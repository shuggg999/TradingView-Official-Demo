'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface TradingInterfaceProps {
  onTradeExecuted: () => void;
}

export function TradingInterface({ onTradeExecuted }: TradingInterfaceProps) {
  const [orderForm, setOrderForm] = useState({
    symbol: 'AAPL',
    side: 'BUY' as 'BUY' | 'SELL',
    type: 'MARKET' as 'MARKET' | 'LIMIT',
    quantity: 100,
    price: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 150.25 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2500.50 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 300.75 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 800.00 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3200.25 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 220.50 },
    { symbol: 'META', name: 'Meta Platforms', price: 280.75 },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 400.25 },
  ];

  const selectedStock = popularStocks.find(stock => stock.symbol === orderForm.symbol);
  const estimatedTotal = selectedStock ? selectedStock.price * orderForm.quantity : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/trading/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderForm),
      });

      if (response.ok) {
        alert('订单执行成功！');
        setOrderForm({
          symbol: 'AAPL',
          side: 'BUY',
          type: 'MARKET',
          quantity: 100,
          price: 0,
        });
        onTradeExecuted();
      } else {
        const error = await response.json();
        alert(error.error || '订单执行失败');
      }
    } catch (error) {
      console.error('提交订单失败:', error);
      alert('订单执行失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">交易下单</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 股票选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择股票
          </label>
          <select
            value={orderForm.symbol}
            onChange={(e) => setOrderForm(prev => ({ ...prev, symbol: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {popularStocks.map(stock => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </option>
            ))}
          </select>
          {selectedStock && (
            <p className="text-sm text-gray-600 mt-1">
              当前价格: <span className="font-medium">${selectedStock.price}</span>
            </p>
          )}
        </div>

        {/* 交易方向 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            交易方向
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOrderForm(prev => ({ ...prev, side: 'BUY' }))}
              className={`flex items-center justify-center px-4 py-2 rounded-md border transition-colors ${
                orderForm.side === 'BUY'
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-green-500 border-green-300 hover:bg-green-50'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              买入
            </button>
            <button
              type="button"
              onClick={() => setOrderForm(prev => ({ ...prev, side: 'SELL' }))}
              className={`flex items-center justify-center px-4 py-2 rounded-md border transition-colors ${
                orderForm.side === 'SELL'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-red-500 border-red-300 hover:bg-red-50'
              }`}
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              卖出
            </button>
          </div>
        </div>

        {/* 订单类型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            订单类型
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOrderForm(prev => ({ ...prev, type: 'MARKET', price: 0 }))}
              className={`px-4 py-2 rounded-md border transition-colors ${
                orderForm.type === 'MARKET'
                  ? 'bg-[#002244] text-white border-[#002244]'
                  : 'bg-white text-[#002244] border-blue-300 hover:bg-blue-50'
              }`}
            >
              市价单
            </button>
            <button
              type="button"
              onClick={() => setOrderForm(prev => ({ 
                ...prev, 
                type: 'LIMIT', 
                price: selectedStock?.price || 0 
              }))}
              className={`px-4 py-2 rounded-md border transition-colors ${
                orderForm.type === 'LIMIT'
                  ? 'bg-[#002244] text-white border-[#002244]'
                  : 'bg-white text-[#002244] border-blue-300 hover:bg-blue-50'
              }`}
            >
              限价单
            </button>
          </div>
        </div>

        {/* 数量 */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            数量
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            max="10000"
            step="1"
            value={orderForm.quantity}
            onChange={(e) => setOrderForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 限价单价格 */}
        {orderForm.type === 'LIMIT' && (
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              限价
            </label>
            <input
              type="number"
              id="price"
              min="0.01"
              step="0.01"
              value={orderForm.price}
              onChange={(e) => setOrderForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* 预估金额 */}
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">预估{orderForm.side === 'BUY' ? '花费' : '收入'}:</span>
            <span className="font-medium text-gray-900">
              ${estimatedTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={submitting || orderForm.quantity <= 0}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-md font-medium transition-colors ${
            orderForm.side === 'BUY'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          {submitting ? '提交中...' : `${orderForm.side === 'BUY' ? '买入' : '卖出'} ${orderForm.symbol}`}
        </button>
      </form>

      {/* 风险提示 */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-xs text-yellow-800">
          <span className="font-medium">风险提示:</span>
          这是模拟交易环境，所有交易均使用虚拟资金，不涉及真实金钱损失。
        </p>
      </div>
    </div>
  );
}