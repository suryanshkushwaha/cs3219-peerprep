import axios, { AxiosError } from 'axios';
import { Request } from '../models/Request';

// Set up axios instance with base URL
const API_URL = "http://localhost:3000/matchingrequest";

class ApiError extends Error {
    constructor(message: string, public statusCode?: number) {
      super(message);
      this.name = 'ApiError';
    }
}

const handleApiError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new ApiError(`API error: ${axiosError.response.statusText}`, axiosError.response.status);
      } else if (axiosError.request) {
        throw new ApiError('API error: No response received from the server');
      } else {
        throw new ApiError(`API error: ${axiosError.message}`);
      }
    } else {
      throw new ApiError(`API error: An unexpected error occurred ${error}`);
    }
};

// Matching Response
export interface MatchingRequestResponse {
    message: string;
    data: {
      userId: string;
      topic: string;
      difficulty: string;
      status: 'pending' | 'matched';
      createdAt: Date;
    };
}

// Method to create matching request
export const createMatchingRequest = async (userId: string | null, topic: string, difficulty: string): Promise<MatchingRequestResponse> => {
    try {
        const response = await axios.post(API_URL, {userId, topic, difficulty});
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}

// Method to receieve matching request
export const getMatchStatus = async (userId: string): Promise<MatchingRequestResponse> => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}

// Method to delete matching request
export const deleteMatchingRequest = async (userId: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${userId}`);
    } catch (error) {
        return handleApiError(error);
    }
}

// Method to save matched session
export const saveMatchedSession = async (userId1: string, userId2: string, topic: string, difficulty: string, sessionId: string): Promise<void> => {
    try {
        await axios.post(`${API_URL}/session`, { userId1, userId2, topic, difficulty, sessionId });
    } catch (error) {
        return handleApiError(error);
    }
}

// Method to get matched session
export const getMatchedSession = async (userId: string): Promise<MatchingRequestResponse> => {
    try {
        const response = await axios.get(`${API_URL}/session/${userId}`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}

// Method to delete matched session
export const deleteMatchedSession = async (userId: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/session/${userId}`);
    } catch (error) {
        return handleApiError(error);
    }
}

// Method to get all matched sessions
export const getAllMatchedSessions = async (): Promise<MatchingRequestResponse> => {
    try {
        const response = await axios.get(`${API_URL}/session`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}

// Method to get all matched sessions by topic
export const getAllMatchedSessionsByTopic = async (topic: string): Promise<MatchingRequestResponse> => {
    try {
        const response = await axios.get(`${API_URL}/session/${topic}`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}

// Method to get all matched sessions by difficulty
export const getAllMatchedSessionsByDifficulty = async (difficulty: string): Promise<MatchingRequestResponse> => {
    try {
        const response = await axios.get(`${API_URL}/session/${difficulty}`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}

// Method to get all matched sessions by topic and difficulty
export const getAllMatchedSessionsByTopicAndDifficulty = async (topic: string, difficulty: string): Promise<MatchingRequestResponse> => {
    try {
        const response = await axios.get(`${API_URL}/session/${topic}/${difficulty}`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}
