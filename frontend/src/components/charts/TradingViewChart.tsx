'use client';

import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, LineData } from 'lightweight-charts';

interface TradingViewChartProps {
  symbol: string;
  height?: number;
  showVolume?: boolean;
  showIndicators?: boolean;
}

export function TradingViewChart({ 
  symbol, 
  height = 400, 
  showVolume = true, 
  showIndicators = false 
}: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const maSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 创建图表
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#cccccc',
      },
      timeScale: {
        borderColor: '#cccccc',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // 创建K线序列
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#00C853',
      downColor: '#FF1744',
      borderDownColor: '#FF1744',
      borderUpColor: '#00C853',
      wickDownColor: '#FF1744',
      wickUpColor: '#00C853',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // 创建成交量序列
    if (showVolume) {
      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
      });
      volumeSeriesRef.current = volumeSeries;
    }

    // 创建移动平均线
    if (showIndicators) {
      const maSeries = chart.addLineSeries({
        color: '#2196F3',
        lineWidth: 2,
        title: 'MA20',
      });
      maSeriesRef.current = maSeries;
    }

    // 生成模拟数据
    generateMockData();

    // 处理窗口大小变化
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chart) {
        chart.remove();
      }
    };
  }, [symbol, height, showVolume, showIndicators]);

  const generateMockData = () => {
    const data: CandlestickData[] = [];
    const volumeData: { time: string; value: number; color?: string }[] = [];
    const maData: LineData[] = [];
    
    const basePrice = 150;
    let currentPrice = basePrice;
    const now = new Date();
    
    // 生成60天的数据
    for (let i = 59; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const timeString = date.toISOString().split('T')[0];
      
      // 生成价格数据
      const change = (Math.random() - 0.5) * 8; // -4 到 +4 的随机变化
      const high = currentPrice + Math.abs(change) + Math.random() * 3;
      const low = currentPrice - Math.abs(change) - Math.random() * 3;
      const close = currentPrice + change;
      
      data.push({
        time: timeString,
        open: currentPrice,
        high,
        low,
        close,
      });
      
      // 生成成交量数据
      const volume = Math.floor(Math.random() * 10000000 + 5000000);
      volumeData.push({
        time: timeString,
        value: volume,
        color: close >= currentPrice ? '#00C85380' : '#FF174480',
      });
      
      currentPrice = close;
    }
    
    // 计算移动平均线
    for (let i = 19; i < data.length; i++) {
      const sum = data.slice(i - 19, i + 1).reduce((acc, item) => acc + item.close, 0);
      const average = sum / 20;
      maData.push({
        time: data[i].time,
        value: average,
      });
    }
    
    // 设置数据
    if (candlestickSeriesRef.current) {
      candlestickSeriesRef.current.setData(data);
    }
    
    if (volumeSeriesRef.current && showVolume) {
      volumeSeriesRef.current.setData(volumeData);
    }
    
    if (maSeriesRef.current && showIndicators) {
      maSeriesRef.current.setData(maData);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{symbol} 价格走势</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500"></div>
            <span className="text-gray-600">上涨</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500"></div>
            <span className="text-gray-600">下跌</span>
          </div>
          {showIndicators && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500"></div>
              <span className="text-gray-600">MA20</span>
            </div>
          )}
        </div>
      </div>
      <div 
        ref={chartContainerRef} 
        className="w-full border border-gray-200 rounded-lg"
        style={{ height }}
      />
    </div>
  );
}