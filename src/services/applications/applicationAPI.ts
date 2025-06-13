
import { apiRequest, tryFetchWithFallback } from '../jobs/apiUtils';
import { JobApplication } from '../types';

export const applicationAPI = {
  getAll: async (filters?: any): Promise<JobApplication[]> => {
    try {
      console.log('🔍 Fetching applications with filters:', filters);
      
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '') {
            queryParams.append(key, value as string);
          }
        });
      }
      
      const endpoint = `/job-applications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      try {
        const result = await apiRequest(endpoint, 'GET', null, true);
        console.log('✅ Applications fetched:', result);
        
        // Handle different response formats
        if (Array.isArray(result)) {
          return result;
        } else if (result?.data && Array.isArray(result.data)) {
          return result.data;
        } else if (result?.success && result?.data && Array.isArray(result.data)) {
          return result.data;
        } else {
          console.warn('⚠️ Unexpected applications response format:', result);
          return [];
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
          return Array.isArray(result) ? result : (result?.data || []);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('❌ Fetch applications error:', error);
      // Return empty array instead of throwing to prevent UI crash
      return [];
    }
  },

  getById: async (id: string): Promise<JobApplication> => {
    try {
      console.log('🔍 Fetching application by ID:', id);
      const result = await apiRequest(`/job-applications/${id}`, 'GET', null, true);
      console.log('✅ Application fetched:', result);
      
      if (result?.data) {
        return result.data;
      } else if (result?.success && result?.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Fetch application error:', error);
      throw error;
    }
  },

  updateStatus: async (id: string, status: string, notes?: string): Promise<JobApplication> => {
    try {
      console.log('🔧 Updating application status:', id, status);
      const result = await apiRequest(`/job-applications/${id}/status`, 'PUT', { status, notes }, true);
      console.log('✅ Application status updated:', result);
      
      if (result?.data) {
        return result.data;
      } else if (result?.success && result?.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Update application status error:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<JobApplication>): Promise<JobApplication> => {
    try {
      console.log('🔧 Updating application:', id, data);
      const result = await apiRequest(`/job-applications/${id}`, 'PUT', data, true);
      console.log('✅ Application updated:', result);
      
      if (result?.data) {
        return result.data;
      } else if (result?.success && result?.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Update application error:', error);
      throw error;
    }
  },

  submit: async (formData: FormData): Promise<{ success: boolean; message?: string; data?: JobApplication }> => {
    try {
      console.log('📤 Submitting application...');
      
      const response = await tryFetchWithFallback('/job-applications', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      console.log('✅ Application submitted:', result);
      
      // Return a standardized response format
      return {
        success: true,
        data: result?.data || result,
        message: result?.message || 'Application submitted successfully'
      };
    } catch (error) {
      console.error('❌ Submit application error:', error);
      throw error;
    }
  },

  downloadResume: async (id: string): Promise<Blob> => {
    try {
      console.log('📥 Downloading resume for application:', id);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await tryFetchWithFallback(`/job-applications/${id}/resume`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to download resume');
      }
      
      const blob = await response.blob();
      console.log('✅ Resume downloaded successfully');
      
      return blob;
    } catch (error) {
      console.error('❌ Download resume error:', error);
      throw error;
    }
  }
};
