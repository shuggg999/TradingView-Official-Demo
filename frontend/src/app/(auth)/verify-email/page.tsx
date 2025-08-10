import { Metadata } from 'next';
import { Suspense } from 'react';
import { EmailVerificationForm } from '@/components/auth';

export const metadata: Metadata = {
  title: '邮箱验证 - SmartFin Technology Platform',
  description: '验证您的邮箱地址以完成账户注册',
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">SmartFin</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">返回登录</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-20 pb-12 px-4">
        <div className="w-full max-w-6xl flex">
          {/* Left Side - Steps Guide */}
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
            <div className="max-w-md">
              <div className="mb-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  即将完成注册
                </h1>
                <p className="text-xl text-gray-600">
                  只需验证邮箱，即可开始使用SmartFin的全部功能
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">1. 账户信息已保存</h3>
                    <p className="text-sm text-gray-600">您的基本信息已安全保存到我们的系统中</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">2. 验证邮箱地址</h3>
                    <p className="text-sm text-gray-600">
                      输入我们发送到您邮箱的6位验证码
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mt-1">
                    <span className="text-gray-500 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500 mb-1">3. 开始投资之旅</h3>
                    <p className="text-sm text-gray-400">
                      验证成功后，您就可以登录并使用所有功能了
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">找不到验证邮件？</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• 检查您的垃圾邮件文件夹</p>
                      <p>• 确保邮箱地址拼写正确</p>
                      <p>• 等待几分钟后重试</p>
                      <p>• 可以点击重新发送验证码</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 mb-4">
                  如果您持续遇到问题，请联系我们的客服团队
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="mailto:support@smartfin.tech"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    📧 邮件支持
                  </a>
                  <span className="text-gray-300">|</span>
                  <a
                    href="/help"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    📚 帮助中心
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Verification Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
              <EmailVerificationForm className="w-full max-w-md" />
            </Suspense>
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