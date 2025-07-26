import { prisma } from "@/lib/prisma"
import { CacheService, CacheKeys, CacheTTL } from "@/lib/redis"
import { AssetType, TimeInterval } from "@prisma/client"
import { logger } from "@/lib/logger"

export interface MarketDataPoint {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: number
  marketCap?: number
  currency: string
  timestamp: Date
}

export interface HistoricalDataPoint {
  timestamp: Date
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export class MarketDataService {
  private static readonly CACHE_TTL = CacheTTL.REAL_TIME_DATA

  // 获取单个股票的实时数据
  static async getSymbolData(symbol: string): Promise<MarketDataPoint> {
    const cacheKey = CacheKeys.SYMBOL_PRICE(symbol)
    
    // 检查缓存
    const cachedData = await CacheService.get<MarketDataPoint>(cacheKey)
    if (cachedData) {
      logger.debug(`Cache hit for symbol: ${symbol}`)
      return cachedData
    }

    logger.info(`Fetching live data for symbol: ${symbol}`)

    // 从外部API获取数据
    const data = await this.fetchFromYahooFinance(symbol)
    
    // 缓存结果
    await CacheService.set(cacheKey, data, this.CACHE_TTL)
    
    // 更新数据库中的符号信息
    await this.updateSymbolInDB(symbol, data)
    
    return data
  }

  // 批量获取多个股票数据
  static async getBatchSymbolData(symbols: string[]): Promise<MarketDataPoint[]> {
    const cacheKeys = symbols.map(symbol => CacheKeys.SYMBOL_PRICE(symbol))
    const cachedResults = await CacheService.mget<MarketDataPoint>(cacheKeys)
    
    const results: MarketDataPoint[] = []
    const missedSymbols: string[] = []

    // 检查哪些数据需要重新获取
    for (let i = 0; i < symbols.length; i++) {
      if (cachedResults[i]) {
        results[i] = cachedResults[i]!
      } else {
        missedSymbols.push(symbols[i])
      }
    }

    // 获取缓存中缺失的数据
    if (missedSymbols.length > 0) {
      const freshData = await Promise.allSettled(
        missedSymbols.map(symbol => this.getSymbolData(symbol))
      )

      let missedIndex = 0
      for (let i = 0; i < symbols.length; i++) {
        if (!results[i]) {
          const result = freshData[missedIndex]
          if (result.status === 'fulfilled') {
            results[i] = result.value
          } else {
            // 返回错误占位符
            results[i] = this.createErrorPlaceholder(symbols[i])
          }
          missedIndex++
        }
      }
    }

    return results
  }

  // 从Yahoo Finance API获取数据
  private static async fetchFromYahooFinance(symbol: string): Promise<MarketDataPoint> {
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Yahoo Finance API error: ${response.status}`)
      }

      const data = await response.json()
      const result = data.chart?.result?.[0]
      
      if (!result) {
        throw new Error(`No data found for symbol: ${symbol}`)
      }

      const meta = result.meta
      const quote = result.indicators?.quote?.[0]
      
      if (!meta) {
        throw new Error(`Invalid data structure for symbol: ${symbol}`)
      }

      const currentPrice = meta.regularMarketPrice || meta.previousClose || 0
      const previousClose = meta.previousClose || currentPrice
      const change = currentPrice - previousClose
      const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0

      return {
        symbol: symbol.toUpperCase(),
        name: meta.longName || meta.shortName || symbol,
        price: currentPrice,
        change,
        changePercent,
        high: meta.regularMarketDayHigh || currentPrice,
        low: meta.regularMarketDayLow || currentPrice,
        volume: meta.regularMarketVolume || 0,
        marketCap: meta.marketCap,
        currency: meta.currency || 'USD',
        timestamp: new Date()
      }
    } catch (error) {
      logger.error(`Failed to fetch data for ${symbol}:`, error)
      throw new Error(`获取 ${symbol} 数据失败`)
    }
  }

  // 获取历史数据
  static async getHistoricalData(
    symbol: string,
    interval: TimeInterval,
    from: Date,
    to: Date
  ): Promise<HistoricalDataPoint[]> {
    const cacheKey = CacheKeys.SYMBOL_HISTORY(symbol, interval)
    
    // 尝试从数据库获取
    const dbData = await prisma.priceHistory.findMany({
      where: {
        symbol: { symbol },
        interval,
        timestamp: {
          gte: from,
          lte: to
        }
      },
      orderBy: { timestamp: 'asc' }
    })

    if (dbData.length > 0) {
      return dbData.map(item => ({
        timestamp: item.timestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume || undefined
      }))
    }

    // 从外部API获取历史数据
    const historicalData = await this.fetchHistoricalFromYahoo(symbol, interval, from, to)
    
    // 保存到数据库
    await this.saveHistoricalData(symbol, historicalData, interval)
    
    return historicalData
  }

  // 从Yahoo Finance获取历史数据
  private static async fetchHistoricalFromYahoo(
    symbol: string,
    interval: TimeInterval,
    from: Date,
    to: Date
  ): Promise<HistoricalDataPoint[]> {
    try {
      const intervalMap = {
        [TimeInterval.ONE_MINUTE]: '1m',
        [TimeInterval.FIVE_MINUTES]: '5m',
        [TimeInterval.FIFTEEN_MINUTES]: '15m',
        [TimeInterval.ONE_HOUR]: '1h',
        [TimeInterval.FOUR_HOURS]: '4h',
        [TimeInterval.ONE_DAY]: '1d',
        [TimeInterval.ONE_WEEK]: '1wk'
      }

      const yahooInterval = intervalMap[interval] || '1d'
      const period1 = Math.floor(from.getTime() / 1000)
      const period2 = Math.floor(to.getTime() / 1000)

      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=${yahooInterval}`
      )

      if (!response.ok) {
        throw new Error(`Yahoo Finance historical API error: ${response.status}`)
      }

      const data = await response.json()
      const result = data.chart?.result?.[0]
      
      if (!result || !result.timestamp) {
        return []
      }

      const timestamps = result.timestamp
      const quotes = result.indicators?.quote?.[0]
      
      if (!quotes) {
        return []
      }

      const historicalData: HistoricalDataPoint[] = []
      
      for (let i = 0; i < timestamps.length; i++) {
        if (quotes.open[i] !== null && quotes.close[i] !== null) {
          historicalData.push({
            timestamp: new Date(timestamps[i] * 1000),
            open: quotes.open[i],
            high: quotes.high[i],
            low: quotes.low[i],
            close: quotes.close[i],
            volume: quotes.volume?.[i]
          })
        }
      }

      return historicalData
    } catch (error) {
      logger.error(`Failed to fetch historical data for ${symbol}:`, error)
      throw new Error(`获取 ${symbol} 历史数据失败`)
    }
  }

  // 保存历史数据到数据库
  private static async saveHistoricalData(
    symbol: string,
    data: HistoricalDataPoint[],
    interval: TimeInterval
  ): Promise<void> {
    try {
      // 确保符号存在
      const symbolRecord = await prisma.symbol.findUnique({
        where: { symbol }
      })

      if (!symbolRecord) {
        logger.warn(`Symbol ${symbol} not found in database`)
        return
      }

      // 批量插入历史数据
      const historyData = data.map(item => ({
        symbolId: symbolRecord.id,
        timestamp: item.timestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
        interval
      }))

      await prisma.priceHistory.createMany({
        data: historyData,
        skipDuplicates: true
      })

      logger.info(`Saved ${historyData.length} historical records for ${symbol}`)
    } catch (error) {
      logger.error(`Failed to save historical data for ${symbol}:`, error)
    }
  }

  // 更新数据库中的符号信息
  private static async updateSymbolInDB(symbol: string, data: MarketDataPoint): Promise<void> {
    try {
      await prisma.symbol.upsert({
        where: { symbol },
        update: {
          name: data.name,
          lastPrice: data.price,
          lastUpdate: data.timestamp
        },
        create: {
          symbol,
          name: data.name,
          exchange: this.guessExchange(symbol),
          type: this.guessAssetType(symbol),
          currency: data.currency,
          lastPrice: data.price,
          lastUpdate: data.timestamp
        }
      })
    } catch (error) {
      logger.error(`Failed to update symbol ${symbol} in database:`, error)
    }
  }

  // 根据符号猜测资产类型
  private static guessAssetType(symbol: string): AssetType {
    const upperSymbol = symbol.toUpperCase()
    
    if (upperSymbol.includes('-USD') || upperSymbol.includes('BTC') || upperSymbol.includes('ETH')) {
      return AssetType.CRYPTO
    }
    if (upperSymbol.includes('=X')) {
      return AssetType.FOREX
    }
    if (upperSymbol.startsWith('^')) {
      return AssetType.INDEX
    }
    return AssetType.STOCK
  }

  // 根据符号猜测交易所
  private static guessExchange(symbol: string): string {
    const upperSymbol = symbol.toUpperCase()
    
    if (upperSymbol.includes('-USD') || upperSymbol.includes('BTC') || upperSymbol.includes('ETH')) {
      return 'CRYPTO'
    }
    if (upperSymbol.includes('=X')) {
      return 'FOREX'
    }
    if (upperSymbol.startsWith('^')) {
      return 'INDEX'
    }
    // 默认假设是美股
    return 'NASDAQ'
  }

  // 创建错误占位符
  private static createErrorPlaceholder(symbol: string): MarketDataPoint {
    return {
      symbol: symbol.toUpperCase(),
      name: symbol,
      price: 0,
      change: 0,
      changePercent: 0,
      high: 0,
      low: 0,
      volume: 0,
      currency: 'USD',
      timestamp: new Date()
    }
  }

  // 搜索符号
  static async searchSymbols(query: string, type?: AssetType, limit: number = 10): Promise<any[]> {
    // 从数据库搜索
    const dbResults = await prisma.symbol.findMany({
      where: {
        AND: [
          {
            OR: [
              { symbol: { contains: query, mode: 'insensitive' } },
              { name: { contains: query, mode: 'insensitive' } }
            ]
          },
          type ? { type } : {},
          { isActive: true }
        ]
      },
      take: limit,
      select: {
        symbol: true,
        name: true,
        type: true,
        exchange: true,
        currency: true,
        lastPrice: true,
        lastUpdate: true
      }
    })

    return dbResults
  }
}