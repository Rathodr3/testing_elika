
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ChangePasswordProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

const ChangePassword = ({ onCancel, onSuccess }: ChangePasswordProps) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [error, setError] = useState('');
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
    setError('');

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      setError(`Password requirements not met: ${passwordValidation.errors.join(', ')}`);
      return;
    }

    try {
      setLoading(true);
      console.log('🔑 Changing password...');
      
      await authAPI.changePassword(formData.currentPassword, formData.newPassword);
      
      console.log('✅ Password changed successfully');
      
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });

      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('❌ Password change failed:', error);
      const errorMessage = error.message || 'Failed to change password. Please try again.';
      setError(errorMessage);
      
      toast({
        title: "Password change failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.newPassword);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="currentPassword"
            type={showPasswords.current ? 'text' : 'password'}
            value={formData.currentPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="newPassword"
            type={showPasswords.new ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {formData.newPassword && (
          <div className="text-sm">
            <p className="font-medium mb-1">Password requirements:</p>
            <div className="space-y-1">
              <div className={`flex items-center gap-2 ${formData.newPassword.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
                <span>{formData.newPassword.length >= 8 ? '✓' : '✗'}</span>
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center gap-2 ${/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-red-600'}`}>
                <span>{/[A-Z]/.test(formData.newPassword) ? '✓' : '✗'}</span>
                <span>At least 1 uppercase letter</span>
              </div>
              <div className={`flex items-center gap-2 ${/\d/.test(formData.newPassword) ? 'text-green-600' : 'text-red-600'}`}>
                <span>{/\d/.test(formData.newPassword) ? '✓' : '✗'}</span>
                <span>At least 1 number</span>
              </div>
              <div className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'text-green-600' : 'text-red-600'}`}>
                <span>{/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? '✓' : '✗'}</span>
                <span>At least 1 special character</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showPasswords.confirm ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit" 
          disabled={loading || !passwordValidation.isValid} 
          className="flex-1"
        >
          {loading ? 'Changing...' : 'Change Password'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ChangePassword;
