import QuestionController from '../../controllers/QuestionController';
import * as api from '../../api/questionApi';
import { Question } from '../../models/Question';

jest.mock('../../api/questionApi');

describe('QuestionController', () => {
  const mockValidQuestion: Question = {
    id: 1,
    title: 'Test Question',
    description: 'This is a test question',
    categories: ['algorithms'],
    complexity: 'medium'
  };

  const mockInvalidQuestion: any = {
    id: 2,
    title: '',  // Invalid: empty title
    description: 'Invalid question',
    categories: [],  // Invalid: empty categories
    complexity: 'invalid'  // Invalid: incorrect complexity
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateQuestion', () => {
    it('should return null for valid question data', () => {
      const result = QuestionController.validateQuestion(mockValidQuestion);
      expect(result).toBeNull();
    });

    it('should return error message for invalid title', () => {
      const result = QuestionController.validateQuestion({ ...mockValidQuestion, title: '' });
      expect(result).toBe("Title is required and cannot be empty.");
    });

    it('should return error message for invalid description', () => {
      const result = QuestionController.validateQuestion({ ...mockValidQuestion, description: '' });
      expect(result).toBe("Description is required and cannot be empty.");
    });

    it('should return error message for empty categories', () => {
      const result = QuestionController.validateQuestion({ ...mockValidQuestion, categories: [] });
      expect(result).toBe("At least one category is required.");
    });

    it('should return error message for invalid complexity', () => {
      const result = QuestionController.validateQuestion({ ...mockValidQuestion, complexity: 'invalid' as any });
      expect(result).toBe("Complexity must be either 'easy', 'medium', or 'hard'.");
    });
  });

  describe('createQuestion', () => {
    const newValidQuestion = {
      title: 'New Question',
      description: 'This is a new question',
      categories: ['data-structures'],
      complexity: 'easy' as const
    };

    it('should create a question when data is valid and API call is successful', async () => {
      (api.createQuestion as jest.Mock).mockResolvedValue({ id: 2, ...newValidQuestion });

      const result = await QuestionController.createQuestion(newValidQuestion);
      expect(result).toEqual({ id: 2, ...newValidQuestion });
      expect(api.createQuestion).toHaveBeenCalledWith(newValidQuestion);
    });

    it('should throw an error when question data is invalid', async () => {
      await expect(QuestionController.createQuestion(mockInvalidQuestion)).rejects.toThrow('Invalid question data:');
      expect(api.createQuestion).not.toHaveBeenCalled();
    });

    it('should throw an error when API call fails', async () => {
      (api.createQuestion as jest.Mock).mockRejectedValue(new Error('API error'));

      await expect(QuestionController.createQuestion(newValidQuestion)).rejects.toThrow('Failed to create question. Please check your input and try again.');
      expect(api.createQuestion).toHaveBeenCalledWith(newValidQuestion);
    });
  });

  describe('updateQuestion', () => {
    const updatedValidQuestion = {
      title: 'Updated Question',
      description: 'This is an updated question',
      categories: ['algorithms', 'dynamic-programming'],
      complexity: 'hard' as const
    };

    it('should update a question when data is valid and API call is successful', async () => {
      (api.updateQuestion as jest.Mock).mockResolvedValue({ id: 1, ...updatedValidQuestion });

      const result = await QuestionController.updateQuestion(1, updatedValidQuestion);
      expect(result).toEqual({ id: 1, ...updatedValidQuestion });
      expect(api.updateQuestion).toHaveBeenCalledWith(1, updatedValidQuestion);
    });

    it('should throw an error when question ID is invalid', async () => {
      await expect(QuestionController.updateQuestion(0, updatedValidQuestion)).rejects.toThrow('Invalid question ID.');
      expect(api.updateQuestion).not.toHaveBeenCalled();
    });

    it('should throw an error when question data is invalid', async () => {
      await expect(QuestionController.updateQuestion(1, mockInvalidQuestion)).rejects.toThrow('Invalid question data:');
      expect(api.updateQuestion).not.toHaveBeenCalled();
    });

    it('should throw an error when API call fails', async () => {
      (api.updateQuestion as jest.Mock).mockRejectedValue(new Error('API error'));

      await expect(QuestionController.updateQuestion(1, updatedValidQuestion)).rejects.toThrow('Failed to update question. Please check your input and try again.');
      expect(api.updateQuestion).toHaveBeenCalledWith(1, updatedValidQuestion);
    });
  });

  describe('deleteQuestion', () => {
    it('should delete a question when ID is valid and API call is successful', async () => {
      (api.deleteQuestion as jest.Mock).mockResolvedValue(undefined);

      await QuestionController.deleteQuestion(1);
      expect(api.deleteQuestion).toHaveBeenCalledWith(1);
    });

    it('should throw an error when question ID is invalid', async () => {
      await expect(QuestionController.deleteQuestion(0)).rejects.toThrow('Invalid question ID.');
      expect(api.deleteQuestion).not.toHaveBeenCalled();
    });

    it('should throw an error when API call fails', async () => {
      (api.deleteQuestion as jest.Mock).mockRejectedValue(new Error('API error'));

      await expect(QuestionController.deleteQuestion(1)).rejects.toThrow('Failed to delete question. Please try again later.');
      expect(api.deleteQuestion).toHaveBeenCalledWith(1);
    });
  });
});