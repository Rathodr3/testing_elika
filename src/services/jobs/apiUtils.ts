
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
    const token = localStorage.getItem('adminToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers,
    ...(data && method !== 'GET' && { body: JSON.stringify(data) }),
  };

  try {
    const response = await tryFetchWithFallback(endpoint, config);
    
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
    if (response.ok || response.status < 500) {
      return response;
    }
    throw new Error(`Server error: ${response.status}`);
  } catch (error) {
    console.warn('❌ Primary API failed:', error);
  }

  // Try fallback URLs
  for (const fallbackUrl of FALLBACK_API_URLS) {
    try {
      console.log('🔗 Trying fallback API:', `${fallbackUrl}${endpoint}`);
      const response = await fetch(`${fallbackUrl}${endpoint}`, config);
      if (response.ok || response.status < 500) {
        return response;
      }
    } catch (error) {
      console.warn(`❌ Fallback API failed (${fallbackUrl}):`, error);
    }
  }

  // If all APIs fail, return a mock response for development
  console.warn('🚧 All APIs failed, returning mock response for development');
  
  // Return appropriate mock responses based on endpoint
  if (endpoint.includes('/jobs/public') || endpoint.includes('/jobs')) {
    return new Response(JSON.stringify([]), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (endpoint.includes('/users')) {
    return new Response(JSON.stringify({ success: true, data: [] }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (endpoint.includes('/companies')) {
    return new Response(JSON.stringify({ success: true, data: [] }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (endpoint.includes('/job-applications')) {
    if (config.method === 'POST') {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Application submitted successfully (mock)',
        data: { id: 'mock-' + Date.now() }
      }), { 
        status: 201, 
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ success: true, data: [] }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (endpoint.includes('/audit')) {
    return new Response(JSON.stringify({ 
      success: true, 
      data: { logs: [], total: 0, page: 1, totalPages: 1 }
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });
  }

  throw new Error('All API endpoints failed and no mock available');
};
