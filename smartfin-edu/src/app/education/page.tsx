import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { BookOpen, Clock, Users, ArrowRight, TrendingUp } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '投资教育 - 智投教育',
  description: '免费的系统化投资教育课程，从基础知识到高级策略，帮助投资者提升技能和素养。',
}

interface Course {
  id: string
  title: string
  description: string
  level: '初级' | '中级' | '高级'
  duration: string
  students: number
  lessons: number
  category: string
  featured?: boolean
}

const courses: Course[] = [
  {
    id: '1',
    title: '投资基础入门',
    description: '从零开始学习投资，掌握基本概念和原理，建立正确的投资理念。',
    level: '初级',
    duration: '4周',
    students: 15420,
    lessons: 12,
    category: '基础知识',
    featured: true
  },
  {
    id: '2',
    title: 'K线图表分析详解',
    description: '学会读懂K线图，掌握各种K线形态的含义，提升技术分析能力。',
    level: '初级',
    duration: '3周',
    students: 12880,
    lessons: 10,
    category: '技术分析'
  },
  {
    id: '3',
    title: '移动平均线系统',
    description: '深入学习各种平均线的计算和应用，掌握趋势判断方法。',
    level: '中级',
    duration: '3周',
    students: 9650,
    lessons: 8,
    category: '技术指标',
    featured: true
  },
  {
    id: '4',
    title: 'RSI指标实战应用',
    description: '学习RSI指标的原理和实战应用，掌握超买超卖信号的识别。',
    level: '中级',
    duration: '2周',
    students: 8330,
    lessons: 6,
    category: '技术指标'
  },
  {
    id: '5',
    title: '风险管理与仓位控制',
    description: '学习如何管理投资风险，合理分配资金，保护投资本金。',
    level: '中级',
    duration: '4周',
    students: 11200,
    lessons: 14,
    category: '风险管理',
    featured: true
  },
  {
    id: '6',
    title: '高级图表形态分析',
    description: '深入学习各种复杂图表形态，提升市场走势的预测能力。',
    level: '高级',
    duration: '6周',
    students: 5870,
    lessons: 18,
    category: '技术分析'
  }
]

function CourseCard({ course }: { course: Course }) {
  const levelColors = {
    '初级': 'bg-green-100 text-green-800',
    '中级': 'bg-yellow-100 text-yellow-800',
    '高级': 'bg-red-100 text-red-800'
  }

  return (
    <div className={`bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow ${
      course.featured ? 'ring-2 ring-primary-500' : ''
    }`}>
      {course.featured && (
        <div className="bg-primary-500 text-white text-xs font-medium px-2 py-1 rounded-full inline-block mb-3">
          热门课程
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-foreground">{course.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[course.level]}`}>
          {course.level}
        </span>
      </div>
      
      <p className="text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{course.lessons}课</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.students.toLocaleString()}人</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-primary-600">{course.category}</span>
        <Link
          href={`/education/${course.id}`}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          开始学习
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

export default function EducationPage() {
  const featuredCourses = courses.filter(course => course.featured)
  const allCourses = courses

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-800 via-purple-800 to-slate-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkzQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJtMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydC00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-sm font-medium mb-6">
                📚 专业课程体系
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                免费投资教育课程
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-100 max-w-4xl mx-auto leading-relaxed">
              系统化学习投资知识，从基础入门到高级策略，提升投资技能和素养
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-6 hover:bg-white/30 transition-all duration-300">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">50+</div>
                <div className="text-sm text-gray-100 font-medium">专业课程</div>
              </div>
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-6 hover:bg-white/30 transition-all duration-300">
                <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">100%</div>
                <div className="text-sm text-gray-100 font-medium">免费学习</div>
              </div>
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-6 hover:bg-white/30 transition-all duration-300">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">10万+</div>
                <div className="text-sm text-gray-100 font-medium">学习用户</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Learning Path */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">学习路径</h2>
            <p className="text-lg text-muted-foreground">
              跟随我们的专业学习路径，逐步提升投资技能
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">基础入门</h3>
              <p className="text-muted-foreground">
                学习投资基本概念，建立正确的投资理念和心态
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">技术分析</h3>
              <p className="text-muted-foreground">
                掌握K线、指标、形态分析，提升市场走势判断能力
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">高级策略</h3>
              <p className="text-muted-foreground">
                学习高级交易策略和风险管理，成为成熟的投资者
              </p>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">热门课程</h2>
            <Link
              href="#all-courses"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              查看全部 →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* TradingView Integration */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8 border border-primary-200">
            <div className="text-center">
              <TrendingUp className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-primary-900 mb-4">
                专业级图表分析工具
              </h2>
              <p className="text-primary-700 mb-6 max-w-2xl mx-auto">
                正在集成 TradingView 高级图表库，为技术分析课程提供专业的实战工具。
                学习者将能够使用100+种技术指标和专业绘图工具进行实战练习。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="bg-card p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-semibold text-primary-800">技术指标学习</div>
                  <div className="text-xs text-primary-600 mt-1">RSI, MACD, 布林带...</div>
                </div>
                <div className="bg-card p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-semibold text-primary-800">图表形态识别</div>
                  <div className="text-xs text-primary-600 mt-1">头肩顶, 双底, 三角形...</div>
                </div>
                <div className="bg-card p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-semibold text-primary-800">绘图工具实战</div>
                  <div className="text-xs text-primary-600 mt-1">支撑位, 压力位...</div>
                </div>
                <div className="bg-card p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-semibold text-primary-800">历史数据分析</div>
                  <div className="text-xs text-primary-600 mt-1">经典案例复盘...</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Courses */}
        <section id="all-courses">
          <h2 className="text-3xl font-bold text-foreground mb-8">全部课程</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <div className="bg-gray-900 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              准备好开始你的投资学习之旅了吗？
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              加入数十万用户的学习社区，获取专业的投资教育和指导
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/education/1"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                从基础开始学习
              </Link>
              <Link
                href="/tools"
                className="px-8 py-3 border-2 border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                体验学习工具
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}