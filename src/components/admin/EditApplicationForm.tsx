
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobApplication } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface EditApplicationFormProps {
  application: JobApplication;
  onSave: (updatedApplication: JobApplication) => void;
  onCancel: () => void;
}

const EditApplicationForm = ({ application, onSave, onCancel }: EditApplicationFormProps) => {
  const [formData, setFormData] = useState({
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    phone: application.phone,
    position: application.position,
    department: application.department,
    experienceLevel: application.experienceLevel,
    yearsOfExperience: application.yearsOfExperience,
    skills: application.skills.join(', '),
    previousCompany: application.previousCompany || '',
    coverLetter: application.coverLetter || '',
    status: application.status
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedApplication: JobApplication = {
      ...application,
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      yearsOfExperience: Number(formData.yearsOfExperience)
    };

    onSave(updatedApplication);
    toast({
      title: "Application updated",
      description: "The application details have been saved successfully.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
            <SelectTrigger>
              <SelectValue />
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

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="experienceLevel">Experience Level</Label>
          <Select value={formData.experienceLevel} onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}>
            <SelectTrigger>
              <SelectValue />
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
            max="50"
            value={formData.yearsOfExperience}
            onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="previousCompany">Previous Company</Label>
        <Input
          id="previousCompany"
          value={formData.previousCompany}
          onChange={(e) => setFormData({ ...formData, previousCompany: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input
          id="skills"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="React, Node.js, Python, etc."
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as JobApplication['status'] })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submitted">Submitted</SelectItem>
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
          onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
          rows={4}
          placeholder="Cover letter content..."
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit">Save Changes</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditApplicationForm;
