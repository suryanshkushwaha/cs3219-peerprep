import axios, { AxiosError } from 'axios';
import { Request } from '../models/Request';

// Set up axios instance with base URL
const API_URL = "http://localhost:3000/matchingrequest";

export class ApiError extends Error {
    constructor(message: string, public statusCode?: number) {
      super(message);
      this.name = 'ApiError';
    }
}

interface ErrorResponseData {
    message: string;
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

const handleRequestApiError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            const { status, data } = axiosError.response;

            // Check for specific status and messages
            if (status === 409 && data && typeof data === 'object' && 'message' in data) {
                if (data.message === 'User is already in the queue') {
                    throw new ApiError('You are already looking for a match in the matching queue', status);
                } else if (data.message === 'User is already in an active session') {
                    throw new ApiError('You are already in an active session', status);
                }
            }

            throw new ApiError(`API error: ${axiosError.response.statusText}`, status);
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
        return handleRequestApiError(error);
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

export const listenToMatchStatus = (userId: string, onUpdate: (data: MatchingRequestResponse) => void, onError: (error: any) => void) => {
    const eventSource = new EventSource(`${API_URL}/${userId}`);

    // Listen for incoming events from the server
    eventSource.onmessage = (event) => {
        try {
            const data: MatchingRequestResponse = JSON.parse(event.data);
            onUpdate(data); // Call the update handler with the received data
        } catch (error) {
            console.error("Error parsing SSE data:", error);
            onError(error);
        }
    };

    // Handle connection errors
    eventSource.onerror = (error) => {
        console.error("Error in SSE connection:", error);
        eventSource.close(); // Close the connection on error
        onError(error);
    };

    // Return a function to allow stopping the event listener
    return () => {
        eventSource.close(); // Close the connection when no longer needed
    };
};

// Method to delete matching request
export const deleteMatchingRequest = async (userId: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${userId}`);
    } catch (error) {
        return handleApiError(error);
    }
}

// Method to delete matched session
export const deleteMatchedSession = async (sessionId: string): Promise<void> => {
    try {
        // Extract Id from "matched on Session ID: 670d81daf90653ef4b9162b8-67094dcc6be97361a2e7cb1a-1730747329524-Qtest1, Topic: algorithms, Difficulty: easy"
        const id = sessionId.split(": ")[1].split(",")[0];
        await axios.delete(`${API_URL}/session/${id}`);
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