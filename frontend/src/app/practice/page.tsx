'use client';

import Link from 'next/link';
import { Play, BarChart3, TrendingUp, Target, Award, BookOpen } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const practiceModules = [
  {
    id: 1,
    title: 'K线图识别训练',
    description: '学习识别各种K线形态，掌握市场情绪判断技巧',
    difficulty: '入门',
    duration: '30分钟',
    icon: BarChart3,
    completed: false,
    topics: ['单根K线形态', '组合K线形态', '反转信号识别', '趋势延续形态']
  },
  {
    id: 2,
    title: '技术指标应用',
    description: '通过实际案例学习各种技术指标的正确使用方法',
    difficulty: '进阶',
    duration: '45分钟',
    icon: TrendingUp,
    completed: false,
    topics: ['移动平均线', 'MACD指标', 'RSI强弱指标', 'KDJ随机指标']
  },
  {
    id: 3,
    title: '趋势线绘制练习',
    description: '掌握支撑阻力位判断和趋势线绘制技巧',
    difficulty: '进阶',
    duration: '40分钟',
    icon: Target,
    completed: false,
    topics: ['支撑阻力位', '趋势线绘制', '通道分析', '突破确认']
  },
  {
    id: 4,
    title: '模拟交易实战',
    description: '在安全的模拟环境中进行真实交易练习',
    difficulty: '高级',
    duration: '60分钟',
    icon: Award,
    completed: false,
    topics: ['买入时机判断', '止损止盈设置', '仓位管理', '风险控制']
  }
];

const achievements = [
  { name: 'K线大师', description: '完成所有K线识别训练', progress: 75 },
  { name: '指标专家', description: '掌握10个技术指标应用', progress: 60 },
  { name: '趋势猎手', description: '准确识别市场趋势变化', progress: 40 },
  { name: '风控高手', description: '模拟交易无重大亏损', progress: 85 }
];

export default function PracticePage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#002244] to-[#003366] text-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              实操训练中心
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              通过互动式练习和模拟交易，在安全环境中提升您的实战技能
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">500+</div>
                <div className="text-sm">练习题目</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">50万</div>
                <div className="text-sm">模拟资金</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">实时</div>
                <div className="text-sm">市场数据</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Modules */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">训练模块</h2>
            <p className="text-lg text-gray-600">
              从基础到高级，循序渐进地提升您的交易技能
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {practiceModules.map((module) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {module.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          module.difficulty === '入门' ? 'bg-green-100 text-green-700' :
                          module.difficulty === '进阶' ? 'bg-blue-100 text-blue-700' :
                          'bg-[#002244] text-white'
                        }`}>
                          {module.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{module.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">训练内容：</h4>
                        <div className="flex flex-wrap gap-2">
                          {module.topics.map((topic, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>⏱️ {module.duration}</span>
                        </div>
                        <button className="px-6 py-2 bg-[#002244] text-white rounded-lg hover:bg-[#001122] transition-all flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          开始练习
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simulated Trading */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                模拟交易环境
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                在真实市场数据驱动的模拟环境中练习交易，无需承担真实资金风险
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">50万虚拟资金进行练习</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">实时市场数据和价格波动</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">完整的买卖交易流程体验</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">详细的交易记录和分析报告</span>
                </div>
              </div>

              <div className="mt-8">
                <button className="px-8 py-4 bg-[#002244] text-white rounded-lg hover:bg-[#001122] transition-all font-semibold">
                  进入模拟交易
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">当前账户状态</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">总资产</span>
                  <span className="text-2xl font-bold text-gray-900">¥508,650</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">当日盈亏</span>
                  <span className="text-lg font-semibold text-green-600">+¥8,650 (+1.73%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">持仓数量</span>
                  <span className="text-lg font-semibold text-gray-900">3只股票</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">可用资金</span>
                  <span className="text-lg font-semibold text-gray-900">¥156,420</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium mb-3">近期交易表现</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>成功率</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>平均持仓时间</span>
                    <span className="font-medium">3.2天</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>最大回撤</span>
                    <span className="font-medium text-red-600">-2.1%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">学习成就</h2>
            <p className="text-lg text-gray-600">
              追踪您的学习进度，解锁各种技能成就
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{achievement.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                  
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 mt-2 block">
                      {achievement.progress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">推荐学习路径</h2>
            <p className="text-lg text-gray-600">
              根据您的练习表现，为您推荐合适的课程
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">理论学习</h3>
                <p className="text-gray-600 mb-4">系统学习技术分析理论基础</p>
                <Link href="/education" className="text-blue-600 hover:text-blue-700 font-medium">
                  查看课程 →
                </Link>
              </div>
              
              <div className="text-center">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">实战练习</h3>
                <p className="text-gray-600 mb-4">在模拟环境中应用所学知识</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  继续练习 →
                </button>
              </div>
              
              <div className="text-center">
                <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">社区交流</h3>
                <p className="text-gray-600 mb-4">与其他用户分享经验心得</p>
                <Link href="/community" className="text-green-600 hover:text-green-700 font-medium">
                  加入社区 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">开始您的实战训练</h2>
          <p className="text-xl text-gray-300 mb-8">
            理论学习很重要，但实战练习更关键。立即开始您的技能提升之旅！
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              开始免费练习
            </button>
            <Link 
              href="/education" 
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all"
            >
              查看相关课程
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}