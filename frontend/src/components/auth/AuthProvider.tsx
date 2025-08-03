'use client';

import React, { useEffect, ReactNode } from 'react';
import { useAuth, startTokenRefresh, stopTokenRefresh } from '@/store/auth';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 认证提供者组件
 * 
 * 功能：
 * - 初始化认证状态
 * - 启动自动token刷新
 * - 提供全局认证上下文
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { initialize, isInitialized, isAuthenticated } = useAuth();

  useEffect(() => {
    // 初始化认证状态
    initialize();
  }, [initialize]);

  useEffect(() => {
    // 如果用户已登录，启动token自动刷新
    if (isAuthenticated) {
      startTokenRefresh();
    } else {
      stopTokenRefresh();
    }

    // 清理函数
    return () => {
      stopTokenRefresh();
    };
  }, [isAuthenticated]);

  // 在初始化完成前显示加载状态
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};