'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, DollarSign, BarChart3 } from 'lucide-react';

interface PortfolioData {
  cash: number;
  positions: Array<{
    symbol: string;
    quantity: number;
    avgPrice: number;
  }>;
}

interface ReturnData {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  totalReturn: number;
  totalValue: number;
  initialValue: number;
}

export function ReturnStatistics() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  // 模拟股价
  const mockPrices: { [key: string]: number } = {
    'AAPL': 150.25,
    'GOOGL': 2500.50,
    'MSFT': 300.75,
    'TSLA': 800.00,
    'AMZN': 3200.25,
    'NVDA': 220.50,
    'META': 280.75,
    'NFLX': 400.25,
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/trading/portfolio');
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
      }
    } catch (error) {
      console.error('获取投资组合失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !portfolio) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // 计算收益统计
  const initialValue = 500000; // 初始虚拟资金
  const totalPositionValue = portfolio.positions.reduce((sum, position) => {
    const currentPrice = mockPrices[position.symbol] || position.avgPrice;
    return sum + (position.quantity * currentPrice);
  }, 0);
  const totalValue = portfolio.cash + totalPositionValue;
  const totalReturn = totalValue - initialValue;
  const totalReturnPercent = (totalReturn / initialValue) * 100;

  // 模拟不同时间段的收益率（实际应用中需要历史数据）
  const returnData: ReturnData = {
    daily: Math.random() * 2 - 1, // -1% 到 1%
    weekly: Math.random() * 5 - 2.5, // -2.5% 到 2.5%
    monthly: Math.random() * 8 - 4, // -4% 到 4%
    yearly: totalReturnPercent, // 使用实际总收益率
    totalReturn,
    totalValue,
    initialValue,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const getReturnColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getBgColor = (value: number) => {
    if (value > 0) return 'bg-green-50';
    if (value < 0) return 'bg-red-50';
    return 'bg-gray-50';
  };

  const returnPeriods = [
    { label: '日收益率', value: returnData.daily, icon: Calendar },
    { label: '周收益率', value: returnData.weekly, icon: Calendar },
    { label: '月收益率', value: returnData.monthly, icon: Calendar },
    { label: '年收益率', value: returnData.yearly, icon: Calendar },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">收益率统计</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 总体收益概览 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">投资组合概览</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-700">初始资金</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(returnData.initialValue)}
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-700">当前总值</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(returnData.totalValue)}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${getBgColor(returnData.totalReturn)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className={`w-5 h-5 ${getReturnColor(returnData.totalReturn)}`} />
                  <span className="font-medium text-gray-700">总盈亏</span>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getReturnColor(returnData.totalReturn)}`}>
                    {formatCurrency(returnData.totalReturn)}
                  </div>
                  <div className={`text-sm ${getReturnColor(returnData.totalReturn)}`}>
                    {formatPercent(totalReturnPercent)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 时间段收益率 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">收益率分析</h3>
          <div className="space-y-3">
            {returnPeriods.map((period) => (
              <div
                key={period.label}
                className={`p-4 rounded-lg border ${getBgColor(period.value)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <period.icon className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-700">{period.label}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${getReturnColor(period.value)}`}>
                      {formatPercent(period.value)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {period.value >= 0 ? '盈利' : '亏损'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 收益趋势图表占位符 */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">收益趋势</h3>
        <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>收益趋势图表</p>
            <p className="text-sm mt-1">将在TradingView集成后显示</p>
          </div>
        </div>
      </div>
    </div>
  );
}