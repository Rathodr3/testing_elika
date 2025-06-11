
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Building2, Briefcase, FileText } from 'lucide-react';
import { AdminDataProvider } from '@/contexts/AdminDataContext';
import { usePermissions } from '@/hooks/usePermissions';
import UsersTab from './admin/UsersTab';
import CompaniesTab from './admin/CompaniesTab';
import JobsTab from './admin/JobsTab';
import ApplicationsTab from './admin/ApplicationsTab';
import PermissionWrapper from './admin/PermissionWrapper';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const { loading } = usePermissions();

  console.log('🎛️ Rendering AdminDashboard with activeTab:', activeTab);

  // Handle tab change and scroll to top
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Scroll to top of the page when tab changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminDataProvider>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">Admin Dashboard</h1>
          <p className="text-accent">Manage your organization's data and settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <PermissionWrapper resource="users" action="read" fallback={null}>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
            </PermissionWrapper>
            
            <PermissionWrapper resource="companies" action="read" fallback={null}>
              <TabsTrigger value="companies" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Companies
              </TabsTrigger>
            </PermissionWrapper>
            
            <PermissionWrapper resource="jobs" action="read" fallback={null}>
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Jobs
              </TabsTrigger>
            </PermissionWrapper>
            
            <PermissionWrapper resource="applications" action="read" fallback={null}>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Applications
              </TabsTrigger>
            </PermissionWrapper>
          </TabsList>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <PermissionWrapper resource="users" action="read">
              <TabsContent value="users" className="mt-0">
                <UsersTab />
              </TabsContent>
            </PermissionWrapper>

            <PermissionWrapper resource="companies" action="read">
              <TabsContent value="companies" className="mt-0">
                <CompaniesTab />
              </TabsContent>
            </PermissionWrapper>

            <PermissionWrapper resource="jobs" action="read">
              <TabsContent value="jobs" className="mt-0">
                <JobsTab />
              </TabsContent>
            </PermissionWrapper>

            <PermissionWrapper resource="applications" action="read">
              <TabsContent value="applications" className="mt-0">
                <ApplicationsTab />
              </TabsContent>
            </PermissionWrapper>
          </div>
        </Tabs>
      </div>
    </AdminDataProvider>
  );
};

export default AdminDashboard;
