
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign } from 'lucide-react';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    posted: string;
  };
  onApplyClick: (job: { id: string; title: string; company: string }) => void;
}

const JobCard = ({ job, onApplyClick }: JobCardProps) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white card-hover group">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-secondary-800 mb-2 group-hover:text-primary transition-colors duration-300">
            {job.title}
          </h3>
          <p className="text-primary font-semibold">{job.company}</p>
        </div>
        
        <div className="space-y-2 mb-4 text-sm text-accent">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {job.location}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {job.type} • Posted {job.posted}
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            {job.salary}
          </div>
        </div>
        
        <p className="text-accent leading-relaxed mb-6">
          {job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}
        </p>
        
        <Button 
          className="w-full group"
          onClick={() => onApplyClick({
            id: job.id,
            title: job.title,
            company: job.company
          })}
        >
          Apply Now
          <Clock className="ml-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobCard;
