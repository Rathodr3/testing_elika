
import { apiRequest } from './jobs/apiUtils';

export const permissionsAPI = {
  getRolePermissions: async () => {
    try {
      console.log('🔍 Fetching role permissions...');
      const result = await apiRequest('/permissions/roles', 'GET', null, true);
      console.log('✅ Role permissions fetched:', result);
      return result.data || result;
    } catch (error) {
      console.error('❌ Role permissions fetch failed:', error);
      throw error;
    }
  },

  updateRolePermissions: async (permissions: any) => {
    try {
      console.log('🔧 Updating role permissions:', permissions);
      const result = await apiRequest('/permissions/roles', 'PUT', permissions, true);
      console.log('✅ Role permissions updated:', result);
      return result.data || result;
    } catch (error) {
      console.error('❌ Role permissions update failed:', error);
      throw error;
    }
  },

  updateUserPermissions: async (userId: string, permissions: any) => {
    try {
      console.log('🔧 Updating user permissions:', userId, permissions);
      const result = await apiRequest(`/permissions/users/${userId}`, 'PUT', { permissions }, true);
      console.log('✅ User permissions updated:', result);
      return result.data || result;
    } catch (error) {
      console.error('❌ User permissions update failed:', error);
      throw error;
    }
  }
};
