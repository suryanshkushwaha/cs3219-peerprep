import * as api from '../api/questionApi';
import { Question } from '../models/Question.tsx';

class QuestionController {
  static async fetchQuestions(): Promise<Question[]> {
    return api.fetchQuestions();
  }

  static async createQuestion(questionData: Omit<Question, 'id'>): Promise<Question> {
    return api.createQuestion(questionData);
  }

  static async updateQuestion(id: number, questionData: Omit<Question, 'id'>): Promise<Question> {
    return api.updateQuestion(id, questionData);
  }

  static async deleteQuestion(id: number): Promise<void> {
    return api.deleteQuestion(id);
  }
}

export default QuestionController;