'use client';

import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import { StockQuote } from '@/components/market/StockQuote';
import { StockSearch } from '@/components/market/StockSearch';
import { SearchResult } from '@/lib/services/market-data/types';

export default function MarketPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [watchlist] = useState(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']);

  const handleStockSelect = (result: SearchResult) => {
    setSelectedSymbol(result.symbol);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            市场数据中心
          </h1>
          <p className="text-gray-600">
            实时股票数据、技术分析和市场动态
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧：搜索和观察列表 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 股票搜索 */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">搜索股票</h2>
              <StockSearch onSelect={handleStockSelect} />
            </div>

            {/* 观察列表 */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">观察列表</h2>
              <div className="space-y-2">
                {watchlist.map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => setSelectedSymbol(symbol)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedSymbol === symbol
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* 市场概览 */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">市场概览</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">交易时间</span>
                  <span className="text-sm font-medium">09:30 - 16:00 EST</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">数据类型</span>
                  <span className="text-sm font-medium">实时行情</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">支持市场</span>
                  <span className="text-sm font-medium">全球主要交易所</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：主要内容区域 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 主股票报价 */}
            <StockQuote 
              symbol={selectedSymbol} 
              autoRefresh={true}
              refreshInterval={60}
              className="col-span-2"
            />

            {/* 热门股票网格 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">热门股票</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {watchlist.slice(0, 6).map((symbol) => (
                  <StockQuote 
                    key={symbol}
                    symbol={symbol}
                    autoRefresh={false}
                  />
                ))}
              </div>
            </div>

            {/* 功能介绍 */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">可用功能</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">实时报价</h3>
                    <p className="text-sm text-gray-600">实时股票价格和变化</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">股票搜索</h3>
                    <p className="text-sm text-gray-600">快速搜索任意股票</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">历史数据</h3>
                    <p className="text-sm text-gray-600">历史价格和K线数据</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">技术指标</h3>
                    <p className="text-sm text-gray-600">SMA, EMA, RSI, MACD等</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}