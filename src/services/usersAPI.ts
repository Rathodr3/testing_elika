
import { User } from './types';

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

export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    try {
      console.log('🔍 Fetching all users...');
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      console.log('✅ Users fetched:', result);
      
      // Handle both array and object responses
      const users = Array.isArray(result) ? result : (result.data || []);
      return users;
    } catch (error) {
      console.error('❌ Fetch users error:', error);
      throw error;
    }
  },

  create: async (userData: any): Promise<User> => {
    try {
      console.log('🆕 Creating new user:', { ...userData, password: '***' });
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      console.log('✅ User created successfully:', result);
      
      return result.data || result;
    } catch (error) {
      console.error('❌ Create user error:', error);
      throw error;
    }
  },

  update: async (userId: string, userData: any): Promise<User> => {
    try {
      console.log('🔄 Updating user:', { userId, userData: { ...userData, password: userData.password ? '***' : undefined } });
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      console.log('✅ User updated successfully:', result);
      
      return result.data || result;
    } catch (error) {
      console.error('❌ Update user error:', error);
      throw error;
    }
  },

  delete: async (userId: string): Promise<void> => {
    try {
      console.log('🗑️ Deleting user:', userId);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      await handleAPIError(response);
      
      console.log('✅ User deleted successfully');
    } catch (error) {
      console.error('❌ Delete user error:', error);
      throw error;
    }
  }
};
