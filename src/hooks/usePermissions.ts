
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
            console.log('🔑 Using user-specific permissions:', userData.permissions);
            setUserPermissions(userData.permissions);
          } else {
            console.log('🔑 Using role-based fallback permissions for role:', userData.role);
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
            console.log('🔑 Applied fallback permissions:', permissions);
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
    const permission = userPermissions?.[resource]?.[action] || false;
    console.log(`🔍 Permission check: ${resource}.${action} = ${permission} (role: ${userRole})`);
    return permission;
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
    const result = userRole === 'viewer';
    console.log(`🔍 isViewer check: ${result} (current role: ${userRole})`);
    return result;
  };

  const isAdmin = () => {
    const result = userRole === 'admin';
    console.log(`🔍 isAdmin check: ${result} (current role: ${userRole})`);
    return result;
  };

  const isHRManager = () => {
    const result = userRole === 'hr_manager';
    console.log(`🔍 isHRManager check: ${result} (current role: ${userRole})`);
    return result;
  };

  const isRecruiter = () => {
    const result = userRole === 'recruiter';
    console.log(`🔍 isRecruiter check: ${result} (current role: ${userRole})`);
    return result;
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
