'use client';

import Link from 'next/link';
import { Calendar, User, Tag, Clock, ArrowRight, TrendingUp, Search } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const featuredPost = {
  id: 1,
  title: '2025年投资市场展望：技术分析在新环境下的应用',
  excerpt: '随着全球经济环境的变化，技术分析方法也在不断演进。本文深入探讨了在当前市场环境下，如何运用现代技术分析工具来识别投资机会...',
  author: '李分析师',
  date: '2025-01-20',
  readTime: '8分钟',
  category: '市场分析',
  tags: ['技术分析', '投资策略', '市场展望'],
  image: '/blog/featured-post.jpg',
  featured: true
};

const blogPosts = [
  {
    id: 2,
    title: 'MACD指标的高级应用技巧：从基础到实战',
    excerpt: 'MACD是最常用的技术指标之一，但很多投资者只掌握了基础用法。本文将深入讲解MACD的高级应用技巧...',
    author: '王技术',
    date: '2025-01-18',
    readTime: '6分钟',
    category: '技术指标',
    tags: ['MACD', '技术指标', '实战技巧'],
    image: '/blog/macd-guide.jpg'
  },
  {
    id: 3,
    title: '新手投资者必知的风险管理策略',
    excerpt: '投资有风险，入市需谨慎。对于新手投资者来说，学会风险管理比追求高收益更重要...',
    author: '张老师',
    date: '2025-01-15',
    readTime: '5分钟',
    category: '投资教育',
    tags: ['风险管理', '新手指南', '投资策略'],
    image: '/blog/risk-management.jpg'
  },
  {
    id: 4,
    title: 'K线形态识别：反转信号的准确判断',
    excerpt: 'K线形态是技术分析的基础，掌握关键反转形态能帮助投资者在重要转折点做出正确决策...',
    author: '刘分析师',
    date: '2025-01-12',
    readTime: '7分钟',
    category: '技术分析',
    tags: ['K线形态', '反转信号', '图表分析'],
    image: '/blog/candlestick-patterns.jpg'
  },
  {
    id: 5,
    title: '量价关系分析：成交量背后的市场真相',
    excerpt: '成交量是资金流向的直接体现，学会分析量价关系能够帮助投资者更好地理解市场动向...',
    author: '陈专家',
    date: '2025-01-10',
    readTime: '6分钟',
    category: '技术分析',
    tags: ['量价分析', '成交量', '市场分析'],
    image: '/blog/volume-analysis.jpg'
  },
  {
    id: 6,
    title: '移动平均线系统的构建与优化',
    excerpt: '移动平均线是趋势跟踪的重要工具，如何构建有效的均线系统是每个技术分析师必须掌握的技能...',
    author: '赵导师',
    date: '2025-01-08',
    readTime: '8分钟',
    category: '技术指标',
    tags: ['移动平均线', '趋势分析', '系统优化'],
    image: '/blog/moving-averages.jpg'
  },
  {
    id: 7,
    title: '心理因素在投资决策中的作用',
    excerpt: '投资不仅是技术和基本面的较量，更是心理素质的考验。了解投资心理学能帮助投资者避免常见陷阱...',
    author: '孙心理师',
    date: '2025-01-05',
    readTime: '5分钟',
    category: '投资心理',
    tags: ['投资心理', '决策分析', '行为金融'],
    image: '/blog/investment-psychology.jpg'
  }
];

const categories = [
  { name: '全部', count: 25, active: true },
  { name: '市场分析', count: 8 },
  { name: '技术指标', count: 12 },
  { name: '投资教育', count: 6 },
  { name: '技术分析', count: 10 },
  { name: '投资心理', count: 4 }
];

const popularTags = [
  '技术分析', 'MACD', 'K线形态', '投资策略', '风险管理', 
  '移动平均线', 'RSI', '量价分析', '趋势线', '支撑阻力'
];

export default function BlogPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#002244] to-[#003366] text-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              投资博客
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              分享专业的投资见解、技术分析技巧和市场动态，助您提升投资技能
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索文章、标签或作者..."
                  className="w-full px-6 py-4 pl-12 text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-64 md:h-auto flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4" />
                  <p>特色文章配图</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                    精选文章
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {featuredPost.category}
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <Link
                  href={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#002244] text-white rounded-lg hover:bg-[#001122] transition-all font-medium"
                >
                  阅读全文
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Blog Posts */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">最新文章</h2>
                <div className="flex items-center gap-4">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">
                    <option>最新发布</option>
                    <option>最受欢迎</option>
                    <option>阅读量最高</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {blogPosts.map((post) => (
                  <article key={post.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                    <div className="bg-gray-200 h-48 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">文章配图</p>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {post.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                        <Link href={`/blog/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                      >
                        阅读更多
                        <ArrowRight className="w-3 h-3" />
                      </Link>
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
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">10</button>
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
                <h3 className="text-xl font-semibold text-gray-900 mb-6">文章分类</h3>
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

              {/* Popular Tags */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">热门标签</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-all text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">订阅我们的博客</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  获取最新的投资见解和技术分析文章，直接发送到您的邮箱
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="请输入您的邮箱"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="w-full py-3 bg-[#002244] text-white rounded-lg hover:bg-[#001122] transition-all font-medium">
                    立即订阅
                  </button>
                </div>
              </div>

              {/* Latest Comments */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">最新评论</h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-700">张</span>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">张三</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      对文章《MACD指标的高级应用技巧》的评论
                    </p>
                    <p className="text-sm text-gray-700">非常实用的技巧分享，学到了很多...</p>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-green-700">李</span>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">李四</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      对文章《风险管理策略》的评论
                    </p>
                    <p className="text-sm text-gray-700">作为新手，这篇文章让我受益匪浅...</p>
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
          <h2 className="text-3xl font-bold mb-6">想要了解更多投资知识？</h2>
          <p className="text-xl text-gray-300 mb-8">
            浏览我们的系统化课程，从基础到高级，全面提升您的投资技能
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/education"
              className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              查看所有课程
            </Link>
            <Link
              href="/practice"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all"
            >
              开始实战练习
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}