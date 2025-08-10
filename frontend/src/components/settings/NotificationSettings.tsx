'use client';

import { useState } from 'react';
import { Bell, Mail, MessageSquare, TrendingUp, BookOpen, Save } from 'lucide-react';

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: {
      courseUpdates: true,
      newLessons: true,
      assignments: true,
      marketAlerts: false,
      newsletter: true,
      promotions: false,
    },
    pushNotifications: {
      courseUpdates: true,
      newMessages: true,
      achievements: true,
      marketAlerts: false,
      reminders: true,
    },
    frequency: 'daily', // instant, daily, weekly
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00',
    },
  });
  const [saving, setSaving] = useState(false);

  const handleEmailChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: value
      }
    }));
  };

  const handlePushChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      pushNotifications: {
        ...prev.pushNotifications,
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('通知设置已保存');
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      console.error('保存通知设置失败:', error);
      alert('保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Bell className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">通知设置</h2>
      </div>

      <div className="space-y-8">
        {/* 邮件通知 */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="w-4 h-4 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">邮件通知</h3>
          </div>
          
          <div className="space-y-3 ml-6">
            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-700">课程更新</span>
                  <p className="text-xs text-gray-500">课程内容更新或有新课时发布时通知</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications.courseUpdates}
                onChange={(e) => handleEmailChange('courseUpdates', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-700">新课程发布</span>
                  <p className="text-xs text-gray-500">有符合您兴趣的新课程发布时通知</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications.newLessons}
                onChange={(e) => handleEmailChange('newLessons', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-700">作业和测验</span>
                  <p className="text-xs text-gray-500">有新的作业或测验时通知</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications.assignments}
                onChange={(e) => handleEmailChange('assignments', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-700">市场提醒</span>
                  <p className="text-xs text-gray-500">重要市场事件和价格变动提醒</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications.marketAlerts}
                onChange={(e) => handleEmailChange('marketAlerts', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-700">新闻资讯</span>
                  <p className="text-xs text-gray-500">定期接收平台新闻和学习资讯</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications.newsletter}
                onChange={(e) => handleEmailChange('newsletter', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-700">促销信息</span>
                  <p className="text-xs text-gray-500">特价课程和优惠活动通知</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications.promotions}
                onChange={(e) => handleEmailChange('promotions', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>
          </div>
        </div>

        {/* 推送通知 */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="w-4 h-4 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">推送通知</h3>
          </div>
          
          <div className="space-y-3 ml-6">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">课程更新</span>
                <p className="text-xs text-gray-500">实时推送课程更新信息</p>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications.courseUpdates}
                onChange={(e) => handlePushChange('courseUpdates', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">新消息</span>
                <p className="text-xs text-gray-500">收到新的私信或回复时通知</p>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications.newMessages}
                onChange={(e) => handlePushChange('newMessages', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">成就解锁</span>
                <p className="text-xs text-gray-500">获得新成就或完成里程碑时通知</p>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications.achievements}
                onChange={(e) => handlePushChange('achievements', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">学习提醒</span>
                <p className="text-xs text-gray-500">定时提醒您继续学习</p>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications.reminders}
                onChange={(e) => handlePushChange('reminders', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>
          </div>
        </div>

        {/* 通知频率 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">通知频率</h3>
          <div className="space-y-2 ml-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="frequency"
                value="instant"
                checked={settings.frequency === 'instant'}
                onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value }))}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">即时通知</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="frequency"
                value="daily"
                checked={settings.frequency === 'daily'}
                onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value }))}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">每日汇总</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="frequency"
                value="weekly"
                checked={settings.frequency === 'weekly'}
                onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value }))}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">每周汇总</span>
            </label>
          </div>
        </div>

        {/* 免打扰时间 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">免打扰时间</h3>
          <div className="ml-6">
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={settings.quietHours.enabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  quietHours: { ...prev.quietHours, enabled: e.target.checked }
                }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">启用免打扰时间</span>
            </label>
            
            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">开始时间</label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, start: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">结束时间</label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, end: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? '保存中...' : '保存设置'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}