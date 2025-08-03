import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ArrowRight, 
  ChevronRight,
  Star,
  MessageCircle
} from 'lucide-react'
import CourseSidebar from '@/components/education/CourseSidebar'
import LessonContent from '@/components/education/LessonContent'

// 模拟课程数据（与详情页面保持一致）
const courses = {
  '1': {
    id: '1',
    title: '投资基础入门',
    description: '从零开始学习投资，掌握基本概念和原理，建立正确的投资理念。',
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
    chapters: [
      {
        id: 1,
        title: '投资基础概念',
        lessons: [
          { 
            id: 1, 
            title: '什么是投资', 
            duration: '15分钟', 
            type: 'video', 
            completed: false,
            content: {
              summary: '本课程将介绍投资的基本概念，包括投资的定义、目的和重要性。我们将探讨投资与储蓄的区别，以及为什么投资对个人财务规划如此重要。',
              keyPoints: [
                '投资的基本定义和核心概念',
                '投资与储蓄的本质区别',
                '投资在个人财务规划中的重要作用',
                '不同类型投资的基本特征',
                '投资的长期价值和复利效应'
              ],
              transcript: `大家好，欢迎来到投资基础入门课程。我是李教授，今天我们要学习的第一个主题是"什么是投资"。

投资，简单来说，就是为了获得未来更多的收益而在当前投入资金或资源的行为。与储蓄不同，投资具有一定的风险性，但同时也提供了获得更高回报的可能性。

让我们先从最基本的概念开始。投资可以分为几个主要类型：

1. 股票投资：购买公司股份，成为公司的部分所有者
2. 债券投资：借钱给政府或公司，获得固定的利息回报
3. 房地产投资：购买房产以获得租金收入或价值增长
4. 基金投资：通过专业机构进行多元化投资

投资的核心原理是时间价值。今天的一元钱比明天的一元钱更有价值，因为今天的钱可以用来投资，产生额外的收益。这就是我们常说的"复利效应"。

例如，如果你每年投资10000元，年回报率为8%，那么30年后，你的投资将增长到约112万元。这就是复利的威力。

投资不仅仅是富人的游戏。实际上，越早开始投资，越能享受到时间和复利的好处。即使是小额投资，长期坚持也能带来可观的回报。

接下来，我们将深入探讨投资与储蓄的区别，以及如何开始你的投资之旅。记住，投资是一个学习过程，需要耐心和坚持。

好的，这就是我们第一课的内容。在下一课中，我们将详细讨论投资与储蓄的区别。谢谢大家的收听。`
            }
          },
          { 
            id: 2, 
            title: '投资与储蓄的区别', 
            duration: '12分钟', 
            type: 'video', 
            completed: false,
            content: {
              summary: '深入分析投资和储蓄的本质差异，帮助学员理解两者在个人财务管理中的不同作用和适用场景。',
              keyPoints: [
                '储蓄的特点：安全性高、流动性强、收益率低',
                '投资的特点：风险较高、收益潜力大、时间要求长',
                '投资与储蓄的风险收益比较',
                '如何在投资和储蓄之间取得平衡',
                '不同人生阶段的投资储蓄策略'
              ],
              transcript: `在上一课中，我们了解了什么是投资。今天我们要讨论一个很多人都关心的问题：投资和储蓄到底有什么区别？

首先，让我们看看储蓄的特点。储蓄通常指的是将钱存放在银行的储蓄账户或定期存款中。储蓄的主要优点是：

1. 安全性高：本金有保障，不会损失
2. 流动性强：随时可以取出使用
3. 收益稳定：利率相对固定，不会波动

但储蓄也有明显的缺点：
1. 收益率低：目前银行存款利率通常在1-3%之间
2. 通胀风险：如果通胀率高于存款利率，实际购买力会下降

现在我们来看投资的特点。投资包括股票、债券、基金、房地产等多种形式。投资的特点是：

1. 收益潜力大：长期来看，股票市场平均年回报率可达8-10%
2. 资产增值：好的投资可以实现资产的大幅增长
3. 对抗通胀：优质投资通常能跑赢通胀

但投资也存在风险：
1. 本金可能损失：投资有亏损的可能
2. 波动性大：短期内价值可能大幅波动
3. 需要专业知识：需要学习和研究

那么，我们应该如何选择呢？

实际上，这不是一个非此即彼的选择。明智的做法是将储蓄和投资结合起来：

1. 紧急储备：保持3-6个月生活费的储蓄作为紧急基金
2. 短期目标：1-2年内需要用的钱适合储蓄
3. 长期目标：5年以上的财务目标适合投资

举个例子：如果你30岁，计划60岁退休，那么退休资金就适合投资，因为有30年的时间可以承受市场波动。但如果你明年要买车，那这笔钱就应该储蓄。

记住，储蓄和投资都是财务规划的重要组成部分。储蓄提供安全保障，投资创造财富增长。两者相结合，才能实现稳健的财务目标。

在下一课中，我们将讨论风险与收益的关系，这是投资中最重要的概念之一。`
            }
          },
          { 
            id: 3, 
            title: '风险与收益', 
            duration: '18分钟', 
            type: 'video', 
            completed: false,
            content: {
              summary: '解释风险与收益的基本关系，介绍不同投资工具的风险收益特征，帮助学员建立正确的风险意识。',
              keyPoints: [
                '风险与收益正相关的基本原理',
                '系统性风险与非系统性风险',
                '如何衡量投资风险',
                '风险承受能力的评估',
                '风险管理的基本策略'
              ],
              transcript: '在这一课中，我们将深入探讨投资中最核心的概念：风险与收益的关系...'
            }
          }
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
      }
    ]
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string; lessonId: string } 
}): Promise<Metadata> {
  const course = courses[params.id as keyof typeof courses]
  
  if (!course) {
    return {
      title: '课程未找到 - SmartFin Technology',
      description: '您要查找的课程不存在。'
    }
  }

  // 查找具体课程
  let lesson = null
  for (const chapter of course.chapters) {
    lesson = chapter.lessons.find(l => l.id.toString() === params.lessonId)
    if (lesson) break
  }

  if (!lesson) {
    return {
      title: '课程未找到 - SmartFin Technology',
      description: '您要查找的课程不存在。'
    }
  }

  return {
    title: `${lesson.title} - ${course.title} - SmartFin Technology`,
    description: `学习${lesson.title}，课程时长${lesson.duration}`,
  }
}

interface LessonPageProps {
  params: {
    id: string
    lessonId: string
  }
}

function Breadcrumb({ course, lesson, chapter }: { course: any; lesson: any; chapter: any }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      <Link href="/" className="hover:text-[#003366]">首页</Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/education" className="hover:text-[#003366]">投资教育</Link>
      <ChevronRight className="h-4 w-4" />
      <Link href={`/education/${course.id}`} className="hover:text-[#003366]">{course.title}</Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-gray-900">{lesson.title}</span>
    </nav>
  )
}


function LessonNavigation({ course, currentLessonId }: { course: any; currentLessonId: string }) {
  // 找到当前课程的前一课和后一课
  const allLessons: any[] = []
  course.chapters.forEach((chapter: any) => {
    chapter.lessons.forEach((lesson: any) => {
      allLessons.push(lesson)
    })
  })

  const currentIndex = allLessons.findIndex(lesson => lesson.id.toString() === currentLessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-8">
      <div className="flex-1">
        {prevLesson && (
          <Link
            href={`/education/${course.id}/lesson/${prevLesson.id}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#003366] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <div>
              <div className="text-xs text-gray-500">上一课</div>
              <div className="font-medium">{prevLesson.title}</div>
            </div>
          </Link>
        )}
      </div>
      
      <div className="flex-1 text-right">
        {nextLesson && (
          <Link
            href={`/education/${course.id}/lesson/${nextLesson.id}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#003366] transition-colors"
          >
            <div className="text-right">
              <div className="text-xs text-gray-500">下一课</div>
              <div className="font-medium">{nextLesson.title}</div>
            </div>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        )}
      </div>
    </div>
  )
}


export default function LessonPage({ params }: LessonPageProps) {
  const course = courses[params.id as keyof typeof courses]

  if (!course) {
    notFound()
  }

  // 查找具体的课程和章节
  let lesson = null
  let chapter = null
  
  for (const ch of course.chapters) {
    const foundLesson = ch.lessons.find(l => l.id.toString() === params.lessonId)
    if (foundLesson) {
      lesson = foundLesson
      chapter = ch
      break
    }
  }

  if (!lesson || !chapter) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        {/* Back to Course */}
        <div className="mb-4">
          <Link
            href={`/education/${course.id}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#003366] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回课程详情
          </Link>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb course={course} lesson={lesson} chapter={chapter} />

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <LessonContent lesson={lesson} />
              <LessonNavigation course={course} currentLessonId={params.lessonId} />
            </div>

            {/* Discussion Section (Placeholder) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  课程讨论
                </h3>
                <span className="text-sm text-gray-500">12条评论</span>
              </div>
              
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>登录后可参与课程讨论</p>
                <Link 
                  href="/login"
                  className="inline-block mt-2 text-[#003366] hover:underline"
                >
                  立即登录
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CourseSidebar course={course} currentLessonId={params.lessonId} />
              
              {/* Course Rating */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
                <h3 className="font-medium text-gray-900 mb-3">为课程评分</h3>
                <div className="flex items-center space-x-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                  ))}
                </div>
                <button className="w-full bg-[#003366] text-white py-2 px-3 rounded text-sm hover:bg-[#000f1e] transition-colors">
                  提交评分
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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