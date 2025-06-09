
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { companiesAPI, Company } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface EditCompanyFormProps {
  company: Company;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditCompanyForm: React.FC<EditCompanyFormProps> = ({ company, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: company.name || '',
    logo: company.logo || '',
    description: company.description || '',
    contactEmail: company.contactEmail || '',
    phoneNumber: company.phoneNumber || '',
    website: company.website || '',
    spokespersons: {
      primary: {
        name: company.spokespersons?.primary?.name || '',
        role: company.spokespersons?.primary?.role || '',
        email: company.spokespersons?.primary?.email || '',
        contact: company.spokespersons?.primary?.contact || ''
      },
      secondary: {
        name: company.spokespersons?.secondary?.name || '',
        role: company.spokespersons?.secondary?.role || '',
        email: company.spokespersons?.secondary?.email || '',
        contact: company.spokespersons?.secondary?.contact || ''
      }
    },
    isActive: company.isActive
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSpokespersonChange = (type: 'primary' | 'secondary', field: string, value: string) => {
    setFormData({
      ...formData,
      spokespersons: {
        ...formData.spokespersons,
        [type]: {
          ...formData.spokespersons[type],
          [field]: value
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.contactEmail || !formData.phoneNumber) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await companiesAPI.update(company._id!, formData);
      toast({
        title: "Company updated successfully",
        description: "The company details have been saved",
      });
      onSuccess();
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Error updating company",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Company Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="logo">Logo URL</Label>
          <Input
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleInputChange}
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://company.com"
          />
        </div>

        {/* Primary Spokesperson */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Primary Spokesperson</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.spokespersons.primary.name}
                  onChange={(e) => handleSpokespersonChange('primary', 'name', e.target.value)}
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  value={formData.spokespersons.primary.role}
                  onChange={(e) => handleSpokespersonChange('primary', 'role', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.spokespersons.primary.email}
                  onChange={(e) => handleSpokespersonChange('primary', 'email', e.target.value)}
                />
              </div>
              <div>
                <Label>Contact</Label>
                <Input
                  value={formData.spokespersons.primary.contact}
                  onChange={(e) => handleSpokespersonChange('primary', 'contact', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Spokesperson */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Secondary Spokesperson</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.spokespersons.secondary.name}
                  onChange={(e) => handleSpokespersonChange('secondary', 'name', e.target.value)}
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  value={formData.spokespersons.secondary.role}
                  onChange={(e) => handleSpokespersonChange('secondary', 'role', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.spokespersons.secondary.email}
                  onChange={(e) => handleSpokespersonChange('secondary', 'email', e.target.value)}
                />
              </div>
              <div>
                <Label>Contact</Label>
                <Input
                  value={formData.spokespersons.secondary.contact}
                  onChange={(e) => handleSpokespersonChange('secondary', 'contact', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Updating...' : 'Update Company'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditCompanyForm;
