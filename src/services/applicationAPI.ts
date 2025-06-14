
import { JobApplication } from './types';
import { apiRequest } from './jobs/apiUtils';

export const applicationAPI = {
  submit: async (formData: FormData): Promise<any> => {
    try {
      console.log('📤 Submitting application via API...');
      
      // Make the API request with FormData
      const result = await fetch('/api/applications', {
        method: 'POST',
        body: formData, // Don't set Content-Type header, let browser set it for FormData
      });

      const response = await result.json();
      console.log('✅ Application API response:', response);
      
      if (!result.ok) {
        throw new Error(response.message || `HTTP error! status: ${result.status}`);
      }

      return response;
    } catch (error) {
      console.error('❌ Application submission failed:', error);
      throw error;
    }
  },

  getAll: async (filters: any = {}): Promise<JobApplication[]> => {
    try {
      console.log('🔍 Fetching applications with filters:', filters);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.position) queryParams.append('position', filters.position);
      if (filters.department) queryParams.append('department', filters.department);
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/api/applications?${queryString}` : '/api/applications';
      
      console.log('🔗 Making API request to:', endpoint);
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
    } catch (error) {
      console.error('❌ Applications fetch failed:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<JobApplication> => {
    try {
      console.log('🔍 Fetching application by ID:', id);
      const result = await apiRequest(`/api/applications/${id}`, 'GET', null, true);
      console.log('✅ Application fetched:', result);
      
      if (result?.data) {
        return result.data;
      } else if (result?.success && result?.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Application fetch failed:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<JobApplication>): Promise<JobApplication> => {
    try {
      console.log('🔧 Updating application:', id, data);
      const result = await apiRequest(`/api/applications/${id}`, 'PUT', data, true);
      console.log('✅ Application updated:', result);
      
      if (result?.data) {
        return result.data;
      } else if (result?.success && result?.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Application update failed:', error);
      throw error;
    }
  },

  updateStatus: async (id: string, status: string, notes?: string): Promise<JobApplication> => {
    try {
      console.log('🔧 Updating application status:', id, status, notes);
      const result = await apiRequest(`/api/applications/${id}/status`, 'PUT', { status, notes }, true);
      console.log('✅ Application status updated:', result);
      
      if (result?.data) {
        return result.data;
      } else if (result?.success && result?.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Application status update failed:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      console.log('🗑️ Deleting application:', id);
      await apiRequest(`/api/applications/${id}`, 'DELETE', null, true);
      console.log('✅ Application deleted');
    } catch (error) {
      console.error('❌ Application deletion failed:', error);
      throw error;
    }
  },

  downloadResume: async (id: string): Promise<Blob> => {
    try {
      console.log('📥 Downloading resume for application:', id);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/applications/${id}/resume`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('❌ Resume download failed:', error);
      throw error;
    }
  }
};
