
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Building2, MapPin, Clock, Users } from 'lucide-react';
import { Job, jobsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAdminData } from '@/contexts/AdminDataContext';
import CreateJobForm from './CreateJobForm';
import EditJobForm from './EditJobForm';
import PermissionWrapper from './PermissionWrapper';

const JobsTab = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();
  const { refreshTrigger, setRefreshing } = useAdminData();

  useEffect(() => {
    fetchJobs();
  }, [refreshTrigger]);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      console.log('🔍 Fetching jobs for admin dashboard...');
      const data = await jobsAPI.getAll();
      console.log('✅ Jobs fetched:', data);
      
      const jobsArray = Array.isArray(data) ? data : [];
      setJobs(jobsArray);
      setFilteredJobs(jobsArray);
    } catch (error) {
      console.error('❌ Error fetching jobs:', error);
      toast({
        title: "Error fetching jobs",
        description: "Failed to load jobs from the server. Please check your connection.",
        variant: "destructive"
      });
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterJobs = () => {
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = jobs.filter(job => 
      (job.title || '').toLowerCase().includes(searchLower) ||
      (job.location || '').toLowerCase().includes(searchLower) ||
      (job.domain || '').toLowerCase().includes(searchLower) ||
      (typeof job.company === 'object' ? job.company?.name : job.company || '').toLowerCase().includes(searchLower)
    );
    setFilteredJobs(filtered);
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    fetchJobs();
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setEditingJob(null);
    fetchJobs();
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowEditDialog(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🗑️ Deleting job:', jobId);
      await jobsAPI.delete(jobId);
      setJobs(prev => prev.filter(job => job._id !== jobId));
      setSelectedJobs(prev => prev.filter(id => id !== jobId));
      toast({
        title: "Job deleted successfully",
        description: "The job has been removed.",
      });
    } catch (error) {
      console.error('❌ Error deleting job:', error);
      toast({
        title: "Error deleting job",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const selectAllJobs = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map(job => job._id!));
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getCompanyName = (company: any) => {
    if (typeof company === 'object' && company?.name) {
      return company.name;
    }
    return company || 'Unknown Company';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading jobs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Jobs Management</h2>
          <p className="text-muted-foreground">Manage job postings and requirements</p>
        </div>
        <PermissionWrapper resource="jobs" action="create">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Job</DialogTitle>
              </DialogHeader>
              <CreateJobForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        </PermissionWrapper>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search jobs by title, location, domain, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedJobs.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-800">
            {selectedJobs.length} jobs selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedJobs([])}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </span>
              <button
                onClick={selectAllJobs}
                className="text-sm text-blue-600 hover:underline"
              >
                {selectedJobs.length === filteredJobs.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            
            {filteredJobs.map((job) => (
              <Card key={job._id} className={`transition-all duration-200 ${selectedJobs.includes(job._id!) ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Checkbox
                        checked={selectedJobs.includes(job._id!)}
                        onCheckedChange={() => toggleJobSelection(job._id!)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {job.title}
                          </h3>
                          <Badge className={getStatusColor(job.isActive || false)}>
                            {job.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4" />
                            <span>{getCompanyName(job.company)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{job.workMode} • {job.employmentType}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>{job.experienceLevel} • {job.minExperience}+ years</span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {job.description}
                          </p>
                        </div>
                        
                        {job.domain && (
                          <div className="mt-2">
                            <Badge variant="secondary">{job.domain}</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log('View job:', job._id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <PermissionWrapper resource="jobs" action="update" fallback={null}>
                          <DropdownMenuItem onClick={() => handleEditJob(job)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        </PermissionWrapper>
                        <PermissionWrapper resource="jobs" action="delete" fallback={null}>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteJob(job._id!)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </PermissionWrapper>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              {jobs.length === 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-2">No Jobs Posted Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first job posting to start attracting candidates.
                  </p>
                  <PermissionWrapper resource="jobs" action="create">
                    <Button onClick={() => setShowCreateDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Job
                    </Button>
                  </PermissionWrapper>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-2">No Matching Jobs</h3>
                  <p className="text-muted-foreground">
                    No jobs found matching your search criteria.
                    Try adjusting your search terms.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Job Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>
          {editingJob && (
            <EditJobForm
              job={editingJob}
              onSuccess={handleEditSuccess}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingJob(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobsTab;
