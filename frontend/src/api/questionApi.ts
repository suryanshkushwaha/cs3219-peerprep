import axios from 'axios';
import { Question } from '../models/Question.tsx';

const API_URL = 'http://your-api-url.com/api/questions';

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const response = await axios.get<Question[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const createQuestion = async (questionData: Omit<Question, 'id'>): Promise<Question> => {
  try {
    const response = await axios.post<Question>(API_URL, questionData);
    return response.data;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

export const updateQuestion = async (id: number, questionData: Omit<Question, 'id'>): Promise<Question> => {
  try {
    const response = await axios.put<Question>(`${API_URL}/${id}`, questionData);
    return response.data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

export const deleteQuestion = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};