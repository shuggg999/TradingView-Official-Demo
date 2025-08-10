'use client';

import { useState } from 'react';

export default function TestMarketPage() {
  const [quote, setQuote] = useState<any>(null);
  const [search, setSearch] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testQuote = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/market/quote?symbol=AAPL');
      const data = await response.json();
      setQuote(data);
    } catch (err) {
      setError('Failed to fetch quote');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const testSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/market/search?q=AAPL&limit=5');
      const data = await response.json();
      setSearch(data);
    } catch (err) {
      setError('Failed to search stocks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          市场数据服务测试
        </h1>

        <div className="space-y-6">
          {/* 测试报价API */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">测试股票报价 API</h2>
            <button
              onClick={testQuote}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? '获取中...' : '获取 AAPL 报价'}
            </button>
            
            {quote && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold">响应结果：</h3>
                <pre className="text-sm mt-2 whitespace-pre-wrap">
                  {JSON.stringify(quote, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* 测试搜索API */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">测试股票搜索 API</h2>
            <button
              onClick={testSearch}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? '搜索中...' : '搜索 AAPL'}
            </button>
            
            {search && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold">搜索结果：</h3>
                <pre className="text-sm mt-2 whitespace-pre-wrap">
                  {JSON.stringify(search, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* 错误显示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* 服务状态 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">服务状态</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded">
                <h3 className="font-semibold text-blue-900">Yahoo Finance API</h3>
                <p className="text-blue-700 text-sm">实时股票数据源</p>
              </div>
              <div className="p-4 bg-green-50 rounded">
                <h3 className="font-semibold text-green-900">Redis 缓存</h3>
                <p className="text-green-700 text-sm">数据缓存服务</p>
              </div>
              <div className="p-4 bg-purple-50 rounded">
                <h3 className="font-semibold text-purple-900">技术指标</h3>
                <p className="text-purple-700 text-sm">计算引擎</p>
              </div>
            </div>
          </div>

          {/* API 端点列表 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">可用的 API 端点</h2>
            <div className="space-y-2 text-sm">
              <div><code className="bg-gray-100 px-2 py-1 rounded">GET /api/market/quote?symbol=AAPL</code> - 获取单个股票报价</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">GET /api/market/quotes?symbols=AAPL,GOOGL</code> - 批量获取报价</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">GET /api/market/history?symbol=AAPL</code> - 获取历史数据</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">GET /api/market/search?q=Apple</code> - 搜索股票</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">GET /api/market/indicators?symbol=AAPL&type=sma</code> - 计算技术指标</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}