
import { API_BASE_URL, FALLBACK_API_URLS } from '../../config/api';

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

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const tryFetchWithFallback = async (endpoint: string, config: RequestInit) => {
  const urls = [API_BASE_URL, ...FALLBACK_API_URLS];
  
  for (let i = 0; i < urls.length; i++) {
    const baseUrl = urls[i];
    try {
      console.log(`🔍 Attempting request ${i + 1}/${urls.length} to: ${baseUrl}${endpoint}`);
      
      const response = await fetch(`${baseUrl}${endpoint}`, config);
      console.log(`✅ Response from ${baseUrl}: ${response.status}`);
      
      if (response.ok) {
        return response;
      } else if (response.status >= 400 && response.status < 500) {
        // Client error, don't try other URLs
        await handleAPIError(response);
      }
    } catch (error) {
      console.warn(`❌ Failed to connect to ${baseUrl}:`, error);
      
      // If this is the last URL, throw the error
      if (i === urls.length - 1) {
        throw new Error('All backend servers are unavailable. Please try again later.');
      }
    }
  }
  
  throw new Error('All backend servers are unavailable');
};

export const apiRequest = async (
  endpoint: string, 
  method: string, 
  data?: any, 
  requiresAuth = false
) => {
  try {
    console.log(`🔍 Making ${method} request to: ${endpoint}`);
    console.log('🔍 Request data:', data);
    console.log('🔍 Requires auth:', requiresAuth);
    
    const headers = requiresAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    console.log('🔍 Request headers:', headers);
    
    const config: RequestInit = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    const response = await tryFetchWithFallback(endpoint, config);
    const result = await response.json();
    console.log('✅ API Response:', result);
    
    return result;
  } catch (error) {
    console.error('❌ API Request failed:', error);
    throw error;
  }
};
