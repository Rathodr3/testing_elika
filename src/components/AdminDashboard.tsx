
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Building2, Briefcase, FileText } from 'lucide-react';
import UsersTab from './admin/UsersTab';
import CompaniesTab from './admin/CompaniesTab';
import JobsTab from './admin/JobsTab';
import ApplicationsTab from './admin/ApplicationsTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('applications');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-800 mb-2">Admin Dashboard</h1>
        <p className="text-accent">Manage your organization's data and settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Companies
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UsersTab />
        </TabsContent>

        <TabsContent value="companies" className="mt-6">
          <CompaniesTab />
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          <JobsTab />
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <ApplicationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
