
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
