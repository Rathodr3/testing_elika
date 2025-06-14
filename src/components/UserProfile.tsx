
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, IdCard, Calendar, LogOut } from 'lucide-react';
import { authAPI } from '@/services/api';
import { User } from '@/services/types';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error fetching current user:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    window.location.href = '/';
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
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Unable to load user profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.photo} />
            <AvatarFallback className="text-2xl">
              {user.firstName && user.lastName ? 
                `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 
                '?'
              }
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">
          {user.firstName} {user.lastName}
        </CardTitle>
        <div className="flex justify-center mt-2">
          <Badge className={getRoleColor(user.role)}>
            {getRoleLabel(user.role)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{user.email}</span>
          </div>
          
          {user.phoneNumber && (
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{user.phoneNumber}</span>
            </div>
          )}
          
          {user.employeeId && (
            <div className="flex items-center space-x-3">
              <IdCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">ID: {user.employeeId}</span>
            </div>
          )}
          
          {user.lastLogin && (
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                Last login: {new Date(user.lastLogin).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
