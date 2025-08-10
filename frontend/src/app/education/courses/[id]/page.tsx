import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import { allCourses } from '@/lib/data/courses';
import { Clock, Users, Award, ArrowLeft, Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const course = allCourses.find(c => c.id === id);
  
  if (!course) {
    return {
      title: '课程未找到 - SmartFin教育平台',
    };
  }

  return {
    title: `${course.title} - SmartFin教育平台`,
    description: course.description,
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  const course = allCourses.find(c => c.id === id);

  if (!course) {
    notFound();
  }

  const getDifficultyBadge = (level: string) => {
    const styles = {
      BEGINNER: 'bg-green-100 text-green-800 border-green-200',
      INTERMEDIATE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ADVANCED: 'bg-red-100 text-red-800 border-red-200'
    };
    const labels = {
      BEGINNER: '入门级',
      INTERMEDIATE: '进阶级',
      ADVANCED: '高级'
    };
    return {
      style: styles[level as keyof typeof styles] || styles.BEGINNER,
      label: labels[level as keyof typeof labels] || '入门级'
    };
  };

  const getCategoryBadge = (category: string) => {
    const styles = {
      basic: 'bg-green-100 text-green-800',
      advanced: 'bg-blue-100 text-blue-800',
      practical: 'bg-orange-100 text-orange-800'
    };
    const labels = {
      basic: '基础课程',
      advanced: '进阶课程',
      practical: '实战课程'
    };
    return {
      style: styles[category as keyof typeof styles] || styles.basic,
      label: labels[category as keyof typeof labels] || '基础课程'
    };
  }

  const difficultyBadge = getDifficultyBadge(course.level);
  const categoryBadge = getCategoryBadge(course.category);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">首页</Link>
            <span className="text-gray-400">/</span>
            <Link href="/education" className="text-gray-500 hover:text-gray-700">投资教育</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{course.title}</span>
          </div>
        </div>
      </div>

      {/* Course Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryBadge.style}`}>
                  {categoryBadge.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${difficultyBadge.style}`}>
                  {difficultyBadge.label}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{course.description}</p>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{Math.floor(course.duration / 60)}小时{course.duration % 60}分钟</span>
                </div>
                <div className="flex items-center">
                  <Play className="w-4 h-4 mr-1" />
                  <span>{course.lessons.length} 课时</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  <span>{difficultyBadge.label}</span>
                </div>
              </div>
            </div>

            <div className="ml-8">
              <div className="bg-gray-50 rounded-lg p-6 w-80">
                <div className="text-center mb-4">
                  {course.price === 0 ? (
                    <div className="text-2xl font-bold text-green-600">免费</div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">¥{course.price}</div>
                  )}
                </div>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors mb-4">
                  {course.price === 0 ? '开始免费学习' : '立即购买'}
                </button>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>课程时长</span>
                    <span>{Math.floor(course.duration / 60)}小时{course.duration % 60}分钟</span>
                  </div>
                  <div className="flex justify-between">
                    <span>课时数量</span>
                    <span>{course.lessons.length} 节</span>
                  </div>
                  <div className="flex justify-between">
                    <span>难度等级</span>
                    <span>{difficultyBadge.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>学习方式</span>
                    <span>在线学习</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">课程介绍</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">{course.description}</p>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">学习目标</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>掌握{course.title}的核心概念和基本原理</li>
                  <li>学会在实际投资中应用相关知识和技巧</li>
                  <li>建立系统化的投资思维和分析能力</li>
                  <li>提升投资决策的准确性和有效性</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">适合人群</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {course.level === 'BEGINNER' && (
                    <>
                      <li>投资新手和初学者</li>
                      <li>希望系统学习投资基础知识的人员</li>
                      <li>想要建立正确投资理念的投资者</li>
                    </>
                  )}
                  {course.level === 'INTERMEDIATE' && (
                    <>
                      <li>有一定投资经验的投资者</li>
                      <li>希望提升投资技能的专业人员</li>
                      <li>需要深化投资知识的从业者</li>
                    </>
                  )}
                  {course.level === 'ADVANCED' && (
                    <>
                      <li>资深投资者和专业交易员</li>
                      <li>金融行业从业人员</li>
                      <li>追求高级投资策略的投资者</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Course Curriculum */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">课程大纲</h2>
              <div className="space-y-4">
                {course.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{lesson.duration} 分钟</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                        {course.price === 0 ? '查看介绍' : '预览'}
                      </button>
                    </div>
                    
                    {/* Lesson preview */}
                    <div className="mt-4 pl-12">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {lesson.content.substring(0, 200) + '...'}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Courses */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">相关课程</h3>
              <div className="space-y-4">
                {allCourses
                  .filter(c => c.category === course.category && c.id !== course.id)
                  .slice(0, 3)
                  .map((relatedCourse) => (
                    <Link
                      key={relatedCourse.id}
                      href={`/education/courses/${relatedCourse.id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 text-sm mb-1">{relatedCourse.title}</h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{relatedCourse.lessons.length} 课时</span>
                        <span>{relatedCourse.price === 0 ? '免费' : `¥${relatedCourse.price}`}</span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}