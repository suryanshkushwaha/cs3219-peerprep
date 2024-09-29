import axios, { AxiosError } from 'axios';
import { Question } from '../models/Question';

const API_URL = 'http://localhost:8080/api/questions';

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
      throw new ApiError('API error: No response received from the server');
    } else {
      throw new ApiError(`API error: ${axiosError.message}`);
    }
  } else {
    throw new ApiError('API error: An unexpected error occurred');
  }
};

const validateQuestionData = (data: any): data is Question => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'number' &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    Array.isArray(data.categories) &&
    data.categories.every((cat: any) => typeof cat === 'string') &&
    ['easy', 'medium', 'hard'].includes(data.complexity)
  );
};

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const response = await axios.get<any[]>(API_URL);
    const validQuestions = response.data.filter(validateQuestionData);
    if (validQuestions.length !== response.data.length) {
      console.warn(`Received ${response.data.length} questions, but only ${validQuestions.length} are valid.`);
    }
    return validQuestions;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createQuestion = async (questionData: Omit<Question, 'id'>): Promise<Question> => {
  try {
    const response = await axios.post<any>(API_URL, questionData);
    if (!validateQuestionData(response.data)) {
      throw new Error('Invalid question data received from server');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateQuestion = async (id: number, questionData: Omit<Question, 'id'>): Promise<Question> => {
  try {
    const response = await axios.put<any>(`${API_URL}/${id}`, questionData);
    if (!validateQuestionData(response.data)) {
      throw new Error('Invalid question data received from server');
    }
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