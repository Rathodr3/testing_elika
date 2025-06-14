
import { useState, useEffect } from 'react';
import { authAPI } from '@/services/api';

interface UserPermissions {
  users: { create: boolean; read: boolean; update: boolean; delete: boolean; };
  companies: { create: boolean; read: boolean; update: boolean; delete: boolean; };
  jobs: { create: boolean; read: boolean; update: boolean; delete: boolean; };
  applications: { create: boolean; read: boolean; update: boolean; delete: boolean; };
}

// Default role-based permissions
const defaultRolePermissions = {
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

export const usePermissions = () => {
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        setError(null);
        
        if (!authAPI.isAuthenticated()) {
          console.log('❌ User not authenticated');
          setUserRole('');
          setUserPermissions(null);
          setLoading(false);
          return;
        }

        console.log('🔍 Checking user permissions...');
        const userData = await authAPI.getCurrentUser();
        console.log('✅ User data received:', userData);
        
        // Handle different response formats
        const user = userData?.user || userData;
        const role = user?.role || 'viewer';
        
        setUserRole(role);
        
        // Set permissions: use user-specific permissions if available, otherwise use role-based
        let permissions;
        if (user?.permissions && typeof user.permissions === 'object') {
          console.log('🔑 Using user-specific permissions:', user.permissions);
          permissions = user.permissions;
        } else {
          console.log('🔑 Using role-based permissions for role:', role);
          permissions = defaultRolePermissions[role as keyof typeof defaultRolePermissions] || defaultRolePermissions.viewer;
        }
        
        console.log('🔑 Final permissions applied:', permissions);
        setUserPermissions(permissions);
        
      } catch (error) {
        console.error('❌ Error checking permissions:', error);
        setError(error instanceof Error ? error.message : 'Permission check failed');
        
        // Try to get role from token as fallback
        try {
          const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
          if (token) {
            if (token.startsWith('admin-token-')) {
              console.log('🔄 Applying fallback admin permissions');
              setUserRole('admin');
              setUserPermissions(defaultRolePermissions.admin);
            } else if (token.startsWith('user-token-')) {
              console.log('🔄 Applying fallback viewer permissions');
              setUserRole('viewer');
              setUserPermissions(defaultRolePermissions.viewer);
            } else {
              // Clear invalid tokens
              localStorage.removeItem('token');
              localStorage.removeItem('adminToken');
              setUserRole('');
              setUserPermissions(null);
            }
          } else {
            setUserRole('');
            setUserPermissions(null);
          }
        } catch (fallbackError) {
          console.error('❌ Fallback permission check failed:', fallbackError);
          setUserRole('');
          setUserPermissions(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, []);

  const hasPermission = (resource: keyof UserPermissions, action: keyof UserPermissions['users']) => {
    if (loading || !userPermissions) {
      console.log(`🔍 Permission check (loading): ${resource}.${action} = false`);
      return false;
    }
    
    const permission = userPermissions[resource]?.[action] || false;
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
    error,
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
