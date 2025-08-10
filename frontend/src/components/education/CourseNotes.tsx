'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp?: number;
  createdAt: string;
  lesson?: { title: string };
  course?: { title: string };
}

interface CourseNotesProps {
  courseId: string;
  lessonId?: string;
  currentVideoTime?: number;
}

export function CourseNotes({ courseId, lessonId, currentVideoTime = 0 }: CourseNotesProps) {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      fetchNotes();
    }
  }, [courseId, lessonId, session]);

  const fetchNotes = async () => {
    try {
      const params = new URLSearchParams({ courseId });
      if (lessonId) params.append('lessonId', lessonId);
      
      const response = await fetch(`/api/education/notes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('获取笔记失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitNote = async () => {
    if (!session || !title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/education/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          title: title.trim(),
          content: content.trim(),
          timestamp: Math.floor(currentVideoTime),
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setTitle('');
        setContent('');
        fetchNotes(); // 重新获取笔记列表
      }
    } catch (error) {
      console.error('创建笔记失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">
          课程笔记 ({notes.length})
        </h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md transition-colors"
        >
          {showForm ? '取消' : '添加笔记'}
        </button>
      </div>

      {/* 笔记表单 */}
      {showForm && (
        <div className="border rounded-lg p-3 mb-4 bg-gray-50">
          <div className="mb-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="笔记标题"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="mb-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="记录你的学习心得..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {currentVideoTime > 0 && (
            <div className="text-xs text-gray-500 mb-3">
              视频时间: {formatTime(currentVideoTime)}
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={submitNote}
              disabled={submitting || !title.trim() || !content.trim()}
              className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm transition-colors"
            >
              {submitting ? '保存中...' : '保存笔记'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 笔记列表 */}
      {notes.length > 0 ? (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
              <div className="flex items-start justify-between mb-1">
                <h5 className="font-medium text-sm text-gray-900">{note.title}</h5>
                {note.timestamp !== undefined && (
                  <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                    {formatTime(note.timestamp)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 mb-2">{note.content}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{new Date(note.createdAt).toLocaleDateString('zh-CN')}</span>
                {note.lesson && (
                  <span>课时: {note.lesson.title}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-gray-500">暂无笔记</p>
          <p className="text-xs text-gray-400 mt-1">在学习过程中记录重要内容</p>
        </div>
      )}
    </div>
  );
}