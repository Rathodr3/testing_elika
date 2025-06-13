export interface JobApplication {
  _id?: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  experienceLevel: string;
  yearsOfExperience: number;
  previousCompany?: string;
  skills: string[];
  coverLetter?: string;
  resumeFile?: File;
  resumePath?: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
  notes?: string;
  applicationDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Job {
  _id?: string;
  id?: string; // For careers page compatibility
  company?: string | {
    _id: string;
    name: string;
  };
  title: string;
  domain: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship';
  workMode: 'remote' | 'on-site' | 'hybrid';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  minExperience: number;
  experience?: string; // For careers page compatibility
  type?: string; // For careers page compatibility  
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary?: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  postedDate?: string; // For careers page compatibility
  posted?: string; // For careers page compatibility
  applicantsCount?: number;
  applicants?: number; // For careers page compatibility
}

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'admin' | 'hr_manager' | 'recruiter' | 'viewer';
  isActive: boolean;
  permissions: {
    users: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    companies: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    jobs: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    applications: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  };
  createdAt: string;
  updatedAt?: string;
}

export interface Spokesperson {
  name: string;
  role: string;
  email: string;
  contact: string;
}

export interface Company {
  _id?: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  contactEmail: string;
  phoneNumber: string;
  address?: string;
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  spokespersons?: {
    primary?: {
      name?: string;
      role?: string;
      email?: string;
      contact?: string;
    };
    secondary?: {
      name?: string;
      role?: string;
      email?: string;
      contact?: string;
    };
  };
  isActive?: boolean;
  foundedYear?: number;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLog {
  _id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout';
  resource: 'users' | 'companies' | 'jobs' | 'applications';
  resourceId?: string;
  resourceName?: string;
  changes?: {
    field: string;
    oldValue?: any;
    newValue?: any;
  }[];
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  details?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}
