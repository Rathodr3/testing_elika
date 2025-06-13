
import { useState, useEffect } from 'react';
import { jobsAPI } from '@/services/jobsAPI';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  posted: string;
}

const useFeaturedJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackFeaturedJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Elika Engineering Pvt Ltd',
      location: 'Bangalore, India',
      type: 'Full-time • Hybrid',
      salary: '₹15-25 LPA',
      description: 'Join our dynamic team to build scalable software solutions using React, Node.js, and cloud technologies.',
      posted: '15 days ago'
    },
    {
      id: '2',
      title: 'Mechanical Design Engineer',
      company: 'Elika Engineering Pvt Ltd',
      location: 'Chennai, India',
      type: 'Full-time • On-site',
      salary: '₹8-15 LPA',
      description: 'Design and develop automotive components using CAD software and work on innovative manufacturing processes.',
      posted: '20 days ago'
    },
    {
      id: '3',
      title: 'DevOps Engineer',
      company: 'Elika Engineering Pvt Ltd',
      location: 'Hyderabad, India',
      type: 'Full-time • Remote',
      salary: '₹12-20 LPA',
      description: 'Implement CI/CD pipelines, manage cloud infrastructure, and ensure scalable deployment processes.',
      posted: '22 days ago'
    }
  ];

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        console.log('🔍 Fetching featured jobs...');
        const jobsData = await jobsAPI.getPublic();
        
        if (jobsData && jobsData.length > 0) {
          const featuredJobs = jobsData.slice(0, 3).map((job: any) => ({
            id: job.id || job._id,
            title: job.title,
            company: typeof job.company === 'object' ? job.company?.name : job.company || 'Elika Engineering Pvt Ltd',
            location: job.location,
            type: job.type || `${job.employmentType || 'full-time'} • ${job.workMode || 'hybrid'}`,
            salary: job.salary || 'Competitive',
            description: job.description || 'No description available',
            posted: job.posted || new Date(job.postedDate || job.createdAt).toLocaleDateString()
          }));
          setJobs(featuredJobs);
          console.log('✅ Featured jobs loaded from API:', featuredJobs.length);
        } else {
          console.log('No jobs found, using fallback featured jobs');
          setJobs(fallbackFeaturedJobs);
        }
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
        console.log('Using fallback featured jobs data');
        setJobs(fallbackFeaturedJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  return { jobs, loading };
};

export default useFeaturedJobs;
