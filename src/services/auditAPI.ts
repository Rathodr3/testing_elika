
import { apiRequest, tryFetchWithFallback } from './jobs/apiUtils';
import { AuditLog } from './types';

// Mock audit logs for development
const mockAuditLogs = [
  {
    _id: 'audit1',
    userId: 'admin',
    userEmail: 'admin@elikaengineering.com',
    userName: 'Admin User',
    action: 'login',
    resource: 'users',
    details: 'Admin user logged in',
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0...',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'audit2',
    userId: 'admin',
    userEmail: 'admin@elikaengineering.com',
    userName: 'Admin User',
    action: 'create',
    resource: 'companies',
    resourceName: 'Test Company',
    details: 'Created new company',
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0...',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export const auditAPI = {
  log: async (auditData: any) => {
    try {
      console.log('🔍 Logging audit data:', auditData);
      const result = await apiRequest('/audit', 'POST', auditData, true);
      console.log('✅ Audit log created:', result);
      return result;
    } catch (error) {
      console.error('❌ Audit log error (using mock):', error);
      // Don't throw error as audit logging shouldn't break main functionality
      return { success: true, message: 'Audit logged to mock service' };
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
      } catch (apiError) {
        console.error('❌ Backend audit fetch failed, using mock data:', apiError);
        
        // Filter mock data based on filters
        let filteredLogs = [...mockAuditLogs];
        
        if (filters?.userId) {
          filteredLogs = filteredLogs.filter(log => 
            log.userEmail.toLowerCase().includes(filters.userId.toLowerCase())
          );
        }
        
        if (filters?.resource) {
          filteredLogs = filteredLogs.filter(log => log.resource === filters.resource);
        }
        
        if (filters?.action) {
          filteredLogs = filteredLogs.filter(log => log.action === filters.action);
        }
        
        return {
          logs: filteredLogs,
          total: filteredLogs.length,
          page: 1,
          totalPages: 1
        };
      }
    } catch (error) {
      console.error('❌ Fetch audit logs error, using mock data:', error);
      // Return mock data instead of empty data
      return {
        logs: mockAuditLogs,
        total: mockAuditLogs.length,
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
      console.error('❌ Export audit logs error, generating mock CSV:', error);
      
      // Generate mock CSV
      const csvHeaders = 'Timestamp,User Email,User Name,Action,Resource,Details\n';
      const csvRows = mockAuditLogs.map(log => 
        `${log.createdAt},${log.userEmail},${log.userName},${log.action},${log.resource},"${log.details}"`
      ).join('\n');
      
      const csvContent = csvHeaders + csvRows;
      return new Blob([csvContent], { type: 'text/csv' });
    }
  }
};
