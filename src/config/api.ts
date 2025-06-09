
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'http://13.126.145.69:5000/api' : 'http://localhost:5000/api');

console.log('🌐 API Configuration:', {
  baseURL: API_BASE_URL,
  environment: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
});

export default API_BASE_URL;
