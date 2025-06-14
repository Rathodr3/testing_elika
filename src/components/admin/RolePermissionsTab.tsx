
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Users, Building2, Briefcase, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { permissionsAPI } from '@/services/permissionsAPI';
import AdminHeader from './AdminHeader';

interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface RolePermissions {
  users: Permission;
  companies: Permission;
  jobs: Permission;
  applications: Permission;
}

const defaultPermissions: Record<string, RolePermissions> = {
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

const RolePermissionsTab = () => {
  const [permissions, setPermissions] = useState<Record<string, RolePermissions>>(defaultPermissions);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const { toast } = useToast();

  const resources = [
    { key: 'users', name: 'Users', icon: Users },
    { key: 'companies', name: 'Companies', icon: Building2 },
    { key: 'jobs', name: 'Jobs', icon: Briefcase },
    { key: 'applications', name: 'Applications', icon: FileText }
  ] as const;

  const actions = [
    { key: 'create', name: 'Create' },
    { key: 'read', name: 'Read' },
    { key: 'update', name: 'Update' },
    { key: 'delete', name: 'Delete' }
  ] as const;

  const roles = ['admin', 'hr_manager', 'recruiter', 'viewer'];

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setFetchLoading(true);
      setApiError(false);
      console.log('🔍 Fetching role permissions...');
      
      const rolePermissions = await permissionsAPI.getRolePermissions();
      console.log('✅ Received permissions:', rolePermissions);
      
      setPermissions(rolePermissions || defaultPermissions);
      
      toast({
        title: "Success",
        description: "Role permissions loaded successfully.",
      });
    } catch (error) {
      console.error('❌ Error fetching permissions:', error);
      setApiError(true);
      setPermissions(defaultPermissions);
      
      toast({
        title: "Warning",
        description: "Could not fetch current permissions from server. Using default values.",
        variant: "destructive",
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const handlePermissionChange = (role: string, resource: keyof RolePermissions, action: keyof Permission, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [resource]: {
          ...prev[role][resource],
          [action]: value
        }
      }
    }));
  };

  const savePermissions = async () => {
    try {
      setLoading(true);
      await permissionsAPI.updateRolePermissions(permissions);
      toast({
        title: "Success",
        description: "Role permissions updated successfully. Changes will take effect on next login.",
      });
    } catch (error) {
      console.error('❌ Error saving permissions:', error);
      toast({
        title: "Error",
        description: "Failed to save permissions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setPermissions(defaultPermissions);
    toast({
      title: "Reset",
      description: "Permissions reset to default values. Don't forget to save!",
    });
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <AdminHeader title="Role Permissions" description="Loading permissions..." />
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Role Permissions" 
        description="Manage role-based access permissions. Changes take effect on next user login."
        onRefresh={fetchPermissions}
      />

      {apiError && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800">
            <strong>Notice:</strong> Unable to connect to permissions API. Displaying default permissions.
            Role-based access control is still enforced by the backend.
          </p>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <Button onClick={savePermissions} disabled={loading || apiError}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
        <Button variant="outline" onClick={fetchPermissions}>
          Refresh
        </Button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Permission changes will take effect when users log in next time. 
          Users currently logged in will continue with their current permissions until they re-authenticate.
        </p>
      </div>

      {roles.map((role) => (
        <Card key={role}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {role.replace('_', ' ').toUpperCase()}
              <Badge variant="outline">{role}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {resources.map((resource) => {
                const ResourceIcon = resource.icon;
                return (
                  <div key={resource.key} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <ResourceIcon className="w-4 h-4" />
                      <h4 className="font-medium">{resource.name}</h4>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {actions.map((action) => (
                        <div key={action.key} className="flex items-center space-x-2">
                          <Switch
                            id={`${role}-${resource.key}-${action.key}`}
                            checked={permissions[role]?.[resource.key]?.[action.key] || false}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(role, resource.key, action.key, checked)
                            }
                          />
                          <Label htmlFor={`${role}-${resource.key}-${action.key}`}>
                            {action.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RolePermissionsTab;
