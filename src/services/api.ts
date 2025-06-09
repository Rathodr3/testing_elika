
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

// Export types
export type { JobApplication, Job, User, Company } from './types';

// Export API modules
export { applicationAPI } from './applicationAPI';
export { jobsAPI } from './jobsAPI';
export { usersAPI } from './usersAPI';
export { companiesAPI } from './companiesAPI';
export { authAPI } from './authAPI';
export { healthAPI, contactAPI } from './utilityAPI';
