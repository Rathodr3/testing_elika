
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Stats from '@/components/Stats';
import JobApplicationModal from '@/components/JobApplicationModal';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Briefcase, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Projects = () => {
  const [selectedJob, setSelectedJob] = useState<{
    id: string;
    title: string;
    company: string;
  } | null>(null);

  const [jobType, setJobType] = useState('All');
  const [experience, setExperience] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const heroRef = useRef<HTMLElement>(null);
  const jobsRef = useRef<HTMLDivElement>(null);

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

  const jobs = [
    {
      id: 'job-1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Industries',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: '5+ years',
      salary: '$120k - $160k',
      description: 'Join our engineering team to build scalable software solutions. Work on cutting-edge technologies and contribute to products used by millions.',
      requirements: ['React', 'Node.js', 'TypeScript', 'AWS'],
      posted: '2 days ago',
      applicants: '24 applicants'
    },
    {
      id: 'job-2',
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      location: 'Remote',
      type: 'Full-time',
      experience: '3+ years',
      salary: '$100k - $140k',
      description: 'Design and maintain CI/CD pipelines, manage cloud infrastructure, and ensure system reliability and security.',
      requirements: ['Docker', 'Kubernetes', 'AWS', 'Jenkins'],
      posted: '1 week ago',
      applicants: '18 applicants'
    },
    {
      id: 'job-3',
      title: 'Frontend Developer',
      company: 'DesignFirst Agency',
      location: 'New York, NY',
      type: 'Contract',
      experience: '2+ years',
      salary: '$80k - $110k',
      description: 'Create beautiful, responsive user interfaces and collaborate with design teams to bring creative visions to life.',
      requirements: ['React', 'CSS', 'JavaScript', 'Figma'],
      posted: '3 days ago',
      applicants: '31 applicants'
    },
    {
      id: 'job-4',
      title: 'Data Engineer',
      company: 'DataFlow Analytics',
      location: 'Austin, TX',
      type: 'Full-time',
      experience: '4+ years',
      salary: '$110k - $150k',
      description: 'Build and maintain data pipelines, work with big data technologies, and support data science initiatives.',
      requirements: ['Python', 'SQL', 'Apache Spark', 'Kafka'],
      posted: '5 days ago',
      applicants: '12 applicants'
    },
    {
      id: 'job-5',
      title: 'Product Manager',
      company: 'InnovateTech',
      location: 'Seattle, WA',
      type: 'Full-time',
      experience: '6+ years',
      salary: '$130k - $170k',
      description: 'Lead product strategy and roadmap, collaborate with engineering and design teams, and drive product success.',
      requirements: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
      posted: '1 day ago',
      applicants: '42 applicants'
    },
    {
      id: 'job-6',
      title: 'QA Engineer',
      company: 'QualityFirst Systems',
      location: 'Boston, MA',
      type: 'Full-time',
      experience: '3+ years',
      salary: '$75k - $100k',
      description: 'Ensure software quality through comprehensive testing, automation, and quality assurance processes.',
      requirements: ['Selenium', 'Java', 'API Testing', 'Automation'],
      posted: '4 days ago',
      applicants: '16 applicants'
    }
  ];

  const jobTypes = ['All', 'Full-time', 'Contract', 'Remote'];
  const experienceLevels = ['All', 'Entry Level', '2+ years', '3+ years', '5+ years'];

  // Filter jobs based on search criteria
  const filteredJobs = jobs.filter(job => {
    const matchesType = jobType === 'All' || job.type === jobType;
    const matchesExperience = experience === 'All' || job.experience === experience;
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesExperience && matchesSearch;
  });

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

  const handleLoadMore = () => {
    // Simulate loading more jobs
    console.log('Loading more jobs...');
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section with Animation */}
        <section 
          ref={heroRef}
          className="py-16 lg:py-24 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        >
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
                  onClick={handleBrowseAllJobs}
                >
                  Browse All Jobs
                </Button>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={handleUploadResume}
                >
                  Upload Resume
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section with Animation */}
        <section className="py-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="fade-in-up grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Type
                  </label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                  >
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience
                  </label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Listing with Staggered Animation */}
        <section className="py-16 lg:py-24" ref={jobsRef}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="fade-in-up mb-8">
                <h2 className="text-2xl font-bold text-secondary-800 dark:text-white mb-4">
                  {filteredJobs.length} Open Positions
                </h2>
                <p className="text-accent dark:text-gray-300">
                  Find your next career opportunity with us
                </p>
              </div>

              <div className="space-y-6">
                {filteredJobs.map((job, index) => (
                  <Card 
                    key={index} 
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
                            onClick={() => handleApplyClick({
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
                            onClick={() => handleSaveJob(job.id)}
                          >
                            {savedJobs.has(job.id) ? 'Saved' : 'Save Job'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="fade-in-up text-center mt-12">
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={handleLoadMore}
                >
                  Load More Jobs
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
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
