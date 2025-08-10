import { Quote, OHLCV, TechnicalIndicator } from './types';

export class DataProcessor {
  /**
   * 计算简单移动平均线 (SMA)
   */
  static calculateSMA(data: number[], period: number): number[] {
    if (data.length < period) return [];
    
    const sma: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  /**
   * 计算指数移动平均线 (EMA)
   */
  static calculateEMA(data: number[], period: number): number[] {
    if (data.length < period) return [];
    
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    // 第一个EMA值是SMA
    const firstSMA = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
    ema.push(firstSMA);
    
    // 计算后续EMA值
    for (let i = period; i < data.length; i++) {
      const emaValue = (data[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
      ema.push(emaValue);
    }
    
    return ema;
  }

  /**
   * 计算相对强弱指数 (RSI)
   */
  static calculateRSI(prices: number[], period: number = 14): number[] {
    if (prices.length < period + 1) return [];
    
    const gains: number[] = [];
    const losses: number[] = [];
    
    // 计算价格变化
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    const rsi: number[] = [];
    
    // 计算第一个RSI值
    const initialAvgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    const initialAvgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    let avgGain = initialAvgGain;
    let avgLoss = initialAvgLoss;
    
    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
    
    // 计算后续RSI值
    for (let i = period; i < gains.length; i++) {
      avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
      avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;
      
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
    
    return rsi;
  }

  /**
   * 计算MACD
   */
  static calculateMACD(
    prices: number[], 
    fastPeriod: number = 12, 
    slowPeriod: number = 26, 
    signalPeriod: number = 9
  ): { macd: number[], signal: number[], histogram: number[] } {
    const fastEMA = this.calculateEMA(prices, fastPeriod);
    const slowEMA = this.calculateEMA(prices, slowPeriod);
    
    if (fastEMA.length === 0 || slowEMA.length === 0) {
      return { macd: [], signal: [], histogram: [] };
    }
    
    // 计算MACD线
    const macd: number[] = [];
    const startIndex = slowPeriod - fastPeriod;
    
    for (let i = 0; i < slowEMA.length; i++) {
      macd.push(fastEMA[i + startIndex] - slowEMA[i]);
    }
    
    // 计算信号线
    const signal = this.calculateEMA(macd, signalPeriod);
    
    // 计算柱状图
    const histogram: number[] = [];
    const signalStartIndex = macd.length - signal.length;
    
    for (let i = 0; i < signal.length; i++) {
      histogram.push(macd[i + signalStartIndex] - signal[i]);
    }
    
    return { macd, signal, histogram };
  }

  /**
   * 计算布林带 (Bollinger Bands)
   */
  static calculateBollingerBands(
    prices: number[], 
    period: number = 20, 
    standardDeviations: number = 2
  ): { upper: number[], middle: number[], lower: number[] } {
    const middle = this.calculateSMA(prices, period);
    const upper: number[] = [];
    const lower: number[] = [];
    
    for (let i = period - 1; i < prices.length; i++) {
      const slice = prices.slice(i - period + 1, i + 1);
      const sma = middle[i - period + 1];
      
      // 计算标准差
      const variance = slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
      const stdDev = Math.sqrt(variance);
      
      upper.push(sma + (standardDeviations * stdDev));
      lower.push(sma - (standardDeviations * stdDev));
    }
    
    return { upper, middle, lower };
  }

  /**
   * 计算随机指标 (Stochastic)
   */
  static calculateStochastic(
    highs: number[], 
    lows: number[], 
    closes: number[], 
    kPeriod: number = 14, 
    dPeriod: number = 3
  ): { k: number[], d: number[] } {
    if (highs.length < kPeriod || lows.length < kPeriod || closes.length < kPeriod) {
      return { k: [], d: [] };
    }
    
    const k: number[] = [];
    
    for (let i = kPeriod - 1; i < closes.length; i++) {
      const highestHigh = Math.max(...highs.slice(i - kPeriod + 1, i + 1));
      const lowestLow = Math.min(...lows.slice(i - kPeriod + 1, i + 1));
      const currentClose = closes[i];
      
      if (highestHigh === lowestLow) {
        k.push(50); // 避免除零
      } else {
        k.push(((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100);
      }
    }
    
    const d = this.calculateSMA(k, dPeriod);
    
    return { k, d };
  }

  /**
   * 格式化价格显示
   */
  static formatPrice(price: number, decimals: number = 2): string {
    return price.toFixed(decimals);
  }

  /**
   * 格式化百分比
   */
  static formatPercentage(value: number, decimals: number = 2): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
  }

  /**
   * 格式化成交量
   */
  static formatVolume(volume: number): string {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(1)}B`;
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  }

  /**
   * 格式化市值
   */
  static formatMarketCap(marketCap: number): string {
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(2)}T`;
    } else if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(2)}M`;
    }
    return `$${marketCap.toFixed(0)}`;
  }

  /**
   * 验证股票代码格式
   */
  static validateSymbol(symbol: string): boolean {
    // 基本的股票代码验证
    const symbolRegex = /^[A-Za-z]{1,5}(\.[A-Za-z]{1,2})?$/;
    return symbolRegex.test(symbol.trim());
  }

  /**
   * 清理和标准化股票代码
   */
  static normalizeSymbol(symbol: string): string {
    return symbol.trim().toUpperCase();
  }

  /**
   * 计算价格变化趋势
   */
  static calculateTrend(prices: number[], period: number = 5): 'up' | 'down' | 'flat' {
    if (prices.length < period) return 'flat';
    
    const recent = prices.slice(-period);
    const first = recent[0];
    const last = recent[recent.length - 1];
    
    const changePercent = ((last - first) / first) * 100;
    
    if (changePercent > 1) return 'up';
    if (changePercent < -1) return 'down';
    return 'flat';
  }

  /**
   * 检测支撑和阻力位
   */
  static findSupportResistance(
    highs: number[], 
    lows: number[], 
    period: number = 20
  ): { support: number[], resistance: number[] } {
    const support: number[] = [];
    const resistance: number[] = [];
    
    for (let i = period; i < lows.length - period; i++) {
      const currentLow = lows[i];
      const currentHigh = highs[i];
      
      // 检查是否为局部最低点（支撑位）
      const isSupport = lows.slice(i - period, i).every(low => low >= currentLow) &&
                       lows.slice(i + 1, i + period + 1).every(low => low >= currentLow);
      
      if (isSupport) {
        support.push(currentLow);
      }
      
      // 检查是否为局部最高点（阻力位）
      const isResistance = highs.slice(i - period, i).every(high => high <= currentHigh) &&
                          highs.slice(i + 1, i + period + 1).every(high => high <= currentHigh);
      
      if (isResistance) {
        resistance.push(currentHigh);
      }
    }
    
    return { support, resistance };
  }

  /**
   * 计算波动率
   */
  static calculateVolatility(prices: number[], period: number = 20): number[] {
    const returns: number[] = [];
    
    // 计算收益率
    for (let i = 1; i < prices.length; i++) {
      returns.push(Math.log(prices[i] / prices[i - 1]));
    }
    
    const volatility: number[] = [];
    
    // 计算滚动标准差
    for (let i = period - 1; i < returns.length; i++) {
      const slice = returns.slice(i - period + 1, i + 1);
      const mean = slice.reduce((sum, ret) => sum + ret, 0) / period;
      const variance = slice.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / period;
      volatility.push(Math.sqrt(variance) * Math.sqrt(252)); // 年化波动率
    }
    
    return volatility;
  }
}