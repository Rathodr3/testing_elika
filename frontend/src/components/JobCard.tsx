
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Users } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
  applicants: string;
}

interface JobCardProps {
  job: Job;
  index: number;
  savedJobs: Set<string>;
  onApply: (job: { id: string; title: string; company: string }) => void;
  onSave: (jobId: string) => void;
}

const JobCard = ({ job, index, savedJobs, onApply, onSave }: JobCardProps) => {
  return (
    <Card 
      className={`fade-in-up delay-${(index % 3 + 1) * 100} border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 card-hover`}
    >
      <CardContent className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-secondary-800 dark:text-white mb-1">
                  {job.title}
                </h3>
                <p className="text-primary font-medium">{job.company}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {job.type}
                </span>
                <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                  {job.experience}
                </span>
              </div>
            </div>

            <p className="text-accent dark:text-gray-300 leading-relaxed mb-4">
              {job.description}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="flex items-center text-sm text-accent dark:text-gray-300">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                {job.location}
              </div>
              <div className="flex items-center text-sm text-accent dark:text-gray-300">
                <DollarSign className="w-4 h-4 mr-2 text-primary" />
                {job.salary}
              </div>
              <div className="flex items-center text-sm text-accent dark:text-gray-300">
                <Clock className="w-4 h-4 mr-2 text-primary" />
                {job.posted}
              </div>
              <div className="flex items-center text-sm text-accent dark:text-gray-300">
                <Users className="w-4 h-4 mr-2 text-primary" />
                {job.applicants}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Required Skills:
              </p>
              <div className="flex flex-wrap gap-2">
                {job.requirements.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full lg:w-auto">
            <Button 
              className="bg-primary hover:bg-primary-600 text-white"
              onClick={() => onApply({
                id: job.id,
                title: job.title,
                company: job.company
              })}
            >
              Apply Now
            </Button>
            <Button 
              variant="outline" 
              className={`border-primary hover:bg-primary/10 ${
                savedJobs.has(job.id) 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-primary'
              }`}
              onClick={() => onSave(job.id)}
            >
              {savedJobs.has(job.id) ? 'Saved' : 'Save Job'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
