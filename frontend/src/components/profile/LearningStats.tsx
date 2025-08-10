'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Clock, Trophy, BookOpen } from 'lucide-react';

interface LearningStatsData {
  totalCourses: number;
  completedCourses: number;
  totalWatchTime: number;
  currentStreak: number;
  favoriteCount: number;
  notesCount: number;
}

export function LearningStats() {
  const [stats, setStats] = useState<LearningStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/learning-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('获取学习统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">暂无学习数据</p>
        </div>
      </div>
    );
  }

  const completionRate = stats.totalCourses > 0 
    ? Math.round((stats.completedCourses / stats.totalCourses) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">学习统计</h2>
      </div>

      <div className="space-y-4">
        {/* 课程完成情况 */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">课程完成率</span>
            </div>
            <span className="text-lg font-semibold text-purple-600">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            已完成 {stats.completedCourses} / {stats.totalCourses} 门课程
          </p>
        </div>

        {/* 学习时长 */}
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">总学习时长</p>
              <p className="text-lg font-semibold text-green-600">
                {formatTime(stats.totalWatchTime)}
              </p>
            </div>
          </div>
        </div>

        {/* 学习连击 */}
        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Trophy className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">连续学习</p>
              <p className="text-lg font-semibold text-orange-600">
                {stats.currentStreak} 天
              </p>
            </div>
          </div>
        </div>

        {/* 其他统计 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.favoriteCount}</p>
            <p className="text-xs text-gray-600">收藏课程</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.notesCount}</p>
            <p className="text-xs text-gray-600">学习笔记</p>
          </div>
        </div>

        {/* 成就徽章 */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">学习成就</h3>
          <div className="flex flex-wrap gap-2">
            {stats.completedCourses >= 1 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                🎓 初学者
              </span>
            )}
            {stats.completedCourses >= 5 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                📚 学习达人
              </span>
            )}
            {stats.currentStreak >= 7 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                🔥 坚持不懈
              </span>
            )}
            {stats.totalWatchTime >= 600 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                ⏰ 时间管理大师
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}