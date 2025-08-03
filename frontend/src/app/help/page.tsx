'use client';

import { useState } from 'react';
import { Search, ChevronRight, ChevronDown, BookOpen, MessageCircle, Phone, Mail, HelpCircle, User, CreditCard, Settings, Monitor, AlertCircle, CheckCircle } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const helpCategories = [
  {
    id: 'getting-started',
    title: '新手入门',
    icon: BookOpen,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: '平台使用基础指南',
    articles: [
      { id: 1, title: '如何注册账户', views: 1250, helpful: 95 },
      { id: 2, title: '完善个人资料设置', views: 890, helpful: 88 },
      { id: 3, title: '选择适合的学习路径', views: 1150, helpful: 92 },
      { id: 4, title: '了解平台功能概览', views: 780, helpful: 90 }
    ]
  },
  {
    id: 'courses',
    title: '课程学习',
    icon: User,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: '课程相关问题解答',
    articles: [
      { id: 5, title: '如何购买和开始课程', views: 2100, helpful: 94 },
      { id: 6, title: '课程进度如何查看', views: 1680, helpful: 91 },
      { id: 7, title: '如何参与课程讨论', views: 920, helpful: 87 },
      { id: 8, title: '获得学习证书的条件', views: 1340, helpful: 89 }
    ]
  },
  {
    id: 'practice',
    title: '实操训练',
    icon: Monitor,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: '模拟交易和练习功能',
    articles: [
      { id: 9, title: '模拟交易如何开始', views: 1850, helpful: 93 },
      { id: 10, title: '虚拟资金是如何计算的', views: 1420, helpful: 88 },
      { id: 11, title: '如何重置练习数据', views: 650, helpful: 85 },
      { id: 12, title: '练习成绩如何评估', views: 990, helpful: 90 }
    ]
  },
  {
    id: 'billing',
    title: '付费与账单',
    icon: CreditCard,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: '支付和退款相关问题',
    articles: [
      { id: 13, title: '支持哪些支付方式', views: 1560, helpful: 92 },
      { id: 14, title: '如何申请退款', views: 890, helpful: 86 },
      { id: 15, title: '发票开具流程', views: 720, helpful: 89 },
      { id: 16, title: '套餐到期后如何续费', views: 1230, helpful: 91 }
    ]
  },
  {
    id: 'technical',
    title: '技术问题',
    icon: Settings,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: '平台技术故障和解决方案',
    articles: [
      { id: 17, title: '无法登录账户怎么办', views: 2340, helpful: 89 },
      { id: 18, title: '视频播放异常解决方法', views: 1690, helpful: 87 },
      { id: 19, title: '页面加载缓慢的原因', views: 980, helpful: 84 },
      { id: 20, title: '忘记密码如何重置', views: 1450, helpful: 93 }
    ]
  },
  {
    id: 'community',
    title: '社区功能',
    icon: MessageCircle,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    description: '社区互动和交流功能',
    articles: [
      { id: 21, title: '如何发起讨论话题', views: 1120, helpful: 90 },
      { id: 22, title: '专家答疑如何参与', views: 1580, helpful: 94 },
      { id: 23, title: '加入学习小组的方法', views: 950, helpful: 88 },
      { id: 24, title: '社区规则和行为准则', views: 760, helpful: 92 }
    ]
  }
];

const popularQuestions = [
  {
    question: '如何开始我的第一个课程？',
    answer: '注册账户后，在课程中心选择适合您水平的课程，点击"开始学习"即可。建议先从基础课程开始。',
    category: '课程学习',
    helpful: 156
  },
  {
    question: '模拟交易的虚拟资金会重置吗？',
    answer: '虚拟资金默认为50万，您可以在设置中随时重置到初始状态，重置不会影响您的学习记录。',
    category: '实操训练',
    helpful: 128
  },
  {
    question: '购买的课程可以永久观看吗？',
    answer: '是的，一次购买即可永久观看。课程内容更新时您也能免费获得最新版本。',
    category: '付费与账单',
    helpful: 189
  },
  {
    question: '忘记密码怎么办？',
    answer: '在登录页面点击"忘记密码"，输入注册邮箱，系统会发送重置密码的邮件给您。',
    category: '技术问题',
    helpful: 167
  }
];

const contactOptions = [
  {
    title: '在线客服',
    description: '7x24小时在线，实时为您解答',
    icon: MessageCircle,
    action: '开始聊天',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: '客服热线',
    description: '400-8888-999（工作日 9:00-18:00）',
    icon: Phone,
    action: '立即拨打',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: '邮件支持',
    description: 'support@smartfin.edu',
    icon: Mail,
    action: '发送邮件',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#002244] to-[#003366] text-white py-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            帮助中心
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            我们为您提供全面的使用指南和专业的技术支持
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索帮助文档、常见问题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div
                  key={index}
                  className={`${option.bgColor} rounded-xl p-6 text-center hover:shadow-lg transition-all cursor-pointer`}
                >
                  <div className={`w-12 h-12 ${option.color.replace('text-', 'text-')} mx-auto mb-4`}>
                    <Icon className="w-12 h-12" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                  <button className={`px-4 py-2 ${option.color.replace('text-', 'bg-').replace('-600', '-600')} text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium`}>
                    {option.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Questions */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">热门问题</h2>
            <p className="text-lg text-gray-600">
              用户最常咨询的问题，也许正是您想了解的
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {popularQuestions.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-3">{item.question}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.answer}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{item.helpful}人觉得有用</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">帮助分类</h2>
            <p className="text-lg text-gray-600">
              按照功能模块整理的详细帮助文档
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Categories List */}
            <div className="lg:col-span-1">
              <div className="space-y-3">
                {filteredCategories.map((category) => {
                  const Icon = category.icon;
                  const isExpanded = expandedCategory === category.id;
                  
                  return (
                    <div key={category.id} className="bg-gray-50 rounded-lg overflow-hidden">
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-all"
                        onClick={() => {
                          toggleCategory(category.id);
                          setSelectedCategory(category.id);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${category.color}`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{category.title}</h3>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      
                      {isExpanded && (
                        <div className="px-4 pb-4">
                          <div className="space-y-2">
                            {category.articles.map((article) => (
                              <div
                                key={article.id}
                                className="flex items-center justify-between p-2 hover:bg-white rounded cursor-pointer"
                              >
                                <span className="text-sm text-gray-700 hover:text-blue-600">
                                  {article.title}
                                </span>
                                <span className="text-xs text-gray-500">{article.views}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Article Content */}
            <div className="lg:col-span-2">
              {selectedCategory ? (
                <div className="bg-gray-50 rounded-xl p-8">
                  {(() => {
                    const category = helpCategories.find(c => c.id === selectedCategory);
                    if (!category) return null;
                    
                    const Icon = category.icon;
                    return (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`w-12 h-12 ${category.bgColor} rounded-xl flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${category.color}`} />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                            <p className="text-gray-600">{category.description}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {category.articles.map((article) => (
                            <div
                              key={article.id}
                              className="bg-white rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                                  {article.title}
                                </h3>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <span>{article.views} 次查看</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span>{article.helpful}% 觉得有用</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">选择帮助分类</h3>
                  <p className="text-gray-600">
                    点击左侧的分类查看相关帮助文档
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Status & Updates */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* System Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">系统状态</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">网站服务</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">正常</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">课程播放</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">正常</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">模拟交易</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">正常</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">社区功能</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-yellow-600">维护中</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  最后更新：2025-01-25 14:30
                </p>
              </div>
            </div>

            {/* Recent Updates */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">最近更新</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">新增TradingView图表功能</h4>
                    <p className="text-sm text-gray-600">更专业的图表分析工具</p>
                    <span className="text-xs text-gray-500">2025-01-25</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">模拟交易系统升级</h4>
                    <p className="text-sm text-gray-600">新增策略回测功能</p>
                    <span className="text-xs text-gray-500">2025-01-20</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">课程内容更新</h4>
                    <p className="text-sm text-gray-600">新增20+高级分析课程</p>
                    <span className="text-xs text-gray-500">2025-01-18</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">性能优化</h4>
                    <p className="text-sm text-gray-600">页面加载速度提升30%</p>
                    <span className="text-xs text-gray-500">2025-01-15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">没有找到答案？</h2>
          <p className="text-xl text-gray-600 mb-8">
            我们的专业团队随时为您提供帮助
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-[#002244] text-white rounded-lg font-semibold hover:bg-[#001122] transition-all flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              联系客服
            </button>
            <button className="px-8 py-4 border-2 border-[#002244] text-[#002244] rounded-lg font-semibold hover:bg-[#002244] hover:text-white transition-all">
              提交反馈
            </button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}