import axios from 'axios';

const API_URL = import.meta.env.VITE_ASSESS_CODE_API_URL;

// Define a custom error class for API errors
export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const assesCode = async (currentCode: string): Promise<string> => {
  try {
    console.log('Submitting code to backend API:');

    // Call the backend API instead of OpenAI directly
    const response = await axios.post(API_URL, { currentCode });

    // Extract and display the response content from the backend
    const feedback = response.data.feedback;
    //console.log('Backend API response:', feedback);
    return feedback;
  } catch (error) {
    console.error('Error executing backend API call:', error);
    return "Failed to process code assessment on backend";
  }
};