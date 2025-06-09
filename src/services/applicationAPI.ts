
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
  submit: async (formData: FormData): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        body: formData,
      });
      
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Submit application error:', error);
      throw error;
    }
  },

  getAll: async (): Promise<JobApplication[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.applications || result;
    } catch (error) {
      console.error('Get applications error:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<JobApplication> => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.application || result;
    } catch (error) {
      console.error('Get application error:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<JobApplication>): Promise<JobApplication> => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(data),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.application || result;
    } catch (error) {
      console.error('Update application error:', error);
      throw error;
    }
  },

  updateStatus: async (id: string, status: string): Promise<JobApplication> => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status }),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.application || result;
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
    } catch (error) {
      console.error('Delete application error:', error);
      throw error;
    }
  }
};
