// 市场数据服务类型定义

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap?: number;
  timestamp: number;
}

export interface HistoricalData {
  symbol: string;
  data: OHLCV[];
}

export interface OHLCV {
  time: string; // ISO date string
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  currency?: string;
}

export interface TechnicalIndicator {
  name: string;
  values: number[];
  timestamps: string[];
}

export interface MarketDataError {
  code: string;
  message: string;
  symbol?: string;
}

// API响应接口
export interface QuoteResponse {
  success: boolean;
  data?: Quote;
  error?: MarketDataError;
}

export interface QuotesResponse {
  success: boolean;
  data?: Quote[];
  error?: MarketDataError;
}

export interface HistoricalResponse {
  success: boolean;
  data?: HistoricalData;
  error?: MarketDataError;
}

export interface SearchResponse {
  success: boolean;
  data?: SearchResult[];
  error?: MarketDataError;
}

export interface IndicatorResponse {
  success: boolean;
  data?: TechnicalIndicator;
  error?: MarketDataError;
}

// 缓存配置
export interface CacheConfig {
  realTimeData: number; // 实时数据缓存时间 (秒)
  dailyData: number;    // 日线数据缓存时间 (秒)
  historicalData: number; // 历史数据缓存时间 (秒)
  searchResults: number; // 搜索结果缓存时间 (秒)
}

// 数据提供商配置
export interface DataProviderConfig {
  name: string;
  rateLimitPerSecond: number;
  rateLimitPerMinute: number;
  rateLimitPerHour: number;
}

// Yahoo Finance API 响应类型
export interface YahooQuoteResponse {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketPreviousClose: number;
  regularMarketOpen: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  marketCap?: number;
  regularMarketTime: number;
}

export interface YahooHistoricalResponse {
  chart: {
    result: Array<{
      meta: {
        symbol: string;
        exchangeTimezoneName: string;
        currency: string;
      };
      timestamp: number[];
      indicators: {
        quote: Array<{
          open: number[];
          high: number[];
          low: number[];
          close: number[];
          volume: number[];
        }>;
      };
    }>;
  };
}

export interface YahooSearchResponse {
  quotes: Array<{
    symbol: string;
    shortname: string;
    longname: string;
    exchDisp: string;
    typeDisp: string;
  }>;
}