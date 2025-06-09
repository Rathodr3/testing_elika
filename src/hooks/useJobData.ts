
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
  employmentType: string;
  workMode: string;
  experienceLevel: string;
}

// Enhanced fallback sample jobs data when backend is not available
const fallbackJobs: JobData[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Elika Engineering Pvt Ltd',
    location: 'Bangalore',
    type: 'Full-time • Hybrid',
    experience: 'Senior (5+ years)',
    salary: '₹15-25 LPA',
    description: 'Join our dynamic team to build scalable software solutions using React, Node.js, and cloud technologies. Work on cutting-edge projects that impact millions of users worldwide.',
    requirements: [
      '5+ years of experience in software development',
      'Strong proficiency in React and Node.js',
      'Experience with cloud platforms (AWS/Azure)',
      'Strong problem-solving skills',
      'Excellent communication skills'
    ],
    isActive: true,
    postedDate: '2024-01-15',
    applicantsCount: 12,
    posted: '15 days ago',
    applicants: '12 applicants',
    employmentType: 'full-time',
    workMode: 'hybrid',
    experienceLevel: 'senior'
  },
  {
    id: '2',
    title: 'Mechanical Design Engineer',
    company: 'Elika Engineering Pvt Ltd',
    location: 'Chennai',
    type: 'Full-time • On-site',
    experience: 'Mid (3+ years)',
    salary: '₹8-15 LPA',
    description: 'Design and develop automotive components using CAD software and work on innovative manufacturing processes. Collaborate with cross-functional teams to deliver high-quality products.',
    requirements: [
      '3+ years of experience in mechanical design',
      'Proficiency in CAD software (SolidWorks, AutoCAD)',
      'Knowledge of manufacturing processes',
      "Bachelor's degree in Mechanical Engineering",
      'Strong analytical skills'
    ],
    isActive: true,
    postedDate: '2024-01-10',
    applicantsCount: 8,
    posted: '20 days ago',
    applicants: '8 applicants',
    employmentType: 'full-time',
    workMode: 'on-site',
    experienceLevel: 'mid'
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'Elika Engineering Pvt Ltd',
    location: 'Hyderabad',
    type: 'Full-time • Remote',
    experience: 'Mid (3+ years)',
    salary: '₹12-20 LPA',
    description: 'Implement CI/CD pipelines, manage cloud infrastructure, and ensure scalable deployment processes. Work with cutting-edge DevOps tools and technologies.',
    requirements: [
      '3+ years of DevOps experience',
      'Proficiency in Docker and Kubernetes',
      'Experience with AWS/Azure',
      'Knowledge of CI/CD tools',
      'Strong scripting skills'
    ],
    isActive: true,
    postedDate: '2024-01-08',
    applicantsCount: 15,
    posted: '22 days ago',
    applicants: '15 applicants',
    employmentType: 'full-time',
    workMode: 'remote',
    experienceLevel: 'mid'
  }
];

interface SearchFilters {
  query: string;
  location: string;
  company: string;
  experience: string;
  workMode: string;
}

export const useJobData = () => {
  const [jobs, setJobs] = useState<JobData[]>(fallbackJobs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    company: '',
    experience: '',
    workMode: ''
  });
  const [displayedJobs, setDisplayedJobs] = useState(6);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching jobs from API...');
        
        // Fetch jobs from the public jobs API
        const jobsData = await jobsAPI.getPublic();
        console.log('📥 Raw jobs data received:', jobsData);
        
        if (Array.isArray(jobsData) && jobsData.length > 0) {
          // Transform the data to match the expected format
          const transformedJobs: JobData[] = jobsData.map((job: any) => {
            console.log('🔄 Transforming job:', job);
            
            // Ensure requirements is always an array
            let requirements: string[] = [];
            if (Array.isArray(job.requirements)) {
              requirements = job.requirements;
            } else if (typeof job.requirements === 'string') {
              requirements = job.requirements.split(',').map((req: string) => req.trim());
            } else {
              // Default requirements based on job type
              requirements = [
                `${job.minExperience || 2}+ years of experience`,
                `Knowledge of ${job.domain || 'relevant technologies'}`,
                'Strong communication skills',
                'Team collaboration',
                'Problem-solving abilities'
              ];
            }
            
            const transformedJob = {
              id: job._id || job.id || `job-${Date.now()}-${Math.random()}`,
              title: job.title || 'Software Engineer',
              company: job.company?.name || 'Elika Engineering Pvt Ltd',
              location: job.location || 'Bangalore',
              type: `${job.employmentType || 'full-time'} • ${job.workMode || 'hybrid'}`,
              experience: `${job.experienceLevel || 'mid'} (${job.minExperience || 2}+ years)`,
              salary: job.salary || 'Competitive',
              description: job.description || 'Exciting opportunity to work with cutting-edge technologies and contribute to innovative projects.',
              requirements: requirements,
              isActive: job.isActive !== false,
              postedDate: job.postedDate || job.createdAt || new Date().toISOString(),
              applicantsCount: job.applicantsCount || 0,
              posted: job.postedDate 
                ? `${Math.ceil((new Date().getTime() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24))} days ago`
                : job.createdAt 
                  ? `${Math.ceil((new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago`
                  : 'Recently posted',
              applicants: `${job.applicantsCount || 0} applicants`,
              employmentType: job.employmentType || 'full-time',
              workMode: job.workMode || 'hybrid',
              experienceLevel: job.experienceLevel || 'mid'
            };
            
            console.log('✅ Transformed job:', transformedJob);
            return transformedJob;
          });

          console.log('✅ All transformed jobs:', transformedJobs);
          setJobs(transformedJobs);
          console.log('✅ Using API jobs data');
        } else {
          console.log('⚠️ API returned empty or invalid data, using fallback jobs');
          setJobs(fallbackJobs);
        }
      } catch (err) {
        console.error('❌ Error fetching jobs:', err);
        console.log('🔄 Using fallback jobs data due to error');
        setError('Backend server not available. Showing sample jobs.');
        setJobs(fallbackJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    console.log('🔍 Filtering jobs with filters:', searchFilters);
    console.log('🔍 Available jobs to filter:', jobs);
    
    const filtered = jobs.filter(job => {
      const matchesQuery = searchFilters.query === '' || 
        job.title.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        job.company.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        job.location.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        job.description.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        job.requirements.some(req => req.toLowerCase().includes(searchFilters.query.toLowerCase()));

      const matchesLocation = searchFilters.location === '' ||
        job.location.toLowerCase().includes(searchFilters.location.toLowerCase());

      const matchesCompany = searchFilters.company === '' ||
        job.company.toLowerCase().includes(searchFilters.company.toLowerCase());

      const matchesExperience = searchFilters.experience === '' ||
        job.experienceLevel === searchFilters.experience;

      const matchesWorkMode = searchFilters.workMode === '' ||
        job.workMode === searchFilters.workMode;
      
      return matchesQuery && matchesLocation && matchesCompany && matchesExperience && matchesWorkMode;
    });
    
    console.log('🔍 Filtered jobs result:', filtered);
    return filtered;
  }, [jobs, searchFilters]);

  const handleSearch = (filters: SearchFilters) => {
    console.log('🔍 Setting search filters:', filters);
    setSearchFilters(filters);
    setDisplayedJobs(6); // Reset displayed jobs when searching
  };

  const handleLoadMore = () => {
    setDisplayedJobs(prev => prev + 6);
  };

  const refetch = () => {
    window.location.reload();
  };

  console.log('🏠 useJobData hook state:', { 
    jobsCount: jobs.length, 
    filteredJobsCount: filteredJobs.length, 
    loading, 
    error 
  });

  return { 
    jobs, 
    loading, 
    error, 
    refetch,
    searchFilters,
    handleSearch,
    filteredJobs,
    displayedJobs,
    handleLoadMore
  };
};
