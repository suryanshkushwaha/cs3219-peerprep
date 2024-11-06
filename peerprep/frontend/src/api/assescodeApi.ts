import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:8080/api/gpt/asses';

// Define a custom error class for API errors
export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// const handleApiError = (error: unknown): never => {
//   if (axios.isAxiosError(error)) {
//     const axiosError = error as AxiosError;
//     if (axiosError.response) {
//       throw new ApiError(`API error: ${axiosError.response.statusText}`, axiosError.response.status);
//     } else if (axiosError.request) {
//       throw new ApiError('API error: No response received from the server');
//     } else {
//       throw new ApiError(`API error: ${axiosError.message}`);
//     }
//   } else {
//     throw new ApiError(`API error: An unexpected error occurred ${error}`);
//   }
// };

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