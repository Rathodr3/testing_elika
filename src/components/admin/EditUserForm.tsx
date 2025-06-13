
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

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: password.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar,
      errors: [
        ...(password.length < minLength ? ['At least 8 characters'] : []),
        ...(!hasUpperCase ? ['At least 1 uppercase letter'] : []),
        ...(!hasNumber ? ['At least 1 number'] : []),
        ...(!hasSpecialChar ? ['At least 1 special character'] : [])
      ]
    };
  };

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

    if (changePassword && formData.password) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        toast({
          title: "Password requirements not met",
          description: `Password must have: ${passwordValidation.errors.join(', ')}`,
          variant: "destructive"
        });
        return;
      }
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
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()';
    
    let password = '';
    password += upper[Math.floor(Math.random() * upper.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    const allChars = upper + lower + numbers + special;
    for (let i = 3; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setFormData(prev => ({ ...prev, password }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      role: value as 'admin' | 'hr_manager' | 'recruiter' | 'viewer'
    }));
  };

  const passwordValidation = changePassword && formData.password ? validatePassword(formData.password) : { isValid: true };

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
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: Boolean(checked) }))}
        />
        <Label htmlFor="isActive">Active User</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="changePassword"
          checked={changePassword}
          onCheckedChange={(checked) => setChangePassword(Boolean(checked))}
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
          {formData.password && (
            <div className="mt-2 text-sm">
              <p className="font-medium mb-1">Password requirements:</p>
              <div className="space-y-1">
                <div className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{formData.password.length >= 8 ? '✓' : '✗'}</span>
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{/[A-Z]/.test(formData.password) ? '✓' : '✗'}</span>
                  <span>At least 1 uppercase letter</span>
                </div>
                <div className={`flex items-center gap-2 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{/\d/.test(formData.password) ? '✓' : '✗'}</span>
                  <span>At least 1 number</span>
                </div>
                <div className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '✓' : '✗'}</span>
                  <span>At least 1 special character</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading || !passwordValidation.isValid} className="flex-1">
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
