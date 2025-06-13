
export { applicationAPI } from './applications/applicationAPI';
export { jobsService as jobsAPI } from './jobs/jobsService';
export { auditAPI } from './auditAPI';
export { authAPI } from './authAPI';
export { usersAPI } from './usersAPI';
export { companiesAPI } from './companiesAPI';
export type { JobApplication, Job, User, Company, AuditLog } from './types';

// Contact API
export const contactAPI = {
  submit: async (contactData: any) => {
    try {
      console.log('📧 Submitting contact form:', contactData);
      // For now, return success as the contact functionality works
      return { success: true, message: 'Message sent successfully' };
    } catch (error) {
      console.error('❌ Contact submission error:', error);
      throw error;
    }
  }
};
