'use client';

import { useState } from 'react';
import { Settings, Monitor, Moon, Sun, Globe, Save } from 'lucide-react';

interface UserSettingsProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function UserSettings({ user }: UserSettingsProps) {
  const [settings, setSettings] = useState({
    theme: 'system', // light, dark, system
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    autoPlay: true,
    emailNotifications: true,
    pushNotifications: true,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('设置已保存');
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      console.error('保存设置失败:', error);
      alert('保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">常规设置</h2>
      </div>

      <div className="space-y-6">
        {/* 主题设置 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            外观主题
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleChange('theme', 'light')}
              className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                settings.theme === 'light'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Sun className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">浅色</span>
            </button>
            <button
              onClick={() => handleChange('theme', 'dark')}
              className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                settings.theme === 'dark'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Moon className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">深色</span>
            </button>
            <button
              onClick={() => handleChange('theme', 'system')}
              className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                settings.theme === 'system'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Monitor className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">跟随系统</span>
            </button>
          </div>
        </div>

        {/* 语言设置 */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
            语言
          </label>
          <select
            id="language"
            value={settings.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="zh-CN">简体中文</option>
            <option value="zh-TW">繁體中文</option>
            <option value="en-US">English</option>
            <option value="ja-JP">日本語</option>
            <option value="ko-KR">한국어</option>
          </select>
        </div>

        {/* 时区设置 */}
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
            时区
          </label>
          <select
            id="timezone"
            value={settings.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="Asia/Shanghai">北京时间 (UTC+8)</option>
            <option value="Asia/Hong_Kong">香港时间 (UTC+8)</option>
            <option value="Asia/Taipei">台北时间 (UTC+8)</option>
            <option value="Asia/Tokyo">东京时间 (UTC+9)</option>
            <option value="America/New_York">纽约时间 (UTC-5/-4)</option>
            <option value="Europe/London">伦敦时间 (UTC+0/+1)</option>
          </select>
        </div>

        {/* 日期时间格式 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-2">
              日期格式
            </label>
            <select
              id="dateFormat"
              value={settings.dateFormat}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="YYYY-MM-DD">2024-01-15</option>
              <option value="DD/MM/YYYY">15/01/2024</option>
              <option value="MM/DD/YYYY">01/15/2024</option>
              <option value="DD-MM-YYYY">15-01-2024</option>
            </select>
          </div>

          <div>
            <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 mb-2">
              时间格式
            </label>
            <select
              id="timeFormat"
              value={settings.timeFormat}
              onChange={(e) => handleChange('timeFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="24h">24小时制 (14:30)</option>
              <option value="12h">12小时制 (2:30 PM)</option>
            </select>
          </div>
        </div>

        {/* 视频设置 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">视频播放</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoPlay}
                onChange={(e) => handleChange('autoPlay', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">自动播放下一个视频</span>
            </label>
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