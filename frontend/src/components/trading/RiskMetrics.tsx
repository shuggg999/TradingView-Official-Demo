'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, TrendingDown, Activity } from 'lucide-react';

interface PortfolioData {
  cash: number;
  positions: Array<{
    symbol: string;
    quantity: number;
    avgPrice: number;
  }>;
}

interface RiskMetrics {
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  beta: number;
  var95: number; // Value at Risk 95%
  concentration: number; // 集中度风险
}

export function RiskMetrics() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  // 模拟股价和历史数据
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

  // 计算风险指标（简化版，实际应用需要历史价格数据）
  const totalPositionValue = portfolio.positions.reduce((sum, position) => {
    const currentPrice = mockPrices[position.symbol] || position.avgPrice;
    return sum + (position.quantity * currentPrice);
  }, 0);
  const totalValue = portfolio.cash + totalPositionValue;

  // 计算集中度风险（最大持仓占比）
  const maxPosition = portfolio.positions.reduce((max, position) => {
    const currentPrice = mockPrices[position.symbol] || position.avgPrice;
    const marketValue = position.quantity * currentPrice;
    const percentage = (marketValue / totalPositionValue) * 100;
    return Math.max(max, percentage);
  }, 0);

  // 模拟风险指标
  const riskMetrics: RiskMetrics = {
    volatility: 15.2 + Math.random() * 10, // 年化波动率 15-25%
    sharpeRatio: 0.8 + Math.random() * 0.6, // 夏普比率 0.8-1.4
    maxDrawdown: -(Math.random() * 15 + 5), // 最大回撤 -5% 到 -20%
    beta: 0.8 + Math.random() * 0.6, // Beta系数 0.8-1.4
    var95: -(totalValue * (0.02 + Math.random() * 0.03)), // VaR 2-5%
    concentration: maxPosition,
  };

  const formatPercent = (percent: number, showSign: boolean = false) => {
    const sign = showSign && percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const getRiskLevel = (metric: string, value: number) => {
    switch (metric) {
      case 'volatility':
        if (value < 15) return { level: '低', color: 'text-green-600 bg-green-50' };
        if (value < 25) return { level: '中', color: 'text-yellow-600 bg-yellow-50' };
        return { level: '高', color: 'text-red-600 bg-red-50' };
      case 'concentration':
        if (value < 20) return { level: '低', color: 'text-green-600 bg-green-50' };
        if (value < 40) return { level: '中', color: 'text-yellow-600 bg-yellow-50' };
        return { level: '高', color: 'text-red-600 bg-red-50' };
      case 'sharpe':
        if (value > 1.2) return { level: '优秀', color: 'text-green-600 bg-green-50' };
        if (value > 0.8) return { level: '良好', color: 'text-yellow-600 bg-yellow-50' };
        return { level: '一般', color: 'text-red-600 bg-red-50' };
      default:
        return { level: '中', color: 'text-gray-600 bg-gray-50' };
    }
  };

  const riskItems = [
    {
      label: '年化波动率',
      value: formatPercent(riskMetrics.volatility),
      description: '衡量投资组合价格波动程度',
      icon: Activity,
      risk: getRiskLevel('volatility', riskMetrics.volatility),
    },
    {
      label: '夏普比率',
      value: riskMetrics.sharpeRatio.toFixed(2),
      description: '风险调整后的收益率指标',
      icon: TrendingDown,
      risk: getRiskLevel('sharpe', riskMetrics.sharpeRatio),
    },
    {
      label: '最大回撤',
      value: formatPercent(riskMetrics.maxDrawdown),
      description: '历史最大亏损幅度',
      icon: TrendingDown,
      risk: { level: '监控', color: 'text-orange-600 bg-orange-50' },
    },
    {
      label: 'Beta系数',
      value: riskMetrics.beta.toFixed(2),
      description: '相对市场的系统性风险',
      icon: Activity,
      risk: { level: '正常', color: 'text-blue-600 bg-blue-50' },
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-5 h-5 text-orange-600" />
        <h2 className="text-xl font-semibold text-gray-900">风险指标分析</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 主要风险指标 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">主要风险指标</h3>
          <div className="space-y-4">
            {riskItems.map((item) => (
              <div key={item.label} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-700">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-gray-900">{item.value}</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${item.risk.color}`}>
                      {item.risk.level}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 风险分析 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">风险分析</h3>
          <div className="space-y-4">
            {/* VaR风险价值 */}
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">风险价值 (VaR 95%)</span>
              </div>
              <div className="text-2xl font-bold text-red-700 mb-1">
                {formatCurrency(riskMetrics.var95)}
              </div>
              <p className="text-sm text-red-600">
                95%置信度下，单日最大可能损失
              </p>
            </div>

            {/* 集中度风险 */}
            <div className={`p-4 rounded-lg border ${
              riskMetrics.concentration > 40 ? 'bg-red-50 border-red-200' : 
              riskMetrics.concentration > 20 ? 'bg-yellow-50 border-yellow-200' : 
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center space-x-3 mb-2">
                <Shield className={`w-5 h-5 ${
                  riskMetrics.concentration > 40 ? 'text-red-600' : 
                  riskMetrics.concentration > 20 ? 'text-yellow-600' : 
                  'text-green-600'
                }`} />
                <span className={`font-medium ${
                  riskMetrics.concentration > 40 ? 'text-red-800' : 
                  riskMetrics.concentration > 20 ? 'text-yellow-800' : 
                  'text-green-800'
                }`}>
                  集中度风险
                </span>
              </div>
              <div className={`text-2xl font-bold mb-1 ${
                riskMetrics.concentration > 40 ? 'text-red-700' : 
                riskMetrics.concentration > 20 ? 'text-yellow-700' : 
                'text-green-700'
              }`}>
                {formatPercent(riskMetrics.concentration)}
              </div>
              <p className={`text-sm ${
                riskMetrics.concentration > 40 ? 'text-red-600' : 
                riskMetrics.concentration > 20 ? 'text-yellow-600' : 
                'text-green-600'
              }`}>
                最大单只股票持仓占比
              </p>
            </div>

            {/* 风险建议 */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">风险管理建议</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 建议单只股票持仓不超过20%</li>
                <li>• 定期检查投资组合Beta系数</li>
                <li>• 关注市场波动率变化</li>
                <li>• 设置止损点控制最大回撤</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 风险等级评估 */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">整体风险评估</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">中等风险</div>
              <div className="text-sm text-gray-600">
                投资组合风险水平适中，建议持续监控
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">风险评分</div>
            <div className="text-2xl font-bold text-yellow-600">6.5/10</div>
          </div>
        </div>
      </div>
    </div>
  );
}