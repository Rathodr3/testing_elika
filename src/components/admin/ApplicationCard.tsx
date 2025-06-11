
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { JobApplication } from '@/services/api';

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onStatusUpdate: (applicationId: string, newStatus: string) => void;
  onDelete: (applicationId: string) => void;
  isSelected: boolean;
  onToggleSelection: (applicationId: string) => void;
}

const ApplicationCard = ({
  application,
  onEdit,
  onStatusUpdate,
  onDelete,
  isSelected,
  onToggleSelection
}: ApplicationCardProps) => {
  const fullName = `${application.firstName || ''} ${application.lastName || ''}`.trim();
  const name = application.name || fullName || 'No Name';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'interviewed': return 'bg-orange-100 text-orange-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <Card className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(application._id!)}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {name}
                </h3>
                <Badge className={getStatusColor(application.status || 'pending')}>
                  {application.status || 'pending'}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                {application.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{application.email}</span>
                  </div>
                )}
                
                {application.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{application.phone}</span>
                  </div>
                )}
                
                {application.position && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Position:</span>
                    <span>{application.position}</span>
                  </div>
                )}
                
                {application.department && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Department:</span>
                    <span>{application.department}</span>
                  </div>
                )}
                
                {application.experienceLevel && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Experience:</span>
                    <span>{application.experienceLevel}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Change Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {statusOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => onStatusUpdate(application._id!, option.value)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(application)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(application._id!)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
