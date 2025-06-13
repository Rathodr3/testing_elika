
import { apiRequest, tryFetchWithFallback } from './jobs/apiUtils';
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
      // Don't throw error as audit logging shouldn't break main functionality
      return { success: false, error: error.message };
    }
  },
  
  getAll: async (filters?: any) => {
    try {
      console.log('🔍 Fetching audit logs with filters:', filters);
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '') {
            queryParams.append(key, value as string);
          }
        });
      }
      
      const endpoint = `/audit${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const result = await apiRequest(endpoint, 'GET', null, true);
      console.log('✅ Audit logs fetched:', result);
      
      // Return standardized format
      return {
        logs: result.data || result.logs || [],
        total: result.total || 0,
        page: result.page || 1,
        totalPages: result.totalPages || 1
      };
    } catch (error) {
      console.error('❌ Fetch audit logs error:', error);
      // Return empty data instead of throwing to prevent UI crash
      return {
        logs: [],
        total: 0,
        page: 1,
        totalPages: 1
      };
    }
  },

  export: async (filters?: any) => {
    try {
      console.log('📥 Exporting audit logs with filters:', filters);
      
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '') {
            queryParams.append(key, value as string);
          }
        });
      }
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const endpoint = `/audit/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await tryFetchWithFallback(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
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
