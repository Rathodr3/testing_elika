
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import JobApplicationModal from './JobApplicationModal';
import JobCard from './jobs/JobCard';
import useFeaturedJobs from './jobs/useFeaturedJobs';

const FeaturedJobs = () => {
  const [selectedJob, setSelectedJob] = useState<{
    id: string;
    title: string;
    company: string;
  } | null>(null);

  const { jobs, loading } = useFeaturedJobs();

  const handleApplyClick = (job: { id: string; title: string; company: string }) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleViewAllClick = () => {
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <p>Loading featured jobs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-secondary-800 mb-6">
              Featured Opportunities
            </h2>
            <p className="text-xl text-accent max-w-3xl mx-auto leading-relaxed">
              Discover exciting career opportunities with our partner companies across various industries.
            </p>
          </div>

          {/* Jobs Grid */}
          {jobs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {jobs.map((job, index) => (
                <JobCard
                  key={index}
                  job={job}
                  onApplyClick={handleApplyClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center mb-12">
              <p className="text-accent">No featured jobs available at the moment.</p>
            </div>
          )}

          {/* View All Jobs Button */}
          <div className="text-center">
            <Link to="/projects" onClick={handleViewAllClick}>
              <Button variant="outline" size="lg" className="px-8 py-4 border-primary text-primary hover:bg-primary/10">
                View All Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Job Application Modal */}
      {selectedJob && (
        <JobApplicationModal
          isOpen={!!selectedJob}
          onClose={handleCloseModal}
          jobTitle={selectedJob.title}
          jobId={selectedJob.id}
          company={selectedJob.company}
        />
      )}
    </section>
  );
};

export default FeaturedJobs;
