import Link from 'next/link';
import { EducationNotice } from '@/components/ui/EducationNotice';
import { LearningNeeds } from '@/components/ui/LearningNeeds';
import Navigation from '@/components/layout/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header Container */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Education Notice */}
        <EducationNotice />
        
        {/* Navigation */}
        <Navigation />
      </div>

      {/* Spacer for fixed header - Urgent notification (~48px) + Nav (64px) */}
      <div className="h-28"></div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#002244] to-[#000f1e] text-white py-24">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            专业投资教育平台
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto">
            为投资者提供系统化的技术分析教育、实战培训和专业图表工具学习
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="px-8 py-4 bg-white text-[#002244] rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              免费开始
            </Link>
            <Link 
              href="/education" 
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#002244] transition-all"
            >
              查看课程
            </Link>
          </div>
        </div>
      </section>


      {/* Learning Needs */}
      <LearningNeeds />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">专业级金融服务</h2>
            <p className="text-xl text-gray-600">打造最专业的投资教育和技术分析学习平台</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">系统化课程</h3>
              <p className="text-gray-600 mb-4">
                从基础入门到高级策略，全面系统的投资和技术分析课程体系
              </p>
              <Link href="/education" className="text-[#002244] font-medium hover:underline">
                查看课程 →
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">实操训练</h3>
              <p className="text-gray-600 mb-4">
                提供交互式图表工具和模拟交易环境，让学习更加生动有效
              </p>
              <Link href="/practice" className="text-[#002244] font-medium hover:underline">
                开始练习 →
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">学习社区</h3>
              <p className="text-gray-600 mb-4">
                与其他用户交流互动，分享学习心得，获得专业导师指导
              </p>
              <Link href="/community" className="text-[#002244] font-medium hover:underline">
                加入社区 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#002244] mb-2">10,000+</div>
              <div className="text-gray-600">注册用户</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#002244] mb-2">200+</div>
              <div className="text-gray-600">专业课程</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#002244] mb-2">95%</div>
              <div className="text-gray-600">用户满意度</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#002244] mb-2">24/7</div>
              <div className="text-gray-600">在线学习支持</div>
            </div>
          </div>
        </div>
      </section>

      {/* TradingView Integration */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-[#002244] text-white">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block mb-8">
            <p className="font-bold">📚 教学提升：正在申请TradingView高级图表库访问权限</p>
          </div>
          <h2 className="text-4xl font-bold mb-6">提升教学质量的必然选择</h2>
          <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto">
            为了给用户提供更专业、更全面的技术分析教育，我们需要升级到TradingView级别的图表工具
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-orange-900/20 border-2 border-orange-500 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-orange-300">当前教学限制（Lightweight Charts）</h3>
              <ul className="text-gray-200 space-y-2 text-left">
                <li className="text-orange-300">× 仅10个基础指标，无法教授完整技术分析</li>
                <li className="text-orange-300">× 缺少绘图工具，无法演示趋势线绘制</li>
                <li className="text-orange-300">× 界面过于简化，与真实交易环境差异大</li>
                <li className="text-orange-300">× 无法教授高级分析技巧</li>
              </ul>
            </div>
            
            <div className="bg-green-900/20 border-2 border-green-500 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-green-300">教学目标（TradingView Advanced Charts）</h3>
              <ul className="text-gray-200 space-y-2 text-left">
                <li className="text-green-300">✓ 100+专业指标，完整技术分析教学体系</li>
                <li className="text-green-300">✓ 完整绘图工具，教授专业分析技巧</li>
                <li className="text-green-300">✓ 专业界面，让用户适应真实环境</li>
                <li className="text-green-300">✓ 高级功能，提升学习效果</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">开始您的专业投资学习之旅</h2>
          <p className="text-xl text-gray-600 mb-8">
            加入我们的学习平台，掌握专业的技术分析技能和投资策略
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="px-8 py-4 bg-[#002244] text-white rounded-lg font-semibold hover:bg-[#001122] transition-all"
            >
              免费注册
            </Link>
            <Link 
              href="/education" 
              className="px-8 py-4 border-2 border-[#002244] text-[#002244] rounded-lg font-semibold hover:bg-[#002244] hover:text-white transition-all"
            >
              查看所有课程
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-semibold mb-4">SmartFin Education</div>
              <p className="text-gray-400 text-sm">
                专业投资教育平台，为用户提供系统化的技术分析教育和实战培训。
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">学习资源</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/education" className="hover:text-white">课程中心</Link></li>
                <li><Link href="/practice" className="hover:text-white">实操训练</Link></li>
                <li><Link href="/community" className="hover:text-white">学习社区</Link></li>
                <li><Link href="/blog" className="hover:text-white">投资博客</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">公司信息</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">关于我们</Link></li>
                <li><Link href="/contact" className="hover:text-white">联系我们</Link></li>
                <li><Link href="/careers" className="hover:text-white">招聘信息</Link></li>
                <li><Link href="/news" className="hover:text-white">新闻动态</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">帮助支持</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white">帮助中心</Link></li>
                <li><Link href="/api-docs" className="hover:text-white">API文档</Link></li>
                <li><Link href="/privacy" className="hover:text-white">隐私政策</Link></li>
                <li><Link href="/terms" className="hover:text-white">服务条款</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 SmartFin Education Platform. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}