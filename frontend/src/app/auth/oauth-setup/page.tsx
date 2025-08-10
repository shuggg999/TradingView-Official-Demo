'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SetupFormData {
  username: string;
  agreeToTerms: boolean;
}

export default function OAuthSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState<SetupFormData>({
    username: '',
    agreeToTerms: false,
  });
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 自动生成用户名
  useEffect(() => {
    if (session?.user?.email && !formData.username) {
      const emailPrefix = session.user.email.split('@')[0];
      const cleanUsername = emailPrefix.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      if (cleanUsername.length >= 3) {
        setFormData(prev => ({
          ...prev,
          username: cleanUsername
        }));
      }
    }
  }, [session, formData.username]);

  // 如果未登录，重定向到登录页
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 表单验证
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 用户名验证
    if (!formData.username) {
      errors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      errors.username = '用户名至少3个字符';
    } else if (formData.username.length > 20) {
      errors.username = '用户名不能超过20个字符';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = '用户名只能包含字母、数字和下划线';
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

    setIsLoading(true);
    setError(null);

    try {
      // 这里应该调用API保存用户偏好设置
      // 现在我们直接跳转到dashboard，因为OAuth用户已经通过NextAuth创建了
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 跳转到dashboard
      router.push('/dashboard/portfolio');
    } catch (error) {
      console.error('Setup failed:', error);
      setError('设置失败，请稍后重试');
    } finally {
      setIsLoading(false);
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // 将会重定向
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Simple Header for OAuth Setup */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">SmartFin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-20 pb-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="text-center mb-8">
              {/* 用户头像和信息 */}
              <div className="mb-6">
                {session?.user?.image && (
                  <img
                    className="mx-auto h-20 w-20 rounded-full"
                    src={session.user.image}
                    alt={session.user?.name || 'User'}
                  />
                )}
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  欢迎, {session?.user?.name}!
                </h2>
                <p className="text-gray-600 mt-2">
                  完善您的账户信息以继续
                </p>
              </div>

              {/* OAuth 提供商信息 */}
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <div className="flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-green-800">
                    已通过 OAuth 成功认证
                  </p>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  邮箱: {session?.user?.email}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 错误信息 */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 用户名设置 */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  设置用户名
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    validationErrors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="请输入用户名"
                />
                {validationErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  用户名将用于显示和系统标识，可以稍后在设置中修改
                </p>
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

              {/* 完成设置按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                    </svg>
                    正在设置...
                  </div>
                ) : (
                  '完成设置并进入'
                )}
              </button>

              {/* 功能预览 */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">您即将获得：</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    个人投资组合管理
                  </li>
                  <li className="flex items-center">
                    <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    实时市场数据访问
                  </li>
                  <li className="flex items-center">
                    <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    专业分析工具
                  </li>
                  <li className="flex items-center">
                    <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    投资教育内容
                  </li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}