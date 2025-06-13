export interface JobApplication {
  _id?: string;
  jobId?: string;
  userId?: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phone: string;
  position?: string;
  department?: string;
  experienceLevel?: string;
  yearsOfExperience?: number;
  previousCompany?: string;
  resume?: string;
  coverLetter?: string;
  notes?: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected' | 'submitted' | 'under-review';
  applicationDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Job {
  _id?: string;
  companyId: string;
  company?: string | Company;
  title: string;
  description: string;
  location: string;
  salary?: string;
  domain: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship';
  workMode: 'remote' | 'on-site' | 'hybrid';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  minExperience: number;
  requirements: string[];
  responsibilities?: string[];
  benefits?: string[];
  type?: 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship';
  experience?: 'entry-level' | 'mid-level' | 'senior-level';
  category?: string;
  tags?: string[];
  status?: 'open' | 'closed' | 'draft';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  role: 'admin' | 'hr_manager' | 'recruiter' | 'viewer';
  permissions?: {
    users: { create: boolean; read: boolean; update: boolean; delete: boolean; };
    companies: { create: boolean; read: boolean; update: boolean; delete: boolean; };
    jobs: { create: boolean; read: boolean; update: boolean; delete: boolean; };
    applications: { create: boolean; read: boolean; update: boolean; delete: boolean; };
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Company {
  _id?: string;
  name: string;
  description?: string;
  location?: string;
  industry?: string;
  size?: string;
  website?: string;
  logo?: string;
  contactEmail: string;
  phoneNumber: string;
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
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLog {
  _id: string;
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
  details?: string;
  createdAt: string;
  updatedAt: string;
  timestamp: string;
}
