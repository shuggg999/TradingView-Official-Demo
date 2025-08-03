'use client';

import Link from 'next/link';
import { Calendar, User, Tag, Eye, TrendingUp, ArrowRight, Bookmark, Share2, Bell } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const featuredNews = {
  id: 1,
  title: 'SmartFin Education获得TradingView图表库申请批准',
  excerpt: '经过数月的准备和申请，SmartFin Education Platform成功获得TradingView Advanced Charts访问权限，将为用户提供更专业的技术分析学习体验...',
  content: '这一重要里程碑标志着我们在投资教育领域的专业水平获得了业界认可。',
  author: '公司公告',
  date: '2025-01-25',
  category: '公司动态',
  tags: ['TradingView', '产品升级', '里程碑'],
  views: 2580,
  featured: true
};

const newsArticles = [
  {
    id: 2,
    title: '平台用户突破50,000人，投资教育普及效果显著',
    excerpt: '自平台上线以来，注册用户数量持续增长，目前已突破50,000人大关。用户满意度调研显示，95%的用户认为通过平台学习提升了投资技能...',
    author: '运营团队',
    date: '2025-01-22',
    category: '平台数据',
    tags: ['用户增长', '数据报告'],
    views: 1856,
    type: 'milestone'
  },
  {
    id: 3,
    title: '新增高级技术分析课程，专业导师团队加入',
    excerpt: '平台新增20+高级技术分析课程，邀请了多位来自知名金融机构的专业分析师担任导师，为用户提供更深入的专业指导...',
    author: '教育团队',
    date: '2025-01-20',
    category: '产品更新',
    tags: ['课程更新', '专业导师'],
    views: 1342,
    type: 'product'
  },
  {
    id: 4,
    title: '模拟交易功能升级，新增策略回测工具',
    excerpt: '为了提供更真实的交易体验，平台模拟交易系统进行了重大升级，新增策略回测、风险评估等高级功能...',
    author: '技术团队',
    date: '2025-01-18',
    category: '功能升级',
    tags: ['模拟交易', '策略回测'],
    views: 1158,
    type: 'feature'
  },
  {
    id: 5,
    title: '学习社区活跃度创新高，专家答疑服务受好评',
    excerpt: '本月学习社区讨论量较上月增长40%，专家答疑服务获得用户一致好评，平均响应时间缩短至2小时内...',
    author: '社区运营',
    date: '2025-01-15',
    category: '社区动态',
    tags: ['社区活跃', '用户体验'],
    views: 923,
    type: 'community'
  },
  {
    id: 6,
    title: '与多家高校建立合作关系，推广投资教育',
    excerpt: '平台与清华大学、北京大学等多所知名高校经管学院建立合作关系，将专业投资教育内容引入校园...',
    author: '合作发展部',
    date: '2025-01-12',
    category: '合作伙伴',
    tags: ['高校合作', '教育推广'],
    views: 1678,
    type: 'partnership'
  },
  {
    id: 7,
    title: '移动端APP即将上线，随时随地学习投资',
    excerpt: '为了满足用户碎片化学习需求，SmartFin Education移动端APP正在最后测试阶段，预计下月正式上线...',
    author: '产品团队',
    date: '2025-01-10',
    category: '产品预告',
    tags: ['移动APP', '产品规划'],
    views: 2134,
    type: 'preview'
  },
  {
    id: 8,
    title: '年度优秀学员表彰，投资技能显著提升',
    excerpt: '2024年度优秀学员表彰大会成功举办，多位学员分享了通过平台学习实现投资收益增长的成功经验...',
    author: '教务部',
    date: '2025-01-08',
    category: '学员风采',
    tags: ['学员表彰', '成功案例'],
    views: 1467,
    type: 'achievement'
  }
];

const categories = [
  { name: '全部', count: 25, active: true },
  { name: '公司动态', count: 8 },
  { name: '产品更新', count: 12 },
  { name: '平台数据', count: 6 },
  { name: '合作伙伴', count: 5 },
  { name: '社区动态', count: 10 }
];

const importantAnnouncements = [
  {
    title: 'TradingView图表库集成完成',
    date: '2025-01-25',
    type: 'success'
  },
  {
    title: '春节假期服务安排通知',
    date: '2025-01-20',
    type: 'info'
  },
  {
    title: '系统维护升级公告',
    date: '2025-01-15',
    type: 'warning'
  }
];

export default function NewsPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#002244] to-[#003366] text-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              新闻动态
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              了解SmartFin Education的最新发展动态、产品更新和行业资讯
            </p>
            
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">50+</div>
                <div className="text-sm">新闻报道</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">每周</div>
                <div className="text-sm">更新频率</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">10K+</div>
                <div className="text-sm">阅读量</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Announcements */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">重要公告</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {importantAnnouncements.map((announcement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  announcement.type === 'success' ? 'bg-green-50 border-green-500' :
                  announcement.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}
              >
                <h4 className="font-medium text-gray-900 mb-1">{announcement.title}</h4>
                <p className="text-sm text-gray-600">{announcement.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-64 md:h-auto flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <TrendingUp className="w-20 h-20 mx-auto mb-4" />
                  <p className="text-lg font-medium">重要新闻</p>
                  <p className="text-sm">TradingView集成成功</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                    重大新闻
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {featuredNews.category}
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {featuredNews.title}
                </h2>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {featuredNews.excerpt}
                </p>
                
                <p className="text-gray-700 mb-6 font-medium">
                  {featuredNews.content}
                </p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{featuredNews.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredNews.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{featuredNews.views.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredNews.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <Link
                    href={`/news/${featuredNews.id}`}
                    className="px-6 py-3 bg-[#002244] text-white rounded-lg hover:bg-[#001122] transition-all font-medium flex items-center gap-2"
                  >
                    阅读全文
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                  
                  <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">最新动态</h2>
                <div className="flex items-center gap-4">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">
                    <option>最新发布</option>
                    <option>最多阅读</option>
                    <option>最多关注</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {newsArticles.map((article) => (
                  <article key={article.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="lg:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-center text-gray-500">
                          <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-xs">新闻配图</p>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {article.category}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${
                            article.type === 'milestone' ? 'bg-green-500' :
                            article.type === 'product' ? 'bg-blue-500' :
                            article.type === 'feature' ? 'bg-purple-500' :
                            article.type === 'community' ? 'bg-orange-500' :
                            article.type === 'partnership' ? 'bg-indigo-500' :
                            'bg-gray-500'
                          }`}></span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                          <Link href={`/news/${article.id}`}>
                            {article.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{article.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{article.views}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/news/${article.id}`}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                            >
                              阅读更多
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                    上一页
                  </button>
                  <button className="px-4 py-2 bg-[#002244] text-white rounded-lg">1</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">2</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">3</button>
                  <span className="px-4 py-2 text-gray-500">...</span>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">8</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                    下一页
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Categories */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">新闻分类</h3>
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                        category.active 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-gray-500">({category.count})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hot News */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">热门新闻</h3>
                <div className="space-y-4">
                  {newsArticles.slice(0, 4).map((article, index) => (
                    <div key={article.id} className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0 ? 'bg-red-500' :
                        index === 1 ? 'bg-orange-500' :
                        index === 2 ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <Link
                          href={`/news/${article.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                        >
                          {article.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{article.date}</span>
                          <Eye className="w-3 h-3 ml-2" />
                          <span>{article.views}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">订阅动态</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  第一时间获取平台最新动态和重要公告
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="请输入您的邮箱"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="w-full py-3 bg-[#002244] text-white rounded-lg hover:bg-[#001122] transition-all font-medium flex items-center justify-center gap-2">
                    <Bell className="w-4 h-4" />
                    立即订阅
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  我们承诺不会发送垃圾邮件，您可以随时取消订阅
                </p>
              </div>

              {/* Company Timeline */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">发展历程</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">2025年1月</div>
                      <div className="text-xs text-gray-600">获得TradingView图表库授权</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">2024年12月</div>
                      <div className="text-xs text-gray-600">用户数突破50,000人</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">2024年11月</div>
                      <div className="text-xs text-gray-600">完成A轮融资</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">2024年6月</div>
                      <div className="text-xs text-gray-600">平台正式上线</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">关注我们的最新动态</h2>
          <p className="text-xl text-gray-300 mb-8">
            第一时间了解平台更新和投资教育行业资讯
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
              <Bell className="w-5 h-5" />
              订阅动态
            </button>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all"
            >
              联系我们
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}