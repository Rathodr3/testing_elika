
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
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Fetch users error:', error);
      throw error;
    }
  },

  create: async (userData: any): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(userData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  update: async (userId: string, userData: any): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(userData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  delete: async (userId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }
};
