import yahooFinance from 'yahoo-finance2';
import { 
  Quote, 
  HistoricalData, 
  OHLCV, 
  SearchResult, 
  YahooQuoteResponse,
  DataProviderConfig,
  MarketDataError
} from './types';

export class YahooFinanceService {
  private config: DataProviderConfig = {
    name: 'Yahoo Finance',
    rateLimitPerSecond: 5,
    rateLimitPerMinute: 100,
    rateLimitPerHour: 2000,
  };

  private requestCount = {
    second: 0,
    minute: 0,
    hour: 0,
    lastReset: {
      second: Date.now(),
      minute: Date.now(),
      hour: Date.now(),
    }
  };

  constructor() {
    // 设置Yahoo Finance配置
    try {
      yahooFinance.setGlobalConfig({
        validation: {
          logOptionsErrors: false,
          logQueryTerms: false,
        },
        queue: {
          concurrency: 4,
          timeout: 30000,
        }
      });
    } catch (error) {
      console.warn('Failed to set Yahoo Finance global config:', error);
    }
  }

  /**
   * 检查速率限制
   */
  private checkRateLimit(): boolean {
    const now = Date.now();

    // 重置计数器
    if (now - this.requestCount.lastReset.second >= 1000) {
      this.requestCount.second = 0;
      this.requestCount.lastReset.second = now;
    }
    if (now - this.requestCount.lastReset.minute >= 60000) {
      this.requestCount.minute = 0;
      this.requestCount.lastReset.minute = now;
    }
    if (now - this.requestCount.lastReset.hour >= 3600000) {
      this.requestCount.hour = 0;
      this.requestCount.lastReset.hour = now;
    }

    // 检查限制
    if (this.requestCount.second >= this.config.rateLimitPerSecond) {
      return false;
    }
    if (this.requestCount.minute >= this.config.rateLimitPerMinute) {
      return false;
    }
    if (this.requestCount.hour >= this.config.rateLimitPerHour) {
      return false;
    }

    // 增加计数
    this.requestCount.second++;
    this.requestCount.minute++;
    this.requestCount.hour++;

    return true;
  }

  /**
   * 获取单个股票报价
   */
  async getQuote(symbol: string): Promise<Quote> {
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    try {
      const result = await yahooFinance.quote(symbol);
      
      if (!result) {
        throw new Error(`No data found for symbol: ${symbol}`);
      }

      return this.formatQuote(result, symbol);
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw new Error(`Failed to fetch quote for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 批量获取股票报价
   */
  async getQuotes(symbols: string[]): Promise<Quote[]> {
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    try {
      const results = await yahooFinance.quote(symbols);
      
      if (!results || typeof results !== 'object') {
        throw new Error('Invalid response from Yahoo Finance');
      }

      const quotes: Quote[] = [];
      
      for (const symbol of symbols) {
        const data = Array.isArray(results) 
          ? results.find(r => r.symbol === symbol)
          : results[symbol] || results;
          
        if (data) {
          try {
            quotes.push(this.formatQuote(data, symbol));
          } catch (error) {
            console.warn(`Failed to format quote for ${symbol}:`, error);
          }
        }
      }

      return quotes;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw new Error(`Failed to fetch quotes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 获取历史数据
   */
  async getHistoricalData(
    symbol: string, 
    period1: Date, 
    period2: Date = new Date(),
    interval: '1d' | '1wk' | '1mo' = '1d'
  ): Promise<HistoricalData> {
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    try {
      const result = await yahooFinance.historical(symbol, {
        period1: period1.toISOString().split('T')[0],
        period2: period2.toISOString().split('T')[0],
        interval,
      });

      if (!result || !Array.isArray(result)) {
        throw new Error(`No historical data found for symbol: ${symbol}`);
      }

      const data: OHLCV[] = result.map(item => ({
        time: item.date.toISOString().split('T')[0],
        open: item.open || 0,
        high: item.high || 0,
        low: item.low || 0,
        close: item.close || 0,
        volume: item.volume || 0,
      }));

      return {
        symbol,
        data,
      };
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      throw new Error(`Failed to fetch historical data for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 搜索股票
   */
  async searchStocks(query: string, limit: number = 10): Promise<SearchResult[]> {
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    try {
      const results = await yahooFinance.search(query);
      
      if (!results || !results.quotes) {
        return [];
      }

      return results.quotes
        .slice(0, limit)
        .map(quote => ({
          symbol: quote.symbol,
          name: quote.shortname || quote.longname || quote.symbol,
          exchange: quote.exchDisp || 'Unknown',
          type: quote.typeDisp || 'Stock',
          currency: quote.currency,
        }));
    } catch (error) {
      console.error(`Error searching stocks with query "${query}":`, error);
      throw new Error(`Failed to search stocks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 格式化报价数据
   */
  private formatQuote(data: any, symbol: string): Quote {
    return {
      symbol,
      price: data.regularMarketPrice || data.price || 0,
      change: data.regularMarketChange || data.change || 0,
      changePercent: data.regularMarketChangePercent || data.changePercent || 0,
      previousClose: data.regularMarketPreviousClose || data.previousClose || 0,
      open: data.regularMarketOpen || data.open || 0,
      high: data.regularMarketDayHigh || data.dayHigh || 0,
      low: data.regularMarketDayLow || data.dayLow || 0,
      volume: data.regularMarketVolume || data.volume || 0,
      marketCap: data.marketCap,
      timestamp: data.regularMarketTime || Date.now(),
    };
  }

  /**
   * 获取服务配置
   */
  getConfig(): DataProviderConfig {
    return { ...this.config };
  }

  /**
   * 获取请求统计
   */
  getRequestStats() {
    return {
      current: { ...this.requestCount },
      limits: {
        perSecond: this.config.rateLimitPerSecond,
        perMinute: this.config.rateLimitPerMinute,
        perHour: this.config.rateLimitPerHour,
      },
    };
  }

  /**
   * 重置请求计数器
   */
  resetRequestStats() {
    const now = Date.now();
    this.requestCount = {
      second: 0,
      minute: 0,
      hour: 0,
      lastReset: {
        second: now,
        minute: now,
        hour: now,
      }
    };
  }
}

// 创建单例实例
export const yahooFinanceService = new YahooFinanceService();