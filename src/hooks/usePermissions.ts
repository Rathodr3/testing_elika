
import { useState, useEffect } from 'react';
import { authAPI } from '@/services/api';

interface UserPermissions {
  users: { create: boolean; read: boolean; update: boolean; delete: boolean; };
  companies: { create: boolean; read: boolean; update: boolean; delete: boolean; };
  jobs: { create: boolean; read: boolean; update: boolean; delete: boolean; };
  applications: { create: boolean; read: boolean; update: boolean; delete: boolean; };
}

export const usePermissions = () => {
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if (authAPI.isAuthenticated()) {
          console.log('🔍 Checking user permissions...');
          const userData = await authAPI.getCurrentUser();
          console.log('✅ User data received:', userData);
          
          setUserRole(userData.role || 'viewer');
          
          // Ensure permissions are properly set
          if (userData.permissions) {
            setUserPermissions(userData.permissions);
          } else {
            // Fallback to role-based permissions if not set
            const rolePermissions = {
              admin: {
                users: { create: true, read: true, update: true, delete: true },
                companies: { create: true, read: true, update: true, delete: true },
                jobs: { create: true, read: true, update: true, delete: true },
                applications: { create: true, read: true, update: true, delete: true }
              },
              hr_manager: {
                users: { create: true, read: true, update: true, delete: false },
                companies: { create: true, read: true, update: true, delete: false },
                jobs: { create: true, read: true, update: true, delete: true },
                applications: { create: false, read: true, update: true, delete: false }
              },
              recruiter: {
                users: { create: false, read: true, update: false, delete: false },
                companies: { create: false, read: true, update: false, delete: false },
                jobs: { create: true, read: true, update: true, delete: false },
                applications: { create: false, read: true, update: true, delete: false }
              },
              viewer: {
                users: { create: false, read: true, update: false, delete: false },
                companies: { create: false, read: true, update: false, delete: false },
                jobs: { create: false, read: true, update: false, delete: false },
                applications: { create: false, read: true, update: false, delete: false }
              }
            };
            
            const permissions = rolePermissions[userData.role as keyof typeof rolePermissions] || rolePermissions.viewer;
            setUserPermissions(permissions);
          }
        } else {
          console.log('❌ User not authenticated');
          setUserRole('');
          setUserPermissions(null);
        }
      } catch (error) {
        console.error('❌ Error checking permissions:', error);
        // Clear authentication on error
        authAPI.logout();
        setUserRole('');
        setUserPermissions(null);
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, []);

  const hasPermission = (resource: keyof UserPermissions, action: keyof UserPermissions['users']) => {
    if (!userPermissions) return false;
    return userPermissions[resource]?.[action] || false;
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

  const isAdmin = () => {
    return userRole === 'admin';
  };

  const isHRManager = () => {
    return userRole === 'hr_manager';
  };

  const isRecruiter = () => {
    return userRole === 'recruiter';
  };

  return {
    userPermissions,
    userRole,
    loading,
    hasPermission,
    canEdit,
    canDelete,
    canCreate,
    isViewer,
    isAdmin,
    isHRManager,
    isRecruiter
  };
};
