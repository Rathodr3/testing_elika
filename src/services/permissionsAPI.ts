
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
      // Return default permissions on error
      const defaultPermissions = {
        admin: {
          users: { create: true, read: true, update: true, delete: true },
          companies: { create: true, read: true, update: true, delete: true },
          jobs: { create: true, read: true, update: true, delete: true },
          applications: { create: true, read: true, update: true, delete: true }
        },
        hr_manager: {
          users: { create: true, read: true, update: true, delete: false },
          companies: { create: true, read: true, update: true, delete: false },
          jobs: { create: true, read: true, update: true, delete: true },
          applications: { create: false, read: true, update: true, delete: false }
        },
        recruiter: {
          users: { create: false, read: true, update: false, delete: false },
          companies: { create: false, read: true, update: false, delete: false },
          jobs: { create: true, read: true, update: true, delete: false },
          applications: { create: false, read: true, update: true, delete: false }
        },
        viewer: {
          users: { create: false, read: true, update: false, delete: false },
          companies: { create: false, read: true, update: false, delete: false },
          jobs: { create: false, read: true, update: false, delete: false },
          applications: { create: false, read: true, update: false, delete: false }
        }
      };
      console.log('Using default permissions due to API error');
      return defaultPermissions;
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
