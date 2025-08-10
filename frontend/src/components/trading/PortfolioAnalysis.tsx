'use client';

import { useState, useEffect } from 'react';
import { PieChart, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

interface PortfolioData {
  cash: number;
  positions: Array<{
    symbol: string;
    quantity: number;
    avgPrice: number;
  }>;
}

export function PortfolioAnalysis() {
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
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // 计算持仓数据
  const positionData = portfolio.positions.map(position => {
    const currentPrice = mockPrices[position.symbol] || position.avgPrice;
    const marketValue = position.quantity * currentPrice;
    const costBasis = position.quantity * position.avgPrice;
    const pnl = marketValue - costBasis;
    const pnlPercentage = (pnl / costBasis) * 100;

    return {
      ...position,
      currentPrice,
      marketValue,
      costBasis,
      pnl,
      pnlPercentage,
    };
  });

  const totalPositionValue = positionData.reduce((sum, pos) => sum + pos.marketValue, 0);
  const totalValue = portfolio.cash + totalPositionValue;
  const totalPnL = positionData.reduce((sum, pos) => sum + pos.pnl, 0);

  // 按行业分类（简化版）
  const sectorData = {
    '科技': positionData.filter(p => ['AAPL', 'GOOGL', 'MSFT', 'META', 'NVDA'].includes(p.symbol)),
    '消费': positionData.filter(p => ['TSLA', 'AMZN', 'NFLX'].includes(p.symbol)),
    '其他': positionData.filter(p => !['AAPL', 'GOOGL', 'MSFT', 'META', 'NVDA', 'TSLA', 'AMZN', 'NFLX'].includes(p.symbol)),
  };

  const sectorValues = Object.entries(sectorData).map(([sector, positions]) => ({
    sector,
    value: positions.reduce((sum, pos) => sum + pos.marketValue, 0),
    percentage: (positions.reduce((sum, pos) => sum + pos.marketValue, 0) / totalPositionValue) * 100,
  })).filter(item => item.value > 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <PieChart className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">投资组合构成分析</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 资产配置 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">资产配置</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="font-medium text-gray-700">现金</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(portfolio.cash)}</p>
                <p className="text-sm text-gray-500">{((portfolio.cash / totalValue) * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="font-medium text-gray-700">股票</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(totalPositionValue)}</p>
                <p className="text-sm text-gray-500">{((totalPositionValue / totalValue) * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>总资产</span>
                <span className="font-semibold">{formatCurrency(totalValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}>总盈亏</span>
                <span className={`font-semibold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalPnL)} ({((totalPnL / (totalValue - totalPnL)) * 100).toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 行业分布 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">行业分布</h3>
          <div className="space-y-3">
            {sectorValues.map((sector) => (
              <div key={sector.sector} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{sector.sector}</span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(sector.value)}</p>
                  <p className="text-sm text-gray-500">{sector.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 持仓详情 */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">持仓明细</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">股票</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">成本价</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">现价</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">市值</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">盈亏</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">占比</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {positionData.map((position) => (
                <tr key={position.symbol}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{position.symbol}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{position.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${position.avgPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${position.currentPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(position.marketValue)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(position.pnl)} ({position.pnlPercentage.toFixed(2)}%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {((position.marketValue / totalPositionValue) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}