
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'http://13.126.145.69:5000/api' : 'http://localhost:5000/api');

// Add fallback URLs for production
const FALLBACK_API_URLS = [
  'http://13.126.145.69:5000/api',
  'http://13.127.4.53:5000/api',
  '/api'
];

console.log('🌐 API Configuration:', {
  baseURL: API_BASE_URL,
  fallbackUrls: FALLBACK_API_URLS,
  environment: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
});

export { API_BASE_URL, FALLBACK_API_URLS };
export default API_BASE_URL;
