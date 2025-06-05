
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { usersAPI, User } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface EditUserFormProps {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

type UserRole = 'admin' | 'hr_manager' | 'recruiter' | 'viewer';

const EditUserForm = ({ user, onSuccess, onCancel }: EditUserFormProps) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role as UserRole,
    isActive: user.isActive,
    permissions: user.permissions
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await usersAPI.update(user._id!, formData);
      toast({
        title: "User updated successfully",
        description: `${formData.firstName} ${formData.lastName} has been updated`,
      });
      onSuccess();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Error updating user",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (section: string, action: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section]: {
          ...prev.permissions[section],
          [action]: checked
        }
      }
    }));
  };

  const setRolePermissions = (role: UserRole) => {
    let permissions;
    if (role === 'admin') {
      permissions = {
        users: { create: true, read: true, update: true, delete: true },
        companies: { create: true, read: true, update: true, delete: true },
        jobs: { create: true, read: true, update: true, delete: true },
        applications: { create: true, read: true, update: true, delete: true }
      };
    } else if (role === 'hr_manager') {
      permissions = {
        users: { create: false, read: true, update: false, delete: false },
        companies: { create: true, read: true, update: true, delete: false },
        jobs: { create: true, read: true, update: true, delete: true },
        applications: { create: true, read: true, update: true, delete: false }
      };
    } else if (role === 'recruiter') {
      permissions = {
        users: { create: false, read: false, update: false, delete: false },
        companies: { create: false, read: true, update: false, delete: false },
        jobs: { create: true, read: true, update: true, delete: false },
        applications: { create: false, read: true, update: true, delete: false }
      };
    } else {
      permissions = {
        users: { create: false, read: false, update: false, delete: false },
        companies: { create: false, read: true, update: false, delete: false },
        jobs: { create: false, read: true, update: false, delete: false },
        applications: { create: false, read: true, update: false, delete: false }
      };
    }
    
    setFormData(prev => ({ ...prev, role, permissions }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={setRolePermissions}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="hr_manager">HR Manager</SelectItem>
            <SelectItem value="recruiter">Recruiter</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
        />
        <Label htmlFor="isActive">Active User</Label>
      </div>

      <div>
        <Label>Permissions</Label>
        <div className="space-y-3 mt-2">
          {Object.entries(formData.permissions).map(([section, actions]) => (
            <div key={section} className="border p-3 rounded">
              <h4 className="font-medium capitalize mb-2">{section}</h4>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(actions).map(([action, hasPermission]) => (
                  <div key={action} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${section}-${action}`}
                      checked={hasPermission}
                      onCheckedChange={(checked) => handlePermissionChange(section, action, !!checked)}
                    />
                    <Label htmlFor={`${section}-${action}`} className="text-sm capitalize">
                      {action}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Updating...' : 'Update User'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditUserForm;
