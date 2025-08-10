'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 认证提供者组件
 * 
 * 功能：
 * - 提供NextAuth.js会话上下文
 * - 管理用户认证状态
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};