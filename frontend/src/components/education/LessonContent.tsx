'use client'

import { useState } from 'react'
import { 
  CheckCircle, 
  Clock, 
  PlayCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface LessonContentProps {
  lesson: any
}

export default function LessonContent({ lesson }: LessonContentProps) {
  const [showTranscript, setShowTranscript] = useState(false)
  const [isCompleted, setIsCompleted] = useState(lesson.completed || false)

  const handleMarkComplete = () => {
    setIsCompleted(!isCompleted)
    // 这里可以添加API调用来更新服务器端的完成状态
  }

  return (
    <div className="bg-white">
      {/* Video Player Placeholder */}
      <div className="aspect-video bg-gray-900 rounded-lg mb-6 flex items-center justify-center">
        <div className="text-center text-white">
          <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-80" />
          <div className="text-lg font-medium mb-2">{lesson.title}</div>
          <div className="text-sm opacity-80">时长：{lesson.duration}</div>
          <button className="mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-2 rounded-lg transition-colors">
            播放视频
          </button>
        </div>
      </div>

      {/* Lesson Info */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{lesson.duration}</span>
          </div>
          <div className="flex items-center">
            <PlayCircle className="h-4 w-4 mr-1" />
            <span>视频课程</span>
          </div>
        </div>
      </div>

      {/* Lesson Summary */}
      {lesson.content && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">课程概要</h2>
            <p className="text-gray-700">{lesson.content.summary}</p>
          </div>

          {/* Key Points */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">学习要点</h2>
            <ul className="space-y-2">
              {lesson.content.keyPoints.map((point: string, index: number) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Transcript */}
          <div>
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center justify-between w-full text-left"
            >
              <h2 className="text-lg font-semibold text-gray-900">课程文稿</h2>
              {showTranscript ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {showTranscript && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {lesson.content.transcript}
                </div>
              </div>
            )}
          </div>

          {/* Mark as Complete */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className={`h-6 w-6 ${isCompleted ? 'text-green-500' : 'text-gray-300'}`} />
                <span className="text-gray-700">标记为已完成</span>
              </div>
              <button 
                onClick={handleMarkComplete}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isCompleted 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-[#003366] text-white hover:bg-[#000f1e]'
                }`}
              >
                {isCompleted ? '已完成' : '标记完成'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}