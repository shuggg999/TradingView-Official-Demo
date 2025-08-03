'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/store/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requiredRole?: string;
  requiredPermissions?: string[];
}

/**
 * 受保护路由组件
 * 
 * 功能：
 * - 验证用户登录状态
 * - 检查用户角色权限
 * - 自动重定向未授权用户
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  redirectTo = '/login',
  requiredRole,
  requiredPermissions = [],
}) => {
  const { isAuthenticated, user, isInitialized, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // 检查角色权限
      if (requiredRole && user?.role !== requiredRole) {
        router.push('/unauthorized');
        return;
      }

      // 检查特定权限
      if (requiredPermissions.length > 0) {
        // TODO: 实现权限检查逻辑
        // const hasPermissions = requiredPermissions.every(permission => 
        //   user?.permissions?.includes(permission)
        // );
        // if (!hasPermissions) {
        //   router.push('/unauthorized');
        //   return;
        // }
      }
    }
  }, [isAuthenticated, user, isInitialized, isLoading, router, redirectTo, requiredRole, requiredPermissions]);

  // 显示加载状态
  if (!isInitialized || isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 用户未登录
  if (!isAuthenticated) {
    return fallback || null;
  }

  // 角色权限不足
  if (requiredRole && user?.role !== requiredRole) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">权限不足</h2>
          <p className="text-gray-600 mb-8">您没有访问此页面的权限</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * 高阶组件：保护页面组件
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  const AuthenticatedComponent = (props: P) => {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

  return AuthenticatedComponent;
}