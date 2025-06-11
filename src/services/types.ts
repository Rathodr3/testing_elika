
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
  logo?: string;
  description?: string;
  contactEmail: string;
  phoneNumber: string;
  website?: string;
  spokespersons?: {
    primary?: Spokesperson;
    secondary?: Spokesperson;
  };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}
