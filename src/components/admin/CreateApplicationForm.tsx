
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { applicationAPI } from '@/services/applicationAPI';
import { jobsAPI } from '@/services/api';
import { Job } from '@/services/types';

interface CreateApplicationFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateApplicationForm: React.FC<CreateApplicationFormProps> = ({
  onCancel,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    experienceLevel: '',
    yearsOfExperience: 0,
    skills: '',
    previousCompany: '',
    coverLetter: '',
    status: 'pending'
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log('🔍 Fetching jobs for application form...');
        const response: any = await jobsAPI.getAll();
        console.log('✅ Jobs response:', response);
        
        let jobsData: Job[] = [];
        if (Array.isArray(response)) {
          jobsData = response;
        } else if (response && typeof response === 'object' && response.data && Array.isArray(response.data)) {
          jobsData = response.data;
        } else if (response && typeof response === 'object' && response.success && response.data && Array.isArray(response.data)) {
          jobsData = response.data;
        }
        
        setJobs(jobsData);
        console.log('✅ Jobs loaded:', jobsData);
      } catch (error) {
        console.error('❌ Error fetching jobs:', error);
        toast({
          title: "Warning",
          description: "Could not load available positions",
          variant: "destructive",
        });
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, [toast]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleJobSelection = (jobId: string) => {
    const selectedJob = jobs.find(job => job._id === jobId);
    if (selectedJob) {
      setFormData(prev => ({
        ...prev,
        position: selectedJob.title,
        department: selectedJob.department || ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('📝 Submitting application data:', formData);
      
      // Create FormData object for submission
      const submitData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value.toString());
      });

      console.log('📤 Submitting application...');
      const result = await applicationAPI.submit(submitData);
      console.log('✅ Application submission result:', result);

      if (result && (result.success || result.data)) {
        toast({
          title: "Success",
          description: "Application created successfully",
        });
        onSuccess();
      } else {
        throw new Error('Failed to create application - no success response');
      }
    } catch (error) {
      console.error('❌ Error creating application:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create application. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'Engineering',
    'Consulting', 
    'Training',
    'Software Development',
    'Management'
  ];

  const experienceLevels = [
    'Entry Level',
    'Mid Level', 
    'Senior Level',
    'Executive'
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under-review', label: 'Under Review' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Information */}
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
          />
        </div>

        {/* Job Information */}
        <div>
          <Label htmlFor="jobSelect">Select Job Position</Label>
          <Select onValueChange={handleJobSelection} disabled={loadingJobs}>
            <SelectTrigger>
              <SelectValue placeholder={loadingJobs ? "Loading jobs..." : "Select a job position"} />
            </SelectTrigger>
            <SelectContent>
              {jobs.map((job) => (
                <SelectItem key={job._id} value={job._id!}>
                  {job.title} - {job.department || 'No Department'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="position">Position *</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="department">Department *</Label>
          <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="experienceLevel">Experience Level *</Label>
          <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
          <Input
            id="yearsOfExperience"
            type="number"
            min="0"
            max="50"
            value={formData.yearsOfExperience}
            onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
            required
          />
        </div>

        <div>
          <Label htmlFor="previousCompany">Previous Company</Label>
          <Input
            id="previousCompany"
            value={formData.previousCompany}
            onChange={(e) => handleInputChange('previousCompany', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="status">Application Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Skills and Cover Letter */}
      <div>
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input
          id="skills"
          value={formData.skills}
          onChange={(e) => handleInputChange('skills', e.target.value)}
          placeholder="React, JavaScript, TypeScript, Node.js"
        />
      </div>

      <div>
        <Label htmlFor="coverLetter">Cover Letter</Label>
        <Textarea
          id="coverLetter"
          value={formData.coverLetter}
          onChange={(e) => handleInputChange('coverLetter', e.target.value)}
          rows={4}
          placeholder="Tell us why you're interested in this position..."
          maxLength={2000}
        />
        <p className="text-sm text-muted-foreground mt-1">
          {formData.coverLetter.length}/2000 characters
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Application'}
        </Button>
      </div>
    </form>
  );
};

export default CreateApplicationForm;
