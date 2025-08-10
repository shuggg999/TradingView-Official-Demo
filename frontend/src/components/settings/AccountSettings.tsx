'use client';

import { useState } from 'react';
import { Lock, Key, Smartphone, AlertTriangle, Trash2, Save } from 'lucide-react';

export function AccountSettings() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('新密码与确认密码不匹配');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        alert('密码已更新');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await response.json();
        alert(error.message || '密码更新失败');
      }
    } catch (error) {
      console.error('密码更新失败:', error);
      alert('密码更新失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle2FA = async (enabled: boolean) => {
    try {
      const response = await fetch('/api/user/2fa', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        setTwoFactorEnabled(enabled);
        alert(enabled ? '双因素认证已启用' : '双因素认证已禁用');
      } else {
        throw new Error('操作失败');
      }
    } catch (error) {
      console.error('双因素认证设置失败:', error);
      alert('操作失败，请稍后重试');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('确定要删除账户吗？此操作无法撤销。')) {
      return;
    }

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('账户已删除');
        window.location.href = '/';
      } else {
        throw new Error('删除失败');
      }
    } catch (error) {
      console.error('删除账户失败:', error);
      alert('删除失败，请稍后重试');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Lock className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">账户安全</h2>
      </div>

      <div className="space-y-8">
        {/* 修改密码 */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Key className="w-4 h-4 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">修改密码</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 ml-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                当前密码
              </label>
              <input
                type="password"
                id="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                新密码
              </label>
              <input
                type="password"
                id="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                required
                minLength={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">密码至少8位，建议包含字母、数字和特殊字符</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                确认新密码
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? '更新中...' : '更新密码'}</span>
            </button>
          </form>
        </div>

        {/* 双因素认证 */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Smartphone className="w-4 h-4 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">双因素认证</h3>
          </div>

          <div className="ml-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {twoFactorEnabled ? '双因素认证已启用' : '双因素认证已禁用'}
                </p>
                <p className="text-xs text-gray-500">
                  {twoFactorEnabled 
                    ? '您的账户受到额外保护' 
                    : '启用双因素认证以增强账户安全性'
                  }
                </p>
              </div>
              <button
                onClick={() => handleToggle2FA(!twoFactorEnabled)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  twoFactorEnabled
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {twoFactorEnabled ? '禁用' : '启用'}
              </button>
            </div>
          </div>
        </div>

        {/* 活跃会话 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">活跃会话</h3>
          <div className="ml-6 space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">当前设备</p>
                <p className="text-xs text-gray-500">Chrome on macOS - 最后活动：刚刚</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                当前
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">iPhone</p>
                <p className="text-xs text-gray-500">移动端浏览器 - 最后活动：2小时前</p>
              </div>
              <button className="text-red-600 hover:text-red-800 text-xs font-medium">
                终止会话
              </button>
            </div>

            <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
              终止所有其他会话
            </button>
          </div>
        </div>

        {/* 危险区域 */}
        <div className="border-t border-red-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h3 className="text-lg font-medium text-red-900">危险区域</h3>
          </div>

          <div className="ml-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-900">删除账户</p>
                  <p className="text-xs text-red-700">
                    一旦删除，您的所有数据将无法恢复。请谨慎操作。
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>删除账户</span>
                </button>
              </div>

              {showDeleteConfirm && (
                <div className="mt-4 p-3 bg-red-100 rounded-md">
                  <p className="text-sm text-red-800 mb-3">
                    确定要删除您的账户吗？此操作将：
                  </p>
                  <ul className="text-xs text-red-700 list-disc list-inside mb-3">
                    <li>永久删除您的个人资料和设置</li>
                    <li>删除所有学习进度和笔记</li>
                    <li>取消所有订阅和服务</li>
                    <li>无法恢复任何数据</li>
                  </ul>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium"
                    >
                      确认删除
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-xs font-medium"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}