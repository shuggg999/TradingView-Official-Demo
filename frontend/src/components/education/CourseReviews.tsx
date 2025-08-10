'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

interface CourseReviewsProps {
  courseId: string;
}

export function CourseReviews({ courseId }: CourseReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/education/reviews?courseId=${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('获取评价失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!session) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/education/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setComment('');
        setRating(5);
        fetchReviews(); // 重新获取评价列表
      }
    } catch (error) {
      console.error('提交评价失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${
              star <= rating 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          课程评价 ({reviews.length})
        </h3>
        {session && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            写评价
          </button>
        )}
      </div>

      {/* 评价表单 */}
      {showForm && (
        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
          <h4 className="font-medium mb-3">写一个评价</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              评分
            </label>
            {renderStars(rating, true, setRating)}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              评价内容 (可选)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="分享你的学习体验..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={submitReview}
              disabled={submitting}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? '提交中...' : '提交评价'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 评价列表 */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {review.user.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium text-sm">
                        {review.user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{review.user.name}</span>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500">暂无评价</p>
          <p className="text-sm text-gray-400 mt-1">成为第一个评价这门课程的人</p>
        </div>
      )}
    </div>
  );
}