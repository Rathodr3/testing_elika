
import React from 'react';
import { Button } from '@/components/ui/button';

interface JobHeroProps {
  onBrowseJobs: () => void;
  onUploadResume: () => void;
}

const JobHero = ({ onBrowseJobs, onUploadResume }: JobHeroProps) => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="fade-in-up text-4xl lg:text-6xl font-bold text-secondary-800 dark:text-white mb-6">
            Career <span className="gradient-text">Opportunities</span>
          </h1>
          <p className="fade-in-up delay-200 text-xl text-accent dark:text-gray-300 leading-relaxed mb-8">
            Join our team of exceptional engineers and build the future of technology with us. 
            Discover exciting opportunities that match your skills and aspirations.
          </p>
          <div className="fade-in-up delay-400 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-primary hover:bg-primary-600 text-white"
              onClick={onBrowseJobs}
            >
              Browse All Jobs
            </Button>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
              onClick={onUploadResume}
            >
              Upload Resume
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobHero;
