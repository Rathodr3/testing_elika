
import { Job } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const handleAPIError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      console.error('API Error Response:', errorData);
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      message: errorMessage
    });
    throw new Error(errorMessage);
  }
  return response;
};

export const jobsAPI = {
  getPublic: async (): Promise<Job[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/public`);
      
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Fetch public jobs error:', error);
      return [];
    }
  },

  getAll: async (): Promise<Job[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Fetch jobs error:', error);
      return [];
    }
  },

  getById: async (jobId: string): Promise<Job> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Fetch job error:', error);
      throw error;
    }
  },

  create: async (jobData: any): Promise<Job> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(jobData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Create job error:', error);
      throw error;
    }
  },

  update: async (jobId: string, jobData: any): Promise<Job> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(jobData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Update job error:', error);
      throw error;
    }
  },

  delete: async (jobId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
    } catch (error) {
      console.error('Delete job error:', error);
      throw error;
    }
  }
};
