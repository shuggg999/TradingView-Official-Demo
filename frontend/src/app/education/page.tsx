import { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import { allCourses, basicCourses, advancedCourses, practicalCourses } from '@/lib/data/courses';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '投资教育 - SmartFin Technology Platform',
  description: '专业的投资教育课程、交易策略和金融知识分享',
};

interface SearchParams {
  category?: string;
  difficulty?: string;
  search?: string;
}

function getCourses(searchParams: SearchParams = {}) {
  const { category, difficulty, search } = searchParams;
  
  let filteredCourses = allCourses.filter(course => course.published);
  
  // Filter by category
  if (category) {
    filteredCourses = filteredCourses.filter(course => course.category === category);
  }
  
  // Filter by difficulty
  if (difficulty) {
    filteredCourses = filteredCourses.filter(course => course.level === difficulty);
  }
  
  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredCourses = filteredCourses.filter(course => 
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower)
    );
  }
  
  return filteredCourses;
}

function getCategories() {
  return [
    { id: 'basic', name: '基础课程', description: '投资基础知识' },
    { id: 'advanced', name: '进阶课程', description: '高级投资策略' },
    { id: 'practical', name: '实战课程', description: '实践操作技巧' },
  ];
}

export default async function EducationPage({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParams>
}) {
  const resolvedSearchParams = await searchParams;
  const courses = getCourses(resolvedSearchParams);
  const categories = getCategories();

  const getDifficultyBadge = (difficulty: string) => {
    const styles = {
      BEGINNER: 'bg-green-100 text-green-800',
      INTERMEDIATE: 'bg-yellow-100 text-yellow-800', 
      ADVANCED: 'bg-red-100 text-red-800'
    };
    const labels = {
      BEGINNER: '入门',
      INTERMEDIATE: '进阶',
      ADVANCED: '高级'
    };
    return {
      style: styles[difficulty as keyof typeof styles] || styles.BEGINNER,
      label: labels[difficulty as keyof typeof labels] || '入门'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#002244] to-[#000f1e] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            投资教育中心
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            从入门到专家，全面的金融投资教育体系
          </p>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{courses.length}</div>
                <div className="text-sm text-gray-300">专业课程</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{courses.reduce((total, course) => total + course.lessons.length, 0)}</div>
                <div className="text-sm text-gray-300">学习课时</div>
              </div>
              <div>
                <div className="text-2xl font-bold">免费</div>
                <div className="text-sm text-gray-300">开放学习</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Course Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/education"
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                !resolvedSearchParams.category 
                  ? 'bg-[#002244] text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              全部课程 ({allCourses.filter(c => c.published).length})
            </Link>
            <Link
              href="/education?category=basic"
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                resolvedSearchParams.category === 'basic'
                  ? 'bg-[#002244] text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              基础课程 ({basicCourses.filter(c => c.published).length})
            </Link>
            <Link
              href="/education?category=advanced"
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                resolvedSearchParams.category === 'advanced'
                  ? 'bg-[#002244] text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              进阶课程 ({advancedCourses.filter(c => c.published).length})
            </Link>
            <Link
              href="/education?category=practical"
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                resolvedSearchParams.category === 'practical'
                  ? 'bg-[#002244] text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              实战课程 ({practicalCourses.filter(c => c.published).length})
            </Link>
          </div>
        </div>

        {/* Course List */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {resolvedSearchParams.category === 'basic' ? '基础课程' :
             resolvedSearchParams.category === 'advanced' ? '进阶课程' :
             resolvedSearchParams.category === 'practical' ? '实战课程' : '全部课程'}
          </h2>
          
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => {
                const difficultyBadge = getDifficultyBadge(course.level);
                return (
                  <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyBadge.style}`}>
                          {difficultyBadge.label}
                        </span>
                        <span className="text-sm text-gray-500">{course.lessons.length} 课时</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {course.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.duration ? `${Math.floor(course.duration / 60)}小时${course.duration % 60}分钟` : '时长待定'}
                        </div>
                        <Link
                          href={`/education/courses/${course.id}`}
                          className="bg-[#002244] hover:bg-[#001122] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          {course.price === 0 ? '免费学习' : `¥${course.price}`}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无课程</h3>
              <p className="text-gray-500">课程内容正在准备中，请稍后再来查看。</p>
            </div>
          )}
        </div>

        {/* Learning Benefits */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择SmartFin教育？</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">专业内容</h3>
              <p className="text-gray-600 text-sm">精选优质投资教育视频，涵盖从基础到高级的完整学习路径</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">实时数据</h3>
              <p className="text-gray-600 text-sm">结合实时市场数据，理论与实践相结合的学习体验</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">进度跟踪</h3>
              <p className="text-gray-600 text-sm">完整的学习进度管理，帮助您系统化地掌握投资知识</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}