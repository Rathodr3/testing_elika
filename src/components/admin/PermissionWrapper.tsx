
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

interface PermissionWrapperProps {
  children: React.ReactNode;
  resource: 'users' | 'companies' | 'jobs' | 'applications';
  action: 'create' | 'read' | 'update' | 'delete';
  fallback?: React.ReactNode;
}

const PermissionWrapper = ({ children, resource, action, fallback }: PermissionWrapperProps) => {
  const { hasPermission, loading } = usePermissions();

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-8 rounded"></div>;
  }

  if (!hasPermission(resource, action)) {
    return fallback || (
      <Alert className="border-orange-200 bg-orange-50">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to {action} {resource}.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default PermissionWrapper;
