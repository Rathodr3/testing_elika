
import { User } from './types';
import { apiRequest } from './jobs/apiUtils';

export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    try {
      console.log('🔍 Fetching users...');
      const result = await apiRequest('/users', 'GET', null, true);
      console.log('✅ Users fetched from backend:', result);
      
      // Handle different response formats
      if (Array.isArray(result)) {
        return result;
      } else if (result?.data && Array.isArray(result.data)) {
        return result.data;
      } else if (result?.success && result?.data && Array.isArray(result.data)) {
        return result.data;
      } else {
        console.warn('⚠️ Unexpected users response format:', result);
        return [];
      }
    } catch (error) {
      console.error('❌ Users fetch failed:', error);
      throw error;
    }
  },

  create: async (userData: any): Promise<User> => {
    try {
      console.log('📝 Creating user:', { ...userData, password: '***' });
      const result = await apiRequest('/users', 'POST', userData, true);
      console.log('✅ User created on backend:', result);
      
      if (result?.data) {
        return result.data;
      } else if (result?.success && result?.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ User creation failed:', error);
      throw error;
    }
  },

  update: async (userId: string, userData: any): Promise<User> => {
    try {
      console.log('🔧 Updating user:', userId, { ...userData, password: userData.password ? '***' : undefined });
      const result = await apiRequest(`/users/${userId}`, 'PUT', userData, true);
      console.log('✅ User updated on backend:', result);
      
      if (result?.data) {
        return result.data;
      } else if (result?.success && result?.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ User update failed:', error);
      throw error;
    }
  },

  delete: async (userId: string): Promise<void> => {
    try {
      console.log('🗑️ Deleting user:', userId);
      await apiRequest(`/users/${userId}`, 'DELETE', null, true);
      console.log('✅ User deleted from backend');
    } catch (error) {
      console.error('❌ User deletion failed:', error);
      throw error;
    }
  }
};
