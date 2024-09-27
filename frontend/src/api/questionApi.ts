import axios, { AxiosError } from 'axios';
import { Question } from '../models/Question';

const API_URL = 'http://your-api-url.com/api/questions';

class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw new ApiError(`API error: ${axiosError.response.statusText}`, axiosError.response.status);
    } else if (axiosError.request) {
      throw new ApiError('No response received from the server');
    } else {
      throw new ApiError(`Error setting up the request: ${axiosError.message}`);
    }
  } else {
    throw new ApiError('An unexpected error occurred');
  }
};

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const response = await axios.get<Question[]>(API_URL);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createQuestion = async (questionData: Omit<Question, 'id'>): Promise<Question> => {
  try {
    const response = await axios.post<Question>(API_URL, questionData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateQuestion = async (id: number, questionData: Omit<Question, 'id'>): Promise<Question> => {
  try {
    const response = await axios.put<Question>(`${API_URL}/${id}`, questionData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteQuestion = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    return handleApiError(error);
  }
};