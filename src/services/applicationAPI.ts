
import { JobApplication } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

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

export const applicationAPI = {
  getAll: async (): Promise<JobApplication[]> => {
    try {
      console.log('🔍 Fetching all applications...');
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      console.log('✅ Applications fetched:', result);
      
      // Handle both array and object responses
      const applications = Array.isArray(result) ? result : (result.data || []);
      return applications;
    } catch (error) {
      console.error('❌ Fetch applications error:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<JobApplication> => {
    try {
      console.log('🔍 Fetching application by ID:', id);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      console.log('✅ Application fetched:', result);
      
      return result.data || result;
    } catch (error) {
      console.error('❌ Fetch application error:', error);
      throw error;
    }
  },

  updateStatus: async (id: string, status: string): Promise<JobApplication> => {
    try {
      console.log('🔄 Updating application status:', { id, status });
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      console.log('✅ Application status updated:', result);
      
      return result.data || result;
    } catch (error) {
      console.error('❌ Update application status error:', error);
      throw error;
    }
  },

  update: async (id: string, applicationData: Partial<JobApplication>): Promise<JobApplication> => {
    try {
      console.log('🔄 Updating application:', { id, applicationData });
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      console.log('✅ Application updated:', result);
      
      return result.data || result;
    } catch (error) {
      console.error('❌ Update application error:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      console.log('🗑️ Deleting application:', id);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      await handleAPIError(response);
      console.log('✅ Application deleted successfully');
    } catch (error) {
      console.error('❌ Delete application error:', error);
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

      const response = await fetch(`${API_BASE_URL}/applications/${id}/resume`, {
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
  },

  submit: async (formData: FormData): Promise<{ success: boolean; message?: string; data?: JobApplication }> => {
    try {
      console.log('📤 Submitting application...');
      
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        body: formData,
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      console.log('✅ Application submitted:', result);
      
      // Return a standardized response format
      return {
        success: true,
        data: result.data || result,
        message: result.message || 'Application submitted successfully'
      };
    } catch (error) {
      console.error('❌ Submit application error:', error);
      throw error;
    }
  }
};
