import { apiRequest } from './jobs/apiUtils';
import { AuditLog } from './types';
import { API_BASE_URL } from '@/config/api';

export const auditAPI = {
  log: async (auditData: any) => {
    try {
      console.log('🔍 Logging audit data:', auditData);
      const result = await apiRequest('/audit', 'POST', auditData, true);
      console.log('✅ Audit log created:', result);
      return result;
    } catch (error) {
      console.error('❌ Audit log error:', error);
      throw error;
    }
  },
  
  getAll: async (filters?: any) => {
    try {
      console.log('🔍 Fetching audit logs with filters:', filters);
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '' && value !== 'all') {
            queryParams.append(key, value as string);
          }
        });
      }
      
      const endpoint = `/audit${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const result = await apiRequest(endpoint, 'GET', null, true);
      
      console.log('✅ Audit logs fetched from backend:', result);
      
      // Handle different response formats
      if (result?.data && result.data.logs) {
        return {
          logs: result.data.logs || [],
          total: result.data.total || 0,
          page: result.data.page || 1,
          totalPages: result.data.totalPages || 1
        };
      } else if (Array.isArray(result)) {
        return {
          logs: result,
          total: result.length,
          page: 1,
          totalPages: 1
        };
      } else {
        return {
          logs: result?.logs || [],
          total: result?.total || 0,
          page: result?.page || 1,
          totalPages: result?.totalPages || 1
        };
      }
    } catch (error) {
      console.error('❌ Fetch audit logs error:', error);
      throw error;
    }
  },

  export: async (filters?: any) => {
    try {
      console.log('📥 Exporting audit logs with filters:', filters);
      
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '' && value !== 'all') {
            queryParams.append(key, value as string);
          }
        });
      }
      
      const endpoint = `/audit/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        throw new Error('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error('Failed to export audit logs');
      }
      
      const blob = await response.blob();
      console.log('✅ Audit logs exported successfully');
      
      return blob;
    } catch (error) {
      console.error('❌ Export audit logs error:', error);
      throw error;
    }
  }
};
