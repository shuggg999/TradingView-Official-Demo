'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  CheckCircle, 
  Clock, 
  PlayCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface CourseSidebarProps {
  course: any
  currentLessonId: string
}

export default function CourseSidebar({ course, currentLessonId }: CourseSidebarProps) {
  const [expandedChapters, setExpandedChapters] = useState<number[]>([1])

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    )
  }

  const totalLessons = course.chapters.reduce((total: number, chapter: any) => total + chapter.lessons.length, 0)
  const completedLessons = course.chapters.reduce((total: number, chapter: any) => 
    total + chapter.lessons.filter((lesson: any) => lesson.completed).length, 0
  )
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Course Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">课程进度</span>
          <span className="text-sm text-gray-600">{completedLessons}/{totalLessons}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#003366] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {progressPercentage.toFixed(0)}% 完成
        </div>
      </div>

      {/* Chapter List */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-900 mb-3">课程目录</h3>
        {course.chapters.map((chapter: any, chapterIndex: number) => (
          <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full px-3 py-2 bg-gray-50 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">
                第{chapterIndex + 1}章：{chapter.title}
              </span>
              {expandedChapters.includes(chapter.id) ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            
            {expandedChapters.includes(chapter.id) && (
              <div className="divide-y divide-gray-200">
                {chapter.lessons.map((lesson: any, lessonIndex: number) => (
                  <Link
                    key={lesson.id}
                    href={`/education/${course.id}/lesson/${lesson.id}`}
                    className={`block px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      lesson.id.toString() === currentLessonId ? 'bg-blue-50 border-r-2 border-[#003366]' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0">
                        {lesson.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <PlayCircle className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate ${
                          lesson.id.toString() === currentLessonId ? 'text-[#003366]' : 'text-gray-900'
                        }`}>
                          {chapterIndex + 1}.{lessonIndex + 1} {lesson.title}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}