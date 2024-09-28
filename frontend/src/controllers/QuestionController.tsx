import * as api from '../api/questionApi';
import { Question } from '../models/Question';

class QuestionController {
  static validateQuestion(question: Partial<Question>): string | null {
    if (!question.title || question.title.trim().length === 0) {
      return "Title is required and cannot be empty.";
    }
    if (!question.description || question.description.trim().length === 0) {
      return "Description is required and cannot be empty.";
    }
    if (!question.categories || question.categories.length === 0) {
      return "At least one category is required.";
    }
    if (!question.complexity || !['easy', 'medium', 'hard'].includes(question.complexity)) {
      return "Complexity must be either 'easy', 'medium', or 'hard'.";
    }
    return null;
  }

  static async fetchQuestions(): Promise<Question[]> {
    try {
      const questions = await api.fetchQuestions();
      return questions.filter(question => {
        const validationResult = this.validateQuestion(question);
        if (validationResult !== null) {
          console.warn(`Invalid question data received: ${validationResult}`, question);
          return false;
        }
        return true;
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw new Error('Failed to fetch questions. Please try again later.');
    }
  }

  static async createQuestion(questionData: Omit<Question, 'id'>): Promise<Question> {
    const error = this.validateQuestion(questionData);
    if (error) {
      throw new Error(`Invalid question data: ${error}`);
    }
    try {
      return await api.createQuestion(questionData);
    } catch (error) {
      console.error('Error creating question:', error);
      throw new Error('Failed to create question. Please check your input and try again.');
    }
  }

  static async updateQuestion(id: number, questionData: Omit<Question, 'id'>): Promise<Question> {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid question ID.');
    }
    const error = this.validateQuestion(questionData);
    if (error) {
      throw new Error(`Invalid question data: ${error}`);
    }
    try {
      return await api.updateQuestion(id, questionData);
    } catch (error) {
      console.error('Error updating question:', error);
      throw new Error('Failed to update question. Please check your input and try again.');
    }
  }

  static async deleteQuestion(id: number): Promise<void> {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid question ID.');
    }
    try {
      await api.deleteQuestion(id);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw new Error('Failed to delete question. Please try again later.');
    }
  }
}

export default QuestionController;