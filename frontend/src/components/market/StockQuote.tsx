'use client';

import { useState, useEffect } from 'react';
import { Quote } from '@/lib/services/market-data/types';

interface StockQuoteProps {
  symbol: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // 秒
  className?: string;
}

export const StockQuote: React.FC<StockQuoteProps> = ({
  symbol,
  autoRefresh = false,
  refreshInterval = 60,
  className = '',
}) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchQuote = async () => {
    if (!symbol) return;
    
    try {
      setError(null);
      const response = await fetch(`/api/market/quote?symbol=${encodeURIComponent(symbol)}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setQuote(data.data);
        setLastUpdate(new Date());
      } else {
        setError(data.error?.message || 'Failed to fetch quote');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error fetching quote:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, [symbol]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchQuote, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const formatPrice = (price: number) => price.toFixed(2);
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
  const formatPercentage = (percent: number) => `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className={`bg-white rounded-lg border p-4 ${className}`}>
        <div className="text-center">
          <div className="text-red-600 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-red-600">{error || 'No data available'}</p>
          <button
            onClick={fetchQuote}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  const isPositive = quote.change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className={`bg-white rounded-lg border hover:shadow-md transition-shadow p-4 ${className}`}>
      {/* 股票代码和刷新状态 */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{quote.symbol}</h3>
        <div className="flex items-center text-xs text-gray-500">
          {autoRefresh && (
            <div className="flex items-center mr-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
              <span>实时</span>
            </div>
          )}
          {lastUpdate && (
            <span>
              {lastUpdate.toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          )}
        </div>
      </div>

      {/* 价格信息 */}
      <div className="mb-3">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          ${formatPrice(quote.price)}
        </div>
        <div className={`text-sm font-medium ${changeColor}`}>
          {formatChange(quote.change)} ({formatPercentage(quote.changePercent)})
        </div>
      </div>

      {/* 详细信息 */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500">开盘:</span>
          <span className="ml-1 font-medium">${formatPrice(quote.open)}</span>
        </div>
        <div>
          <span className="text-gray-500">前收:</span>
          <span className="ml-1 font-medium">${formatPrice(quote.previousClose)}</span>
        </div>
        <div>
          <span className="text-gray-500">最高:</span>
          <span className="ml-1 font-medium">${formatPrice(quote.high)}</span>
        </div>
        <div>
          <span className="text-gray-500">最低:</span>
          <span className="ml-1 font-medium">${formatPrice(quote.low)}</span>
        </div>
      </div>

      {/* 成交量 */}
      {quote.volume && (
        <div className="mt-3 pt-3 border-t text-sm">
          <span className="text-gray-500">成交量:</span>
          <span className="ml-1 font-medium">
            {quote.volume.toLocaleString()}
          </span>
        </div>
      )}

      {/* 市值 */}
      {quote.marketCap && (
        <div className="text-sm">
          <span className="text-gray-500">市值:</span>
          <span className="ml-1 font-medium">
            ${(quote.marketCap / 1000000000).toFixed(2)}B
          </span>
        </div>
      )}
    </div>
  );
};