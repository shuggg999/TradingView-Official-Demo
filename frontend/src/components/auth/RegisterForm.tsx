'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth';

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
}

interface PasswordStrength {
  valid: boolean;
  score: number;
  strength: string;
  errors: string[];
  suggestions: string[];
}

/**
 * 简化的注册表单组件
 * 
 * 功能：
 * - 简化的用户注册（邮箱 + 密码 + 可选用户名）
 * - 实时密码强度验证
 * - OAuth 快速注册
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  redirectTo = '/verify-email',
  className = '',
}) => {
  const { register, checkPasswordStrength, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);

  // 自动生成用户名
  useEffect(() => {
    if (formData.email && !formData.username) {
      const emailPrefix = formData.email.split('@')[0];
      const cleanUsername = emailPrefix.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      if (cleanUsername.length >= 3) {
        setFormData(prev => ({
          ...prev,
          username: cleanUsername
        }));
      }
    }
  }, [formData.email, formData.username]);

  // 密码强度检查防抖
  useEffect(() => {
    if (formData.password.length >= 6) {
      const timeoutId = setTimeout(async () => {
        setIsCheckingPassword(true);
        try {
          const strength = await checkPasswordStrength(
            formData.password,
            formData.username,
            formData.email
          );
          setPasswordStrength(strength);
        } catch (error) {
          console.error('Password strength check failed:', error);
        } finally {
          setIsCheckingPassword(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setPasswordStrength(null);
    }
  }, [formData.password, formData.username, formData.email, checkPasswordStrength]);

  // 表单验证
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 邮箱验证
    if (!formData.email) {
      errors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }

    // 用户名验证（可选，但如果填写需要验证）
    if (formData.username && formData.username.length < 3) {
      errors.username = '用户名至少3个字符';
    } else if (formData.username && formData.username.length > 20) {
      errors.username = '用户名不能超过20个字符';
    } else if (formData.username && !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = '用户名只能包含字母、数字和下划线';
    }

    // 密码验证
    if (!formData.password) {
      errors.password = '请输入密码';
    } else if (formData.password.length < 8) {
      errors.password = '密码至少8位';
    } else if (passwordStrength && !passwordStrength.valid) {
      errors.password = '密码强度不足，请参考下方建议';
    }

    // 确认密码验证
    if (!formData.confirmPassword) {
      errors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致';
    }

    // 服务条款验证
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = '请阅读并同意服务条款';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    clearError();
    
    const success = await register({
      email: formData.email,
      password: formData.password,
      name: formData.username || formData.email.split('@')[0], // 使用用户名或邮箱前缀作为显示名
    });
    
    if (success) {
      onSuccess?.();
      router.push(`${redirectTo}?email=${encodeURIComponent(formData.email)}`);
    }
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // 清除相关字段的验证错误
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // 获取密码强度颜色
  const getPasswordStrengthColor = (score: number): string => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">创建账户</h2>
          <p className="text-gray-600">快速开始您的投资之旅</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 全局错误信息 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* 邮箱输入 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              邮箱地址
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                validationErrors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="请输入邮箱地址"
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>

          {/* 用户名输入（可选） */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              用户名 <span className="text-gray-400 text-xs">(可选，会自动生成)</span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                validationErrors.username ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="系统会自动生成"
            />
            {validationErrors.username && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
            )}
          </div>

          {/* 密码输入 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                validationErrors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="请输入密码（至少8位）"
            />
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
            )}

            {/* 密码强度指示器 */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            passwordStrength && passwordStrength.score >= level
                              ? getPasswordStrengthColor(passwordStrength.score)
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {isCheckingPassword ? '检查中...' : passwordStrength?.strength || ''}
                  </span>
                </div>

                {/* 密码强度提示 */}
                {passwordStrength && !passwordStrength.valid && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium text-red-600">密码强度不足：</p>
                    {passwordStrength.errors.slice(0, 2).map((error, index) => (
                      <p key={index} className="text-xs text-red-600">• {error}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 确认密码输入 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              确认密码
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="请再次输入密码"
            />
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
            )}
          </div>

          {/* 服务条款同意 */}
          <div>
            <div className="flex items-start">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                我已阅读并同意{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
                  服务条款
                </Link>
                {' '}和{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
                  隐私政策
                </Link>
              </label>
            </div>
            {validationErrors.agreeToTerms && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.agreeToTerms}</p>
            )}
          </div>

          {/* 注册按钮 */}
          <button
            type="submit"
            disabled={isLoading || isCheckingPassword}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                </svg>
                创建中...
              </div>
            ) : (
              '创建账户'
            )}
          </button>

          {/* OAuth 快速注册区域 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或者快速注册</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => signIn('google', { callbackUrl: '/auth/oauth-setup' })}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => signIn('github', { callbackUrl: '/auth/oauth-setup' })}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="ml-2">GitHub</span>
              </button>
            </div>
          </div>

          {/* 登录链接 */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              已有账户？{' '}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                立即登录
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};