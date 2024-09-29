import axios from 'axios';
import { Question } from '../../models/Question';
import * as api from '../../api/questionApi';

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