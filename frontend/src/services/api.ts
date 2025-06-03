// API service layer for MERN backend integration

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface JobApplication {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  experienceLevel: string;
  yearsOfExperience: number;
  skills: string[];
  previousCompany?: string;
  coverLetter?: string;
  resumeFilename?: string;
  resumePath?: string;
  status: 'submitted' | 'under-review' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
  applicationDate: string;
  createdAt: string;
  updatedAt: string;
  // Computed properties for backwards compatibility
  name?: string;
  jobTitle?: string;
  company?: string;
  experience?: string;
  resumeUrl?: string;
}

export interface Job {
  _id: string;
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
  createdAt: string;
}

// Enhanced error handling
const handleAPIError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return response;
};

// Job Applications API
export const applicationAPI = {
  // Submit new application
  submit: async (formData: FormData): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/job-applications`, {
        method: 'POST',
        body: formData,
      });
      
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Application submission error:', error);
      throw error;
    }
  },

  // Get all applications (admin)
  getAll: async (): Promise<JobApplication[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/job-applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
      const result = await response.json();
      
      // Transform the data to add computed properties for backwards compatibility
      const applications = (result.data || result).map((app: JobApplication) => ({
        ...app,
        name: `${app.firstName} ${app.lastName}`,
        jobTitle: app.position,
        company: app.previousCompany || app.department,
        experience: `${app.yearsOfExperience} years`,
        resumeUrl: app.resumePath ? `${API_BASE_URL}/api/job-applications/${app._id}/resume` : undefined
      }));
      
      return applications;
    } catch (error) {
      console.error('Fetch applications error:', error);
      throw error;
    }
  },

  // Get applications for specific job
  getByJob: async (jobId: string): Promise<JobApplication[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/job-applications?jobId=${jobId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Fetch job applications error:', error);
      throw error;
    }
  },

  // Update application status
  updateStatus: async (applicationId: string, status: string): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/job-applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status }),
      });
      
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  }
};

// Jobs API
export const jobsAPI = {
  // Get all active jobs
  getAll: async (): Promise<Job[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs`);
      
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Fetch jobs error:', error);
      // Return fallback data if API fails
      return [];
    }
  },

  // Get single job by ID
  getById: async (jobId: string): Promise<Job> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`);
      
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Fetch job error:', error);
      throw error;
    }
  }
};

// Admin authentication
export const authAPI = {
  login: async (email: string, password: string): Promise<{ success: boolean; token: string; user: any }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      await handleAPIError(response);
      const data = await response.json();
      
      if (data.success && data.token) {
        localStorage.setItem('adminToken', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('adminToken');
  }
};

// Health check API
export const healthAPI = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
};
