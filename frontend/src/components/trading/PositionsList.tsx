'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Position {
  id: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
}

interface PositionsListProps {
  positions: Position[];
  onTradeExecuted: () => void;
}

export function PositionsList({ positions, onTradeExecuted }: PositionsListProps) {
  const [marketPrices, setMarketPrices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
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
    setMarketPrices(mockPrices);
  }, []);

  const handleQuickSell = async (position: Position, sellQuantity: number) => {
    if (!window.confirm(`确定要卖出 ${sellQuantity} 股 ${position.symbol} 吗？`)) {
      return;
    }

    try {
      const response = await fetch('/api/trading/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: position.symbol,
          side: 'SELL',
          type: 'MARKET',
          quantity: sellQuantity,
        }),
      });

      if (response.ok) {
        alert('卖出成功！');
        onTradeExecuted();
      } else {
        const error = await response.json();
        alert(error.error || '卖出失败');
      }
    } catch (error) {
      console.error('卖出失败:', error);
      alert('卖出失败，请稍后重试');
    }
  };

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

  if (positions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">持仓</h3>
        <div className="text-center py-8">
          <Minus className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">暂无持仓</p>
          <p className="text-sm text-gray-400 mt-1">开始交易来建立您的投资组合</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">持仓 ({positions.length})</h3>
      
      <div className="space-y-4">
        {positions.map((position) => {
          const currentPrice = marketPrices[position.symbol] || position.avgPrice;
          const marketValue = position.quantity * currentPrice;
          const costBasis = position.quantity * position.avgPrice;
          const pnl = marketValue - costBasis;
          const pnlPercentage = (pnl / costBasis) * 100;
          const isProfit = pnl >= 0;

          return (
            <div key={position.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{position.symbol}</h4>
                  <p className="text-sm text-gray-600">{position.quantity} 股</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${currentPrice.toFixed(2)}
                  </p>
                  <div className={`flex items-center text-sm font-medium ${
                    isProfit ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isProfit ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {formatPercentage(pnlPercentage)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">持仓成本</p>
                  <p className="text-sm font-medium text-gray-900">
                    ${position.avgPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">市值</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(marketValue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">成本</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(costBasis)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">盈亏</p>
                  <p className={`text-sm font-medium ${
                    isProfit ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(pnl)}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleQuickSell(position, Math.floor(position.quantity / 4))}
                  disabled={position.quantity < 4}
                  className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  卖出1/4
                </button>
                <button
                  onClick={() => handleQuickSell(position, Math.floor(position.quantity / 2))}
                  disabled={position.quantity < 2}
                  className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  卖出1/2
                </button>
                <button
                  onClick={() => handleQuickSell(position, position.quantity)}
                  className="flex-1 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
                >
                  全部卖出
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}