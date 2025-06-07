
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import JobApplicationModal from '@/components/JobApplicationModal';
import JobHero from '@/components/JobHero';
import JobCard from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { useJobData } from '@/hooks/useJobData';

const Projects = () => {
  const [selectedJob, setSelectedJob] = useState<{
    id: string;
    title: string;
    company: string;
  } | null>(null);

  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const jobsRef = useRef<HTMLDivElement>(null);

  const {
    filteredJobs,
    displayedJobs,
    handleLoadMore,
    handleSearch
  } = useJobData();

  // Animation effect for elements
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleApplyClick = (job: { id: string; title: string; company: string }) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleSaveJob = (jobId: string) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const handleJobSearch = (filters: {
    query: string;
    location: string;
    company: string;
    experience: string;
    workMode: string;
  }) => {
    handleSearch(filters);
    
    // Scroll to jobs section after search
    if (jobsRef.current) {
      jobsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const jobsToShow = filteredJobs.slice(0, displayedJobs);
  const hasMoreJobs = displayedJobs < filteredJobs.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <JobHero onSearch={handleJobSearch} />

        {/* Jobs Listing */}
        <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900" ref={jobsRef}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="fade-in-up mb-8">
                <h2 className="text-2xl font-bold text-secondary-800 dark:text-white mb-4">
                  {filteredJobs.length} Open Position{filteredJobs.length !== 1 ? 's' : ''}
                </h2>
                <p className="text-accent dark:text-gray-300">
                  Find your next career opportunity with us
                </p>
              </div>

              <div className="space-y-6">
                {jobsToShow.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    index={index}
                    savedJobs={savedJobs}
                    onApply={handleApplyClick}
                    onSave={handleSaveJob}
                  />
                ))}
              </div>

              {/* Load More */}
              {hasMoreJobs && (
                <div className="fade-in-up text-center mt-12">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary/10 dark:border-primary dark:text-primary"
                    onClick={handleLoadMore}
                  >
                    Load More Jobs ({filteredJobs.length - displayedJobs} remaining)
                  </Button>
                </div>
              )}

              {/* No Jobs Found */}
              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    No jobs found matching your criteria. Try adjusting your search filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />

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
    </div>
  );
};

export default Projects;
