
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { applicationAPI, JobApplication } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface EditApplicationFormProps {
  application: JobApplication;
  onSuccess: () => void;
  onCancel: () => void;
  readOnly?: boolean;
}

const EditApplicationForm = ({ application, onSuccess, onCancel, readOnly = false }: EditApplicationFormProps) => {
  const [formData, setFormData] = useState({
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    phone: application.phone,
    position: application.position,
    department: application.department,
    experienceLevel: application.experienceLevel,
    yearsOfExperience: application.yearsOfExperience,
    skills: application.skills || [],
    previousCompany: application.previousCompany || '',
    coverLetter: application.coverLetter || '',
    status: application.status
  });
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (readOnly) return;
    
    try {
      setLoading(true);
      await applicationAPI.update(application._id!, formData);
      toast({
        title: "Application updated successfully",
        description: `${formData.firstName} ${formData.lastName}'s application has been updated`,
      });
      onSuccess();
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error updating application",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (!readOnly) {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill !== skillToRemove)
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {readOnly && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            You are viewing this application in read-only mode. You don't have permission to make changes.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
            disabled={readOnly}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
            disabled={readOnly}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
          disabled={readOnly}
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          required
          disabled={readOnly}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            required
            disabled={readOnly}
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            required
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="experienceLevel">Experience Level</Label>
          <Select value={formData.experienceLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))} disabled={readOnly}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
          <Input
            id="yearsOfExperience"
            type="number"
            value={formData.yearsOfExperience}
            onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) }))}
            required
            disabled={readOnly}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="previousCompany">Previous Company</Label>
        <Input
          id="previousCompany"
          value={formData.previousCompany}
          onChange={(e) => setFormData(prev => ({ ...prev, previousCompany: e.target.value }))}
          disabled={readOnly}
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))} disabled={readOnly}>
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
        <Label>Skills</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
              {skill} {!readOnly && '×'}
            </Badge>
          ))}
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <Button type="button" onClick={addSkill} variant="outline">Add</Button>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="coverLetter">Cover Letter</Label>
        <Textarea
          id="coverLetter"
          value={formData.coverLetter}
          onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
          rows={4}
          disabled={readOnly}
        />
      </div>

      <div className="flex gap-2 pt-4">
        {!readOnly && (
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Updating...' : 'Update Application'}
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          {readOnly ? 'Close' : 'Cancel'}
        </Button>
      </div>
    </form>
  );
};

export default EditApplicationForm;
