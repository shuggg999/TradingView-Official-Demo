import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/config/auth';
import Navigation from '@/components/layout/Navigation';
import { UserProfileForm } from '@/components/profile/UserProfileForm';
import { LearningStats } from '@/components/profile/LearningStats';
import { RecentActivity } from '@/components/profile/RecentActivity';
import { FavoriteCourses } from '@/components/profile/FavoriteCourses';

export const metadata: Metadata = {
  title: '个人资料 - SmartFin教育平台',
  description: '管理您的个人资料、学习进度和偏好设置',
};

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/profile');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || '用户头像'}
                  className="w-16 h-16 rounded-full border-2 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                  <span className="text-2xl font-semibold text-purple-600">
                    {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {session.user.name || '用户'}
              </h1>
              <p className="text-gray-600">{session.user.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                加入时间: {new Date().toLocaleDateString('zh-CN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Form */}
          <div className="lg:col-span-2 space-y-8">
            <UserProfileForm user={session.user} />
            <RecentActivity />
          </div>

          {/* Right Column - Stats and Favorites */}
          <div className="space-y-8">
            <LearningStats />
            <FavoriteCourses />
          </div>
        </div>
      </div>
    </div>
  );
}