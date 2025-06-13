
import { User, Company, JobApplication, Job } from './types';

export const mockUsers: User[] = [
  {
    _id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    role: 'hr_manager',
    isActive: true,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    _id: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '+1234567891',
    role: 'recruiter',
    isActive: true,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString()
  }
];

export const mockCompanies: Company[] = [
  {
    _id: 'company1',
    name: 'Tech Solutions Inc',
    industry: 'Technology',
    description: 'Leading technology solutions provider',
    website: 'https://techsolutions.example.com',
    contactEmail: 'contact@techsolutions.example.com',
    phoneNumber: '+1234567892',
    address: '123 Tech Street, Silicon Valley, CA',
    isActive: true,
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString()
  },
  {
    _id: 'company2',
    name: 'Engineering Corp',
    industry: 'Engineering',
    description: 'Premier engineering consultancy',
    website: 'https://engineeringcorp.example.com',
    contactEmail: 'info@engineeringcorp.example.com',
    phoneNumber: '+1234567893',
    address: '456 Engineering Ave, Tech City, TX',
    isActive: true,
    createdAt: new Date('2024-01-12').toISOString(),
    updatedAt: new Date('2024-01-12').toISOString()
  }
];

export const mockJobs: Job[] = [
  {
    _id: 'job1',
    title: 'Senior Software Engineer',
    description: 'We are looking for an experienced software engineer...',
    requirements: ['Bachelor\'s degree in Computer Science', '5+ years experience'],
    location: 'San Francisco, CA',
    employmentType: 'full-time',
    workMode: 'hybrid',
    experienceLevel: 'senior',
    minExperience: 5,
    domain: 'Technology',
    salary: '$120,000 - $150,000',
    companyId: 'company1',
    isActive: true,
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString()
  }
];

export const mockApplications: JobApplication[] = [
  {
    _id: 'app1',
    jobId: 'job1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1234567894',
    status: 'pending',
    applicationDate: new Date('2024-02-05').toISOString(),
    createdAt: new Date('2024-02-05').toISOString(),
    updatedAt: new Date('2024-02-05').toISOString()
  }
];

// In-memory storage for development
let users = [...mockUsers];
let companies = [...mockCompanies];
let applications = [...mockApplications];

export const mockDataService = {
  // Users
  getUsers: () => Promise.resolve([...users]),
  createUser: (userData: any) => {
    const newUser = {
      ...userData,
      _id: 'user' + (users.length + 1),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    return Promise.resolve(newUser);
  },
  updateUser: (id: string, userData: any) => {
    const index = users.findIndex(u => u._id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData, updatedAt: new Date().toISOString() };
      return Promise.resolve(users[index]);
    }
    throw new Error('User not found');
  },
  deleteUser: (id: string) => {
    const index = users.findIndex(u => u._id === id);
    if (index !== -1) {
      users.splice(index, 1);
      return Promise.resolve();
    }
    throw new Error('User not found');
  },

  // Companies
  getCompanies: () => Promise.resolve([...companies]),
  createCompany: (companyData: any) => {
    const newCompany = {
      ...companyData,
      _id: 'company' + (companies.length + 1),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    companies.push(newCompany);
    return Promise.resolve(newCompany);
  },
  updateCompany: (id: string, companyData: any) => {
    const index = companies.findIndex(c => c._id === id);
    if (index !== -1) {
      companies[index] = { ...companies[index], ...companyData, updatedAt: new Date().toISOString() };
      return Promise.resolve(companies[index]);
    }
    throw new Error('Company not found');
  },
  deleteCompany: (id: string) => {
    const index = companies.findIndex(c => c._id === id);
    if (index !== -1) {
      companies.splice(index, 1);
      return Promise.resolve();
    }
    throw new Error('Company not found');
  },

  // Applications
  getApplications: () => Promise.resolve([...applications]),
  createApplication: (appData: any) => {
    const newApplication = {
      ...appData,
      _id: 'app' + (applications.length + 1),
      status: 'pending',
      applicationDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    applications.push(newApplication);
    return Promise.resolve(newApplication);
  },
  updateApplication: (id: string, appData: any) => {
    const index = applications.findIndex(a => a._id === id);
    if (index !== -1) {
      applications[index] = { ...applications[index], ...appData, updatedAt: new Date().toISOString() };
      return Promise.resolve(applications[index]);
    }
    throw new Error('Application not found');
  }
};
