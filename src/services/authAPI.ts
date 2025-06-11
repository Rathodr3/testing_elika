
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const handleAPIError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return response;
};

export const authAPI = {
  login: async (email: string, password: string): Promise<{ success: boolean; user: any; token: string; message?: string }> => {
    try {
      console.log('Attempting login with:', { email, password: '***' });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      console.log('Login response:', result);
      
      // Store token in localStorage
      if (result.token) {
        localStorage.setItem('adminToken', result.token);
        if (result.user) {
          localStorage.setItem('adminUser', JSON.stringify(result.user));
        }
      }
      
      return {
        success: true,
        user: result.user,
        token: result.token,
        message: result.message
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<any> => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      // Update stored user data
      if (result.user) {
        localStorage.setItem('adminUser', JSON.stringify(result.user));
      }
      
      return result.user;
    } catch (error) {
      console.error('Get current user error:', error);
      // Clear invalid stored data using the logout function directly
      authAPI.logout();
      throw error;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      return {
        success: true,
        message: result.message || 'Password changed successfully'
      };
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string; resetToken?: string }> => {
    try {
      console.log('Requesting password reset for:', email);
      
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      console.log('Forgot password response:', result);
      
      return {
        success: true,
        message: result.message || 'Reset email sent successfully',
        resetToken: result.resetToken
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  resetPassword: async (resetToken: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('Resetting password with token:', resetToken.substring(0, 20) + '...');
      
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      console.log('Reset password response:', result);
      
      return {
        success: true,
        message: result.message || 'Password reset successfully'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  validateResetToken: async (resetToken: string): Promise<{ success: boolean; message?: string; email?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-reset-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken }),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      return {
        success: true,
        message: result.message,
        email: result.email
      };
    } catch (error) {
      console.error('Validate reset token error:', error);
      throw error;
    }
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('adminToken');
    return !!token;
  },

  logout: (): void => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }
};
