'use client';

import { useState } from 'react';
import { User, Camera, Save, Loader2 } from 'lucide-react';

interface UserProfileFormProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserProfileForm({ user }: UserProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    bio: '',
    location: '',
    website: '',
    occupation: '',
    interests: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 显示成功提示
        alert('个人资料已更新');
      } else {
        throw new Error('更新失败');
      }
    } catch (error) {
      console.error('更新个人资料失败:', error);
      alert('更新失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">个人信息</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            {user.image ? (
              <img
                src={user.image}
                alt="头像"
                className="w-20 h-20 rounded-full border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-sm transition-colors"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">个人头像</p>
            <p className="text-xs text-gray-500">点击相机图标上传新头像</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              姓名
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              邮箱地址
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">邮箱地址无法修改</p>
          </div>

          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
              职业
            </label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="例如：软件工程师"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              所在地
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="例如：北京市"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              个人网站
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              个人简介
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="介绍一下自己..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
              兴趣爱好
            </label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="用逗号分隔，例如：股票投资, 技术分析, 区块链"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? '保存中...' : '保存更改'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}