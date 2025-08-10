import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/config/auth';
import Navigation from '@/components/layout/Navigation';
import { TradingViewChart } from '@/components/charts/TradingViewChart';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

export const metadata: Metadata = {
  title: '图表分析 - SmartFin教育平台',
  description: '专业的股票图表分析工具，支持K线图、技术指标和实时数据',
};

export default async function ChartsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/charts');
  }

  const popularSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">专业图表分析</h1>
              <p className="text-gray-600 mt-2">基于TradingView技术的专业K线图表和技术分析工具</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 主要图表 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <TradingViewChart 
              symbol="AAPL" 
              height={500} 
              showVolume={true} 
              showIndicators={true} 
            />
          </div>

          {/* 热门股票图表 */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">热门股票</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {popularSymbols.slice(1, 5).map((symbol) => (
                <div key={symbol} className="bg-white rounded-lg shadow-sm p-6">
                  <TradingViewChart 
                    symbol={symbol} 
                    height={300} 
                    showVolume={false} 
                    showIndicators={true} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 图表功能介绍 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">图表功能</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">专业K线图</h3>
                <p className="text-sm text-gray-600">
                  基于TradingView Lightweight Charts，提供专业级的K线图表显示
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">技术指标</h3>
                <p className="text-sm text-gray-600">
                  支持移动平均线、MACD、RSI等常用技术指标分析
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">成交量分析</h3>
                <p className="text-sm text-gray-600">
                  集成成交量指标，帮助您更好地分析市场动态
                </p>
              </div>
            </div>
          </div>

          {/* 升级提示 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  升级到TradingView Advanced Charts
                </h3>
                <p className="text-gray-600 mb-4">
                  我们正在申请TradingView Advanced Charts访问权限，届时将提供更多专业功能：
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 更多技术指标和绘图工具</li>
                  <li>• 实时数据和警报功能</li>
                  <li>• 多时间框架分析</li>
                  <li>• 专业交易界面</li>
                </ul>
              </div>
              <div className="ml-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-10 h-10 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}