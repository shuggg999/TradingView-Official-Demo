import { yahooFinanceService } from './yahoo-finance.service';
import { cacheService } from './cache.service';
import { DataProcessor } from './data-processor';
import { 
  Quote, 
  HistoricalData, 
  SearchResult, 
  TechnicalIndicator,
  QuoteResponse,
  QuotesResponse,
  HistoricalResponse,
  SearchResponse,
  IndicatorResponse,
  MarketDataError
} from './types';

export class MarketDataService {
  private yahooService = yahooFinanceService;
  private cache = cacheService;

  /**
   * 获取单个股票报价（带缓存）
   */
  async getQuote(symbol: string): Promise<QuoteResponse> {
    try {
      const normalizedSymbol = DataProcessor.normalizeSymbol(symbol);
      
      if (!DataProcessor.validateSymbol(normalizedSymbol)) {
        return {
          success: false,
          error: {
            code: 'INVALID_SYMBOL',
            message: 'Invalid symbol format',
            symbol: normalizedSymbol,
          }
        };
      }

      // 尝试从缓存获取
      const cacheKey = this.cache.generateKey('quote', normalizedSymbol);
      const cachedData = await this.cache.get<Quote>(cacheKey);
      
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
        };
      }

      // 从Yahoo Finance获取数据
      const quote = await this.yahooService.getQuote(normalizedSymbol);
      
      // 缓存数据
      await this.cache.set(
        cacheKey, 
        quote, 
        this.cache.getRealTimeDataTTL()
      );

      return {
        success: true,
        data: quote,
      };
    } catch (error) {
      console.error(`Error in getQuote for ${symbol}:`, error);
      return {
        success: false,
        error: {
          code: 'QUOTE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          symbol,
        }
      };
    }
  }

  /**
   * 批量获取股票报价（带缓存）
   */
  async getQuotes(symbols: string[]): Promise<QuotesResponse> {
    try {
      const normalizedSymbols = symbols.map(s => DataProcessor.normalizeSymbol(s));
      const validSymbols = normalizedSymbols.filter(s => DataProcessor.validateSymbol(s));
      
      if (validSymbols.length === 0) {
        return {
          success: false,
          error: {
            code: 'NO_VALID_SYMBOLS',
            message: 'No valid symbols provided',
          }
        };
      }

      const quotes: Quote[] = [];
      const symbolsToFetch: string[] = [];

      // 检查缓存
      for (const symbol of validSymbols) {
        const cacheKey = this.cache.generateKey('quote', symbol);
        const cachedData = await this.cache.get<Quote>(cacheKey);
        
        if (cachedData) {
          quotes.push(cachedData);
        } else {
          symbolsToFetch.push(symbol);
        }
      }

      // 获取未缓存的数据
      if (symbolsToFetch.length > 0) {
        const freshQuotes = await this.yahooService.getQuotes(symbolsToFetch);
        
        // 缓存新数据
        for (const quote of freshQuotes) {
          const cacheKey = this.cache.generateKey('quote', quote.symbol);
          await this.cache.set(
            cacheKey, 
            quote, 
            this.cache.getRealTimeDataTTL()
          );
          quotes.push(quote);
        }
      }

      return {
        success: true,
        data: quotes,
      };
    } catch (error) {
      console.error('Error in getQuotes:', error);
      return {
        success: false,
        error: {
          code: 'QUOTES_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        }
      };
    }
  }

  /**
   * 获取历史数据（带缓存）
   */
  async getHistoricalData(
    symbol: string,
    period1: Date,
    period2: Date = new Date(),
    interval: '1d' | '1wk' | '1mo' = '1d'
  ): Promise<HistoricalResponse> {
    try {
      const normalizedSymbol = DataProcessor.normalizeSymbol(symbol);
      
      if (!DataProcessor.validateSymbol(normalizedSymbol)) {
        return {
          success: false,
          error: {
            code: 'INVALID_SYMBOL',
            message: 'Invalid symbol format',
            symbol: normalizedSymbol,
          }
        };
      }

      // 缓存键包含时间范围和间隔
      const cacheKey = this.cache.generateKey(
        'historical',
        normalizedSymbol,
        period1.toISOString().split('T')[0],
        period2.toISOString().split('T')[0],
        interval
      );

      // 尝试从缓存获取
      const cachedData = await this.cache.get<HistoricalData>(cacheKey);
      
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
        };
      }

      // 从Yahoo Finance获取数据
      const historicalData = await this.yahooService.getHistoricalData(
        normalizedSymbol,
        period1,
        period2,
        interval
      );

      // 缓存数据
      const ttl = interval === '1d' ? 
        this.cache.getDailyDataTTL() : 
        this.cache.getHistoricalDataTTL();
        
      await this.cache.set(cacheKey, historicalData, ttl);

      return {
        success: true,
        data: historicalData,
      };
    } catch (error) {
      console.error(`Error in getHistoricalData for ${symbol}:`, error);
      return {
        success: false,
        error: {
          code: 'HISTORICAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          symbol,
        }
      };
    }
  }

  /**
   * 搜索股票（带缓存）
   */
  async searchStocks(query: string, limit: number = 10): Promise<SearchResponse> {
    try {
      if (!query || query.trim().length < 1) {
        return {
          success: false,
          error: {
            code: 'INVALID_QUERY',
            message: 'Search query is required',
          }
        };
      }

      const normalizedQuery = query.trim().toLowerCase();
      const cacheKey = this.cache.generateKey('search', normalizedQuery, limit.toString());

      // 尝试从缓存获取
      const cachedData = await this.cache.get<SearchResult[]>(cacheKey);
      
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
        };
      }

      // 从Yahoo Finance搜索
      const searchResults = await this.yahooService.searchStocks(query, limit);
      
      // 缓存结果
      await this.cache.set(
        cacheKey, 
        searchResults, 
        this.cache.getSearchResultsTTL()
      );

      return {
        success: true,
        data: searchResults,
      };
    } catch (error) {
      console.error(`Error in searchStocks for query "${query}":`, error);
      return {
        success: false,
        error: {
          code: 'SEARCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        }
      };
    }
  }

  /**
   * 计算技术指标
   */
  async calculateIndicator(
    symbol: string,
    indicatorType: 'sma' | 'ema' | 'rsi' | 'macd' | 'bollinger' | 'stochastic',
    period: number = 14,
    params?: any
  ): Promise<IndicatorResponse> {
    try {
      const normalizedSymbol = DataProcessor.normalizeSymbol(symbol);
      
      // 获取历史数据
      const historicalResponse = await this.getHistoricalData(
        normalizedSymbol,
        new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // 1年数据
      );

      if (!historicalResponse.success || !historicalResponse.data) {
        return {
          success: false,
          error: {
            code: 'NO_DATA',
            message: 'Unable to get historical data for indicator calculation',
            symbol,
          }
        };
      }

      const data = historicalResponse.data.data;
      const closes = data.map(d => d.close);
      const highs = data.map(d => d.high);
      const lows = data.map(d => d.low);
      const timestamps = data.map(d => d.time);

      let values: number[] = [];
      let indicatorName = '';

      switch (indicatorType) {
        case 'sma':
          values = DataProcessor.calculateSMA(closes, period);
          indicatorName = `SMA(${period})`;
          break;
        case 'ema':
          values = DataProcessor.calculateEMA(closes, period);
          indicatorName = `EMA(${period})`;
          break;
        case 'rsi':
          values = DataProcessor.calculateRSI(closes, period);
          indicatorName = `RSI(${period})`;
          break;
        case 'macd':
          const macdResult = DataProcessor.calculateMACD(closes);
          values = macdResult.macd;
          indicatorName = 'MACD';
          break;
        case 'bollinger':
          const bbResult = DataProcessor.calculateBollingerBands(closes, period);
          values = bbResult.middle;
          indicatorName = `Bollinger Bands(${period})`;
          break;
        case 'stochastic':
          const stochResult = DataProcessor.calculateStochastic(highs, lows, closes, period);
          values = stochResult.k;
          indicatorName = `Stochastic(${period})`;
          break;
        default:
          return {
            success: false,
            error: {
              code: 'INVALID_INDICATOR',
              message: `Unsupported indicator type: ${indicatorType}`,
              symbol,
            }
          };
      }

      const indicator: TechnicalIndicator = {
        name: indicatorName,
        values,
        timestamps: timestamps.slice(-values.length),
      };

      return {
        success: true,
        data: indicator,
      };
    } catch (error) {
      console.error(`Error calculating ${indicatorType} for ${symbol}:`, error);
      return {
        success: false,
        error: {
          code: 'INDICATOR_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          symbol,
        }
      };
    }
  }

  /**
   * 获取服务统计信息
   */
  async getServiceStats() {
    const yahooStats = this.yahooService.getRequestStats();
    const cacheStats = await this.cache.getStats();
    
    return {
      yahoo: yahooStats,
      cache: cacheStats,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 清除指定符号的所有缓存
   */
  async clearSymbolCache(symbol: string): Promise<number> {
    const normalizedSymbol = DataProcessor.normalizeSymbol(symbol);
    const pattern = this.cache.generateKey('*', normalizedSymbol, '*');
    return await this.cache.deletePattern(pattern);
  }

  /**
   * 清除所有缓存
   */
  async clearAllCache(): Promise<number> {
    const pattern = this.cache.generateKey('*');
    return await this.cache.deletePattern(pattern);
  }
}

// 导出单例实例
export const marketDataService = new MarketDataService();

// 导出所有类型和服务
export * from './types';
export { DataProcessor } from './data-processor';
export { yahooFinanceService } from './yahoo-finance.service';
export { cacheService } from './cache.service';