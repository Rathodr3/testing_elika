
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import JobApplicationModal from '@/components/JobApplicationModal';
import JobHero from '@/components/JobHero';
import JobFilters from '@/components/JobFilters';
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
    jobType,
    setJobType,
    experience,
    setExperience,
    searchTerm,
    setSearchTerm,
    filteredJobs,
    jobsToShow,
    hasMoreJobs,
    displayedJobs,
    handleLoadMore
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

  const handleBrowseAllJobs = () => {
    if (jobsRef.current) {
      jobsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUploadResume = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Resume uploaded:', file.name);
        // Handle file upload logic here
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <JobHero 
          onBrowseJobs={handleBrowseAllJobs}
          onUploadResume={handleUploadResume}
        />

        {/* Filters Section */}
        <JobFilters
          jobType={jobType}
          setJobType={setJobType}
          experience={experience}
          setExperience={setExperience}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          resultsCount={filteredJobs.length}
        />

        {/* Jobs Listing */}
        <section className="py-16 lg:py-24" ref={jobsRef}>
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
                    className="border-primary text-primary hover:bg-primary/10"
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
                    No jobs found matching your criteria. Try adjusting your filters.
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
