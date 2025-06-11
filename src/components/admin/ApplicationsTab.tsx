
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { JobApplication, applicationAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAdminData } from '@/contexts/AdminDataContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EditApplicationForm from './EditApplicationForm';
import ApplicationsStats from './ApplicationsStats';
import ApplicationCard from './ApplicationCard';
import AdminHeader from './AdminHeader';
import EnhancedFilters from './EnhancedFilters';
import BulkOperationsBar from './BulkOperationsBar';
import ConfirmationDialog from './ConfirmationDialog';

const ApplicationsTab = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { refreshTrigger, setRefreshing } = useAdminData();

  useEffect(() => {
    fetchApplications();
  }, [refreshTrigger]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      console.log('🔍 Fetching applications for admin dashboard...');
      const data = await applicationAPI.getAll();
      console.log('✅ Applications fetched:', data);
      
      const applicationsArray = Array.isArray(data) ? data : [];
      setApplications(applicationsArray);
    } catch (error) {
      console.error('❌ Error fetching applications:', error);
      toast({
        title: "Error fetching applications",
        description: "Failed to load applications from the server. Please check your connection.",
        variant: "destructive"
      });
      setApplications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(app => {
        const fullName = `${app.firstName || ''} ${app.lastName || ''}`.trim();
        const name = app.name || fullName;
        
        return name.toLowerCase().includes(searchLower) ||
               (app.email || '').toLowerCase().includes(searchLower) ||
               (app.position || '').toLowerCase().includes(searchLower) ||
               (app.department || '').toLowerCase().includes(searchLower);
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
      setSelectedApplications(prev => prev.filter(id => id !== applicationId));
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

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedApplications) {
        await applicationAPI.delete(id);
      }
      setApplications(prev => prev.filter(app => !selectedApplications.includes(app._id!)));
      setSelectedApplications([]);
      toast({
        title: "Applications deleted",
        description: `${selectedApplications.length} applications deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error deleting applications",
        description: "Some applications could not be deleted",
        variant: "destructive"
      });
    }
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    try {
      for (const id of selectedApplications) {
        await applicationAPI.updateStatus(id, newStatus);
      }
      setApplications(prev => 
        prev.map(app => 
          selectedApplications.includes(app._id!) 
            ? { ...app, status: newStatus as JobApplication['status'] }
            : app
        )
      );
      setSelectedApplications([]);
      toast({
        title: "Status updated",
        description: `${selectedApplications.length} applications updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Some applications could not be updated",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    const dataToExport = selectedApplications.length > 0 
      ? filteredApplications.filter(app => selectedApplications.includes(app._id!))
      : filteredApplications;

    if (dataToExport.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no applications to export.",
        variant: "destructive"
      });
      return;
    }

    const csvData = dataToExport.map(app => {
      const fullName = `${app.firstName || ''} ${app.lastName || ''}`.trim();
      const name = app.name || fullName;
      
      return {
        Name: name,
        Email: app.email || 'N/A',
        Phone: app.phone || 'N/A',
        Position: app.position || 'N/A',
        Department: app.department || 'N/A',
        'Experience Level': app.experienceLevel || 'N/A',
        'Years of Experience': app.yearsOfExperience || 'N/A',
        Status: app.status || 'pending',
        'Applied Date': new Date(app.applicationDate || app.createdAt || Date.now()).toLocaleDateString()
      };
    });

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
      description: `${dataToExport.length} applications exported to CSV file.`,
    });
  };

  const handleEditApplication = (application: JobApplication) => {
    setEditingApplication(application);
    setShowEditDialog(true);
  };

  const confirmDelete = (applicationId: string) => {
    setApplicationToDelete(applicationId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (applicationToDelete) {
      deleteApplication(applicationToDelete);
    }
    setShowDeleteConfirm(false);
    setApplicationToDelete(null);
  };

  const toggleSelection = (applicationId: string) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const selectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app._id!));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading applications...</span>
      </div>
    );
  }

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const bulkStatusOptions = statusOptions.slice(1); // Remove 'all' option

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Applications Management"
        description="Review and manage job applications"
        onExport={exportToCSV}
      />

      <ApplicationsStats applications={applications} />
      
      <EnhancedFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by name, email, position, or department..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            options: statusOptions,
            onChange: setStatusFilter
          }
        ]}
        onClearFilters={() => {
          setSearchTerm('');
          setStatusFilter('all');
        }}
      />

      <BulkOperationsBar
        selectedCount={selectedApplications.length}
        onBulkDelete={handleBulkDelete}
        onBulkExport={exportToCSV}
        onBulkStatusChange={handleBulkStatusChange}
        statusOptions={bulkStatusOptions}
        onClearSelection={() => setSelectedApplications([])}
      />

      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Showing {filteredApplications.length} of {applications.length} applications
              </span>
              <button
                onClick={selectAll}
                className="text-sm text-blue-600 hover:underline"
              >
                {selectedApplications.length === filteredApplications.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                onEdit={handleEditApplication}
                onStatusUpdate={updateApplicationStatus}
                onDelete={confirmDelete}
                isSelected={selectedApplications.includes(application._id!)}
                onToggleSelection={toggleSelection}
              />
            ))}
          </>
        ) : (
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
      </div>

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

      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Application"
        description="Are you sure you want to delete this application? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  );
};

export default ApplicationsTab;
