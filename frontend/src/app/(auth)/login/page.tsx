import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth';

export const metadata: Metadata = {
  title: '登录 - SmartFin Technology Platform',
  description: '登录您的SmartFin账户，开始专业的金融数据分析之旅',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">SmartFin</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">首页</Link>
              <Link href="/market" className="text-gray-600 hover:text-gray-900">市场数据</Link>
              <Link href="/education" className="text-gray-600 hover:text-gray-900">投资教育</Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">注册</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-20 pb-12 px-4">
        <div className="w-full max-w-6xl flex">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
            <div className="max-w-md text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  专业金融数据平台
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  为投资者提供实时市场数据、深度分析工具和专业教育内容
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">实时市场数据</h3>
                    <p className="text-sm text-gray-600">全球股票、外汇、期货实时价格</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">专业分析工具</h3>
                    <p className="text-sm text-gray-600">技术指标、图表分析、投资组合管理</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">投资教育</h3>
                    <p className="text-sm text-gray-600">从基础知识到高级策略的全面课程</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  &ldquo;专业的金融数据分析平台，让投资决策更加智能化。&rdquo;
                </p>
                <p className="text-xs text-blue-600 mt-2">— 专业投资顾问</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
            <LoginForm className="w-full max-w-md" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 text-center text-sm text-gray-500">
        <p>&copy; 2025 SmartFin Technology Platform. 保留所有权利。</p>
      </footer>
    </div>
  );
}