import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User, UserLogin, UserCreate } from '../types/models';

// For development - auto login with a test user
const AUTO_LOGIN = false;
const TEST_USER = {
  username: 'user',
  password: 'password'
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error('Failed to fetch user data:', err);
          authService.logout();
        }
      } else if (AUTO_LOGIN) {
        // Auto login for development
        try {
          await authService.login(TEST_USER);
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error('Auto login failed:', err);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: UserLogin) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(credentials);
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      setError('Invalid username or password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: UserCreate) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(userData);
      await login({ 
        username: userData.username, 
        password: userData.password 
      });
    } catch (err) {
      setError('Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
    } catch (err) {
      setError('Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 