import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/config/auth';
import Navigation from '@/components/layout/Navigation';
import { TradingDashboard } from '@/components/trading/TradingDashboard';

export const metadata: Metadata = {
  title: '模拟交易 - SmartFin教育平台',
  description: '使用虚拟资金进行股票交易练习，提升投资技能',
};

export default async function TradingPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/trading');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">模拟交易</h1>
              <p className="text-gray-600 mt-2">使用虚拟资金练习股票交易，无风险提升投资技能</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">提示：</span>
                所有交易均为模拟，使用虚拟资金，不涉及真实金钱
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TradingDashboard />
      </div>
    </div>
  );
}