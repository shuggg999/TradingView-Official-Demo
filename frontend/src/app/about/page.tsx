import Link from 'next/link'
import { Target, Users, BookOpen, Shield, TrendingUp, Award } from 'lucide-react'
import { Metadata } from 'next'
import PageLayout from '@/components/layout/PageLayout'

export const metadata: Metadata = {
  title: '关于我们 - SmartFin Technology',
  description: '了解SmartFin Technology的使命、愿景和价值观，为投资者提供专业、免费的金融教育服务。',
}

export default function AboutPage() {
  return (
    <PageLayout>
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#003366] to-[#000f1e] text-white">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            关于SmartFin Technology
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto">
            致力于提升大众金融素养，打造专业、免费的投资教育平台
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Target className="h-6 w-6 text-[#003366]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">我们的使命</h3>
              </div>
              <p className="text-gray-600 mb-4">
                透过免费、专业的金融教育，帮助更多人掌握投资知识和技能，实现财富的稳健增长。
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 提供系统化的投资教育课程</li>
                <li>• 普及正确的投资理念和方法</li>
                <li>• 帮助投资者避免常见错误</li>
                <li>• 提升整个社会的金融素养</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Award className="h-6 w-6 text-[#003366]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">我们的愿景</h3>
              </div>
              <p className="text-gray-600 mb-4">
                成为中国领先的互联网金融教育平台，让每个普通人都能获得专业的投资教育。
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 打破金融教育的门槛和壁垒</li>
                <li>• 让优质教育资源惠及更多人群</li>
                <li>• 培养理性、成熟的投资者</li>
                <li>• 促进金融市场健康发展</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">核心价值观</h2>
            <p className="text-gray-600">
              指导我们行动的基本原则和信念
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center">
              <div className="mx-auto p-3 bg-blue-50 rounded-full w-fit mb-4">
                <BookOpen className="h-8 w-8 text-[#003366]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">专业至上</h3>
              <p className="text-gray-600">
                始终坚持专业标准，提供科学、准确的投资知识和方法。
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center">
              <div className="mx-auto p-3 bg-green-50 rounded-full w-fit mb-4">
                <Shield className="h-8 w-8 text-[#00AA44]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">免费公益</h3>
              <p className="text-gray-600">
                所有核心教育内容完全免费，让知识不再成为少数人的特权。
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center">
              <div className="mx-auto p-3 bg-purple-50 rounded-full w-fit mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">用户至上</h3>
              <p className="text-gray-600">
                以用户需求为中心，不断优化学习体验和教育质量。
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择我们</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="text-3xl font-bold text-[#003366] mb-2">100%</div>
              <div className="text-sm text-gray-600">免费承诺</div>
            </div>
            <div className="text-center bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="text-3xl font-bold text-[#003366] mb-2">10万+</div>
              <div className="text-sm text-gray-600">用户信赖</div>
            </div>
            <div className="text-center bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="text-3xl font-bold text-[#003366] mb-2">50+</div>
              <div className="text-sm text-gray-600">专业课程</div>
            </div>
            <div className="text-center bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="text-3xl font-bold text-[#003366] mb-2">24/7</div>
              <div className="text-sm text-gray-600">在线学习</div>
            </div>
          </div>
        </section>

        {/* TradingView Integration */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-[#003366]" />
              </div>
              <h3 className="text-2xl font-bold text-[#003366]">专业工具支持</h3>
            </div>
            <p className="text-[#003366] mb-6">
              我们正在申请集成 TradingView 企业级高级图表库，为学习者提供业界顶级的技术分析工具。
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-[#003366] mb-3">教育价值</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 100+ 专业技术指标教学</li>
                  <li>• 绘图工具实战练习</li>
                  <li>• 历史数据回放分析</li>
                  <li>• 多时间周期对比学习</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-[#003366] mb-3">免费承诺</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 所有功能对学习者完全免费</li>
                  <li>• 无付费会员制度</li>
                  <li>• 纯教育目的，非商业交易</li>
                  <li>• 专业服务维持运营</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center mb-16">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">联系我们</h3>
            <p className="text-gray-600 mb-6">
              有任何问题或建议，欢迎随时与我们联系
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/feedback" 
                className="px-6 py-3 bg-[#003366] text-white rounded-lg font-semibold hover:bg-[#000f1e] transition-colors"
              >
                反馈建议
              </Link>
              <Link 
                href="/community" 
                className="px-6 py-3 border-2 border-[#003366] text-[#003366] rounded-lg font-semibold hover:bg-[#003366] hover:text-white transition-colors"
              >
                加入交流群
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center">
            <div className="text-2xl font-semibold text-[#003366] mb-4">
              SmartFin Technology
            </div>
            <p className="text-gray-600 mb-6">
              专业的金融数据分析与投资者教育平台
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <Link href="/education" className="hover:text-[#003366]">课程中心</Link>
              <Link href="/practice" className="hover:text-[#003366]">实操训练</Link>
              <Link href="/community" className="hover:text-[#003366]">学习社区</Link>
              <Link href="/about" className="hover:text-[#003366]">关于我们</Link>
            </div>
            <div className="mt-6 text-xs text-gray-400">
              © 2025 SmartFin Technology. 保留所有权利。
            </div>
          </div>
        </div>
      </footer>
    </PageLayout>
  )
}