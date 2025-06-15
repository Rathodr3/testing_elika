
import { API_BASE_URL, FALLBACK_API_URLS } from '@/config/api';

// Enhanced error handling and logging
export const apiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  requireAuth: boolean = false
): Promise<any> => {
  console.log(`🔗 Making API request: ${method} ${endpoint}`);
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (requireAuth) {
    // Check both token locations with priority order
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');
    const token = adminToken || userToken;
    
    if (!token) {
      console.log('❌ No authentication token found');
      throw new Error('No authentication token found. Please login again.');
    }
    
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Adding auth token to request:', token.substring(0, 20) + '...');
  }

  const config: RequestInit = {
    method,
    headers,
    ...(data && method !== 'GET' && { body: JSON.stringify(data) }),
  };

  try {
    const response = await tryFetchWithFallback(endpoint, config);
    
    if (response.status === 401) {
      // Token expired or invalid - force re-login
      console.log('🔄 Token expired or invalid, clearing tokens');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');
      throw new Error('Session expired. Please login again.');
    }
    
    if (response.status === 403) {
      // Permission denied - get detailed error message
      console.log('❌ Permission denied for request');
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        console.log('❌ Permission error details:', errorData);
        const errorMessage = errorData.message || 'Permission denied - insufficient privileges';
        if (errorData.details) {
          console.log('❌ Permission details:', errorData.details);
        }
        throw new Error(errorMessage);
      } catch (parseError) {
        console.log('❌ Failed to parse permission error response');
        throw new Error('Permission denied - insufficient privileges');
      }
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error ${response.status}:`, errorText);
      
      // Try to parse as JSON for error details
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      } catch {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    const responseText = await response.text();
    
    // Check if response is HTML (indicates server routing issues)
    if (responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html')) {
      console.error('❌ Received HTML instead of JSON:', responseText.substring(0, 200));
      throw new Error('Server returned HTML instead of JSON - API endpoint not found');
    }

    // Parse JSON response
    try {
      const result = JSON.parse(responseText);
      console.log(`✅ API Success: ${method} ${endpoint}`, result);
      return result;
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError, 'Response:', responseText.substring(0, 500));
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error(`❌ API request failed: ${method} ${endpoint}`, error);
    throw error;
  }
};

export const tryFetchWithFallback = async (endpoint: string, config: RequestInit): Promise<Response> => {
  // First try the primary API URL
  try {
    console.log('🔗 Trying primary API:', `${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return response;
  } catch (error) {
    console.warn('❌ Primary API failed:', error);
  }

  // Try fallback URLs
  for (const fallbackUrl of FALLBACK_API_URLS) {
    try {
      console.log('🔗 Trying fallback API:', `${fallbackUrl}${endpoint}`);
      const response = await fetch(`${fallbackUrl}${endpoint}`, config);
      return response;
    } catch (error) {
      console.warn(`❌ Fallback API failed (${fallbackUrl}):`, error);
    }
  }

  throw new Error('All API endpoints failed - please check your connection');
};
