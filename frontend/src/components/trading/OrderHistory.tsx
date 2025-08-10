'use client';

import { Clock, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

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

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'EXECUTED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return '等待中';
      case 'EXECUTED':
        return '已执行';
      case 'CANCELLED':
        return '已取消';
      default:
        return '未知';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      case 'EXECUTED':
        return 'text-green-600 bg-green-50';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">订单历史</h3>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">暂无订单记录</p>
          <p className="text-sm text-gray-400 mt-1">您的交易订单会显示在这里</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        订单历史 ({orders.length})
      </h3>
      
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
                  order.side === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {order.side === 'BUY' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="text-xs font-medium">
                    {order.side === 'BUY' ? '买入' : '卖出'}
                  </span>
                </div>
                <span className="font-medium text-gray-900">{order.symbol}</span>
                <span className="text-sm text-gray-500">
                  {order.type === 'MARKET' ? '市价单' : '限价单'}
                </span>
              </div>
              
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span>{getStatusText(order.status)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">数量</p>
                <p className="font-medium text-gray-900">{order.quantity} 股</p>
              </div>
              <div>
                <p className="text-gray-500">价格</p>
                <p className="font-medium text-gray-900">${order.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">总额</p>
                <p className="font-medium text-gray-900">
                  {formatCurrency(order.quantity * order.price)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">时间</p>
                <p className="font-medium text-gray-900">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length >= 10 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            查看更多订单 →
          </button>
        </div>
      )}
    </div>
  );
}