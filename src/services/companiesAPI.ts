
import { Company } from './types';
import { apiRequest, tryFetchWithFallback } from './jobs/apiUtils';
import { mockDataService } from './mockData';

export const companiesAPI = {
  getAll: async (): Promise<Company[]> => {
    try {
      console.log('🔍 Fetching companies...');
      const result = await apiRequest('/companies', 'GET', null, true);
      console.log('✅ Companies fetched from backend:', result);
      
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
      console.error('❌ Backend fetch failed, using mock data:', error);
      // Use mock data when backend is unavailable
      return await mockDataService.getCompanies();
    }
  },

  create: async (companyData: any): Promise<Company> => {
    try {
      console.log('📝 Creating company:', companyData);
      const result = await apiRequest('/companies', 'POST', companyData, true);
      console.log('✅ Company created on backend:', result);
      
      if (result?.data) {
        return result.data;
      } else if (result?.success && result?.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Backend create failed, using mock service:', error);
      // Use mock service when backend is unavailable
      return await mockDataService.createCompany(companyData);
    }
  },

  update: async (companyId: string, companyData: any): Promise<Company> => {
    try {
      console.log('🔧 Updating company:', companyId, companyData);
      const result = await apiRequest(`/companies/${companyId}`, 'PUT', companyData, true);
      console.log('✅ Company updated on backend:', result);
      
      if (result?.data) {
        return result.data;
      } else if (result?.success && result?.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Backend update failed, using mock service:', error);
      // Use mock service when backend is unavailable
      return await mockDataService.updateCompany(companyId, companyData);
    }
  },

  delete: async (companyId: string): Promise<void> => {
    try {
      console.log('🗑️ Deleting company:', companyId);
      await apiRequest(`/companies/${companyId}`, 'DELETE', null, true);
      console.log('✅ Company deleted from backend');
    } catch (error) {
      console.error('❌ Backend delete failed, using mock service:', error);
      // Use mock service when backend is unavailable
      await mockDataService.deleteCompany(companyId);
    }
  }
};
