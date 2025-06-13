
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, RefreshCw, Search, Users, FileText, Clock, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { applicationAPI } from '@/services/applicationAPI';
import { useToast } from '@/hooks/use-toast';
import { JobApplication } from '@/services/types';
import ApplicationCard from './ApplicationCard';
import EditApplicationForm from './EditApplicationForm';
import AdminHeader from './AdminHeader';
import { Skeleton } from '@/components/ui/skeleton';

interface FilterState {
  status: string;
  search: string;
}

const ApplicationsTab = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching applications...');
      
      const filters: FilterState = {
        status: statusFilter === 'all' ? '' : statusFilter,
        search: searchTerm
      };
      
      const data = await applicationAPI.getAll(filters);
      console.log('✅ Applications loaded:', data);
      
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications. Please check your connection and try again.",
        variant: "destructive",
      });
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleSearch = () => {
    fetchApplications();
  };

  const handleStatusUpdate = async (id: string, status: string, notes?: string) => {
    try {
      await applicationAPI.updateStatus(id, status, notes);
      toast({
        title: "Success",
        description: "Application status updated successfully",
      });
      fetchApplications();
    } catch (error) {
      console.error('❌ Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (application: JobApplication) => {
    setSelectedApplication(application);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedApplication(null);
    fetchApplications();
  };

  const handleDelete = async (applicationId: string) => {
    try {
      await applicationAPI.delete(applicationId);
      toast({
        title: "Success",
        description: "Application deleted successfully",
      });
      fetchApplications();
    } catch (error) {
      console.error('❌ Error deleting application:', error);
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive",
      });
    }
  };

  const handleToggleSelection = (applicationId: string) => {
    setSelectedApplicationIds(prev => 
      prev.includes(applicationId) 
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const getStatusCounts = () => {
    const counts = {
      total: applications.length,
      pending: applications.filter(app => 
        app.status === 'pending' || app.status === 'submitted'
      ).length,
      reviewing: applications.filter(app => 
        app.status === 'reviewing' || app.status === 'under-review'
      ).length,
      interviewed: applications.filter(app => 
        app.status === 'interviewed' || app.status === 'shortlisted'
      ).length,
      hired: applications.filter(app => app.status === 'hired').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminHeader title="Job Applications" description="Manage and review job applications" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Job Applications" 
        description="Manage and review job applications"
        onRefresh={fetchApplications}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.reviewing}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hired</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.hired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="flex gap-2">
            <Input
              placeholder="Search by name, email, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} variant="outline">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="reviewing">Reviewing</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="interviewed">Interviewed</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No Applications Found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {searchTerm || statusFilter !== 'all'
                ? "Try adjusting your search filters." 
                : "No job applications have been submitted yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onStatusUpdate={handleStatusUpdate}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isSelected={selectedApplicationIds.includes(application._id!)}
              onToggleSelection={handleToggleSelection}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <EditApplicationForm
              application={selectedApplication}
              onCancel={() => setShowEditModal(false)}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsTab;
