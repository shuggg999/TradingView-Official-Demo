import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '投资博客 - SmartFin Technology Platform',
  description: '分享专业的投资见解、技术分析技巧和市场动态',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#002244] to-[#000f1e] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            投资博客
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            分享专业的投资见解、技术分析技巧和市场动态，助您提升投资技能
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Coming Soon Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h2 className="text-2xl font-semibold text-blue-900">博客内容即将上线</h2>
            </div>
            <p className="text-blue-800 mb-6">
              我们正在准备高质量的投资教育内容和市场分析文章
            </p>
          </div>

          {/* Planned Content */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">技术分析</h3>
              <p className="text-gray-600 mb-4">
                深度解析各种技术指标和图表形态
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• MACD、RSI等指标详解</li>
                <li>• K线形态识别技巧</li>
                <li>• 趋势线和支撑阻力</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">市场分析</h3>
              <p className="text-gray-600 mb-4">
                及时的市场动态和投资机会分析
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 周度市场回顾</li>
                <li>• 行业热点分析</li>
                <li>• 投资策略分享</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">投资教育</h3>
              <p className="text-gray-600 mb-4">
                从入门到进阶的系统化学习内容
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 新手投资指南</li>
                <li>• 风险管理策略</li>
                <li>• 投资心理学</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">工具介绍</h3>
              <p className="text-gray-600 mb-4">
                各类投资工具和平台的使用指南
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 图表软件教程</li>
                <li>• 数据分析工具</li>
                <li>• API使用指南</li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gray-100 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">抢先体验</h2>
            <p className="text-gray-600 mb-6">
              注册成为会员，第一时间获得最新文章推送
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
              >
                立即注册
              </Link>
              <Link
                href="/education"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-md font-medium"
              >
                查看课程
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}