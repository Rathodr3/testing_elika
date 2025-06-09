
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

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const jobsAPI = {
  getPublic: async (): Promise<Job[]> => {
    try {
      console.log('🔍 Fetching public jobs...');
      const response = await fetch(`${API_BASE_URL}/jobs/public`);
      
      await handleAPIError(response);
      const jobs = await response.json();
      console.log('✅ Public jobs fetched:', jobs.length);
      return Array.isArray(jobs) ? jobs : [];
    } catch (error) {
      console.error('❌ Fetch public jobs error:', error);
      return [];
    }
  },

  getAll: async (): Promise<Job[]> => {
    try {
      console.log('🔍 Fetching all jobs (admin)...');
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        headers: getAuthHeaders(),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      const jobs = result.data || result;
      console.log('✅ Admin jobs fetched:', jobs.length);
      return Array.isArray(jobs) ? jobs : [];
    } catch (error) {
      console.error('❌ Fetch jobs error:', error);
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
      console.error('❌ Fetch job error:', error);
      throw error;
    }
  },

  create: async (jobData: any): Promise<Job> => {
    try {
      console.log('🔧 Creating job:', jobData);
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(jobData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      console.log('✅ Job created:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Create job error:', error);
      throw error;
    }
  },

  update: async (jobId: string, jobData: any): Promise<Job> => {
    try {
      console.log('🔧 Updating job:', jobId, jobData);
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(jobData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      console.log('✅ Job updated:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Update job error:', error);
      throw error;
    }
  },

  delete: async (jobId: string): Promise<void> => {
    try {
      console.log('🗑️ Deleting job:', jobId);
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      await handleAPIError(response);
      console.log('✅ Job deleted:', jobId);
    } catch (error) {
      console.error('❌ Delete job error:', error);
      throw error;
    }
  }
};
