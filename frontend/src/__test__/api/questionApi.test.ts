import axios from 'axios';
import { Question } from '../../models/Question';
import * as api from '../../api/QuestionApi';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('questionApi', () => {
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

  describe('fetchQuestions', () => {
    it('should return valid questions when API call is successful', async () => {
      mockedAxios.get.mockResolvedValue({ data: [mockValidQuestion] });

      const result = await api.fetchQuestions();
      expect(result).toEqual([mockValidQuestion]);
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.any(String));
    });

    it('should filter out invalid questions and log warnings', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      mockedAxios.get.mockResolvedValue({ data: [mockValidQuestion, mockInvalidQuestion] });

      const result = await api.fetchQuestions();
      expect(result).toEqual([mockValidQuestion]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Received 2 questions, but only 1 are valid."));
      consoleSpy.mockRestore();
    });

    it('should throw an ApiError when API call fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(api.fetchQuestions()).rejects.toThrow('API error');
    });
  });

  describe('createQuestion', () => {
    const newValidQuestion: Omit<Question, 'id'> = {
      title: 'New Question',
      description: 'This is a new question',
      categories: ['data-structures'],
      complexity: 'easy'
    };

    it('should create a question when API call is successful', async () => {
      mockedAxios.post.mockResolvedValue({ data: { id: 3, ...newValidQuestion } });

      const result = await api.createQuestion(newValidQuestion);
      expect(result).toEqual({ id: 3, ...newValidQuestion });
      expect(mockedAxios.post).toHaveBeenCalledWith(expect.any(String), newValidQuestion);
    });

    it('should throw an error when server returns invalid data', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockInvalidQuestion });

      await expect(api.createQuestion(newValidQuestion)).rejects.toThrow('Invalid question data received from server');
    });

    it('should throw an ApiError when API call fails', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      await expect(api.createQuestion(newValidQuestion)).rejects.toThrow('API error');
    });
  });

  describe('updateQuestion', () => {
    const updatedValidQuestion: Omit<Question, 'id'> = {
      title: 'Updated Question',
      description: 'This is an updated question',
      categories: ['algorithms', 'dynamic-programming'],
      complexity: 'hard'
    };

    it('should update a question when API call is successful', async () => {
      mockedAxios.put.mockResolvedValue({ data: { id: 1, ...updatedValidQuestion } });

      const result = await api.updateQuestion(1, updatedValidQuestion);
      expect(result).toEqual({ id: 1, ...updatedValidQuestion });
      expect(mockedAxios.put).toHaveBeenCalledWith(expect.stringContaining('/1'), updatedValidQuestion);
    });

    it('should throw an error when server returns invalid data', async () => {
      mockedAxios.put.mockResolvedValue({ data: mockInvalidQuestion });

      await expect(api.updateQuestion(1, updatedValidQuestion)).rejects.toThrow('Invalid question data received from server');
    });

    it('should throw an ApiError when API call fails', async () => {
      mockedAxios.put.mockRejectedValue(new Error('Network error'));

      await expect(api.updateQuestion(1, updatedValidQuestion)).rejects.toThrow('API error');
    });
  });

  describe('deleteQuestion', () => {
    it('should delete a question when API call is successful', async () => {
      mockedAxios.delete.mockResolvedValue({ data: {} });

      await api.deleteQuestion(1);
      expect(mockedAxios.delete).toHaveBeenCalledWith(expect.stringContaining('/1'));
    });

    it('should throw an ApiError when API call fails', async () => {
      mockedAxios.delete.mockRejectedValue(new Error('Network error'));

      await expect(api.deleteQuestion(1)).rejects.toThrow('API error');
    });
  });
});