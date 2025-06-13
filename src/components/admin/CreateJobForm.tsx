
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { jobsAPI, companiesAPI, Company } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface CreateJobFormProps {
  onSuccess: () => void;
}

const CreateJobForm = ({ onSuccess }: CreateJobFormProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    employmentType: 'full-time',
    domain: '',
    workMode: 'on-site',
    experienceLevel: 'mid',
    minExperience: 0,
    type: 'full-time • on-site', // Combined type field
    experience: '0+ years', // Experience display field
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    salary: '',
    posted: new Date().toISOString().split('T')[0], // Posted date
    applicants: 0, // Applicants count
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
    // Set default posted date to today
    setFormData(prev => ({
      ...prev,
      posted: new Date().toISOString().split('T')[0]
    }));
  }, []);

  // Update derived fields when base fields change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      type: `${prev.employmentType} • ${prev.workMode}`,
      experience: `${prev.minExperience}+ years`
    }));
  }, [formData.employmentType, formData.workMode, formData.minExperience]);

  const fetchCompanies = async () => {
    try {
      console.log('🔍 Fetching companies for job creation...');
      const data = await companiesAPI.getAll();
      console.log('✅ Companies fetched:', data);
      setCompanies(data.filter(company => company.isActive));
    } catch (error) {
      console.error('❌ Error fetching companies:', error);
      toast({
        title: "Error fetching companies",
        description: "Could not load companies list",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company || !formData.title || !formData.location || !formData.domain) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      console.log('🔧 Creating job with data:', formData);
      
      const jobData = {
        ...formData,
        requirements: formData.requirements ? formData.requirements.split('\n').filter(req => req.trim()) : [],
        responsibilities: formData.responsibilities ? formData.responsibilities.split('\n').filter(resp => resp.trim()) : [],
        benefits: formData.benefits ? formData.benefits.split('\n').filter(benefit => benefit.trim()) : [],
        applicantsCount: formData.applicants,
        postedDate: formData.posted
      };
      
      const result = await jobsAPI.create(jobData);
      console.log('✅ Job created successfully:', result);
      
      toast({
        title: "Job created successfully",
        description: `${formData.title} has been posted`,
      });
      onSuccess();
    } catch (error: any) {
      console.error('❌ Error creating job:', error);
      toast({
        title: "Error creating job",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4 pr-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company">Company *</Label>
            <Select value={formData.company} onValueChange={(value) => setFormData(prev => ({ ...prev, company: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company._id} value={company._id!}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="domain">Domain *</Label>
            <Input
              id="domain"
              value={formData.domain}
              onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="employmentType">Employment Type</Label>
            <Select value={formData.employmentType} onValueChange={(value) => setFormData(prev => ({ ...prev, employmentType: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="workMode">Work Mode</Label>
            <Select value={formData.workMode} onValueChange={(value) => setFormData(prev => ({ ...prev, workMode: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="on-site">On-site</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Select value={formData.experienceLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="minExperience">Min Experience (years)</Label>
            <Input
              id="minExperience"
              type="number"
              min="0"
              value={formData.minExperience}
              onChange={(e) => setFormData(prev => ({ ...prev, minExperience: parseInt(e.target.value) || 0 }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Type (Auto-generated)</Label>
            <Input
              id="type"
              value={formData.type}
              readOnly
              className="bg-gray-50"
              placeholder="Auto-generated from employment type and work mode"
            />
          </div>

          <div>
            <Label htmlFor="experience">Experience Display (Auto-generated)</Label>
            <Input
              id="experience"
              value={formData.experience}
              readOnly
              className="bg-gray-50"
              placeholder="Auto-generated from min experience"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              value={formData.salary}
              onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
              placeholder="e.g., $50,000 - $70,000"
            />
          </div>

          <div>
            <Label htmlFor="posted">Posted Date</Label>
            <Input
              id="posted"
              type="date"
              value={formData.posted}
              onChange={(e) => setFormData(prev => ({ ...prev, posted: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="applicants">Initial Applicants Count</Label>
          <Input
            id="applicants"
            type="number"
            min="0"
            value={formData.applicants}
            onChange={(e) => setFormData(prev => ({ ...prev, applicants: parseInt(e.target.value) || 0 }))}
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            placeholder="Describe the job role and what the candidate will be doing..."
            required
          />
        </div>

        <div>
          <Label htmlFor="requirements">Requirements (one per line)</Label>
          <Textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
            rows={3}
            placeholder="3+ years of experience&#10;Bachelor's degree&#10;Strong communication skills"
          />
        </div>

        <div>
          <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
          <Textarea
            id="responsibilities"
            value={formData.responsibilities}
            onChange={(e) => setFormData(prev => ({ ...prev, responsibilities: e.target.value }))}
            rows={3}
            placeholder="Develop and maintain software applications&#10;Collaborate with cross-functional teams&#10;Write clean, maintainable code"
          />
        </div>

        <div>
          <Label htmlFor="benefits">Benefits (one per line)</Label>
          <Textarea
            id="benefits"
            value={formData.benefits}
            onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
            rows={3}
            placeholder="Health insurance&#10;Flexible working hours&#10;Professional development opportunities"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Creating...' : 'Create Job'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobForm;
