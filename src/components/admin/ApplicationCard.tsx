
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Eye, Download, Trash2 } from 'lucide-react';
import { JobApplication } from '@/services/api';
import EditApplicationForm from './EditApplicationForm';
import { usePermissions } from '@/hooks/usePermissions';

interface ApplicationCardProps {
  application: JobApplication;
  onStatusUpdate: (id: string, status: string) => void;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
}

const ApplicationCard = ({ application, onStatusUpdate, onEdit, onDelete }: ApplicationCardProps) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const { canEdit, canDelete, isViewer } = usePermissions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'interviewed': return 'bg-orange-100 text-orange-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (newStatus: string) => {
    // Only allow status changes if user has edit permissions
    if (canEdit('applications')) {
      onStatusUpdate(application._id!, newStatus);
    }
  };

  const handleEdit = () => {
    if (canEdit('applications')) {
      setShowEditForm(true);
    }
  };

  const handleDelete = () => {
    if (canDelete('applications')) {
      if (window.confirm('Are you sure you want to delete this application?')) {
        onDelete(application._id!);
      }
    }
  };

  const handleDownloadResume = () => {
    if (application.resumePath) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      window.open(`${apiUrl}/applications/${application._id}/resume`, '_blank');
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              {application.firstName} {application.lastName}
            </h3>
            <p className="text-gray-600">{application.email}</p>
            <p className="text-sm text-gray-500">{application.phone}</p>
          </div>
          <Badge className={getStatusColor(application.status)}>
            {application.status.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium">Position</p>
            <p className="text-sm text-gray-600">{application.position}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Department</p>
            <p className="text-sm text-gray-600">{application.department}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Experience</p>
            <p className="text-sm text-gray-600">{application.yearsOfExperience} years</p>
          </div>
          <div>
            <p className="text-sm font-medium">Applied</p>
            <p className="text-sm text-gray-600">
              {new Date(application.applicationDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {application.skills && application.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {application.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Select
              value={application.status}
              onValueChange={handleStatusChange}
              disabled={!canEdit('applications') || isViewer()}
            >
              <SelectTrigger className="w-40">
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
            {isViewer() && (
              <span className="text-xs text-gray-500">(View only)</span>
            )}
          </div>

          <div className="flex gap-2">
            {application.resumePath && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadResume}
              >
                <Download className="w-4 h-4 mr-1" />
                Resume
              </Button>
            )}
            
            <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  disabled={!canEdit('applications') || isViewer()}
                >
                  {canEdit('applications') && !isViewer() ? (
                    <><Edit className="w-4 h-4 mr-1" />Edit</>
                  ) : (
                    <><Eye className="w-4 h-4 mr-1" />View</>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {canEdit('applications') && !isViewer() ? 'Edit' : 'View'} Application
                  </DialogTitle>
                </DialogHeader>
                <EditApplicationForm
                  application={application}
                  onSuccess={() => {
                    setShowEditForm(false);
                    onEdit(application);
                  }}
                  onCancel={() => setShowEditForm(false)}
                  readOnly={!canEdit('applications') || isViewer()}
                />
              </DialogContent>
            </Dialog>

            {canDelete('applications') && !isViewer() && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
