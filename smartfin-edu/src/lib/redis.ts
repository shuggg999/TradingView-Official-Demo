import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
})

export const CacheKeys = {
  // 市场数据
  SYMBOL_PRICE: (symbol: string) => `price:${symbol}`,
  SYMBOL_HISTORY: (symbol: string, interval: string) => `history:${symbol}:${interval}`,
  MARKET_OVERVIEW: () => 'market:overview',
  
  // 用户数据
  USER_PROFILE: (userId: string) => `user:${userId}`,
  USER_WATCHLIST: (userId: string) => `watchlist:${userId}`,
  
  // API限流
  API_RATE_LIMIT: (apiKey: string) => `rate:${apiKey}`,
  
  // 系统配置
  SYSTEM_CONFIG: () => 'config:system',
} as const

export const CacheTTL = {
  REAL_TIME_DATA: 60,      // 1分钟
  HISTORICAL_DATA: 3600,   // 1小时  
  USER_DATA: 1800,         // 30分钟
  SYSTEM_CONFIG: 86400,    // 24小时
} as const

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Redis GET error:', error)
      return null
    }
  }

  static async set(key: string, value: any, ttl: number = CacheTTL.REAL_TIME_DATA): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('Redis SET error:', error)
    }
  }

  static async del(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error('Redis DEL error:', error)
    }
  }

  static async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const results = await redis.mget(...keys)
      return results.map(result => result ? JSON.parse(result) : null)
    } catch (error) {
      console.error('Redis MGET error:', error)
      return keys.map(() => null)
    }
  }

  // API限流
  static async rateLimitCheck(key: string, limit: number, window: number): Promise<boolean> {
    try {
      const current = await redis.incr(key)
      if (current === 1) {
        await redis.expire(key, window)
      }
      return current <= limit
    } catch (error) {
      console.error('Rate limit check error:', error)
      return true // 错误时允许通过
    }
  }
}

export { redis }