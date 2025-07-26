'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, RegisterData, AuthError } from '@/types/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: Implement actual login API call
      console.log('Login attempt:', credentials);
      
      // Temporary mock response
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        username: 'user',
        fullName: 'Test User',
        emailVerified: true,
        isActive: true,
        role: 'FREE_USER' as any,
        subscriptionTier: 'FREE' as any,
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          notifications: {
            email: true,
            push: false,
            marketAlerts: true,
            priceAlerts: true,
            newsUpdates: false,
          },
          trading: {
            defaultCurrency: 'USD',
            riskTolerance: 'medium',
            investmentGoals: [],
            preferredMarkets: [],
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          code: 'LOGIN_FAILED',
          message: error.message || 'Login failed',
        },
      }));
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: Implement actual register API call
      console.log('Register attempt:', data);
      
      // Simulate registration success
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          code: 'REGISTER_FAILED',
          message: error.message || 'Registration failed',
        },
      }));
    }
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // TODO: Implement actual logout API call
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: error.message || 'Logout failed',
        },
      }));
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // TODO: Implement token refresh logic
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: {
          code: 'REFRESH_FAILED',
          message: error.message || 'Session refresh failed',
        },
      });
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return {
    ...state,
    login,
    register,
    logout,
    refreshAuth,
  };
}