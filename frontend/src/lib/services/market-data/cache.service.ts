import { createClient, RedisClientType } from 'redis';
import { CacheConfig } from './types';

export class CacheService {
  private client: RedisClientType | null = null;
  private isConnected = false;

  private config: CacheConfig = {
    realTimeData: 60,        // 1分钟缓存
    dailyData: 24 * 60 * 60, // 24小时缓存
    historicalData: 7 * 24 * 60 * 60, // 7天缓存
    searchResults: 60 * 60,  // 1小时缓存
  };

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // 创建Redis客户端
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          connectTimeout: 5000,
          lazyConnect: true,
        },
      });

      // 错误处理
      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis Client Connected');
        this.isConnected = true;
      });

      this.client.on('disconnect', () => {
        console.log('Redis Client Disconnected');
        this.isConnected = false;
      });

      // 连接到Redis
      await this.client.connect();
    } catch (error) {
      console.error('Failed to initialize Redis cache:', error);
      this.client = null;
      this.isConnected = false;
    }
  }

  /**
   * 获取缓存的数据
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.client) {
      return null;
    }

    try {
      const data = await this.client.get(key);
      if (!data) return null;

      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Failed to get cache for key ${key}:`, error);
      return null;
    }
  }

  /**
   * 设置缓存数据
   */
  async set<T>(key: string, data: T, ttlSeconds?: number): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const serializedData = JSON.stringify(data);
      
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, serializedData);
      } else {
        await this.client.set(key, serializedData);
      }

      return true;
    } catch (error) {
      console.error(`Failed to set cache for key ${key}:`, error);
      return false;
    }
  }

  /**
   * 删除缓存
   */
  async delete(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error(`Failed to delete cache for key ${key}:`, error);
      return false;
    }
  }

  /**
   * 删除匹配模式的所有缓存
   */
  async deletePattern(pattern: string): Promise<number> {
    if (!this.isConnected || !this.client) {
      return 0;
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) return 0;

      await this.client.del(keys);
      return keys.length;
    } catch (error) {
      console.error(`Failed to delete cache pattern ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * 检查缓存是否存在
   */
  async exists(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Failed to check cache existence for key ${key}:`, error);
      return false;
    }
  }

  /**
   * 获取缓存TTL
   */
  async getTTL(key: string): Promise<number> {
    if (!this.isConnected || !this.client) {
      return -1;
    }

    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error(`Failed to get TTL for key ${key}:`, error);
      return -1;
    }
  }

  /**
   * 生成缓存键
   */
  generateKey(prefix: string, ...parts: string[]): string {
    return `market_data:${prefix}:${parts.join(':')}`;
  }

  /**
   * 获取实时数据缓存TTL
   */
  getRealTimeDataTTL(): number {
    return this.config.realTimeData;
  }

  /**
   * 获取日线数据缓存TTL
   */
  getDailyDataTTL(): number {
    return this.config.dailyData;
  }

  /**
   * 获取历史数据缓存TTL
   */
  getHistoricalDataTTL(): number {
    return this.config.historicalData;
  }

  /**
   * 获取搜索结果缓存TTL
   */
  getSearchResultsTTL(): number {
    return this.config.searchResults;
  }

  /**
   * 获取连接状态
   */
  isRedisConnected(): boolean {
    return this.isConnected;
  }

  /**
   * 关闭连接
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  /**
   * 获取缓存统计信息
   */
  async getStats(): Promise<Record<string, any> | null> {
    if (!this.isConnected || !this.client) {
      return null;
    }

    try {
      const info = await this.client.info('memory');
      const keyspace = await this.client.info('keyspace');
      
      return {
        connected: this.isConnected,
        memory: info,
        keyspace: keyspace,
        config: this.config,
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return null;
    }
  }
}

// 创建单例实例
export const cacheService = new CacheService();