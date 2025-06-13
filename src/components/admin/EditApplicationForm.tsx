
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobApplication } from '@/services/types';
import { applicationAPI } from '@/services/applications/applicationAPI';
import { useToast } from '@/hooks/use-toast';

interface EditApplicationFormProps {
  application: JobApplication;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditApplicationForm = ({ application, onSuccess, onCancel }: EditApplicationFormProps) => {
  const [formData, setFormData] = useState({
    firstName: application.firstName || '',
    lastName: application.lastName || '',
    email: application.email || '',
    phone: application.phone || '',
    position: application.position || '',
    department: application.department || '',
    experienceLevel: application.experienceLevel || '',
    yearsOfExperience: application.yearsOfExperience || 0,
    previousCompany: application.previousCompany || '',
    coverLetter: application.coverLetter || '',
    status: application.status || 'pending' as const,
    notes: application.notes || ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔧 Updating application with data:', formData);
      
      await applicationAPI.update(application._id!, formData);
      console.log('✅ Application updated successfully');
      
      toast({
        title: "Application updated successfully",
        description: `${formData.firstName} ${formData.lastName}'s application has been updated`,
      });
      onSuccess();
    } catch (error: any) {
      console.error('❌ Error updating application:', error);
      toast({
        title: "Error updating application",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      status: value as 'pending' | 'reviewing' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected' | 'submitted' | 'under-review'
    }));
  };

  return (
    <div className="max-h-96 overflow-y-auto p-1">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Consulting">Consulting</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="Software Development">Software Development</SelectItem>
                <SelectItem value="Management">Management</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Select value={formData.experienceLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entry Level">Entry Level</SelectItem>
                <SelectItem value="Mid Level">Mid Level</SelectItem>
                <SelectItem value="Senior Level">Senior Level</SelectItem>
                <SelectItem value="Executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="yearsOfExperience">Years of Experience</Label>
            <Input
              id="yearsOfExperience"
              type="number"
              min="0"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="previousCompany">Previous Company</Label>
          <Input
            id="previousCompany"
            value={formData.previousCompany}
            onChange={(e) => setFormData(prev => ({ ...prev, previousCompany: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="status">Application Status</Label>
          <Select value={formData.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="interviewed">Interviewed</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="coverLetter">Cover Letter</Label>
          <Textarea
            id="coverLetter"
            value={formData.coverLetter}
            onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
            rows={4}
            placeholder="Cover letter content..."
          />
        </div>

        <div>
          <Label htmlFor="notes">Internal Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            placeholder="Add internal notes about this application..."
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Updating...' : 'Update Application'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditApplicationForm;
