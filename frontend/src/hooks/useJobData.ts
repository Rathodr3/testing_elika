
import { useState, useMemo } from 'react';

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

export const useJobData = () => {
  const [jobType, setJobType] = useState('All');
  const [experience, setExperience] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedJobs, setDisplayedJobs] = useState(6);

  const allJobs: Job[] = [
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
    },
    {
      id: 'job-7',
      title: 'Machine Learning Engineer',
      company: 'AI Innovations',
      location: 'San Jose, CA',
      type: 'Full-time',
      experience: '4+ years',
      salary: '$140k - $180k',
      description: 'Develop and deploy machine learning models at scale, work with large datasets, and optimize ML algorithms.',
      requirements: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
      posted: '6 days ago',
      applicants: '28 applicants'
    },
    {
      id: 'job-8',
      title: 'Backend Developer',
      company: 'ServerScale Inc',
      location: 'Chicago, IL',
      type: 'Full-time',
      experience: '3+ years',
      salary: '$95k - $125k',
      description: 'Build robust backend systems, design APIs, and optimize database performance for high-traffic applications.',
      requirements: ['Node.js', 'PostgreSQL', 'Redis', 'Microservices'],
      posted: '1 week ago',
      applicants: '22 applicants'
    },
    {
      id: 'job-9',
      title: 'UI/UX Designer',
      company: 'Creative Studios',
      location: 'Los Angeles, CA',
      type: 'Contract',
      experience: '2+ years',
      salary: '$70k - $95k',
      description: 'Design intuitive user experiences and beautiful interfaces for web and mobile applications.',
      requirements: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
      posted: '3 days ago',
      applicants: '35 applicants'
    },
    {
      id: 'job-10',
      title: 'Cloud Architect',
      company: 'CloudMaster Technologies',
      location: 'Denver, CO',
      type: 'Full-time',
      experience: '6+ years',
      salary: '$150k - $190k',
      description: 'Design and implement cloud infrastructure solutions, lead migration projects, and optimize cloud costs.',
      requirements: ['AWS', 'Azure', 'Terraform', 'Kubernetes'],
      posted: '4 days ago',
      applicants: '19 applicants'
    },
    {
      id: 'job-11',
      title: 'Cybersecurity Analyst',
      company: 'SecureNet Solutions',
      location: 'Washington, DC',
      type: 'Full-time',
      experience: '3+ years',
      salary: '$85k - $115k',
      description: 'Monitor security threats, implement security protocols, and conduct vulnerability assessments.',
      requirements: ['CISSP', 'Network Security', 'Incident Response', 'SIEM'],
      posted: '2 days ago',
      applicants: '15 applicants'
    },
    {
      id: 'job-12',
      title: 'Mobile App Developer',
      company: 'MobileTech Solutions',
      location: 'Remote',
      type: 'Contract',
      experience: '3+ years',
      salary: '$90k - $120k',
      description: 'Develop cross-platform mobile applications using React Native and Flutter frameworks.',
      requirements: ['React Native', 'Flutter', 'JavaScript', 'Mobile UI/UX'],
      posted: '1 day ago',
      applicants: '27 applicants'
    },
    {
      id: 'job-13',
      title: 'Technical Writer',
      company: 'DocuTech Inc',
      location: 'Portland, OR',
      type: 'Full-time',
      experience: '2+ years',
      salary: '$65k - $85k',
      description: 'Create comprehensive technical documentation, API guides, and user manuals for software products.',
      requirements: ['Technical Writing', 'API Documentation', 'Markdown', 'Git'],
      posted: '5 days ago',
      applicants: '14 applicants'
    },
    {
      id: 'job-14',
      title: 'Systems Administrator',
      company: 'InfraCore Systems',
      location: 'Dallas, TX',
      type: 'Full-time',
      experience: '4+ years',
      salary: '$80k - $110k',
      description: 'Manage and maintain enterprise IT infrastructure, servers, and network systems.',
      requirements: ['Linux', 'Windows Server', 'VMware', 'Network Management'],
      posted: '3 days ago',
      applicants: '20 applicants'
    },
    {
      id: 'job-15',
      title: 'Business Analyst',
      company: 'Analytics Pro',
      location: 'Miami, FL',
      type: 'Full-time',
      experience: '3+ years',
      salary: '$75k - $105k',
      description: 'Analyze business processes, gather requirements, and bridge the gap between business and technical teams.',
      requirements: ['Business Analysis', 'SQL', 'Requirements Gathering', 'Process Mapping'],
      posted: '6 days ago',
      applicants: '33 applicants'
    },
    {
      id: 'job-16',
      title: 'Blockchain Developer',
      company: 'CryptoInnovate',
      location: 'Remote',
      type: 'Full-time',
      experience: '4+ years',
      salary: '$130k - $170k',
      description: 'Develop decentralized applications and smart contracts on various blockchain platforms.',
      requirements: ['Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts'],
      posted: '2 days ago',
      applicants: '19 applicants'
    }
  ];

  // Fixed filtering logic with proper string matching
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      const matchesType = jobType === 'All' || job.type === jobType;
      
      // Fixed experience matching - handle variations in experience format
      const matchesExperience = experience === 'All' || 
        job.experience === experience ||
        (experience === 'Entry Level' && (job.experience.includes('Entry') || job.experience === '0-1 years')) ||
        (experience === '2+ years' && job.experience.includes('2+')) ||
        (experience === '3+ years' && job.experience.includes('3+')) ||
        (experience === '4+ years' && job.experience.includes('4+')) ||
        (experience === '5+ years' && job.experience.includes('5+')) ||
        (experience === '6+ years' && job.experience.includes('6+'));
      
      const matchesSearch = searchTerm === '' || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesType && matchesExperience && matchesSearch;
    });
  }, [allJobs, jobType, experience, searchTerm]);

  const jobsToShow = filteredJobs.slice(0, displayedJobs);
  const hasMoreJobs = filteredJobs.length > displayedJobs;

  const handleLoadMore = () => {
    setDisplayedJobs(prev => prev + 5);
  };

  return {
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
