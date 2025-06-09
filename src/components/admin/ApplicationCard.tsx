
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Mail, Phone, FileText, Calendar, Edit } from 'lucide-react';
import { JobApplication } from '@/services/api';

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onStatusUpdate: (applicationId: string, newStatus: string) => void;
}

const ApplicationCard = ({ application, onEdit, onStatusUpdate }: ApplicationCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'interviewed': return 'bg-orange-100 text-orange-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-secondary-800">
                  {application.name || `${application.firstName} ${application.lastName}`}
                </h3>
                <p className="text-primary font-medium">
                  {application.position} - {application.department}
                </p>
              </div>
              <Badge className={getStatusColor(application.status)}>
                {application.status}
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm text-accent">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {application.email}
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {application.phone}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(application.applicationDate || application.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full lg:w-auto">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(application)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              {application.resumeUrl && (
                <Button size="sm" variant="outline" asChild>
                  <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-4 h-4 mr-1" />
                    Resume
                  </a>
                </Button>
              )}
            </div>

            <Select
              value={application.status}
              onValueChange={(value) => onStatusUpdate(application._id!, value)}
            >
              <SelectTrigger className="w-full lg:w-36">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
