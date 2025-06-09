
import { useState, useEffect } from 'react';
import { authAPI } from '@/services/api';

interface UserPermissions {
  users: { create: boolean; read: boolean; update: boolean; delete: boolean; };
  companies: { create: boolean; read: boolean; update: boolean; delete: boolean; };
  jobs: { create: boolean; read: boolean; update: boolean; delete: boolean; };
  applications: { create: boolean; read: boolean; update: boolean; delete: boolean; };
}

interface UserData {
  role: string;
  permissions: UserPermissions;
}

export const usePermissions = () => {
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if (authAPI.isAuthenticated()) {
          const userData = await authAPI.getCurrentUser();
          setUserRole(userData.role);
          setUserPermissions(userData.permissions);
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        // Set default viewer permissions on error
        setUserRole('viewer');
        setUserPermissions({
          users: { create: false, read: false, update: false, delete: false },
          companies: { create: false, read: true, update: false, delete: false },
          jobs: { create: false, read: true, update: false, delete: false },
          applications: { create: false, read: true, update: false, delete: false }
        });
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, []);

  const hasPermission = (resource: keyof UserPermissions, action: keyof UserPermissions['users']) => {
    if (!userPermissions) return false;
    return userPermissions[resource][action];
  };

  const canEdit = (resource: keyof UserPermissions) => {
    return hasPermission(resource, 'update');
  };

  const canDelete = (resource: keyof UserPermissions) => {
    return hasPermission(resource, 'delete');
  };

  const canCreate = (resource: keyof UserPermissions) => {
    return hasPermission(resource, 'create');
  };

  const isViewer = () => {
    return userRole === 'viewer';
  };

  return {
    userPermissions,
    userRole,
    loading,
    hasPermission,
    canEdit,
    canDelete,
    canCreate,
    isViewer
  };
};
