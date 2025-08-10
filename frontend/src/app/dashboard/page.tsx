import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/config/auth';
import { TrendingUp, Users, BarChart3, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '控制台 - SmartFin教育平台',
  description: '投资组合管理和交易分析控制台',
};

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  // 模拟数据
  const portfolioStats = {
    totalValue: 523450.67,
    todayChange: 2340.45,
    todayChangePercent: 0.45,
    cash: 125000.00,
    invested: 398450.67,
  };

  const marketData = [
    { symbol: 'AAPL', price: 150.25, change: 2.34, changePercent: 1.58 },
    { symbol: 'GOOGL', price: 2501.45, change: -15.23, changePercent: -0.60 },
    { symbol: 'MSFT', price: 300.78, change: 5.67, changePercent: 1.92 },
    { symbol: 'TSLA', price: 245.89, change: -8.45, changePercent: -3.32 },
  ];

  const recentOrders = [
    { symbol: 'AAPL', side: 'BUY', quantity: 100, price: 148.90, time: '10:30' },
    { symbol: 'GOOGL', side: 'SELL', quantity: 50, price: 2515.30, time: '09:45' },
    { symbol: 'MSFT', side: 'BUY', quantity: 200, price: 295.50, time: '09:15' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">控制台</h1>
              <p className="text-gray-600 mt-1">欢迎回来，{session.user.name || session.user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/trading"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                开始交易
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总资产</p>
                <p className="text-2xl font-bold text-gray-900">
                  ¥{portfolioStats.totalValue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">今日盈亏</p>
                <p className={`text-2xl font-bold ${portfolioStats.todayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolioStats.todayChange >= 0 ? '+' : ''}¥{Math.abs(portfolioStats.todayChange).toLocaleString()}
                </p>
                <p className={`text-sm ${portfolioStats.todayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolioStats.todayChange >= 0 ? '+' : ''}{portfolioStats.todayChangePercent}%
                </p>
              </div>
              <div className={`p-3 rounded-full ${portfolioStats.todayChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {portfolioStats.todayChange >= 0 ? (
                  <ArrowUpRight className="w-6 h-6 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">可用现金</p>
                <p className="text-2xl font-bold text-gray-900">
                  ¥{portfolioStats.cash.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已投资</p>
                <p className="text-2xl font-bold text-gray-900">
                  ¥{portfolioStats.invested.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Market Watch */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">市场行情</h2>
                <Link href="/market" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  查看更多 →
                </Link>
              </div>
              <div className="space-y-4">
                {marketData.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">{stock.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{stock.symbol}</p>
                        <p className="text-sm text-gray-500">${stock.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}
                      </p>
                      <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Orders */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
              <div className="space-y-3">
                <Link
                  href="/trading"
                  className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">模拟交易</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-purple-600" />
                </Link>
                <Link
                  href="/charts"
                  className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">图表分析</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-blue-600" />
                </Link>
                <Link
                  href="/education"
                  className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">投资教育</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">最近订单</h3>
                <Link href="/trading" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  查看全部
                </Link>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                        order.side === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {order.side === 'BUY' ? '买入' : '卖出'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.symbol}</p>
                        <p className="text-xs text-gray-500">{order.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{order.quantity}股</p>
                      <p className="text-xs text-gray-500">${order.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Educational Progress */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">学习进度</h2>
            <Link href="/education" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
              继续学习 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">10</div>
              <div className="text-sm text-gray-600">已完成基础课程</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-sm text-gray-600">正在学习进阶课程</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-sm text-gray-600">实战课程待解锁</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}