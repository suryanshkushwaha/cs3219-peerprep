import * as api from '../api/questionApi';
import { ApiError } from '../api/questionApi';
import { Question } from '../models/Question';

class QuestionController {

  static validateQuestion = (question: Omit<Question, '_id'> & Partial<Pick<Question, '_id'>>): Error | null => { // FIXME: why are there two 'validateQuestion' functions?
    if (!question.title || question.title.trim().length === 0) {
      return new Error("Title is required and cannot be empty.");
    }
    if (!question.description || question.description.trim().length === 0) {
      return new Error("Description is required and cannot be empty.");
    }
    if (!question.categories || question.categories.length === 0) {
      return new Error("At least one category is required.");
    }
    if (typeof question.categories !== 'object') {
      return new Error("Categories must be an array. (Must be a plain array, not an Array-like object)");
    }
    if (!question.difficulty || !['easy', 'medium', 'hard'].includes(question.difficulty)) {
      return new Error("Difficulty must be either 'easy', 'medium', or 'hard'.");
    }
    return null;
  };

  static async fetchQuestions(): Promise<Question[]> {
    try {
      const questions = await api.fetchQuestions();
      return questions.filter(question => {
        const validationResult = QuestionController.validateQuestion(question);
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

  static async createQuestion(questionData: Omit<Question, '_id'>): Promise<Question> {
    console.log('Creating question:', questionData);
    const error = QuestionController.validateQuestion(questionData);
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

  static async updateQuestion(id: string, questionData: Omit<Question, '_id'>): Promise<Question> {
    console.log('Updating question:', id, questionData);
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid question ID.');
    }
    const error = QuestionController.validateQuestion(questionData);
    if (error) {
      throw new Error(`Invalid question data: ${error}`);
    }
    try {
      return await api.updateQuestion(id, questionData);
    } catch (error: unknown) {  // Specify `unknown` type for error
      if (error instanceof ApiError && error.statusCode === 400) {
        console.error('Duplicate title error:', error.message);
        throw new Error(error.message); // Show specific message for duplicate title
      } else if (error instanceof Error) {  // Check if error is a general Error instance
        console.error('Error updating question:', error.message);
        throw new Error('Failed to update question. Please check your input and try again.');
      } else {
        console.error('An unknown error occurred');
        throw new Error('Failed to update question due to an unknown error.');
      }
    }
  }
  

  static async deleteQuestion(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
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