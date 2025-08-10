'use client';

import { useState, useEffect } from 'react';
import { PortfolioOverview } from './PortfolioOverview';
import { TradingInterface } from './TradingInterface';
import { PositionsList } from './PositionsList';
import { OrderHistory } from './OrderHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Portfolio {
  id: string;
  cash: number;
  positions: Position[];
  orders: Order[];
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
}

export function TradingDashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchPortfolio();
  }, [refreshKey]);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/trading/portfolio');
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
      } else {
        console.error('获取投资组合失败');
      }
    } catch (error) {
      console.error('获取投资组合失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTradeExecuted = () => {
    // 交易执行后刷新数据
    setRefreshKey(prev => prev + 1);
  };

  const handleResetPortfolio = async () => {
    if (!window.confirm('确定要重置投资组合吗？这将清空所有持仓并恢复初始资金。')) {
      return;
    }

    try {
      const response = await fetch('/api/trading/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reset' }),
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
        alert('投资组合已重置');
      } else {
        alert('重置失败，请稍后重试');
      }
    } catch (error) {
      console.error('重置投资组合失败:', error);
      alert('重置失败，请稍后重试');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">无法加载投资组合数据</p>
        <button
          onClick={fetchPortfolio}
          className="mt-4 bg-[#002244] hover:bg-[#001122] text-white px-4 py-2 rounded-md"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <PortfolioOverview 
        portfolio={portfolio} 
        onReset={handleResetPortfolio}
      />

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Form */}
        <div className="lg:col-span-1">
          <TradingInterface onTradeExecuted={handleTradeExecuted} />
        </div>

        {/* Positions and Orders */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="positions" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="positions">持仓</TabsTrigger>
              <TabsTrigger value="orders">订单</TabsTrigger>
            </TabsList>
            
            <TabsContent value="positions">
              <PositionsList 
                positions={portfolio.positions}
                onTradeExecuted={handleTradeExecuted}
              />
            </TabsContent>
            
            <TabsContent value="orders">
              <OrderHistory orders={portfolio.orders} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}