// src/api/authApi.ts
import axios, { AxiosError } from 'axios';
import { User } from '../models/User';

// Base URL for authentication APIs
const API_URL = 'http://localhost:3001/auth';

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

// Login Response
interface LoginResponse {
    message: string;
    data: {
      accessToken: string;
      id: string;
      username: string;
      email: string;
      isAdmin: boolean;
      createdAt: string;
    };
  }
// Login User
export const loginUser = async (email: string, password: string): Promise<{ token: string; user: User }> => {
    try {
      // Define response with the LoginResponse type
      const response = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
  
      // Destructure the response and construct the user object
      const { accessToken, id, username, email: userEmail, isAdmin, createdAt } = response.data.data;
      const user: User = { id, username, email: userEmail, isAdmin, createdAt };
      
      // Return the token and user data
      return { token: accessToken, user };
    } catch (error) {
      return handleApiError(error);
    }
};

// Register User
export const registerUser = async (username: string, email: string, password: string): Promise<User> => {
  try {
    const response = await axios.post<User>(`${API_URL}/register`, { username, email, password });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Verify JWT Token
export const verifyToken = async (token: string): Promise<User> => {
  try {
    const response = await axios.get<User>(`${API_URL}/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};