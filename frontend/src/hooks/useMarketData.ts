'use client';

import { useState, useEffect, useCallback } from 'react';
import { MarketData, HistoricalData } from '@/types/market';

interface MarketDataState {
  data: MarketData[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useMarketData(symbols: string[] = []) {
  const [state, setState] = useState<MarketDataState>({
    data: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const fetchMarketData = useCallback(async (symbolList: string[]) => {
    if (symbolList.length === 0) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: Implement actual market data API call
      console.log('Fetching market data for:', symbolList);
      
      // Mock data for now
      const mockData: MarketData[] = symbolList.map(symbol => ({
        symbol,
        name: `${symbol} Company`,
        price: Math.random() * 1000 + 100,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 10,
        volume: Math.floor(Math.random() * 10000000),
        marketCap: Math.random() * 1000000000,
        lastUpdated: new Date(),
      }));
      
      setState({
        data: mockData,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch market data',
      }));
    }
  }, []);

  useEffect(() => {
    fetchMarketData(symbols);
  }, [symbols, fetchMarketData]);

  return {
    ...state,
    refetch: () => fetchMarketData(symbols),
  };
}

export function useHistoricalData(symbol: string, period: string = '1Y') {
  const [state, setState] = useState<{
    data: HistoricalData[];
    isLoading: boolean;
    error: string | null;
  }>({
    data: [],
    isLoading: false,
    error: null,
  });

  const fetchHistoricalData = useCallback(async () => {
    if (!symbol) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: Implement actual historical data API call
      console.log('Fetching historical data for:', symbol, period);
      
      // Mock historical data
      const mockData: HistoricalData[] = [];
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      
      for (let i = 0; i < 252; i++) { // Roughly 1 year of trading days
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        const basePrice = 100 + Math.sin(i / 50) * 20;
        const open = basePrice + (Math.random() - 0.5) * 5;
        const close = open + (Math.random() - 0.5) * 10;
        const high = Math.max(open, close) + Math.random() * 5;
        const low = Math.min(open, close) - Math.random() * 5;
        
        mockData.push({
          symbol,
          date,
          open,
          high,
          low,
          close,
          volume: Math.floor(Math.random() * 1000000),
        });
      }
      
      setState({
        data: mockData,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch historical data',
      }));
    }
  }, [symbol, period]);

  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);

  return {
    ...state,
    refetch: fetchHistoricalData,
  };
}