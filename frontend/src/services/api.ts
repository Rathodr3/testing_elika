// API service layer for MERN backend integration

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface JobApplication {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter: string;
  linkedinUrl: string;
  jobId: string;
  jobTitle: string;
  company: string;
  resumeUrl?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
}

// Job Applications API
export const applicationAPI = {
  // Submit new application
  submit: async (formData: FormData): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Application submission error:', error);
      throw error;
    }
  },

  // Get all applications (admin)
  getAll: async (): Promise<JobApplication[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fetch applications error:', error);
      throw error;
    }
  },

  // Get applications for specific job
  getByJob: async (jobId: string): Promise<JobApplication[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch job applications');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fetch job applications error:', error);
      throw error;
    }
  },

  // Update application status
  updateStatus: async (applicationId: string, status: string): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update application status');
      }
      
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
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fetch jobs error:', error);
      throw error;
    }
  },

  // Get single job by ID
  getById: async (jobId: string): Promise<Job> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch job');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fetch job error:', error);
      throw error;
    }
  }
};

// Admin authentication (for future use)
export const authAPI = {
  login: async (email: string, password: string): Promise<{ token: string; user: any }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('adminToken', data.token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken');
  }
};
