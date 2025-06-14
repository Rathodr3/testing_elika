import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Edit, Trash2, Mail, Phone, IdCard } from 'lucide-react';
import { User as UserType, usersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAdminData } from '@/contexts/AdminDataContext';
import CreateUserForm from './CreateUserForm';
import EditUserForm from './EditUserForm';
import AdminHeader from './AdminHeader';
import EnhancedFilters from './EnhancedFilters';
import PermissionWrapper from './PermissionWrapper';

const UsersTab = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const { toast } = useToast();
  const { refreshTrigger, setRefreshing } = useAdminData();

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      console.log('🔍 Fetching users for admin dashboard...');
      const data = await usersAPI.getAll();
      console.log('✅ Users fetched:', data);
      
      const usersArray = Array.isArray(data) ? data : [];
      setUsers(usersArray);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: "Failed to load users from the server.",
        variant: "destructive"
      });
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.phoneNumber || '').toLowerCase().includes(searchLower) ||
        (user.employeeId || '').toLowerCase().includes(searchLower)
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    fetchUsers();
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setEditingUser(null);
    fetchUsers();
  };

  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setShowEditDialog(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🗑️ Deleting user:', userId);
      await usersAPI.delete(userId);
      setUsers(prev => prev.filter(user => user._id !== userId));
      toast({
        title: "User deleted successfully",
        description: "The user has been removed.",
      });
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      toast({
        title: "Error deleting user",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'hr_manager': return 'bg-blue-100 text-blue-800';
      case 'recruiter': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'hr_manager': return 'HR Manager';
      case 'recruiter': return 'Recruiter';
      case 'admin': return 'Admin';
      case 'viewer': return 'Viewer';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading users...</span>
      </div>
    );
  }

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'hr_manager', label: 'HR Manager' },
    { value: 'recruiter', label: 'Recruiter' },
    { value: 'viewer', label: 'Viewer' }
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Users Management"
        description="Manage user accounts and permissions"
      >
        <PermissionWrapper resource="users" action="create">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <CreateUserForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        </PermissionWrapper>
      </AdminHeader>

      <EnhancedFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by name, email, phone, or employee ID..."
        filters={[
          {
            key: 'role',
            label: 'Role',
            value: roleFilter,
            options: roleOptions,
            onChange: setRoleFilter
          }
        ]}
        onClearFilters={() => {
          setSearchTerm('');
          setRoleFilter('all');
        }}
      />

      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Card key={user._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.photo} />
                      <AvatarFallback>
                        {user.firstName && user.lastName ? 
                          `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 
                          '?'
                        }
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </h3>
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        {user.phoneNumber && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{user.phoneNumber}</span>
                          </div>
                        )}
                        {user.employeeId && (
                          <div className="flex items-center space-x-2">
                            <IdCard className="w-4 h-4" />
                            <span>ID: {user.employeeId}</span>
                          </div>
                        )}
                        {user.lastLogin && (
                          <div className="text-xs text-muted-foreground">
                            Last login: {new Date(user.lastLogin).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <PermissionWrapper resource="users" action="update" fallback={null}>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </PermissionWrapper>
                      <PermissionWrapper resource="users" action="delete" fallback={null}>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user._id!)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </PermissionWrapper>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
              <p className="text-muted-foreground">
                {users.length === 0 
                  ? "No users have been created yet." 
                  : "No users match your current search criteria."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <EditUserForm
              user={editingUser}
              onSuccess={handleEditSuccess}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingUser(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersTab;
