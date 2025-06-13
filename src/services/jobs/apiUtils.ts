
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

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

export const apiRequest = async (
  endpoint: string, 
  method: string, 
  data?: any, 
  requiresAuth = false
) => {
  try {
    console.log(`🔍 Making ${method} request to: ${API_BASE_URL}${endpoint}`);
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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response ok:', response.ok);
    
    await handleAPIError(response);
    const result = await response.json();
    console.log('✅ API Response:', result);
    
    return result;
  } catch (error) {
    console.error('❌ API Request failed:', error);
    
    // If it's a network error, provide a more helpful message
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Backend server is not available. Please check if the server is running.');
    }
    
    throw error;
  }
};
