import { apiService } from './api';
import type { AuthTokens, User, UserCreate, UserLogin, UserUpdate } from '../types/models';

export const authService = {
  /**
   * Register a new user
   */
  register: async (userData: UserCreate): Promise<User> => {
    const user = await apiService.post<User>('/register', userData);
    return user;
  },

  /**
   * Login a user with email
   */
  login: async (credentials: UserLogin): Promise<AuthTokens> => {
    const response = await apiService.post<AuthTokens>('/login/email', credentials);
    
    // Store tokens in localStorage
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('refreshToken', response.refresh_token);
    
    return response;
  },

  /**
   * Logout the current user
   */
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  /**
   * Get the current user's profile
   */
  getCurrentUser: async (): Promise<User> => {
    return apiService.get<User>('/profile');
  },

  /**
   * Update the current user's profile
   */
  updateProfile: async (userData: UserUpdate): Promise<User> => {
    return apiService.put<User>('/users/me', userData);
  },

  /**
   * Check if a user is logged in
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get the current JWT token
   */
  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
}; 