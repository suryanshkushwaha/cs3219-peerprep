// src/api/userApi.ts
import axios, { AxiosError } from 'axios';
import { User } from '../models/User';

// Set up axios instance with base URL
const API_URL = import.meta.env.VITE_USER_API_URL;

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

const validateUserData = (data: any): data is User => {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data._id === 'string' &&
      typeof data.username === 'string' &&
      typeof data.email === 'string' &&
      typeof data.isAdmin === 'boolean'
    );
  };

// Register user
export const registerUser = async (username: string, email: string, password: string): Promise<User> => {
    try {
      const response = await axios.post<any>(API_URL, { username, email, password });
      if (!validateUserData(response.data)) {
        throw new Error('Invalid user data received from server');
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
};
  
// Login
export const loginUser = async (email: string, password: string): Promise<{ token: string; user: User }> => {
    try {
      const response = await axios.post<any>(`${API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      if (!validateUserData(user)) {
        throw new Error('Invalid user data received from server');
      }
      return { token, user };
    } catch (error) {
      return handleApiError(error);
    }
};
  
// Get user profile
export const getUserProfile = async (token: string): Promise<User> => {
    try {
      const response = await axios.get<any>(`${API_URL}/auth/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!validateUserData(response.data)) {
        throw new Error('Invalid user data received from server');
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
};
  
// Get all users (Admin only)
export const getAllUsers = async (token: string): Promise<User[]> => {
    try {
      const response = await axios.get<any[]>(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const validUsers = response.data.filter(validateUserData);
      if (validUsers.length !== response.data.length) {
        console.warn(`Received ${response.data.length} users, but only ${validUsers.length} are valid.`);
      }
      return validUsers;
    } catch (error) {
      return handleApiError(error);
    }
};
  
// Update user
export const updateUser = async (userId: string, data: Partial<User>, token: string): Promise<User> => {
    try {
      const response = await axios.patch<any>(`${API_URL}/${userId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!validateUserData(response.data)) {
        throw new Error('Invalid user data received from server');
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
};
  
// Delete user
  export const deleteUser = async (userId: string, token: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      return handleApiError(error);
    }
};