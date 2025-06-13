
import { AuditLog } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

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

export const auditAPI = {
  getAll: async (filters?: {
    userId?: string;
    resource?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: AuditLog[]; total: number; page: number; totalPages: number; }> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/audit?${queryParams}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('❌ Fetch audit logs error:', error);
      throw error;
    }
  },

  log: async (logData: Omit<AuditLog, '_id' | 'timestamp'>): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/audit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(logData),
      });
      
      await handleAPIError(response);
    } catch (error) {
      console.error('❌ Create audit log error:', error);
      // Don't throw here as audit logging shouldn't break the main functionality
    }
  },

  export: async (filters?: {
    userId?: string;
    resource?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/audit/export?${queryParams}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      await handleAPIError(response);
      return await response.blob();
    } catch (error) {
      console.error('❌ Export audit logs error:', error);
      throw error;
    }
  }
};
