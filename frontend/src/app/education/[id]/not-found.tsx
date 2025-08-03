import Link from 'next/link'
import { BookOpen, ArrowLeft } from 'lucide-react'

export default function CourseNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="h-12 w-12 text-gray-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          课程未找到
        </h1>
        
        <p className="text-gray-600 mb-8">
          抱歉，您要查找的课程不存在或已被移除。请检查链接是否正确，或浏览我们的其他课程。
        </p>
        
        <div className="space-y-4">
          <Link
            href="/education"
            className="block w-full bg-[#003366] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#000f1e] transition-colors"
          >
            浏览所有课程
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-[#003366] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}