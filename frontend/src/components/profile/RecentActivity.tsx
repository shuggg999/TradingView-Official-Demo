'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, BookOpen, Heart, MessageSquare, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'course_completed' | 'lesson_watched' | 'course_favorited' | 'note_created' | 'review_posted';
  title: string;
  description: string;
  courseSlug?: string;
  createdAt: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/user/recent-activity');
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('获取最近活动失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'course_completed':
        return <BookOpen className="w-4 h-4 text-green-600" />;
      case 'lesson_watched':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'course_favorited':
        return <Heart className="w-4 h-4 text-red-600" />;
      case 'note_created':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'review_posted':
        return <MessageSquare className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'course_completed':
        return 'bg-green-50 border-green-200';
      case 'lesson_watched':
        return 'bg-blue-50 border-blue-200';
      case 'course_favorited':
        return 'bg-red-50 border-red-200';
      case 'note_created':
        return 'bg-purple-50 border-purple-200';
      case 'review_posted':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Activity className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">最近活动</h2>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`p-4 rounded-lg border ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 p-2 bg-white rounded-full">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {activity.courseSlug ? (
                        <Link
                          href={`/education/courses/${activity.courseSlug}`}
                          className="hover:text-purple-600 transition-colors"
                        >
                          {activity.title}
                        </Link>
                      ) : (
                        activity.title
                      )}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <Link
              href="/profile/activity"
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              查看全部活动 →
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">暂无最近活动</p>
          <p className="text-gray-400 text-xs mt-1">开始学习课程来记录您的学习历程</p>
        </div>
      )}
    </div>
  );
}