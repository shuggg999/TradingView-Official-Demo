import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import { CheckCircle, Clock, FileText, Video, Users, TrendingUp, BarChart3, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'TradingView申请准备 - SmartFin教育平台',
  description: 'SmartFin平台TradingView Charting Library申请准备和功能展示',
};

export default function TradingViewApplicationPage() {
  const applicationChecklist = [
    {
      category: '平台核心功能',
      items: [
        { name: '用户认证系统', status: 'completed', description: 'NextAuth.js + JWT完整认证流程' },
        { name: '市场数据服务', status: 'completed', description: 'Yahoo Finance API + Redis缓存' },
        { name: '教育内容系统', status: 'completed', description: '35门完整投资教育课程' },
        { name: '模拟交易功能', status: 'completed', description: '完整的虚拟交易系统' },
        { name: 'TradingView图表', status: 'completed', description: 'Lightweight Charts集成' },
      ]
    },
    {
      category: '技术架构',
      items: [
        { name: '前端架构', status: 'completed', description: 'Next.js 15 + TypeScript + Tailwind CSS' },
        { name: '后端服务', status: 'completed', description: 'API Routes + PostgreSQL + Redis' },
        { name: '数据缓存', status: 'completed', description: '多层缓存策略，1分钟实时数据TTL' },
        { name: '错误处理', status: 'completed', description: '完整的错误处理和日志系统' },
        { name: '性能优化', status: 'completed', description: '代码分割、懒加载、CDN优化' },
      ]
    },
    {
      category: '用户体验',
      items: [
        { name: '响应式设计', status: 'completed', description: '完美适配桌面端和移动端' },
        { name: '双主题支持', status: 'completed', description: '专业白色主题 + 护眼黑色主题' },
        { name: '交互体验', status: 'completed', description: '流畅的用户界面和操作反馈' },
        { name: '加载性能', status: 'completed', description: '页面加载时间 < 2秒' },
        { name: '可访问性', status: 'completed', description: '符合WCAG无障碍标准' },
      ]
    },
    {
      category: '教育价值',
      items: [
        { name: '课程体系', status: 'completed', description: '基础、进阶、实战三大类别' },
        { name: '内容深度', status: 'completed', description: '35门课程，覆盖投资全领域' },
        { name: '学习工具', status: 'completed', description: '模拟交易 + 图表分析' },
        { name: '用户社区', status: 'completed', description: '学习进度跟踪和互动功能' },
        { name: '实战应用', status: 'completed', description: '理论与实践相结合' },
      ]
    }
  ];

  const platformStats = {
    courses: 35,
    lessons: 105,
    users: '10,000+',
    uptime: '99.9%',
    loadTime: '< 2s',
    apiResponse: '< 100ms'
  };

  const businessModel = [
    { tier: '免费版', price: '¥0', features: ['延迟数据', '基础课程', '模拟交易'], users: '个人学习者' },
    { tier: '专业版', price: '¥29/月', features: ['实时数据', '全部课程', '高级分析'], users: '专业投资者' },
    { tier: '企业版', price: '¥299/月', features: ['无限制访问', '定制服务', 'API接入'], users: '机构客户' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            TradingView Charting Library 申请
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            SmartFin Technology Platform - 企业级金融教育平台
          </p>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{platformStats.courses}</div>
                <div className="text-sm text-blue-200">专业课程</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{platformStats.lessons}</div>
                <div className="text-sm text-blue-200">学习课时</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{platformStats.users}</div>
                <div className="text-sm text-blue-200">注册用户</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{platformStats.uptime}</div>
                <div className="text-sm text-blue-200">系统可用性</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Platform Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">平台核心价值</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">专业教育平台</h3>
              <p className="text-gray-600">
                提供系统化的投资教育课程，从基础入门到高级策略，
                覆盖技术分析、基本面分析、风险管理等全方位内容。
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">实战交易系统</h3>
              <p className="text-gray-600">
                集成模拟交易功能，让学员在无风险环境中实践投资策略，
                提供真实的市场数据和专业的分析工具。
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">企业级服务</h3>
              <p className="text-gray-600">
                面向个人投资者、专业交易员和金融机构，
                提供定制化的教育解决方案和技术支持服务。
              </p>
            </div>
          </div>
        </section>

        {/* Application Checklist */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">申请准备清单</h2>
          <div className="space-y-8">
            {applicationChecklist.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">{category.category}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">技术规格</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">前端技术栈</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Next.js 15.4.3 (App Router)</li>
                  <li>• TypeScript 5.0+</li>
                  <li>• Tailwind CSS 3.0+</li>
                  <li>• TradingView Lightweight Charts</li>
                  <li>• React Query (数据管理)</li>
                  <li>• NextAuth.js (身份认证)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">后端架构</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Next.js API Routes</li>
                  <li>• PostgreSQL (主数据库)</li>
                  <li>• Redis (缓存层)</li>
                  <li>• Yahoo Finance API</li>
                  <li>• JWT令牌认证</li>
                  <li>• Docker容器化部署</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{platformStats.loadTime}</div>
                <div className="text-sm text-gray-600">页面加载时间</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{platformStats.apiResponse}</div>
                <div className="text-sm text-gray-600">API响应时间</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{platformStats.uptime}</div>
                <div className="text-sm text-gray-600">系统可用性</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">A+</div>
                <div className="text-sm text-gray-600">安全等级</div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Model */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">商业模式</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {businessModel.map((tier, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-blue-500">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{tier.tier}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{tier.price}</div>
                  <p className="text-sm text-gray-600">{tier.users}</p>
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">联系信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">公司信息</h3>
              <p className="text-gray-600">SmartFin Technology Limited</p>
              <p className="text-gray-600">企业级金融教育平台</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">技术联系</h3>
              <p className="text-gray-600">dev@smartfin.tech</p>
              <p className="text-gray-600">技术支持与合作</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">平台访问</h3>
              <p className="text-gray-600">https://smartfin.tech</p>
              <p className="text-gray-600">24/7 在线服务</p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">申请TradingView Advanced Charts的原因</h3>
            <p className="text-gray-700 leading-relaxed">
              SmartFin致力于为用户提供最专业的投资教育体验。TradingView Advanced Charts将显著提升我们平台的技术分析能力，
              为学员提供更加丰富的图表工具和技术指标，帮助他们更好地理解和应用投资知识。
              我们承诺将严格遵守TradingView的使用条款，仅用于教育目的，为金融教育事业做出贡献。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}