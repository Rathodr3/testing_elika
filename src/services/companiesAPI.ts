
import { Company } from './types';
import { apiRequest, tryFetchWithFallback } from './jobs/apiUtils';

export const companiesAPI = {
  getAll: async (): Promise<Company[]> => {
    try {
      console.log('🔍 Fetching companies...');
      const result = await apiRequest('/companies', 'GET', null, true);
      console.log('✅ Companies fetched:', result);
      
      // Handle different response formats
      if (Array.isArray(result)) {
        return result;
      } else if (result?.data && Array.isArray(result.data)) {
        return result.data;
      } else if (result?.success && result?.data && Array.isArray(result.data)) {
        return result.data;
      } else {
        console.warn('⚠️ Unexpected companies response format:', result);
        return [];
      }
    } catch (error) {
      console.error('❌ Fetch companies error:', error);
      // Try fallback approach
      try {
        const response = await tryFetchWithFallback('/companies', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          return Array.isArray(data) ? data : (data?.data || []);
        }
      } catch (fallbackError) {
        console.error('❌ Fallback fetch also failed:', fallbackError);
      }
      
      // Return empty array instead of throwing to prevent UI crash
      return [];
    }
  },

  create: async (companyData: any): Promise<Company> => {
    try {
      console.log('📝 Creating company:', companyData);
      const result = await apiRequest('/companies', 'POST', companyData, true);
      console.log('✅ Company created:', result);
      
      if (result?.data) {
        return result.data;
      } else if (result?.success && result?.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Create company error:', error);
      throw error;
    }
  },

  update: async (companyId: string, companyData: any): Promise<Company> => {
    try {
      console.log('🔧 Updating company:', companyId, companyData);
      const result = await apiRequest(`/companies/${companyId}`, 'PUT', companyData, true);
      console.log('✅ Company updated:', result);
      
      if (result?.data) {
        return result.data;
      } else if (result?.success && result?.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Update company error:', error);
      throw error;
    }
  },

  delete: async (companyId: string): Promise<void> => {
    try {
      console.log('🗑️ Deleting company:', companyId);
      await apiRequest(`/companies/${companyId}`, 'DELETE', null, true);
      console.log('✅ Company deleted successfully');
    } catch (error) {
      console.error('❌ Delete company error:', error);
      throw error;
    }
  }
};
