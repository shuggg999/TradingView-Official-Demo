'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = '' }: NavigationProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { href: '/', label: '首页' },
    { href: '/market', label: '市场数据' },
    { href: '/education', label: '投资教育' },
    ...(session ? [
      { href: '/trading', label: '模拟交易' },
      { href: '/charts', label: '图表分析' }
    ] : []),
    { href: '/about', label: '关于我们' },
  ];

  return (
    <header className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">SmartFin</h1>
            </Link>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-8 ml-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-1 pt-1 text-sm font-medium ${
                    isActive(item.href)
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse flex space-x-4">
                <div className="rounded bg-gray-200 h-8 w-12"></div>
                <div className="rounded bg-gray-200 h-8 w-16"></div>
              </div>
            ) : session ? (
              // Authenticated state
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  控制台
                </Link>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
                  >
                    {session.user?.image ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={session.user.image}
                        alt={session.user?.name || 'User'}
                      />
                    ) : (
                      <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">
                          {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {session.user?.name || session.user?.email}
                    </span>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    退出
                  </button>
                </div>
              </div>
            ) : (
              // Unauthenticated state
              <>
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}