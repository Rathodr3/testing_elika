export { applicationAPI } from './applications/applicationAPI';
export { jobsService as jobsAPI } from './jobs/jobsService';
export { auditAPI } from './auditAPI';
export type { JobApplication, Job, User, Company, AuditLog } from './types';

// Create missing API services
export const authAPI = {
  login: async (email: string, password: string) => {
    // Implementation would depend on your auth system
    console.log('Login attempt:', { email });
    // Mock implementation - replace with actual auth logic
    const mockResponse = {
      success: true,
      user: { id: '1', email, firstName: 'Admin', lastName: 'User', role: 'admin' },
      token: 'mock-token'
    };
    localStorage.setItem('adminToken', mockResponse.token);
    return mockResponse;
  },
  
  logout: () => {
    localStorage.removeItem('adminToken');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
  
  getCurrentUser: async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('No token found');
    return { 
      id: '1', 
      email: 'admin@example.com', 
      firstName: 'Admin', 
      lastName: 'User', 
      role: 'admin',
      permissions: {
        users: { create: true, read: true, update: true, delete: true },
        companies: { create: true, read: true, update: true, delete: true },
        jobs: { create: true, read: true, update: true, delete: true },
        applications: { create: true, read: true, update: true, delete: true }
      }
    };
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    console.log('Change password request');
    return { success: true };
  },
  
  forgotPassword: async (email: string) => {
    console.log('Forgot password request for:', email);
    return { success: true, message: 'Reset link sent', resetToken: 'mock-reset-token' };
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    console.log('Reset password with token');
    return { success: true, message: 'Password reset successfully' };
  }
};

export const companiesAPI = {
  getAll: async () => {
    console.log('Fetching companies...');
    return [];
  },
  
  create: async (companyData: any) => {
    console.log('Creating company:', companyData);
    return { success: true };
  },
  
  update: async (id: string, companyData: any) => {
    console.log('Updating company:', id, companyData);
    return { success: true };
  },
  
  delete: async (id: string) => {
    console.log('Deleting company:', id);
    return { success: true };
  }
};

export const usersAPI = {
  getAll: async () => {
    console.log('Fetching users...');
    return [];
  },
  
  create: async (userData: any) => {
    console.log('Creating user:', userData);
    return { success: true };
  },
  
  update: async (id: string, userData: any) => {
    console.log('Updating user:', id, userData);
    return { success: true };
  },
  
  delete: async (id: string) => {
    console.log('Deleting user:', id);
    return { success: true };
  }
};

export const contactAPI = {
  submit: async (contactData: any) => {
    console.log('Submitting contact form:', contactData);
    return { success: true, message: 'Message sent successfully' };
  }
};
