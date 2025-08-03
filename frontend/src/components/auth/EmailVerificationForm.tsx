'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/store/auth';

interface EmailVerificationFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
}

/**
 * 邮箱验证表单组件
 * 
 * 功能：
 * - 邮箱验证码输入
 * - 自动发送验证码
 * - 重新发送验证码
 * - 验证码倒计时
 */
export const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  onSuccess,
  redirectTo = '/login',
  className = '',
}) => {
  const { verifyEmail, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get('email') || '';
  const [verificationCode, setVerificationCode] = useState('');
  const [validationError, setValidationError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 表单验证
  const validateForm = (): boolean => {
    if (!verificationCode) {
      setValidationError('请输入验证码');
      return false;
    }
    
    if (verificationCode.length !== 6) {
      setValidationError('验证码应为6位数字');
      return false;
    }
    
    if (!/^\d{6}$/.test(verificationCode)) {
      setValidationError('验证码只能包含数字');
      return false;
    }
    
    setValidationError('');
    return true;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    clearError();
    
    const success = await verifyEmail(email, verificationCode);
    
    if (success) {
      onSuccess?.();
      router.push(redirectTo);
    }
  };

  // 重新发送验证码
  const handleResendCode = async () => {
    if (countdown > 0 || isResending) {
      return;
    }

    setIsResending(true);
    clearError();

    try {
      // TODO: 调用重新发送验证码的API
      // await resendVerificationCode(email);
      console.log('Resending verification code to:', email);
      
      setCountdown(60); // 设置60秒倒计时
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Failed to resend verification code:', error);
    } finally {
      setIsResending(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // 只允许数字，最多6位
    setVerificationCode(value);
    
    if (validationError) {
      setValidationError('');
    }
  };

  // 自动分割验证码显示
  const formatVerificationCode = (code: string): string => {
    return code.replace(/(\d{3})(\d{3})/, '$1 $2');
  };

  if (!email) {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">缺少邮箱信息</h2>
          <p className="text-gray-600 mb-6">
            无法确定需要验证的邮箱地址，请重新注册或联系客服。
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            重新注册
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">验证邮箱</h2>
          <p className="text-gray-600 mb-2">
            我们已向以下邮箱发送了验证码
          </p>
          <p className="text-blue-600 font-medium">{email}</p>
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

          {/* 验证码输入 */}
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
              验证码
            </label>
            <input
              id="verificationCode"
              name="verificationCode"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={formatVerificationCode(verificationCode)}
              onChange={handleInputChange}
              className={`appearance-none block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono tracking-widest ${
                validationError ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="000 000"
              maxLength={7} // 6位数字 + 1个空格
            />
            {validationError && (
              <p className="mt-1 text-sm text-red-600">{validationError}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              请输入6位数字验证码
            </p>
          </div>

          {/* 验证按钮 */}
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
                验证中...
              </div>
            ) : (
              '验证邮箱'
            )}
          </button>

          {/* 重新发送验证码 */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              没有收到验证码？
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={countdown > 0 || isResending}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                  </svg>
                  发送中...
                </span>
              ) : countdown > 0 ? (
                `重新发送 (${countdown}s)`
              ) : (
                '重新发送验证码'
              )}
            </button>
          </div>

          {/* 提示信息 */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">温馨提示</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>验证码有效期为10分钟</li>
                    <li>请检查垃圾邮件文件夹</li>
                    <li>如果仍未收到，请联系客服</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 返回登录 */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-500"
            >
              ← 返回登录页面
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};