import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  PlayCircle,
  ArrowLeft,
  Calendar,
  Award,
  TrendingUp,
  ChevronRight
} from 'lucide-react'

// 模拟课程数据
const courses = {
  '1': {
    id: '1',
    title: '投资基础入门',
    description: '从零开始学习投资，掌握基本概念和原理，建立正确的投资理念。本课程将带你全面了解投资世界，包括股票、债券、基金等各种投资工具的基础知识，以及如何制定个人投资策略。',
    level: '初级',
    duration: '4周',
    students: 15420,
    lessons: 12,
    category: '基础知识',
    rating: 4.8,
    reviews: 2341,
    instructor: {
      name: '李教授',
      title: '资深投资顾问',
      experience: '15年投资经验'
    },
    featured: true,
    progress: 0,
    enrolled: false,
    price: 'free',
    whatYouWillLearn: [
      '理解股票、债券、基金等基本投资工具',
      '掌握风险与收益的关系',
      '学会制定个人投资目标和策略',
      '了解市场运作机制和投资环境',
      '建立正确的投资心态和风险意识'
    ],
    chapters: [
      {
        id: 1,
        title: '投资基础概念',
        lessons: [
          { id: 1, title: '什么是投资', duration: '15分钟', type: 'video', completed: false },
          { id: 2, title: '投资与储蓄的区别', duration: '12分钟', type: 'video', completed: false },
          { id: 3, title: '风险与收益', duration: '18分钟', type: 'video', completed: false }
        ]
      },
      {
        id: 2,
        title: '投资工具介绍',
        lessons: [
          { id: 4, title: '股票投资基础', duration: '25分钟', type: 'video', completed: false },
          { id: 5, title: '债券投资入门', duration: '20分钟', type: 'video', completed: false },
          { id: 6, title: '基金投资指南', duration: '22分钟', type: 'video', completed: false }
        ]
      },
      {
        id: 3,
        title: '投资策略制定',
        lessons: [
          { id: 7, title: '投资目标设定', duration: '16分钟', type: 'video', completed: false },
          { id: 8, title: '资产配置原理', duration: '28分钟', type: 'video', completed: false },
          { id: 9, title: '分散投资策略', duration: '24分钟', type: 'video', completed: false }
        ]
      },
      {
        id: 4,
        title: '实战应用',
        lessons: [
          { id: 10, title: '投资账户开设', duration: '14分钟', type: 'video', completed: false },
          { id: 11, title: '投资心理学', duration: '30分钟', type: 'video', completed: false },
          { id: 12, title: '总结与展望', duration: '20分钟', type: 'video', completed: false }
        ]
      }
    ]
  },
  '2': {
    id: '2',
    title: 'K线图表分析详解',
    description: '学会读懂K线图，掌握各种K线形态的含义，提升技术分析能力。',
    level: '初级',
    duration: '3周',
    students: 12880,
    lessons: 10,
    category: '技术分析',
    rating: 4.7,
    reviews: 1876,
    instructor: {
      name: '王分析师',
      title: '技术分析专家',
      experience: '12年交易经验'
    },
    featured: false,
    progress: 0,
    enrolled: false,
    price: 'free',
    whatYouWillLearn: [
      '掌握K线图的基本构成和含义',
      '识别各种经典K线形态',
      '学会通过K线判断市场趋势',
      '了解K线与成交量的关系',
      '掌握K线分析的实战技巧'
    ],
    chapters: [
      {
        id: 1,
        title: 'K线基础知识',
        lessons: [
          { id: 1, title: 'K线的构成要素', duration: '18分钟', type: 'video', completed: false },
          { id: 2, title: 'K线的时间周期', duration: '15分钟', type: 'video', completed: false },
          { id: 3, title: 'K线颜色的含义', duration: '12分钟', type: 'video', completed: false }
        ]
      },
      {
        id: 2,
        title: '经典K线形态',
        lessons: [
          { id: 4, title: '单根K线形态', duration: '25分钟', type: 'video', completed: false },
          { id: 5, title: '双K线组合', duration: '22分钟', type: 'video', completed: false },
          { id: 6, title: '三K线组合', duration: '28分钟', type: 'video', completed: false }
        ]
      },
      {
        id: 3,
        title: 'K线实战应用',
        lessons: [
          { id: 7, title: 'K线与趋势判断', duration: '20分钟', type: 'video', completed: false },
          { id: 8, title: 'K线与支撑阻力', duration: '24分钟', type: 'video', completed: false },
          { id: 9, title: 'K线交易策略', duration: '26分钟', type: 'video', completed: false },
          { id: 10, title: '案例分析与总结', duration: '30分钟', type: 'video', completed: false }
        ]
      }
    ]
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const course = courses[params.id as keyof typeof courses]
  
  if (!course) {
    return {
      title: '课程未找到 - SmartFin Technology',
      description: '您要查找的课程不存在。'
    }
  }

  return {
    title: `${course.title} - SmartFin Technology`,
    description: course.description,
  }
}

interface CourseDetailPageProps {
  params: {
    id: string
  }
}

function Breadcrumb({ course }: { course: any }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-[#003366]">首页</Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/education" className="hover:text-[#003366]">投资教育</Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-gray-900">{course.title}</span>
    </nav>
  )
}

function CourseProgress({ course }: { course: any }) {
  const totalLessons = course.chapters.reduce((total: number, chapter: any) => total + chapter.lessons.length, 0)
  const completedLessons = course.chapters.reduce((total: number, chapter: any) => 
    total + chapter.lessons.filter((lesson: any) => lesson.completed).length, 0
  )
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-900">学习进度</span>
        <span className="text-sm text-blue-700">{completedLessons}/{totalLessons} 课程</span>
      </div>
      <div className="w-full bg-blue-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="text-xs text-blue-700 mt-1">
        {progressPercentage.toFixed(0)}% 完成
      </div>
    </div>
  )
}

function ChapterList({ course }: { course: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">课程内容</h3>
      {course.chapters.map((chapter: any, chapterIndex: number) => (
        <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">
              第{chapterIndex + 1}章：{chapter.title}
            </h4>
          </div>
          <div className="divide-y divide-gray-200">
            {chapter.lessons.map((lesson: any, lessonIndex: number) => (
              <Link
                key={lesson.id}
                href={`/education/${course.id}/lesson/${lesson.id}`}
                className="block px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {lesson.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <PlayCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {chapterIndex + 1}.{lessonIndex + 1} {lesson.title}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{lesson.duration}</span>
                        <span>•</span>
                        <span>{lesson.type === 'video' ? '视频' : '文档'}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const course = courses[params.id as keyof typeof courses]

  if (!course) {
    notFound()
  }

  const levelColors = {
    '初级': 'bg-green-100 text-green-800',
    '中级': 'bg-yellow-100 text-yellow-800',
    '高级': 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-300 px-8 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-semibold text-[#003366]">
            SmartFin Technology
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/market" className="text-gray-700 hover:text-[#003366] text-sm font-medium transition-colors">
              市场数据
            </Link>
            <Link href="/analysis" className="text-gray-700 hover:text-[#003366] text-sm font-medium transition-colors">
              分析工具
            </Link>
            <Link href="/education" className="text-[#003366] hover:text-[#0066CC] text-sm font-medium transition-colors border-b-2 border-[#003366]">
              投资教育
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#003366] text-sm font-medium transition-colors">
              关于我们
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link 
              href="/login" 
              className="px-6 py-2 text-[#003366] border border-[#003366] rounded-md hover:bg-[#003366] hover:text-white transition-all text-sm font-medium"
            >
              登录
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2 bg-[#003366] text-white rounded-md hover:bg-[#000f1e] transition-all text-sm font-medium"
            >
              注册
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            href="/education"
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#003366] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回课程列表
          </Link>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb course={course} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelColors[course.level as keyof typeof levelColors]}`}>
                  {course.level}
                </span>
                <span className="text-sm font-medium text-[#003366]">{course.category}</span>
                {course.featured && (
                  <span className="bg-[#003366] text-white text-xs font-medium px-2 py-1 rounded-full">
                    热门课程
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{course.lessons}课</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{course.students.toLocaleString()}人已学习</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
                  <span>{course.rating}</span>
                  <span className="ml-1">({course.reviews}评价)</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg mb-6">
                <div className="w-12 h-12 bg-[#003366] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {course.instructor.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{course.instructor.name}</div>
                  <div className="text-sm text-gray-600">{course.instructor.title}</div>
                  <div className="text-xs text-gray-500">{course.instructor.experience}</div>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                你将学到什么
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content */}
            <ChapterList course={course} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Progress Card */}
              {course.enrolled && <CourseProgress course={course} />}

              {/* Enrollment Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#003366] mb-2">
                    {course.price === 'free' ? '免费' : `¥${course.price}`}
                  </div>
                  <div className="text-sm text-gray-600 mb-6">
                    {course.price === 'free' ? '永久免费' : '一次付费，终身学习'}
                  </div>
                  
                  {!course.enrolled ? (
                    <button className="w-full bg-[#003366] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#000f1e] transition-colors mb-4">
                      立即开始学习
                    </button>
                  ) : (
                    <Link
                      href={`/education/${course.id}/lesson/1`}
                      className="block w-full bg-[#003366] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#000f1e] transition-colors mb-4 text-center"
                    >
                      继续学习
                    </Link>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    30天无条件退款保证
                  </div>
                </div>
              </div>

              {/* Course Features */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">课程特色</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-4 w-4 text-[#003366]" />
                    <span className="text-sm text-gray-700">实战案例分析</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PlayCircle className="h-4 w-4 text-[#003366]" />
                    <span className="text-sm text-gray-700">高清视频教学</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-4 w-4 text-[#003366]" />
                    <span className="text-sm text-gray-700">完成证书</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-[#003366]" />
                    <span className="text-sm text-gray-700">终身访问</span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">分享课程</h3>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                    微信
                  </button>
                  <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors">
                    微博
                  </button>
                  <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 transition-colors">
                    链接
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-16">
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
              <Link href="/market" className="hover:text-[#003366]">市场数据</Link>
              <Link href="/analysis" className="hover:text-[#003366]">分析工具</Link>
              <Link href="/education" className="hover:text-[#003366]">投资教育</Link>
            </div>
            <div className="mt-6 text-xs text-gray-400">
              © 2025 SmartFin Technology. 保留所有权利。
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}