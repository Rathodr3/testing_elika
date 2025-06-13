
import { Job } from '../types';
import { apiRequest } from './apiUtils';

export const jobsService = {
  getPublic: async (): Promise<Job[]> => {
    try {
      console.log('🔍 Fetching public jobs for careers page...');
      const jobs = await apiRequest('/jobs/public', 'GET');
      console.log('✅ Public jobs fetched:', jobs);
      
      if (Array.isArray(jobs)) {
        return jobs.map(transformJobForCareersPage);
      } else if (jobs.data && Array.isArray(jobs.data)) {
        return jobs.data.map(transformJobForCareersPage);
      } else if (jobs.success && jobs.data && Array.isArray(jobs.data)) {
        return jobs.data.map(transformJobForCareersPage);
      } else {
        console.warn('⚠️ Unexpected job data format:', jobs);
        return [];
      }
    } catch (error) {
      console.error('❌ Fetch public jobs error:', error);
      // Return empty array to let fallback data handle it
      return [];
    }
  },

  getAll: async (): Promise<Job[]> => {
    try {
      console.log('🔍 Fetching all jobs (admin)...');
      const result = await apiRequest('/jobs', 'GET', null, true);
      console.log('✅ Admin jobs response:', result);
      
      let jobs = [];
      if (Array.isArray(result)) {
        jobs = result;
      } else if (result.data && Array.isArray(result.data)) {
        jobs = result.data;
      } else if (result.success && result.data && Array.isArray(result.data)) {
        jobs = result.data;
      } else {
        console.warn('⚠️ Unexpected admin jobs format:', result);
        jobs = [];
      }
      
      console.log('✅ Admin jobs fetched:', jobs.length);
      return jobs.map(transformJobForAdmin);
    } catch (error) {
      console.error('❌ Fetch admin jobs error:', error);
      return [];
    }
  },

  getById: async (jobId: string): Promise<Job> => {
    try {
      console.log('🔍 Fetching job by ID:', jobId);
      const result = await apiRequest(`/jobs/${jobId}`, 'GET');
      console.log('✅ Job fetched by ID:', result);
      
      if (result.data) {
        return transformJobForAdmin(result.data);
      } else if (result.success && result.data) {
        return transformJobForAdmin(result.data);
      } else {
        return transformJobForAdmin(result);
      }
    } catch (error) {
      console.error('❌ Fetch job by ID error:', error);
      throw error;
    }
  },

  create: async (jobData: any): Promise<Job> => {
    try {
      console.log('🔧 Creating job:', jobData);
      const result = await apiRequest('/jobs', 'POST', jobData, true);
      console.log('✅ Job created:', result);
      
      if (result.data) {
        return transformJobForAdmin(result.data);
      } else if (result.success && result.data) {
        return transformJobForAdmin(result.data);
      } else {
        return transformJobForAdmin(result);
      }
    } catch (error) {
      console.error('❌ Create job error:', error);
      throw error;
    }
  },

  update: async (jobId: string, jobData: any): Promise<Job> => {
    try {
      console.log('🔧 Updating job:', jobId, jobData);
      const result = await apiRequest(`/jobs/${jobId}`, 'PUT', jobData, true);
      console.log('✅ Job updated:', result);
      
      if (result.data) {
        return transformJobForAdmin(result.data);
      } else if (result.success && result.data) {
        return transformJobForAdmin(result.data);
      } else {
        return transformJobForAdmin(result);
      }
    } catch (error) {
      console.error('❌ Update job error:', error);
      throw error;
    }
  },

  delete: async (jobId: string): Promise<void> => {
    try {
      console.log('🗑️ Deleting job:', jobId);
      await apiRequest(`/jobs/${jobId}`, 'DELETE', null, true);
      console.log('✅ Job deleted:', jobId);
    } catch (error) {
      console.error('❌ Delete job error:', error);
      throw error;
    }
  }
};

const transformJobForCareersPage = (job: any): Job => {
  console.log('🔄 Transforming job for careers page:', job);
  
  const companyName = typeof job.company === 'object' ? job.company?.name : job.company || 'Elika Engineering Pvt Ltd';
  const postedDate = job.createdAt || job.postedDate || new Date();
  
  const transformedJob = {
    ...job,
    id: job._id?.toString() || job.id,
    _id: job._id,
    company: companyName, // For careers page, just use string
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
    benefits: Array.isArray(job.benefits) ? job.benefits : [],
    postedDate: postedDate,
    posted: new Date(postedDate).toLocaleDateString(),
    applicantsCount: job.applicantsCount || 0,
    applicants: job.applicantsCount || 0,
    experience: `${job.minExperience || 0}+ years`,
    type: `${job.employmentType || 'full-time'} • ${job.workMode || 'hybrid'}`,
    salary: job.salary || 'Competitive salary',
    title: job.title || 'Job Position',
    location: job.location || 'Location',
    description: job.description || 'Join our team and contribute to exciting projects.',
    isActive: job.isActive !== false
  };
  
  console.log('✅ Transformed job for careers:', transformedJob);
  return transformedJob;
};

const transformJobForAdmin = (job: any): Job => {
  const companyName = typeof job.company === 'object' ? job.company?.name : job.company || 'Elika Engineering Pvt Ltd';
  const postedDate = job.createdAt || job.postedDate || new Date();
  
  return {
    ...job,
    id: job._id?.toString() || job.id,
    _id: job._id,
    company: typeof job.company === 'object' ? job.company : { name: companyName },
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
    benefits: Array.isArray(job.benefits) ? job.benefits : [],
    postedDate: postedDate,
    applicantsCount: job.applicantsCount || 0,
    isActive: job.isActive !== false,
    title: job.title || 'Untitled Job',
    location: job.location || 'Not specified',
    employmentType: job.employmentType || 'full-time',
    workMode: job.workMode || 'hybrid',
    experienceLevel: job.experienceLevel || 'mid',
    minExperience: job.minExperience || 0,
    domain: job.domain || 'General',
    description: job.description || 'No description available'
  };
};
