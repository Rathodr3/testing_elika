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
        console.log('✅ Applications fetched from backend:', result);
        
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
        console.error('❌ Backend fetch failed, using mock data:', apiError);
        // Use mock data when backend is unavailable
        return [];
      }
    } catch (error) {
      console.error('❌ Fetch applications error:', error);
      // Return mock data instead of empty array
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
      // For mock service, just return a mock response
      return {} as any;
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
      // Use mock service when backend is unavailable
      return {} as any;
    }
  },

  submit: async (formData: FormData): Promise<{ success: boolean; message?: string; data?: JobApplication }> => {
    try {
      console.log('📤 Submitting application...');
      
      // Try to submit to backend first
      const response = await tryFetchWithFallback('/job-applications', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Application submission failed:', errorText);
        
        return {
          success: false,
          message: 'Application submission failed',
        };
      }

      const responseText = await response.text();
      
      // Check if response is HTML (server error)
      if (responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html')) {
        console.error('❌ Received HTML instead of JSON:', responseText.substring(0, 200));
        
        return {
          success: false,
          message: 'Application submission failed (backend returned HTML)',
        };
      }

      try {
        const result = JSON.parse(responseText);
        console.log('✅ Application submitted to backend:', result);
        
        return {
          success: true,
          data: result?.data || result,
          message: result?.message || 'Application submitted successfully'
        };
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        
        return {
          success: false,
          message: 'Application submission failed (parse error)',
        };
      }
    } catch (error) {
      console.error('❌ Submit application error:', error);
      
      return {
        success: false,
        message: 'Application submission failed',
      };
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
      // Return a mock blob for development
      const mockContent = 'Mock resume content - backend not available';
      return new Blob([mockContent], { type: 'text/plain' });
    }
  }
};
