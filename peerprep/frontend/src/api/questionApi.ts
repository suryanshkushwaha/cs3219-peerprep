import axios, { AxiosError } from 'axios';
import { Question } from '../models/Question';

const API_URL = 'http://localhost:8080/api/questions';

export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Explicitly cast response data as an object with a `message` string field if expected
    const responseData = axiosError.response?.data as { message?: string } | undefined;

    if (axiosError.response) {
      if (axiosError.response.status === 400 && responseData?.message?.includes('title already exists')) {
        throw new ApiError('A question with this title already exists.', 400);
      }
      throw new ApiError(`API error: ${axiosError.response.statusText}`, axiosError.response.status);
    } else if (axiosError.request) {
      throw new ApiError('API error: No response received from the server');
    } else {
      throw new ApiError(`API error: ${axiosError.message}`);
    }
  } else {
    throw new ApiError(`API error: An unexpected error occurred ${String(error)}`);
  }
};


const validateQuestionData = (data: any): data is Question => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data._id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    typeof data.input1 === 'string' &&
    typeof data.output1 === 'string' &&
    typeof data.input2 === 'string' &&
    typeof data.output2 === 'string' &&
    Array.isArray(data.categories) &&
    data.categories.every((cat: any) => typeof cat === 'string') &&
    ['easy', 'medium', 'hard'].includes(data.difficulty)
  );
};

const normalizeQuestionData = (data: Omit<Question, '_id'>): Omit<Question, '_id'> => {
  return {
    ...data,
    categories: data.categories.map(cat => cat.toLowerCase()),
    difficulty: data.difficulty.toLowerCase()
  };
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

export const createQuestion = async (questionData: Omit<Question, '_id'>): Promise<Question> => {
  try {
    const normalizedData = normalizeQuestionData(questionData);
    const response = await axios.post<any>(API_URL, normalizedData);
    if (!validateQuestionData(response.data)) {
      throw new Error('Invalid question data received from server');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateQuestion = async (id: string, questionData: Omit<Question, '_id'>): Promise<Question> => {
  try {
    const normalizedData = normalizeQuestionData(questionData);
    const response = await axios.put<any>(`${API_URL}/${id}`, normalizedData);
    if (!validateQuestionData(response.data)) {
      throw new Error('Invalid question data received from server');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteQuestion = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    return handleApiError(error);
  }
};

export const getQuestionById = async (id: string): Promise<Question> => {
  try {
    const response = await axios.get<any>(`${API_URL}/${id}`);
    if (!validateQuestionData(response.data)) {
      throw new Error('Invalid question data received from server');
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}