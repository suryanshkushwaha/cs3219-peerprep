import * as api from '../api/questionApi';
import { Question } from '../models/Question';

class QuestionController {
  static async fetchQuestions(): Promise<Question[]> {
    try {
      return await api.fetchQuestions();
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw new Error('Failed to fetch questions. Please try again later.');
    }
  }

  static async createQuestion(questionData: Omit<Question, 'id'>): Promise<Question> {
    try {
      return await api.createQuestion(questionData);
    } catch (error) {
      console.error('Error creating question:', error);
      throw new Error('Failed to create question. Please check your input and try again.');
    }
  }

  static async updateQuestion(id: number, questionData: Omit<Question, 'id'>): Promise<Question> {
    try {
      return await api.updateQuestion(id, questionData);
    } catch (error) {
      console.error('Error updating question:', error);
      throw new Error('Failed to update question. Please check your input and try again.');
    }
  }

  static async deleteQuestion(id: number): Promise<void> {
    try {
      await api.deleteQuestion(id);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw new Error('Failed to delete question. Please try again later.');
    }
  }
}

export default QuestionController;