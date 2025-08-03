'use client';

import Link from 'next/link';
import { MessageCircle, Users, BookOpen, TrendingUp, Calendar, Star, ThumbsUp, Eye } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const discussionCategories = [
  {
    id: 1,
    name: '市场分析讨论',
    description: '分享市场观点，讨论行情走势',
    icon: TrendingUp,
    posts: 1248,
    members: 3420,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    name: '技术问题求助',
    description: '技术分析相关问题解答',
    icon: BookOpen,
    posts: 892,
    members: 2150,
    color: 'bg-green-500'
  },
  {
    id: 3,
    name: '交易心得分享',
    description: '实战经验和心得体会',
    icon: MessageCircle,
    posts: 567,
    members: 1890,
    color: 'bg-purple-500'
  },
  {
    id: 4,
    name: '学习资源推荐',
    description: '优质学习资料分享',
    icon: Star,
    posts: 234,
    members: 980,
    color: 'bg-orange-500'
  }
];

const hotTopics = [
  {
    id: 1,
    title: '如何在震荡市中把握交易机会？',
    author: '技术分析师小王',
    category: '市场分析讨论',
    replies: 45,
    views: 1230,
    lastReply: '2小时前',
    isHot: true
  },
  {
    id: 2,
    title: 'MACD指标的实战应用技巧分享',
    author: '交易老手李',
    category: '技术问题求助',
    replies: 32,
    views: 890,
    lastReply: '4小时前',
    isHot: true
  },
  {
    id: 3,
    title: '我的止损策略心得，欢迎讨论',
    author: '稳健投资者',
    category: '交易心得分享',
    replies: 28,
    views: 654,
    lastReply: '6小时前',
    isHot: false
  },
  {
    id: 4,
    title: '推荐几本经典的技术分析书籍',
    author: '书虫小张',
    category: '学习资源推荐',
    replies: 19,
    views: 432,
    lastReply: '8小时前',
    isHot: false
  },
  {
    id: 5,
    title: '新手如何选择适合自己的技术指标？',
    author: '投资新人',
    category: '技术问题求助',
    replies: 15,
    views: 298,
    lastReply: '1天前',
    isHot: false
  }
];

const expertAnswers = [
  {
    id: 1,
    expert: '资深分析师张老师',
    avatar: '👨‍🏫',
    question: '如何判断趋势的真假突破？',
    answer: '判断真假突破需要综合考虑成交量、时间确认和回撤测试...',
    likes: 156,
    time: '昨天 14:30'
  },
  {
    id: 2,
    expert: '量化交易专家李博士',
    avatar: '👨‍💼',
    question: '什么情况下应该调整仓位大小？',
    answer: '仓位管理是风险控制的核心，建议根据账户风险承受能力...',
    likes: 89,
    time: '2天前'
  },
  {
    id: 3,
    expert: '技术分析导师王老师',
    avatar: '👩‍🏫',
    question: 'RSI指标在不同周期下的应用差异？',
    answer: '不同周期的RSI指标确实存在应用差异，短周期更适合...',
    likes: 67,
    time: '3天前'
  }
];

const learningGroups = [
  {
    id: 1,
    name: '技术分析入门班',
    members: 245,
    description: '适合刚开始学习技术分析的朋友',
    activity: '每周三晚8点线上讨论',
    tag: '入门级'
  },
  {
    id: 2,
    name: '短线交易研究组',
    members: 189,
    description: '专注短线交易策略研究',
    activity: '每日复盘分享',
    tag: '进阶级'
  },
  {
    id: 3,
    name: '价值投资交流圈',
    members: 167,
    description: '长期价值投资理念交流',
    activity: '每月投资报告分享',
    tag: '专业级'
  },
  {
    id: 4,
    name: '量化策略实验室',
    members: 98,
    description: '量化交易策略开发与测试',
    activity: '策略代码分享',
    tag: '专家级'
  }
];

export default function CommunityPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#002244] to-[#003366] text-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              学习社区
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              与志同道合的投资者交流学习，分享经验，共同成长
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">8,500+</div>
                <div className="text-sm">活跃用户</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">2,800+</div>
                <div className="text-sm">讨论话题</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">50+</div>
                <div className="text-sm">专家导师</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-wrap items-center gap-4">
            <button className="px-6 py-3 bg-[#002244] text-white rounded-lg hover:bg-[#001122] transition-all font-medium">
              发起讨论
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
              提问求助
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
              分享心得
            </button>
            <div className="ml-auto">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">
                <option>最新发布</option>
                <option>最热讨论</option>
                <option>精华内容</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Discussion Categories */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">讨论版块</h2>
            <p className="text-lg text-gray-600">
              选择您感兴趣的话题，参与热烈讨论
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {discussionCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 ${category.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                    
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>{category.posts} 话题</span>
                      <span>{category.members} 用户</span>
                    </div>
                    
                    <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all">
                      进入版块
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hot Topics */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Discussion List */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">热门话题</h2>
                <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  查看全部 →
                </Link>
              </div>

              <div className="space-y-4">
                {hotTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {topic.isHot && (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                              热
                            </span>
                          )}
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            {topic.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                          {topic.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>by {topic.author}</span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {topic.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {topic.views}
                          </span>
                          <span>最后回复: {topic.lastReply}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Expert Answers */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">专家答疑</h3>
                <div className="space-y-4">
                  {expertAnswers.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{item.avatar}</span>
                        <div>
                          <div className="font-medium text-gray-900">{item.expert}</div>
                          <div className="text-sm text-gray-500">{item.time}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        Q: {item.question}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        A: {item.answer}
                      </div>
                      <div className="flex items-center justify-between">
                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                          <ThumbsUp className="w-4 h-4" />
                          {item.likes}
                        </button>
                        <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">
                          查看完整回答
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Stats */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">社区数据</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">今日新增话题</span>
                    <span className="font-bold text-gray-900">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">今日活跃用户</span>
                    <span className="font-bold text-gray-900">1,245</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">专家在线数</span>
                    <span className="font-bold text-green-600">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">待解答问题</span>
                    <span className="font-bold text-orange-600">8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Groups */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">学习小组</h2>
            <p className="text-lg text-gray-600">
              加入志趣相投的学习小组，与同伴一起进步
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    group.tag === '入门级' ? 'bg-green-100 text-green-700' :
                    group.tag === '进阶级' ? 'bg-blue-100 text-blue-700' :
                    group.tag === '专业级' ? 'bg-purple-100 text-purple-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {group.tag}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    {group.members}
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{group.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{group.activity}</span>
                </div>
                
                <button className="w-full py-2 bg-[#002244] text-white rounded-lg hover:bg-[#001122] transition-all">
                  申请加入
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Rules */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">社区公约</h2>
            <p className="text-lg text-gray-600">
              共同维护良好的学习讨论环境
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">提倡行为</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">分享真实的学习心得和交易经验</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">耐心解答新手提出的问题</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">理性讨论，尊重不同观点</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">推荐优质的学习资源</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">禁止行为</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✕</span>
                  </div>
                  <span className="text-gray-700">发布虚假信息或恶意传播谣言</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✕</span>
                  </div>
                  <span className="text-gray-700">进行人身攻击或恶意诽谤</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✕</span>
                  </div>
                  <span className="text-gray-700">发布广告或进行商业推广</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✕</span>
                  </div>
                  <span className="text-gray-700">恶意刷屏或发布无关内容</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">加入我们的学习社区</h2>
          <p className="text-xl text-gray-300 mb-8">
            与8,500+投资者一起学习成长，分享经验，共同进步
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              立即加入社区
            </button>
            <Link 
              href="/practice" 
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all"
            >
              开始实操练习
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}