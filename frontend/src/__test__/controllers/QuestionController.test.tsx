import QuestionController from '../../controllers/QuestionController';
import * as api from '../../api/questionApi';
import { Question } from '../../models/Question';  // Import Question type directly from the models

// Mock the api module
jest.mock('../../api/questionApi');

describe('QuestionController', () => {
  const mockQuestion: Question = {
    id: 1,
    title: 'Test Question',
    description: 'This is a test question',
    categories: ['algorithms'],
    complexity: 'medium'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchQuestions', () => {
    it('should return questions when API call is successful', async () => {
      (api.fetchQuestions as jest.Mock).mockResolvedValue([mockQuestion]);

      const result = await QuestionController.fetchQuestions();
      expect(result).toEqual([mockQuestion]);
      expect(api.fetchQuestions).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when API call fails', async () => {
      (api.fetchQuestions as jest.Mock).mockRejectedValue(new Error('API error'));

      await expect(QuestionController.fetchQuestions()).rejects.toThrow('Failed to fetch questions. Please try again later.');
      expect(api.fetchQuestions).toHaveBeenCalledTimes(1);
    });
  });

  describe('createQuestion', () => {
    const newQuestion = {
      title: 'New Question',
      description: 'This is a new question',
      categories: ['data-structures'],
      complexity: 'easy' as const
    };

    it('should create a question when API call is successful', async () => {
      (api.createQuestion as jest.Mock).mockResolvedValue({ id: 2, ...newQuestion });

      const result = await QuestionController.createQuestion(newQuestion);
      expect(result).toEqual({ id: 2, ...newQuestion });
      expect(api.createQuestion).toHaveBeenCalledWith(newQuestion);
    });

    it('should throw an error when API call fails', async () => {
      (api.createQuestion as jest.Mock).mockRejectedValue(new Error('API error'));

      await expect(QuestionController.createQuestion(newQuestion)).rejects.toThrow('Failed to create question. Please check your input and try again.');
      expect(api.createQuestion).toHaveBeenCalledWith(newQuestion);
    });
  });

  describe('updateQuestion', () => {
    const updatedQuestion = {
      title: 'Updated Question',
      description: 'This is an updated question',
      categories: ['algorithms', 'dynamic-programming'],
      complexity: 'hard' as const
    };

    it('should update a question when API call is successful', async () => {
      (api.updateQuestion as jest.Mock).mockResolvedValue({ id: 1, ...updatedQuestion });

      const result = await QuestionController.updateQuestion(1, updatedQuestion);
      expect(result).toEqual({ id: 1, ...updatedQuestion });
      expect(api.updateQuestion).toHaveBeenCalledWith(1, updatedQuestion);
    });

    it('should throw an error when API call fails', async () => {
      (api.updateQuestion as jest.Mock).mockRejectedValue(new Error('API error'));

      await expect(QuestionController.updateQuestion(1, updatedQuestion)).rejects.toThrow('Failed to update question. Please check your input and try again.');
      expect(api.updateQuestion).toHaveBeenCalledWith(1, updatedQuestion);
    });
  });

  describe('deleteQuestion', () => {
    it('should delete a question when API call is successful', async () => {
      (api.deleteQuestion as jest.Mock).mockResolvedValue(undefined);

      await QuestionController.deleteQuestion(1);
      expect(api.deleteQuestion).toHaveBeenCalledWith(1);
    });

    it('should throw an error when API call fails', async () => {
      (api.deleteQuestion as jest.Mock).mockRejectedValue(new Error('API error'));

      await expect(QuestionController.deleteQuestion(1)).rejects.toThrow('Failed to delete question. Please try again later.');
      expect(api.deleteQuestion).toHaveBeenCalledWith(1);
    });
  });
});