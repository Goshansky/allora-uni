import { apiService } from './api';
import type { AuthTokens, User, UserCreate, UserLogin } from '../types/models';
import { mockUsers, mockAuthTokens } from '../data/mockData';

// For using mock data instead of real API
const USE_MOCK = true;

export const authService = {
  /**
   * Register a new user
   */
  register: async (userData: UserCreate): Promise<User> => {
    if (USE_MOCK) {
      // Check if username already exists
      const existingUser = mockUsers.find(user => user.username === userData.username);
      if (existingUser) {
        return Promise.reject(new Error('Username already exists'));
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a new mock user
      const newUser: User = {
        id: mockUsers.length + 1,
        email: userData.email,
        username: userData.username,
        is_active: true,
        is_admin: false,
        created_at: new Date().toISOString()
      };
      
      // Add tokens for the new user
      mockAuthTokens[userData.username] = {
        access_token: `mock-token-${userData.username}`,
        refresh_token: `mock-refresh-${userData.username}`,
        token_type: 'bearer'
      };
      
      // Store token for automatic login
      localStorage.setItem('token', mockAuthTokens[userData.username].access_token);
      localStorage.setItem('refreshToken', mockAuthTokens[userData.username].refresh_token);
      
      return newUser;
    } else {
      return apiService.post<User>('/register', userData);
    }
  },

  /**
   * Login a user
   */
  login: async (credentials: UserLogin): Promise<AuthTokens> => {
    if (USE_MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user by username
      const user = mockUsers.find(user => user.username === credentials.username);
      
      // Check if user exists and credentials are correct
      // In mock mode, we don't check password for easy testing
      if (!user) {
        return Promise.reject(new Error('Invalid username or password'));
      }
      
      const tokens = mockAuthTokens[credentials.username];
      if (!tokens) {
        return Promise.reject(new Error('Authentication failed'));
      }
      
      // Store tokens in localStorage
      localStorage.setItem('token', tokens.access_token);
      localStorage.setItem('refreshToken', tokens.refresh_token);
      localStorage.setItem('mockUser', credentials.username); // Store username for mock data
      
      return tokens;
    } else {
      const response = await apiService.post<AuthTokens>('/login', credentials);
      
      // Store tokens in localStorage
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      
      return response;
    }
  },

  /**
   * Logout the current user
   */
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('mockUser'); // Remove mock username
  },

  /**
   * Get the current user's profile
   */
  getCurrentUser: async (): Promise<User> => {
    if (USE_MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get username from localStorage
      const username = localStorage.getItem('mockUser');
      
      // Find user by username
      const user = mockUsers.find(user => user.username === username);
      
      if (!user) {
        return Promise.reject(new Error('User not found'));
      }
      
      return user;
    } else {
      return apiService.get<User>('/profile');
    }
  },

  /**
   * Update the current user's profile
   */
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    if (USE_MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get username from localStorage
      const username = localStorage.getItem('mockUser');
      
      // Find user by username
      const userIndex = mockUsers.findIndex(user => user.username === username);
      
      if (userIndex === -1) {
        return Promise.reject(new Error('User not found'));
      }
      
      // Update user data
      const updatedUser = {
        ...mockUsers[userIndex],
        ...userData,
        // Don't allow changing these fields
        id: mockUsers[userIndex].id,
        is_admin: mockUsers[userIndex].is_admin
      };
      
      // In a real implementation we would update the array
      // Here we just return the updated user
      return updatedUser;
    } else {
      return apiService.put<User>('/profile', userData);
    }
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