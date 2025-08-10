'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface FavoriteButtonProps {
  courseId: string;
  className?: string;
}

export function FavoriteButton({ courseId, className = '' }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      checkFavoriteStatus();
    }
  }, [courseId, session]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch('/api/education/favorites');
      if (response.ok) {
        const favorites = await response.json();
        const isFav = favorites.some((fav: any) => fav.courseId === courseId);
        setIsFavorited(isFav);
      }
    } catch (error) {
      console.error('检查收藏状态失败:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!session) {
      // 可以在这里添加登录提示
      alert('请先登录后再收藏课程');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/education/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          action: isFavorited ? 'remove' : 'add',
        }),
      });

      if (response.ok) {
        setIsFavorited(!isFavorited);
      }
    } catch (error) {
      console.error('操作收藏失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null; // 未登录不显示收藏按钮
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`inline-flex items-center px-4 py-2 border rounded-md transition-colors disabled:opacity-50 ${
        isFavorited
          ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
      } ${className}`}
    >
      <svg
        className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`}
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {loading ? '处理中...' : isFavorited ? '已收藏' : '收藏'}
    </button>
  );
}