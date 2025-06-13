
import { useCallback } from 'react';
import { auditAPI } from '@/services/auditAPI';
import { authAPI } from '@/services/api';

interface AuditLogData {
  action: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout';
  resource: 'users' | 'companies' | 'jobs' | 'applications';
  resourceId?: string;
  resourceName?: string;
  changes?: {
    field: string;
    oldValue?: any;
    newValue?: any;
  }[];
  details?: string;
}

export const useAuditLog = () => {
  const logActivity = useCallback(async (data: AuditLogData) => {
    try {
      if (!authAPI.isAuthenticated()) {
        return;
      }

      const currentUser = await authAPI.getCurrentUser();
      
      await auditAPI.log({
        userId: currentUser.id || 'unknown',
        userEmail: currentUser.email,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        ...data
      });
    } catch (error) {
      console.error('Failed to log audit activity:', error);
      // Don't throw error as audit logging shouldn't break main functionality
    }
  }, []);

  return { logActivity };
};
