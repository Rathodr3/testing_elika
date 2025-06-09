
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { JobApplication, applicationAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EditApplicationForm from './EditApplicationForm';
import ApplicationsStats from './ApplicationsStats';
import ApplicationsFilters from './ApplicationsFilters';
import ApplicationCard from './ApplicationCard';

const ApplicationsTab = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching applications for admin dashboard...');
      const data = await applicationAPI.getAll();
      console.log('✅ Applications fetched:', data);
      setApplications(data);
    } catch (error) {
      console.error('❌ Error fetching applications:', error);
      toast({
        title: "Error fetching applications",
        description: "Failed to load applications from the server. Please check your connection.",
        variant: "destructive"
      });
      // Set empty array on error to prevent infinite loading
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app => {
        const name = app.name || `${app.firstName || ''} ${app.lastName || ''}`.trim();
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               app.position.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      console.log('🔄 Updating application status:', { applicationId, newStatus });
      await applicationAPI.updateStatus(applicationId, newStatus);
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId 
            ? { ...app, status: newStatus as JobApplication['status'] }
            : app
        )
      );
      toast({
        title: "Status updated successfully",
        description: `Application marked as ${newStatus}`,
      });
    } catch (error) {
      console.error('❌ Error updating status:', error);
      toast({
        title: "Error updating status",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const deleteApplication = async (applicationId: string) => {
    try {
      console.log('🗑️ Deleting application:', applicationId);
      await applicationAPI.delete(applicationId);
      setApplications(prev => prev.filter(app => app._id !== applicationId));
      toast({
        title: "Application deleted successfully",
        description: "The application has been removed.",
      });
    } catch (error) {
      console.error('❌ Error deleting application:', error);
      toast({
        title: "Error deleting application",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    if (filteredApplications.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no applications to export.",
        variant: "destructive"
      });
      return;
    }

    const csvData = filteredApplications.map(app => ({
      Name: app.name || `${app.firstName || ''} ${app.lastName || ''}`.trim(),
      Email: app.email,
      Phone: app.phone,
      Position: app.position,
      Department: app.department,
      'Experience Level': app.experienceLevel,
      'Years of Experience': app.yearsOfExperience || 'N/A',
      Status: app.status,
      'Applied Date': new Date(app.applicationDate || app.createdAt).toLocaleDateString()
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job_applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Applications exported to CSV file.",
    });
  };

  const handleEditApplication = (application: JobApplication) => {
    setEditingApplication(application);
    setShowEditDialog(true);
  };

  const handleSaveApplication = async (updatedApplication: JobApplication) => {
    try {
      console.log('💾 Saving application:', updatedApplication);
      await applicationAPI.update(updatedApplication._id!, updatedApplication);
      setApplications(prev => 
        prev.map(app => 
          app._id === updatedApplication._id ? updatedApplication : app
        )
      );
      setShowEditDialog(false);
      setEditingApplication(null);
      toast({
        title: "Application updated successfully",
        description: "The application details have been saved.",
      });
    } catch (error) {
      console.error('❌ Error updating application:', error);
      toast({
        title: "Error updating application",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading applications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Applications Management</h2>
        <p className="text-muted-foreground">Review and manage job applications</p>
      </div>

      <ApplicationsStats applications={applications} />
      
      <ApplicationsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onExportCSV={exportToCSV}
      />

      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <ApplicationCard
            key={application._id}
            application={application}
            onEdit={handleEditApplication}
            onStatusUpdate={updateApplicationStatus}
            onDelete={deleteApplication}
          />
        ))}
      </div>

      {filteredApplications.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            {applications.length === 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground">
                  No job applications have been submitted yet. 
                  Applications will appear here when candidates apply for jobs.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-2">No Matching Applications</h3>
                <p className="text-muted-foreground">
                  No applications found matching your current filters.
                  Try adjusting your search criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          {editingApplication && (
            <EditApplicationForm
              application={editingApplication}
              onSuccess={() => {
                setShowEditDialog(false);
                setEditingApplication(null);
                fetchApplications();
              }}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingApplication(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsTab;
