import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_ASSESSCODE_API_URL;

// Define a custom error class for API errors
export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const assessCode = async (currentCode: string): Promise<string> => {
  try {
    console.log('Submitting code to backend API:');

    // Call the backend API instead of OpenAI directly
    const response = await axios.post(API_URL, { codeDetails: currentCode });

    // Extract and display the response content from the backend
    const feedback = response.data.feedback;
    console.log('Backend API response:', feedback);
    return feedback;
  } catch (error) {
    console.error('Error executing backend API call:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new ApiError(`API error: ${axiosError.response.statusText}`, axiosError.response.status);
      } else if (axiosError.request) {
        throw new ApiError('API error: No response received from the server');
      } else {
        throw new ApiError(`API error: ${axiosError.message}`);
      }
    }
    throw new ApiError(`API error: An unexpected error occurred ${error}`);
  }
};
