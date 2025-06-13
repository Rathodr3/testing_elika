
import { API_BASE_URL, FALLBACK_API_URLS } from '@/config/api';

export const tryFetchWithFallback = async (endpoint: string, options: RequestInit = {}) => {
  const urls = [API_BASE_URL, ...FALLBACK_API_URLS];
  
  for (const baseUrl of urls) {
    try {
      console.log(`🔗 Trying API request: ${baseUrl}${endpoint}`);
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (response.ok) {
        console.log(`✅ API request successful: ${baseUrl}${endpoint}`);
        return response;
      } else {
        console.warn(`⚠️ API request failed with status ${response.status}: ${baseUrl}${endpoint}`);
      }
    } catch (error) {
      console.warn(`❌ API request error for ${baseUrl}${endpoint}:`, error);
      continue;
    }
  }
  
  throw new Error(`All API endpoints failed for ${endpoint}`);
};

export const apiRequest = async (endpoint: string, method: string = 'GET', data?: any, requireAuth: boolean = false) => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (requireAuth) {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await tryFetchWithFallback(endpoint, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`🚨 API request failed: ${method} ${endpoint}`, error);
    throw error;
  }
};
