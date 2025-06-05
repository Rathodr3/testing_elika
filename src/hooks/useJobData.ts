
import { useState, useEffect, useMemo } from 'react';
import { jobsAPI } from '@/services/api';

export interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  isActive: boolean;
  postedDate: string;
  applicantsCount: number;
  posted: string;
  applicants: string;
}

export const useJobData = () => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobType, setJobType] = useState('All');
  const [experience, setExperience] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedJobs, setDisplayedJobs] = useState(6);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch jobs from the admin jobs API
        const jobsData = await jobsAPI.getPublic();
        
        // Transform the data to match the expected format
        const transformedJobs: JobData[] = jobsData.map(job => ({
          id: job._id,
          title: job.title,
          company: job.company?.name || 'Unknown Company',
          location: job.location,
          type: `${job.employmentType} • ${job.workMode}`,
          experience: `${job.experienceLevel} (${job.minExperience}+ years)`,
          salary: job.salary || 'Competitive',
          description: job.description || 'No description available',
          requirements: job.requirements || [],
          isActive: job.isActive,
          postedDate: job.postedDate || job.createdAt,
          applicantsCount: job.applicantsCount || 0,
          posted: new Date(job.postedDate || job.createdAt).toLocaleDateString(),
          applicants: `${job.applicantsCount || 0} applicants`
        }));

        setJobs(transformedJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
        
        // Fallback to empty array if API fails
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesJobType = jobType === 'All' || job.type.toLowerCase().includes(jobType.toLowerCase());
      const matchesExperience = experience === 'All' || job.experience.toLowerCase().includes(experience.toLowerCase());
      const matchesSearch = searchTerm === '' || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesJobType && matchesExperience && matchesSearch;
    });
  }, [jobs, jobType, experience, searchTerm]);

  const jobsToShow = filteredJobs.slice(0, displayedJobs);
  const hasMoreJobs = displayedJobs < filteredJobs.length;

  const handleLoadMore = () => {
    setDisplayedJobs(prev => prev + 6);
  };

  return { 
    jobs, 
    loading, 
    error, 
    refetch: () => window.location.reload(),
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
  };
};
