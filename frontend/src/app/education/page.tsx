import Link from 'next/link'
import { BookOpen, Clock, Users, ArrowRight, TrendingUp } from 'lucide-react'
import { Metadata } from 'next'
import PageLayout from '@/components/layout/PageLayout'

export const metadata: Metadata = {
  title: '投资教育 - SmartFin Technology',
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
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${
      course.featured ? 'ring-2 ring-[#003366]' : ''
    }`}>
      {course.featured && (
        <div className="bg-[#003366] text-white text-xs font-medium px-2 py-1 rounded-full inline-block mb-3">
          热门课程
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[course.level]}`}>
          {course.level}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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
        <span className="text-sm font-medium text-[#003366]">{course.category}</span>
        <Link
          href={`/education/${course.id}`}
          className="inline-flex items-center px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#000f1e] transition-colors"
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
    <PageLayout>
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#003366] to-[#000f1e] text-white">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            专业投资教育
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto">
            系统化学习投资知识，从基础入门到高级策略，配合专业分析工具，提升投资技能和素养
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#courses" 
              className="px-8 py-4 bg-white text-[#003366] rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              开始学习
            </Link>
            <Link 
              href="/market" 
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#003366] transition-all"
            >
              查看市场数据
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Learning Path */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">学习路径</h2>
            <p className="text-lg text-gray-600">
              跟随我们的专业学习路径，逐步提升投资技能
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">基础入门</h3>
              <p className="text-gray-600">
                学习投资基本概念，建立正确的投资理念和心态
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">技术分析</h3>
              <p className="text-gray-600">
                掌握K线、指标、形态分析，提升市场走势判断能力
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">高级策略</h3>
              <p className="text-gray-600">
                学习高级交易策略和风险管理，成为成熟的投资者
              </p>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">热门课程</h2>
            <Link
              href="#all-courses"
              className="text-[#003366] hover:text-[#0066CC] font-medium"
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
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
            <div className="text-center">
              <TrendingUp className="h-16 w-16 text-[#003366] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#003366] mb-4">
                专业级图表分析工具
              </h2>
              <p className="text-[#003366] mb-6 max-w-2xl mx-auto">
                正在集成 TradingView 高级图表库，为技术分析课程提供专业的实战工具。
                学习者将能够使用100+种技术指标和专业绘图工具进行实战练习。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-semibold text-[#003366]">技术指标学习</div>
                  <div className="text-xs text-gray-600 mt-1">RSI, MACD, 布林带...</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-semibold text-[#003366]">图表形态识别</div>
                  <div className="text-xs text-gray-600 mt-1">头肩顶, 双底, 三角形...</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-semibold text-[#003366]">绘图工具实战</div>
                  <div className="text-xs text-gray-600 mt-1">支撑位, 压力位...</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-semibold text-[#003366]">历史数据分析</div>
                  <div className="text-xs text-gray-600 mt-1">经典案例复盘...</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Courses */}
        <section id="all-courses">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">全部课程</h2>
          
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
                className="px-8 py-3 bg-[#003366] text-white rounded-lg font-semibold hover:bg-[#000f1e] transition-colors"
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
              <Link href="/about" className="hover:text-[#003366]">关于我们</Link>
              <Link href="/education" className="hover:text-[#003366]">课程中心</Link>
              <Link href="/practice" className="hover:text-[#003366]">实操训练</Link>
              <Link href="/community" className="hover:text-[#003366]">学习社区</Link>
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