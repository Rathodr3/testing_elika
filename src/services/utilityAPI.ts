
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const handleAPIError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return response;
};

export const healthAPI = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      await handleAPIError(response);
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
};

export const contactAPI = {
  submit: async (formData: {
    name: string;
    email: string;
    company?: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Submitting contact form to:', `${API_BASE_URL}/contact`);
      
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      await handleAPIError(response);
      const result = await response.json();
      console.log('Contact form submission successful:', result);
      return result;
    } catch (error) {
      console.error('Contact form submission error:', error);
      throw error;
    }
  }
};
