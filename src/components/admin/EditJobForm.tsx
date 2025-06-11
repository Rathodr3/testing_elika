
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { jobsAPI, companiesAPI, Job, Company } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface EditJobFormProps {
  job: Job;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditJobForm = ({ job, onSuccess, onCancel }: EditJobFormProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState({
    company: typeof job.company === 'object' ? job.company._id : job.company || '',
    title: job.title || '',
    location: job.location || '',
    employmentType: job.employmentType || 'full-time',
    domain: job.domain || '',
    workMode: job.workMode || 'remote',
    experienceLevel: job.experienceLevel || 'entry',
    minExperience: job.minExperience || 0,
    description: job.description || '',
    requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
    benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : '',
    salary: job.salary || '',
    isActive: job.isActive
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      console.log('🔍 Fetching companies for job editing...');
      const data = await companiesAPI.getAll();
      console.log('✅ Companies fetched for editing:', data);
      setCompanies(data);
    } catch (error) {
      console.error('❌ Error fetching companies:', error);
      toast({
        title: "Error fetching companies",
        description: "Failed to load companies list",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company || !formData.title || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔧 Updating job with data:', formData);
      
      const jobData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(req => req.trim()),
        responsibilities: formData.responsibilities.split('\n').filter(resp => resp.trim()),
        benefits: formData.benefits.split('\n').filter(benefit => benefit.trim())
      };
      
      const result = await jobsAPI.update(job._id, jobData);
      console.log('✅ Job updated successfully:', result);
      
      toast({
        title: "Job updated successfully",
        description: `${formData.title} has been updated`,
      });
      onSuccess();
    } catch (error: any) {
      console.error('❌ Error updating job:', error);
      toast({
        title: "Error updating job",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-96 overflow-y-auto p-1">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="company">Company *</Label>
          <Select value={formData.company} onValueChange={(value) => setFormData(prev => ({ ...prev, company: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a company" />
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
            <Label htmlFor="employmentType">Employment Type *</Label>
            <Select value={formData.employmentType} onValueChange={(value) => setFormData(prev => ({ ...prev, employmentType: value as 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship' }))}>
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
            <Label htmlFor="workMode">Work Mode *</Label>
            <Select value={formData.workMode} onValueChange={(value) => setFormData(prev => ({ ...prev, workMode: value as 'remote' | 'on-site' | 'hybrid' }))}>
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
            <Label htmlFor="experienceLevel">Experience Level *</Label>
            <Select value={formData.experienceLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value as 'entry' | 'mid' | 'senior' | 'lead' | 'executive' }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry</SelectItem>
                <SelectItem value="mid">Mid</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="minExperience">Min Experience (years) *</Label>
            <Input
              id="minExperience"
              type="number"
              min="0"
              value={formData.minExperience}
              onChange={(e) => setFormData(prev => ({ ...prev, minExperience: parseInt(e.target.value) || 0 }))}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            value={formData.salary}
            onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
            placeholder="e.g., ₹80,000 - ₹120,000"
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Job description..."
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="requirements">Requirements (one per line)</Label>
          <Textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
            placeholder="Enter requirements, one per line"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
          <Textarea
            id="responsibilities"
            value={formData.responsibilities}
            onChange={(e) => setFormData(prev => ({ ...prev, responsibilities: e.target.value }))}
            placeholder="Enter responsibilities, one per line"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="benefits">Benefits (one per line)</Label>
          <Textarea
            id="benefits"
            value={formData.benefits}
            onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
            placeholder="Enter benefits, one per line"
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
          />
          <Label htmlFor="isActive">Active Job</Label>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Updating...' : 'Update Job'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditJobForm;
