import Navigation from '@/components/Navigation'
import { StockMarketData, CryptoMarketData, IndexMarketData } from '@/components/MarketData'
import { BookOpen, TrendingUp, Calculator } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-slate-700/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkzQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJtMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydC00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-sm font-medium mb-4">
                🎯 专业金融教育平台
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              免费学习投资
              <br />
              <span className="text-white">提升财商素养</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              专业级图表分析，系统化投资教育。帮助每一位投资者理性决策，实现财富增长。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <div className="group bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <span className="text-sm font-semibold text-white flex items-center">
                  <span className="w-2 h-2 bg-primary-foreground rounded-full mr-2 animate-pulse"></span>
                  ✓ 完全免费
                </span>
              </div>
              <div className="group bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <span className="text-sm font-semibold text-white flex items-center">
                  <span className="w-2 h-2 bg-primary-foreground rounded-full mr-2 animate-pulse"></span>
                  ✓ 专业教学
                </span>
              </div>
              <div className="group bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <span className="text-sm font-semibold text-white flex items-center">
                  <span className="w-2 h-2 bg-primary-foreground rounded-full mr-2 animate-pulse"></span>
                  ✓ 实用工具
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/education"
                className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  🎓 开始学习
                </span>
              </Link>
              <Link
                href="/market"
                className="group px-10 py-4 border-2 border-blue-400 text-blue-300 rounded-xl font-bold text-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                📊 查看市场数据
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-background to-background/90">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group text-center bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-border">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-3">100,000+</div>
              <div className="text-foreground/70 font-medium flex items-center justify-center">
                👥 用户学习
              </div>
            </div>
            <div className="group text-center bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-border">
              <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">500+</div>
              <div className="text-foreground/70 font-medium flex items-center justify-center">
                📚 教育文章
              </div>
            </div>
            <div className="group text-center bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-border">
              <div className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3">50+</div>
              <div className="text-foreground/70 font-medium flex items-center justify-center">
                📈 技术指标
              </div>
            </div>
            <div className="group text-center bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-border">
              <div className="text-4xl font-black bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-3">100%</div>
              <div className="text-foreground/70 font-medium flex items-center justify-center">
                🎁 免费使用
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-background/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-slate-800/10 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white text-sm font-medium mb-6">
              🌟 平台优势
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                为什么选择智投教育？
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              我们致力于为每一位投资者提供专业、免费、实用的金融教育服务
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="group bg-card p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-border relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">系统化教学</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  从投资基础到高级策略，构建完整的知识体系，让学习更有效率。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    新手入门指南
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    技术分析进阶
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    风险管理专题
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    实战案例分析
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group bg-card p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-border relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">专业级图表</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  即将集成TradingView高级图表库，提供专业的技术分析工具。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    100+ 技术指标
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    专业绘图工具
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    多时间周期分析
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    历史数据回放
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group bg-card p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-border relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calculator className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">实用工具</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  丰富的投资计算器和学习工具，让理论知识与实践相结合。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    复利计算器
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    风险评估工具
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    资产配置建议
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    模拟交易练习
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Data Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              🚀 实时市场数据
            </h2>
            <p className="text-xl text-muted-foreground">
              体验真实的市场数据，为 TradingView 专业图表集成做准备
            </p>
          </div>
          
          {/* 主要市场数据展示 */}
          <div className="mb-12">
            <StockMarketData />
          </div>
          
          {/* 其他市场数据 */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <CryptoMarketData />
            <IndexMarketData />
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-6 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600 mb-4">
                💡 这只是开始！TradingView 高级图表集成后，您将获得：
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center justify-center">
                  📊 100+ 技术指标
                </div>
                <div className="flex items-center justify-center">
                  ✏️ 专业绘图工具
                </div>
                <div className="flex items-center justify-center">
                  ⏰ 多时间周期
                </div>
                <div className="flex items-center justify-center">
                  🎬 历史回放功能
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            开启你的投资学习之旅
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            加入数十万用户的学习社区，从基础知识到高级策略，全程免费指导
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/education"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors border border-primary-500"
            >
              免费开始学习
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 border-2 border-gray-400 text-gray-200 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition-colors"
            >
              了解更多
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-8 w-8 text-primary-400" />
                <span className="text-xl font-bold">智投教育</span>
              </div>
              <p className="text-gray-400 mb-4">
                专业的免费金融教育平台，致力于提升大众投资素养。
              </p>
              <div className="text-sm text-gray-500">
                © 2025 智投教育. 保留所有权利.
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">学习中心</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/education" className="hover:text-white">投资基础</Link></li>
                <li><Link href="/education" className="hover:text-white">技术分析</Link></li>
                <li><Link href="/education" className="hover:text-white">风险管理</Link></li>
                <li><Link href="/education" className="hover:text-white">实战案例</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">市场数据</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/market" className="hover:text-white">股票市场</Link></li>
                <li><Link href="/market" className="hover:text-white">外汇市场</Link></li>
                <li><Link href="/market" className="hover:text-white">加密货币</Link></li>
                <li><Link href="/analysis" className="hover:text-white">技术分析</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">关于我们</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">公司介绍</Link></li>
                <li><Link href="/about" className="hover:text-white">教育理念</Link></li>
                <li><Link href="/about" className="hover:text-white">免费承诺</Link></li>
                <li><Link href="/about" className="hover:text-white">联系我们</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
