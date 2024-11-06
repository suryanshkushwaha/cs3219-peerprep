// src/api/userApi.ts
import axios, { AxiosError } from 'axios';
import { User } from '../models/User';

// Base URL for user APIs
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

// Create a new user
export const createUser = async (
    username: string,
    email: string,
    password: string
  ): Promise<User> => {
    try {
      // Send a POST request with username, email, and password
      const response = await axios.post<{ message: string; data: User }>(API_URL, {
        username,
        email,
        password,
      });
  
      // Return the created user data from the response
      return response.data.data;
    } catch (error) {
      return handleApiError(error); // Handle API errors such as 400, 409, or 500
    }
};

// Get All Users (Admin only)
export const getAllUsers = async (token: string): Promise<User[]> => {
    try {
      const response = await axios.get<{ message: string; data: User[] }>(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Return the array of users from the data field
      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
};

// Get User Profile (for non-admin users or self profile)
export const getUserProfile = async (userId: string, token: string): Promise<User> => {
    try {
      // Send a GET request with the userId in the URL and Authorization header
      const response = await axios.get<{ message: string; data: User }>(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Return the user data from the response
      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
  };

// Update User
export const updateUser = async (userId: string, data: Partial<User>, token: string): Promise<User> => {
  try {
    const response = await axios.patch<User>(`${API_URL}/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete User (Admin only)
export const deleteUser = async (userId: string, token: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    return handleApiError(error);
  }
};