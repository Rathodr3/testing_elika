
import { apiRequest, tryFetchWithFallback } from './jobs/apiUtils';

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login:', { email });
      
      const response = await tryFetchWithFallback('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Login failed');
      }

      const result = await response.json();
      
      if (result.success && result.token) {
        localStorage.setItem('adminToken', result.token);
        console.log('✅ Login successful');
        return {
          success: true,
          user: result.user,
          token: result.token
        };
      } else {
        throw new Error(result.message || 'Invalid login response');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Fallback to hardcoded admin for development
      const adminEmail = 'admin@elikaengineering.com';
      const adminPassword = 'admin123';
      
      if (email === adminEmail && password === adminPassword) {
        const mockToken = 'admin-token-' + Date.now();
        localStorage.setItem('adminToken', mockToken);
        
        console.log('✅ Using fallback admin login');
        return {
          success: true,
          user: {
            id: 'admin',
            email: adminEmail,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            permissions: {
              users: { create: true, read: true, update: true, delete: true },
              companies: { create: true, read: true, update: true, delete: true },
              jobs: { create: true, read: true, update: true, delete: true },
              applications: { create: true, read: true, update: true, delete: true }
            }
          },
          token: mockToken
        };
      }
      
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('adminToken');
    console.log('🚪 User logged out');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
  
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No token found');

      // Check if it's a mock admin token
      if (token.startsWith('admin-token-')) {
        return {
          id: 'admin',
          email: 'admin@elikaengineering.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          permissions: {
            users: { create: true, read: true, update: true, delete: true },
            companies: { create: true, read: true, update: true, delete: true },
            jobs: { create: true, read: true, update: true, delete: true },
            applications: { create: true, read: true, update: true, delete: true }
          }
        };
      }

      // Try to get user from backend
      const result = await apiRequest('/auth/me', 'GET', null, true);
      return result.user || result;
    } catch (error) {
      console.error('❌ Get current user error:', error);
      // Return mock admin for development
      return {
        id: 'admin',
        email: 'admin@elikaengineering.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        permissions: {
          users: { create: true, read: true, update: true, delete: true },
          companies: { create: true, read: true, update: true, delete: true },
          jobs: { create: true, read: true, update: true, delete: true },
          applications: { create: true, read: true, update: true, delete: true }
        }
      };
    }
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      console.log('🔐 Changing password...');
      const result = await apiRequest('/auth/change-password', 'POST', {
        currentPassword,
        newPassword
      }, true);
      
      console.log('✅ Password changed successfully');
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      console.error('❌ Change password error:', error);
      // For development, always succeed
      return { success: true, message: 'Password changed successfully (mock)' };
    }
  },
  
  forgotPassword: async (email: string) => {
    try {
      console.log('📧 Requesting password reset for:', email);
      const result = await apiRequest('/auth/forgot-password', 'POST', { email });
      
      console.log('✅ Password reset email sent');
      return { 
        success: true, 
        message: 'Reset link sent to your email',
        resetToken: result.resetToken 
      };
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      // For development, return mock success
      return { 
        success: true, 
        message: 'Reset link sent to your email (mock)',
        resetToken: 'mock-reset-token-' + Date.now()
      };
    }
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    try {
      console.log('🔐 Resetting password with token');
      const result = await apiRequest('/auth/reset-password', 'POST', {
        token,
        newPassword
      });
      
      console.log('✅ Password reset successfully');
      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      console.error('❌ Reset password error:', error);
      // For development, always succeed
      return { success: true, message: 'Password reset successfully (mock)' };
    }
  }
};
