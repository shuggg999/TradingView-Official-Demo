"use client"

import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, TrendingDown, Activity, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MarketDataPoint {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: number
  currency: string
  timestamp: number
}

interface MarketDataProps {
  symbols?: string[]
  refreshInterval?: number
  showChart?: boolean
}

const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', '^GSPC', 'BTC-USD']

export default function MarketData({ 
  symbols = DEFAULT_SYMBOLS, 
  refreshInterval = 60000, // 60秒刷新一次
  showChart = true 
}: MarketDataProps) {
  const [marketData, setMarketData] = useState<Record<string, MarketDataPoint>>({})
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchMarketData = useCallback(async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) setRefreshing(true)
      
      const promises = symbols.map(async (symbol) => {
        const response = await fetch(`/api/market/${symbol}`)
        if (response.ok) {
          const data = await response.json()
          return { symbol, data }
        }
        return null
      })

      const results = await Promise.all(promises)
      const newData: Record<string, MarketDataPoint> = {}
      
      results.forEach((result) => {
        if (result) {
          newData[result.symbol] = result.data
        }
      })

      setMarketData(newData)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch market data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [symbols])

  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(() => fetchMarketData(), refreshInterval)
    return () => clearInterval(interval)
  }, [symbols, refreshInterval, fetchMarketData])

  const formatPrice = (price: number, currency: string = 'USD') => {
    if (currency === 'USD') {
      return `$${price.toFixed(2)}`
    }
    return `${price.toFixed(2)} ${currency}`
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`
    return volume.toString()
  }

  const getSymbolDisplayName = (symbol: string) => {
    const names: Record<string, string> = {
      'AAPL': '苹果',
      'MSFT': '微软',
      'GOOGL': '谷歌',
      'TSLA': '特斯拉',
      '^GSPC': 'S&P 500',
      'BTC-USD': '比特币',
      'ETH-USD': '以太坊',
      'AMZN': '亚马逊',
      'NVDA': '英伟达',
      'META': 'Meta',
      '^DJI': '道琼斯',
      '^IXIC': '纳斯达克'
    }
    return names[symbol] || symbol
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 animate-pulse" />
            <span>市场数据加载中...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded mb-1"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>实时市场数据</span>
          </CardTitle>
          <div className="flex items-center space-x-3">
            {lastUpdate && (
              <span className="text-xs text-muted-foreground">
                更新: {lastUpdate.toLocaleTimeString('zh-CN')}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchMarketData(true)}
              disabled={refreshing}
            >
              <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {symbols.map((symbol) => {
            const data = marketData[symbol]
            if (!data) {
              return (
                <div key={symbol} className="p-4 border rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">
                    {getSymbolDisplayName(symbol)}
                  </div>
                  <div className="text-sm text-muted-foreground">数据获取中...</div>
                </div>
              )
            }

            const isPositive = (data.change || 0) >= 0
            const changeColor = isPositive ? 'text-green-500' : 'text-red-500'
            const TrendIcon = isPositive ? TrendingUp : TrendingDown

            return (
              <div key={symbol} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    {getSymbolDisplayName(symbol)}
                  </div>
                  <TrendIcon className={`h-4 w-4 ${changeColor}`} />
                </div>
                
                <div className="space-y-1">
                  <div className="text-lg font-bold">
                    {formatPrice(data.price || 0, data.currency)}
                  </div>
                  
                  <div className={`text-sm ${changeColor} flex items-center space-x-1`}>
                    <span>{isPositive ? '+' : ''}{data.change?.toFixed(2) || '0.00'}</span>
                    <span>({isPositive ? '+' : ''}{data.changePercent?.toFixed(2) || '0.00'}%)</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <div>最高: {formatPrice(data.high || 0, data.currency)}</div>
                    <div>最低: {formatPrice(data.low || 0, data.currency)}</div>
                    <div>成交量: {formatVolume(data.volume || 0)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {showChart && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <div className="text-center">
              <h4 className="text-lg font-medium mb-2">📈 TradingView 专业图表即将集成</h4>
              <p className="text-sm text-muted-foreground mb-4">
                我们正在申请 TradingView 企业级高级图表库，为您提供业界顶级的技术分析工具
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center justify-center p-2 bg-background rounded">
                  ✓ 100+ 技术指标
                </div>
                <div className="flex items-center justify-center p-2 bg-background rounded">
                  ✓ 专业绘图工具
                </div>
                <div className="flex items-center justify-center p-2 bg-background rounded">
                  ✓ 多时间周期
                </div>
                <div className="flex items-center justify-center p-2 bg-background rounded">
                  ✓ 历史数据回放
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          <p>📊 数据来源: Yahoo Finance API | 每分钟自动更新</p>
          <p>🚀 集成 TradingView 后将提供更丰富的实时数据和专业分析工具</p>
        </div>
      </CardContent>
    </Card>
  )
}

// 便捷组件导出
export function StockMarketData() {
  return <MarketData symbols={['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'META']} />
}

export function CryptoMarketData() {
  return <MarketData symbols={['BTC-USD', 'ETH-USD']} />
}

export function IndexMarketData() {
  return <MarketData symbols={['^GSPC', '^DJI', '^IXIC']} />
}