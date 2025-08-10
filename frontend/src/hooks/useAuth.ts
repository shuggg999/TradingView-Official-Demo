'use client';

import { useState, useCallback } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { AuthError } from '@/types/auth';

interface RegisterData {
  email: string;
  password: string;
  name?: string;
  username?: string;
  fullName?: string;
  phone?: string;
  agreeToTerms?: boolean;
  preferences?: any;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface PasswordStrength {
  valid: boolean;
  score: number;
  strength: string;
  errors: string[];
  suggestions: string[];
}

export function useAuth() {
  const { data: session, status } = useSession();
  const [error, setError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 登录
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    clearError();
    
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError({
          code: 'LOGIN_FAILED',
          message: result.error,
        });
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return true;
    } catch (error: any) {
      setError({
        code: 'LOGIN_FAILED',
        message: error.message || 'Login failed',
      });
      setIsLoading(false);
      return false;
    }
  }, [clearError]);

  // 注册
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name || data.fullName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError({
          code: result.code || 'REGISTER_FAILED',
          message: result.error || 'Registration failed',
        });
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return true;
    } catch (error: any) {
      setError({
        code: 'REGISTER_FAILED',
        message: error.message || 'Registration failed',
      });
      setIsLoading(false);
      return false;
    }
  }, [clearError]);

  // 登出
  const logout = useCallback(async () => {
    setIsLoading(true);
    clearError();
    
    try {
      await signOut({ redirect: false });
      setIsLoading(false);
      return true;
    } catch (error: any) {
      setError({
        code: 'LOGOUT_FAILED',
        message: error.message || 'Logout failed',
      });
      setIsLoading(false);
      return false;
    }
  }, [clearError]);

  // 检查密码强度
  const checkPasswordStrength = useCallback(async (
    password: string,
    username?: string,
    email?: string
  ): Promise<PasswordStrength> => {
    try {
      const response = await fetch('/api/auth/password-strength', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          username,
          email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Password strength check failed');
      }

      return result.data;
    } catch (error: any) {
      // 如果API失败，返回基础检查结果
      return {
        valid: password.length >= 8,
        score: password.length >= 8 ? 3 : 1,
        strength: password.length >= 8 ? '一般' : '弱',
        errors: password.length >= 8 ? [] : ['密码至少需要8个字符'],
        suggestions: password.length >= 8 ? [] : ['增加密码长度'],
      };
    }
  }, []);

  // 忘记密码
  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError({
          code: result.code || 'FORGOT_PASSWORD_FAILED',
          message: result.error || 'Failed to send reset email',
        });
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return true;
    } catch (error: any) {
      setError({
        code: 'FORGOT_PASSWORD_FAILED',
        message: error.message || 'Failed to send reset email',
      });
      setIsLoading(false);
      return false;
    }
  }, [clearError]);

  // 重置密码
  const resetPassword = useCallback(async (
    token: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password,
          confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError({
          code: result.code || 'RESET_PASSWORD_FAILED',
          message: result.error || 'Failed to reset password',
        });
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return true;
    } catch (error: any) {
      setError({
        code: 'RESET_PASSWORD_FAILED',
        message: error.message || 'Failed to reset password',
      });
      setIsLoading(false);
      return false;
    }
  }, [clearError]);

  return {
    // 状态
    user: session?.user || null,
    isLoading: status === 'loading' || isLoading,
    isAuthenticated: !!session,
    error,
    
    // 方法
    login,
    register,
    logout,
    clearError,
    checkPasswordStrength,
    forgotPassword,
    resetPassword,
  };
}