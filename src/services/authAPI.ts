
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export const authAPI = {
  login: async (email: string, password: string): Promise<{ success: boolean; token?: string; user?: any; message?: string }> => {
    try {
      console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (data.success && data.token) {
        localStorage.setItem('adminToken', data.token);
        console.log('Login successful for:', data.user?.email || email);
      } else {
        console.log('Login failed:', data.message);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check if the backend server is running.');
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const serverUrl = import.meta.env.DEV ? 'http://localhost:5000' : 'your backend server';
        throw new Error(`Cannot connect to backend server. Please ensure the server is running on ${serverUrl}`);
      }
      
      throw new Error('Failed to connect to server. Please check if the backend server is running.');
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }
      
      const result = await response.json();
      console.log('Password change result:', result);
      return result;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string; resetToken?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  resetPassword: async (resetToken: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userInfo');
    console.log('User logged out');
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('adminToken');
    return !!token;
  }
};
