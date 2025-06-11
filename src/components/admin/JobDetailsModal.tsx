
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Job } from '@/services/types';
import { Calendar, MapPin, Users, Clock, DollarSign, Building } from 'lucide-react';

interface JobDetailsModalProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, open, onOpenChange }) => {
  if (!job) return null;

  const getCompanyName = (company: string | { _id: string; name: string } | undefined): string => {
    if (!company) return 'N/A';
    if (typeof company === 'string') return company;
    return company.name;
  };

  // Helper function to ensure we get an array from string or array input
  const ensureArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      // Try to parse as JSON first, if that fails, split by common delimiters
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
        return [value]; // If not an array, wrap in array
      } catch {
        // If JSON parsing fails, try splitting by common delimiters
        return value.split(/[,;|\n]/).map(item => item.trim()).filter(item => item.length > 0);
      }
    }
    return [];
  };

  const requirements = ensureArray(job.requirements);
  const responsibilities = ensureArray(job.responsibilities);
  const benefits = ensureArray(job.benefits);

  // Get the posted date - use createdAt since postedDate doesn't exist in Job type
  const getPostedDate = () => {
    const date = job.createdAt || new Date();
    return new Date(date).toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-2xl font-bold text-left">{job.title}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 pb-4">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building className="w-5 h-5" />
                  Job Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Company:</span>
                    <span className="font-medium">{getCompanyName(job.company)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Location:</span>
                    <span className="font-medium">{job.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <Badge variant="outline">{job.employmentType}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Experience:</span>
                    <Badge variant="secondary">{job.experienceLevel}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Work Mode:</span>
                    <Badge variant="outline">{job.workMode}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Domain:</span>
                    <Badge variant="secondary">{job.domain}</Badge>
                  </div>
                  
                  {job.salary && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Salary:</span>
                      <span className="font-medium">{job.salary}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Min Experience:</span>
                    <span className="font-medium">{job.minExperience}+ years</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Posted:</span>
                    <span className="font-medium">{getPostedDate()}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant={job.isActive ? 'default' : 'secondary'}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm leading-relaxed">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Responsibilities */}
            {responsibilities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm leading-relaxed">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
