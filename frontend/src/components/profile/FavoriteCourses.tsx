'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Clock, Play } from 'lucide-react';

interface FavoriteCourse {
  id: string;
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    difficulty: string;
    category: {
      name: string;
    };
    lessons: Array<{ id: string }>;
  };
  createdAt: string;
}

export function FavoriteCourses() {
  const [favorites, setFavorites] = useState<FavoriteCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/education/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.slice(0, 3)); // 只显示最近的3个收藏
      }
    } catch (error) {
      console.error('获取收藏课程失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return '入门';
      case 'INTERMEDIATE':
        return '进阶';
      case 'ADVANCED':
        return '高级';
      default:
        return '未知';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Heart className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">收藏的课程</h2>
        </div>
        {favorites.length > 0 && (
          <Link
            href="/profile/favorites"
            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
          >
            查看全部
          </Link>
        )}
      </div>

      {favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Link
                    href={`/education/courses/${favorite.course.slug}`}
                    className="text-lg font-medium text-gray-900 hover:text-purple-600 transition-colors line-clamp-1"
                  >
                    {favorite.course.title}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {favorite.course.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(favorite.course.difficulty)}`}>
                    {getDifficultyLabel(favorite.course.difficulty)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {favorite.course.lessons.length} 课时
                  </span>
                </div>

                <Link
                  href={`/education/courses/${favorite.course.slug}`}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
                >
                  <Play className="w-3 h-3" />
                  <span>开始学习</span>
                </Link>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>分类: {favorite.course.category.name}</span>
                  <span>收藏于: {new Date(favorite.createdAt).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">暂无收藏的课程</p>
          <p className="text-gray-400 text-xs mt-1">
            浏览课程时点击收藏按钮来收藏您感兴趣的课程
          </p>
          <Link
            href="/education"
            className="inline-block mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            去发现课程 →
          </Link>
        </div>
      )}
    </div>
  );
}