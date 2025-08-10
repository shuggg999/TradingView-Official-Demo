'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ProgressTrackerProps {
  lessonId: string;
  courseId: string;
  videoDuration?: number;
}

interface Progress {
  completed: boolean;
  watchTime: number;
  lastWatched?: string;
}

export function ProgressTracker({ lessonId, courseId, videoDuration = 0 }: ProgressTrackerProps) {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [watchTime, setWatchTime] = useState(0);

  useEffect(() => {
    if (session) {
      fetchProgress();
    }
  }, [lessonId, session]);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/education/progress?lessonId=${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
        if (data?.watchTime) {
          setWatchTime(data.watchTime);
        }
      }
    } catch (error) {
      console.error('获取进度失败:', error);
    }
  };

  const updateProgress = async (completed: boolean, currentWatchTime?: number) => {
    if (!session) return;

    try {
      const response = await fetch('/api/education/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          courseId,
          completed,
          watchTime: currentWatchTime || watchTime,
        }),
      });

      if (response.ok) {
        const updatedProgress = await response.json();
        setProgress(updatedProgress);
      }
    } catch (error) {
      console.error('更新进度失败:', error);
    }
  };

  const markAsCompleted = () => {
    updateProgress(true, videoDuration);
  };

  const updateWatchTime = (time: number) => {
    setWatchTime(time);
    // 自动更新观看时间（防抖）
    const timer = setTimeout(() => {
      updateProgress(time >= videoDuration * 0.8, time);
    }, 2000);

    return () => clearTimeout(timer);
  };

  if (!session) {
    return null;
  }

  const progressPercentage = videoDuration > 0 ? Math.min((watchTime / videoDuration) * 100, 100) : 0;

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">学习进度</h4>
        <span className={`text-sm px-2 py-1 rounded ${
          progress?.completed 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {progress?.completed ? '已完成' : '学习中'}
        </span>
      </div>

      {/* 进度条 */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>观看进度</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* 时间信息 */}
      <div className="flex justify-between text-sm text-gray-500 mb-3">
        <span>观看时间: {Math.floor(watchTime / 60)}分{watchTime % 60}秒</span>
        <span>总时长: {Math.floor(videoDuration / 60)}分{videoDuration % 60}秒</span>
      </div>

      {/* 完成按钮 */}
      {!progress?.completed && progressPercentage >= 80 && (
        <button
          onClick={markAsCompleted}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors"
        >
          标记为已完成
        </button>
      )}

      {/* 最后观看时间 */}
      {progress?.lastWatched && (
        <p className="text-xs text-gray-400 mt-2">
          最后观看: {new Date(progress.lastWatched).toLocaleString('zh-CN')}
        </p>
      )}
    </div>
  );
}