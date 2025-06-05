
// API service layer for MERN backend integration

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🏗️ Environment:', import.meta.env.MODE);

// Add health check on module load
const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('✅ Backend server is running and accessible');
    } else {
      console.warn('⚠️ Backend server responded with status:', response.status);
    }
  } catch (error) {
    console.error('❌ Backend server is not accessible:', error);
    if (import.meta.env.DEV) {
      console.log('💡 Make sure the backend server is running on port 5000');
      console.log('💡 Run: cd backend && npm install && npm start');
    } else {
      console.log('💡 Check if the backend API is properly deployed');
      console.log('💡 Verify Nginx configuration and PM2 process status');
    }
  }
};

// Check backend health on module load
checkBackendHealth();

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
  company: {
    _id: string;
    name: string;
    logo?: string;
  };
  title: string;
  location: string;
  employmentType: string;
  domain: string;
  workMode: string;
  experienceLevel: string;
  minExperience: number;
  description?: string;
  requirements: string[];
  salary?: string;
  isActive: boolean;
  postedDate: string;
  applicantsCount: number;
  createdAt: string;
}

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'admin' | 'hr_manager' | 'recruiter' | 'viewer';
  isActive: boolean;
  permissions: {
    users: { create: boolean; read: boolean; update: boolean; delete: boolean; };
    companies: { create: boolean; read: boolean; update: boolean; delete: boolean; };
    jobs: { create: boolean; read: boolean; update: boolean; delete: boolean; };
    applications: { create: boolean; read: boolean; update: boolean; delete: boolean; };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  _id?: string;
  name: string;
  logo?: string;
  description?: string;
  contactEmail: string;
  phoneNumber: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Enhanced error handling with better logging
const handleAPIError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      console.error('API Error Response:', errorData);
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      message: errorMessage
    });
    throw new Error(errorMessage);
  }
  return response;
};

// Job Applications API
export const applicationAPI = {
  // Submit new application
  submit: async (formData: FormData): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Submitting application to:', `${API_BASE_URL}/applications`);
      
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        body: formData,
      });
      
      await handleAPIError(response);
      const result = await response.json();
      console.log('Application submission successful:', result);
      return result;
    } catch (error) {
      console.error('Application submission error:', error);
      throw error;
    }
  },

  getAll: async (): Promise<JobApplication[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
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
        resumeUrl: app.resumePath ? `${API_BASE_URL}/applications/${app._id}/resume` : undefined
      }));
      
      return applications;
    } catch (error) {
      console.error('Fetch applications error:', error);
      throw error;
    }
  },

  getByJob: async (jobId: string): Promise<JobApplication[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications?jobId=${jobId}`, {
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

  updateStatus: async (applicationId: string, status: string): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
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
  // Get all active jobs for public
  getPublic: async (): Promise<Job[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/public`);
      
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Fetch public jobs error:', error);
      return [];
    }
  },

  // Get all jobs (admin)
  getAll: async (): Promise<Job[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Fetch jobs error:', error);
      return [];
    }
  },

  // Get single job by ID
  getById: async (jobId: string): Promise<Job> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Fetch job error:', error);
      throw error;
    }
  },

  // Create new job
  create: async (jobData: any): Promise<Job> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(jobData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Create job error:', error);
      throw error;
    }
  },

  // Update job
  update: async (jobId: string, jobData: any): Promise<Job> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(jobData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Update job error:', error);
      throw error;
    }
  },

  // Delete job
  delete: async (jobId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
    } catch (error) {
      console.error('Delete job error:', error);
      throw error;
    }
  }
};

// Users API
export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Fetch users error:', error);
      throw error;
    }
  },

  create: async (userData: any): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(userData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  update: async (userId: string, userData: any): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(userData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  delete: async (userId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }
};

// Companies API
export const companiesAPI = {
  getAll: async (): Promise<Company[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Fetch companies error:', error);
      throw error;
    }
  },

  create: async (companyData: any): Promise<Company> => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(companyData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Create company error:', error);
      throw error;
    }
  },

  update: async (companyId: string, companyData: any): Promise<Company> => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(companyData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Update company error:', error);
      throw error;
    }
  },

  delete: async (companyId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      await handleAPIError(response);
    } catch (error) {
      console.error('Delete company error:', error);
      throw error;
    }
  }
};

// Admin authentication with better error handling
export const authAPI = {
  login: async (email: string, password: string): Promise<{ success: boolean; token?: string; user?: any; message?: string }> => {
    try {
      console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
      
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (data.success && data.token) {
        localStorage.setItem('adminToken', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check if the backend server is running.');
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const serverUrl = import.meta.env.DEV ? 'http://localhost:5000' : 'your backend server';
        throw new Error(`Cannot connect to backend server. Please ensure the server is running on ${serverUrl}`);
      }
      
      throw new Error('Failed to connect to server. Please check if the backend server is running.');
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string; resetToken?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  resetPassword: async (resetToken: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Reset password error:', error);
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
      const response = await fetch(`${API_BASE_URL}/health`);
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
};

// Contact form API with improved error handling
export const contactAPI = {
  submit: async (formData: {
    name: string;
    email: string;
    company?: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Submitting contact form to:', `${API_BASE_URL}/contact`);
      
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      console.log('Contact form submission successful:', result);
      return result;
    } catch (error) {
      console.error('Contact form submission error:', error);
      throw error;
    }
  }
};
