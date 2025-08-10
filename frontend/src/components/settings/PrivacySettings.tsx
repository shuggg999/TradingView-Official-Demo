'use client';

import { useState } from 'react';
import { Shield, Eye, EyeOff, Users, Save } from 'lucide-react';

export function PrivacySettings() {
  const [settings, setSettings] = useState({
    profileVisibility: 'public', // public, friends, private
    showActivity: true,
    showProgress: true,
    showCourses: true,
    allowMessages: 'everyone', // everyone, friends, none
    dataCollection: true,
    analytics: false,
    thirdPartySharing: false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/privacy-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('隐私设置已保存');
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      console.error('保存隐私设置失败:', error);
      alert('保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">隐私设置</h2>
      </div>

      <div className="space-y-6">
        {/* 个人资料可见性 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">个人资料可见性</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="profileVisibility"
                value="public"
                checked={settings.profileVisibility === 'public'}
                onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">公开 - 所有人都可以查看</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="profileVisibility"
                value="friends"
                checked={settings.profileVisibility === 'friends'}
                onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">好友 - 仅好友可以查看</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="profileVisibility"
                value="private"
                checked={settings.profileVisibility === 'private'}
                onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">私密 - 仅自己可见</span>
            </label>
          </div>
        </div>

        {/* 活动信息展示 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">活动信息展示</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-700">显示学习活动</span>
                  <p className="text-xs text-gray-500">让他人看到您的学习动态</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showActivity}
                onChange={(e) => setSettings(prev => ({ ...prev, showActivity: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-700">显示学习进度</span>
                  <p className="text-xs text-gray-500">让他人看到您的课程完成情况</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showProgress}
                onChange={(e) => setSettings(prev => ({ ...prev, showProgress: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-700">显示课程列表</span>
                  <p className="text-xs text-gray-500">让他人看到您正在学习的课程</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showCourses}
                onChange={(e) => setSettings(prev => ({ ...prev, showCourses: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>
          </div>
        </div>

        {/* 消息权限 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">消息权限</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="allowMessages"
                value="everyone"
                checked={settings.allowMessages === 'everyone'}
                onChange={(e) => setSettings(prev => ({ ...prev, allowMessages: e.target.value }))}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">所有人都可以给我发消息</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="allowMessages"
                value="friends"
                checked={settings.allowMessages === 'friends'}
                onChange={(e) => setSettings(prev => ({ ...prev, allowMessages: e.target.value }))}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">仅好友可以给我发消息</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="allowMessages"
                value="none"
                checked={settings.allowMessages === 'none'}
                onChange={(e) => setSettings(prev => ({ ...prev, allowMessages: e.target.value }))}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">不接收任何私信</span>
            </label>
          </div>
        </div>

        {/* 数据使用 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">数据使用</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">数据收集</span>
                <p className="text-xs text-gray-500">允许收集学习数据以改善服务</p>
              </div>
              <input
                type="checkbox"
                checked={settings.dataCollection}
                onChange={(e) => setSettings(prev => ({ ...prev, dataCollection: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">使用分析</span>
                <p className="text-xs text-gray-500">允许使用匿名数据进行产品分析</p>
              </div>
              <input
                type="checkbox"
                checked={settings.analytics}
                onChange={(e) => setSettings(prev => ({ ...prev, analytics: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">第三方共享</span>
                <p className="text-xs text-gray-500">允许与合作伙伴共享匿名数据</p>
              </div>
              <input
                type="checkbox"
                checked={settings.thirdPartySharing}
                onChange={(e) => setSettings(prev => ({ ...prev, thirdPartySharing: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
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