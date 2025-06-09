
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
      const data = await applicationAPI.getAll();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error fetching applications",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
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
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const deleteApplication = async (applicationId: string) => {
    try {
      await applicationAPI.delete(applicationId);
      setApplications(prev => prev.filter(app => app._id !== applicationId));
      toast({
        title: "Application deleted successfully",
        description: "The application has been removed.",
      });
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: "Error deleting application",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    const csvData = filteredApplications.map(app => ({
      Name: app.name || `${app.firstName} ${app.lastName}`,
      Email: app.email,
      Phone: app.phone,
      Position: app.position,
      Department: app.department,
      'Experience Level': app.experienceLevel,
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
    a.download = 'job_applications.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleEditApplication = (application: JobApplication) => {
    setEditingApplication(application);
    setShowEditDialog(true);
  };

  const handleSaveApplication = async (updatedApplication: JobApplication) => {
    try {
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
      console.error('Error updating application:', error);
      toast({
        title: "Error updating application",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
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

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-accent">No applications found matching your criteria.</p>
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
