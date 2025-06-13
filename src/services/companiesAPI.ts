
import { Company } from './types';
import { API_BASE_URL } from '@/config/api';

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
      console.log('🔍 Fetching companies...');
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/companies`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      console.log('✅ Companies fetched:', result);
      return result.data || result;
    } catch (error) {
      console.error('❌ Fetch companies error:', error);
      throw error;
    }
  },

  create: async (companyData: any): Promise<Company> => {
    try {
      console.log('📝 Creating company:', companyData);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(companyData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      console.log('✅ Company created:', result);
      return result.data;
    } catch (error) {
      console.error('❌ Create company error:', error);
      throw error;
    }
  },

  update: async (companyId: string, companyData: any): Promise<Company> => {
    try {
      console.log('🔧 Updating company:', companyId, companyData);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(companyData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      console.log('✅ Company updated:', result);
      return result.data;
    } catch (error) {
      console.error('❌ Update company error:', error);
      throw error;
    }
  },

  delete: async (companyId: string): Promise<void> => {
    try {
      console.log('🗑️ Deleting company:', companyId);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      await handleAPIError(response);
      console.log('✅ Company deleted successfully');
    } catch (error) {
      console.error('❌ Delete company error:', error);
      throw error;
    }
  }
};
