
import { JobApplication } from './types';

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

export const applicationAPI = {
  submit: async (formData: FormData): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Submitting application to:', `${API_BASE_URL}/applications`);
      
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        body: formData,
      });
      
      await handleAPIError(response);
      const result = await response.json();
      console.log('Application submission successful:', result);
      return result;
    } catch (error) {
      console.error('Application submission error:', error);
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
      
      const applications = (result.data || result).map((app: JobApplication) => ({
        ...app,
        name: `${app.firstName} ${app.lastName}`,
        jobTitle: app.position,
        company: app.previousCompany || app.department,
        experience: `${app.yearsOfExperience} years`,
        resumeUrl: app.resumePath ? `${API_BASE_URL}/applications/${app._id}/resume` : undefined
      }));
      
      return applications;
    } catch (error) {
      console.error('Fetch applications error:', error);
      throw error;
    }
  },

  getByJob: async (jobId: string): Promise<JobApplication[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications?jobId=${jobId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Fetch job applications error:', error);
      throw error;
    }
  },

  update: async (applicationId: string, applicationData: Partial<JobApplication>): Promise<JobApplication> => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(applicationData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Update application error:', error);
      throw error;
    }
  },

  updateStatus: async (applicationId: string, status: string): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status }),
      });
      
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  }
};
