
import { apiRequest, tryFetchWithFallback } from './jobs/apiUtils';
import { AuditLog } from './types';

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
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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
      
      try {
        const result = await apiRequest(endpoint, 'GET', null, true);
        console.log('✅ Audit logs fetched:', result);
        
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
      } catch (apiError) {
        console.error('❌ API request failed, trying fallback:', apiError);
        
        // Try fallback approach
        const response = await tryFetchWithFallback(endpoint, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          return {
            logs: result?.data?.logs || result?.logs || [],
            total: result?.data?.total || result?.total || 0,
            page: result?.data?.page || result?.page || 1,
            totalPages: result?.data?.totalPages || result?.totalPages || 1
          };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
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
      
      const endpoint = `/audit/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await tryFetchWithFallback(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
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
