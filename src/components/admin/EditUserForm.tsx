import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, usersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface EditUserFormProps {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditUserForm = ({ user, onSuccess, onCancel }: EditUserFormProps) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    role: user.role || 'viewer' as const,
    isActive: user.isActive !== false,
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (changePassword && !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please enter a new password",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      console.log('🔧 Updating user with data:', formData);
      
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        isActive: formData.isActive,
        ...(changePassword && formData.password && { password: formData.password })
      };
      
      await usersAPI.update(user._id!, updateData);
      console.log('✅ User updated successfully');
      
      toast({
        title: "User updated successfully",
        description: `${formData.firstName} ${formData.lastName} has been updated`,
      });
      onSuccess();
    } catch (error: any) {
      console.error('❌ Error updating user:', error);
      toast({
        title: "Error updating user",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    setFormData(prev => ({ ...prev, password }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      role: value as 'admin' | 'hr_manager' | 'recruiter' | 'viewer'
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="phoneNumber">Phone Number *</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={handleRoleChange}>
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

      <div className="flex items-center space-x-2">
        <Checkbox
          id="changePassword"
          checked={changePassword}
          onCheckedChange={(checked) => setChangePassword(!!checked)}
        />
        <Label htmlFor="changePassword">Change Password</Label>
      </div>

      {changePassword && (
        <div>
          <Label htmlFor="password">New Password</Label>
          <div className="flex gap-2">
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter new password"
            />
            <Button type="button" variant="outline" onClick={generatePassword}>
              Generate
            </Button>
          </div>
        </div>
      )}

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
