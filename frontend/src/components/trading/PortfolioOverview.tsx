'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, RefreshCw, RotateCcw } from 'lucide-react';

interface Portfolio {
  id: string;
  cash: number;
  positions: Position[];
  orders: Order[];
}

interface Position {
  id: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
}

interface Order {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT';
  quantity: number;
  price: number;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED';
}

interface PortfolioOverviewProps {
  portfolio: Portfolio;
  onReset: () => void;
}

export function PortfolioOverview({ portfolio, onReset }: PortfolioOverviewProps) {
  const [marketValues, setMarketValues] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMarketValues();
  }, [portfolio.positions]);

  const fetchMarketValues = async () => {
    setLoading(true);
    try {
      // 模拟获取实时股价
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

      setMarketValues(mockPrices);
    } catch (error) {
      console.error('获取市场价格失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 计算投资组合总值
  const calculatePortfolioValue = () => {
    const positionsValue = portfolio.positions.reduce((total, position) => {
      const currentPrice = marketValues[position.symbol] || position.avgPrice;
      return total + (position.quantity * currentPrice);
    }, 0);

    return portfolio.cash + positionsValue;
  };

  // 计算总盈亏
  const calculateTotalPnL = () => {
    return portfolio.positions.reduce((total, position) => {
      const currentPrice = marketValues[position.symbol] || position.avgPrice;
      const marketValue = position.quantity * currentPrice;
      const costBasis = position.quantity * position.avgPrice;
      return total + (marketValue - costBasis);
    }, 0);
  };

  // 计算持仓市值
  const calculatePositionsValue = () => {
    return portfolio.positions.reduce((total, position) => {
      const currentPrice = marketValues[position.symbol] || position.avgPrice;
      return total + (position.quantity * currentPrice);
    }, 0);
  };

  const totalValue = calculatePortfolioValue();
  const totalPnL = calculateTotalPnL();
  const positionsValue = calculatePositionsValue();
  const pnlPercentage = totalPnL / (totalValue - totalPnL) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">投资组合总览</h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchMarketValues}
            disabled={loading}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>刷新</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重置</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 总资产 */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">总资产</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="p-2 bg-blue-200 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* 可用资金 */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">可用资金</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(portfolio.cash)}</p>
            </div>
            <div className="p-2 bg-green-200 rounded-lg">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* 持仓市值 */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">持仓市值</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(positionsValue)}</p>
            </div>
            <div className="p-2 bg-blue-200 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* 总盈亏 */}
        <div className={`p-4 rounded-lg ${
          totalPnL >= 0 
            ? 'bg-gradient-to-r from-green-50 to-green-100' 
            : 'bg-gradient-to-r from-red-50 to-red-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                总盈亏
              </p>
              <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                {formatCurrency(totalPnL)}
              </p>
              <p className={`text-sm ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(pnlPercentage)}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${totalPnL >= 0 ? 'bg-green-200' : 'bg-red-200'}`}>
              {totalPnL >= 0 ? (
                <TrendingUp className={`w-6 h-6 ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              ) : (
                <TrendingDown className={`w-6 h-6 ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 简要统计 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">持仓数量</p>
            <p className="text-lg font-semibold text-gray-900">{portfolio.positions.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">今日订单</p>
            <p className="text-lg font-semibold text-gray-900">
              {portfolio.orders.filter(order => {
                const today = new Date().toDateString();
                const orderDate = new Date(order.createdAt).toDateString();
                return today === orderDate;
              }).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">资金利用率</p>
            <p className="text-lg font-semibold text-gray-900">
              {((positionsValue / totalValue) * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">初始资金</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(500000)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}