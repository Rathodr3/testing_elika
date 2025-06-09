
import { Company } from './types';

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

export const companiesAPI = {
  getAll: async (): Promise<Company[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Fetch companies error:', error);
      throw error;
    }
  },

  create: async (companyData: any): Promise<Company> => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(companyData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Create company error:', error);
      throw error;
    }
  },

  update: async (companyId: string, companyData: any): Promise<Company> => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(companyData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Update company error:', error);
      throw error;
    }
  },

  delete: async (companyId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
    } catch (error) {
      console.error('Delete company error:', error);
      throw error;
    }
  }
};
