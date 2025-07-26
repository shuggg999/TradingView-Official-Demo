# 市场数据系统技术设计方案

## 项目信息
- **功能模块**: 市场数据系统技术设计
- **设计版本**: v1.0
- **技术栈**: Next.js 15 + Node.js + PostgreSQL + Redis + WebSocket + Bull Queue
- **设计日期**: 2025-01-26

## 1. 系统架构设计

### 1.1 整体架构图

```mermaid
graph TB
    subgraph "客户端层"
        A[Web应用] --> B[移动端应用]
        B --> C[第三方API客户端]
    end
    
    subgraph "API网关层"
        D[Next.js API Routes] --> E[WebSocket服务器]
        E --> F[GraphQL端点]
        F --> G[REST API端点]
    end
    
    subgraph "业务服务层"
        H[市场数据服务] --> I[实时推送服务]
        I --> J[数据聚合服务]
        J --> K[告警服务]
        K --> L[用户订阅服务]
    end
    
    subgraph "数据处理层"
        M[数据采集器] --> N[数据验证器]
        N --> O[数据转换器]
        O --> P[技术指标计算器]
    end
    
    subgraph "存储层"
        Q[(PostgreSQL)] --> R[(Redis缓存)]
        R --> S[(时序数据库)]
        S --> T[(文件存储)]
    end
    
    subgraph "外部数据源"
        U[Yahoo Finance] --> V[Alpha Vantage]
        V --> W[Polygon.io]
        W --> X[其他数据源]
    end
    
    subgraph "基础设施层"
        Y[消息队列] --> Z[定时任务]
        Z --> AA[监控告警]
        AA --> BB[日志系统]
    end
    
    A --> D
    B --> E
    C --> G
    
    D --> H
    E --> I
    F --> J
    G --> K
    
    H --> M
    I --> Q
    J --> R
    K --> Y
    L --> Q
    
    M --> U
    N --> V
    O --> W
    P --> X
    
    H --> Q
    I --> R
    J --> S
    K --> T
```

### 1.2 微服务架构分层

#### API层 (Next.js API Routes)
- **RESTful APIs**: 标准的CRUD操作和查询接口
- **GraphQL端点**: 灵活的数据查询和订阅
- **WebSocket服务**: 实时数据推送和双向通信
- **API网关**: 请求路由、认证、限流、监控

#### 业务服务层
- **市场数据服务**: 核心数据获取和管理逻辑
- **实时推送服务**: WebSocket连接管理和数据推送
- **数据聚合服务**: 多源数据整合和质量控制
- **告警服务**: 价格告警和系统监控告警
- **用户订阅服务**: 个人关注列表和偏好管理

#### 数据处理层
- **数据采集器**: 多源数据获取和调度
- **数据验证器**: 数据质量检查和异常处理
- **数据转换器**: 数据格式统一和标准化
- **技术指标计算器**: 实时技术指标计算

## 2. 数据模型设计

### 2.1 核心数据表结构

#### 市场数据主表 (market_data)
```sql
CREATE TABLE market_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    market VARCHAR(10) NOT NULL,
    asset_type VARCHAR(20) NOT NULL, -- 'stock', 'forex', 'crypto', 'commodity'
    
    -- 价格数据
    price DECIMAL(15,6) NOT NULL,
    open_price DECIMAL(15,6),
    high_price DECIMAL(15,6),
    low_price DECIMAL(15,6),
    close_price DECIMAL(15,6),
    
    -- 变化数据
    change_amount DECIMAL(15,6),
    change_percent DECIMAL(8,4),
    
    -- 成交数据
    volume BIGINT DEFAULT 0,
    turnover DECIMAL(20,2) DEFAULT 0,
    
    -- 时间信息
    data_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    data_date DATE GENERATED ALWAYS AS (data_timestamp::date) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 数据源信息
    data_source VARCHAR(50) NOT NULL,
    data_quality_score INTEGER DEFAULT 100,
    
    -- 约束和索引
    UNIQUE(symbol, market, data_timestamp),
    CHECK (price > 0),
    CHECK (volume >= 0),
    CHECK (data_quality_score BETWEEN 0 AND 100)
);

-- 分区表（按月分区）
CREATE TABLE market_data_y2025m01 PARTITION OF market_data
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- 核心索引
CREATE INDEX idx_market_data_symbol_timestamp ON market_data(symbol, data_timestamp DESC);
CREATE INDEX idx_market_data_market_type ON market_data(market, asset_type);
CREATE INDEX idx_market_data_date ON market_data(data_date);
CREATE INDEX idx_market_data_source ON market_data(data_source);
```

#### 资产信息表 (assets)
```sql
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    market VARCHAR(10) NOT NULL,
    asset_type VARCHAR(20) NOT NULL,
    
    -- 基本信息
    currency VARCHAR(3) NOT NULL,
    exchange VARCHAR(50),
    timezone VARCHAR(50),
    
    -- 详细信息
    company_name VARCHAR(200),
    sector VARCHAR(100),
    industry VARCHAR(100),
    market_cap BIGINT,
    
    -- 交易信息
    trading_hours JSONB,
    tick_size DECIMAL(10,6),
    lot_size INTEGER DEFAULT 1,
    
    -- 状态信息
    is_active BOOLEAN DEFAULT TRUE,
    is_tradable BOOLEAN DEFAULT TRUE,
    delisting_date DATE,
    
    -- 元数据
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_assets_symbol ON assets(symbol),
    INDEX idx_assets_market_type ON assets(market, asset_type),
    INDEX idx_assets_active ON assets(is_active) WHERE is_active = TRUE
);
```

#### 历史数据表 (historical_data)
```sql
CREATE TABLE historical_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    interval_type VARCHAR(10) NOT NULL, -- '1m', '5m', '15m', '1h', '1d', '1w', '1M'
    
    -- OHLCV数据
    open_price DECIMAL(15,6) NOT NULL,
    high_price DECIMAL(15,6) NOT NULL,
    low_price DECIMAL(15,6) NOT NULL,
    close_price DECIMAL(15,6) NOT NULL,
    volume BIGINT DEFAULT 0,
    
    -- 调整数据
    adj_close DECIMAL(15,6),
    split_factor DECIMAL(10,6) DEFAULT 1.0,
    dividend DECIMAL(10,6) DEFAULT 0,
    
    -- 时间信息
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    data_date DATE GENERATED ALWAYS AS (period_start::date) STORED,
    
    -- 数据源和质量
    data_source VARCHAR(50) NOT NULL,
    data_quality INTEGER DEFAULT 100,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 唯一约束
    UNIQUE(symbol, interval_type, period_start),
    
    -- 检查约束
    CHECK (high_price >= low_price),
    CHECK (high_price >= open_price),
    CHECK (high_price >= close_price),
    CHECK (low_price <= open_price),
    CHECK (low_price <= close_price),
    CHECK (volume >= 0)
) PARTITION BY RANGE (data_date);

-- 分区表（按月分区）
CREATE TABLE historical_data_y2025m01 PARTITION OF historical_data
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- 核心索引
CREATE INDEX idx_historical_symbol_interval_time ON historical_data(symbol, interval_type, period_start DESC);
CREATE INDEX idx_historical_date_symbol ON historical_data(data_date, symbol);
```

#### 用户订阅表 (user_subscriptions)
```sql
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subscription_type VARCHAR(20) NOT NULL, -- 'watchlist', 'alert', 'realtime'
    
    -- 订阅内容
    symbols TEXT[] NOT NULL,
    markets TEXT[] DEFAULT ARRAY[]::TEXT[],
    asset_types TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- 订阅配置
    notification_methods TEXT[] DEFAULT ARRAY['web']::TEXT[], -- 'web', 'email', 'sms'
    update_frequency INTEGER DEFAULT 60, -- 秒
    is_active BOOLEAN DEFAULT TRUE,
    
    -- 告警配置（当subscription_type='alert'时使用）
    alert_conditions JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id),
    INDEX idx_user_subscriptions_type ON user_subscriptions(subscription_type),
    INDEX idx_user_subscriptions_active ON user_subscriptions(is_active) WHERE is_active = TRUE
);
```

#### 数据源配置表 (data_sources)
```sql
CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    
    -- 连接配置
    base_url TEXT NOT NULL,
    api_key_encrypted TEXT,
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_day INTEGER DEFAULT 1000,
    
    -- 支持的资产类型和市场
    supported_asset_types TEXT[] NOT NULL,
    supported_markets TEXT[] NOT NULL,
    supported_intervals TEXT[] NOT NULL,
    
    -- 优先级和状态
    priority INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    is_realtime BOOLEAN DEFAULT FALSE,
    
    -- 成本和配额
    cost_per_call DECIMAL(8,6) DEFAULT 0,
    daily_quota INTEGER DEFAULT 1000,
    current_usage INTEGER DEFAULT 0,
    quota_reset_time TIME DEFAULT '00:00:00',
    
    -- 质量指标
    success_rate DECIMAL(5,2) DEFAULT 100.00,
    avg_response_time INTEGER DEFAULT 1000, -- 毫秒
    last_error_at TIMESTAMP WITH TIME ZONE,
    error_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_data_sources_active ON data_sources(is_active) WHERE is_active = TRUE,
    INDEX idx_data_sources_priority ON data_sources(priority DESC)
);
```

### 2.2 Redis缓存数据结构

#### 实时数据缓存
```redis
# 实时价格数据
market:realtime:{symbol} = {
    "symbol": "AAPL",
    "price": 150.25,
    "change": 2.15,
    "changePercent": 1.45,
    "volume": 25000000,
    "timestamp": "2025-01-26T15:30:00Z",
    "source": "yahoo"
}
TTL: 30秒

# 市场状态
market:status:{market} = {
    "market": "NASDAQ",
    "status": "open",
    "openTime": "09:30:00",
    "closeTime": "16:00:00",
    "timezone": "America/New_York",
    "lastUpdate": "2025-01-26T15:30:00Z"
}
TTL: 1分钟

# 用户关注列表缓存
user:watchlist:{userId} = ["AAPL", "GOOGL", "MSFT", "TSLA"]
TTL: 10分钟
```

#### API限流缓存
```redis
# 用户API调用计数
rate_limit:user:{userId}:{endpoint} = {
    "count": 45,
    "window": "2025-01-26T15:00:00Z",
    "limit": 100
}
TTL: 3600秒

# 数据源调用计数
rate_limit:source:{sourceName} = {
    "minuteCount": 58,
    "dailyCount": 2450,
    "lastReset": "2025-01-26T00:00:00Z"
}
TTL: 86400秒
```

#### 技术指标缓存
```redis
# 技术指标数据
indicator:{symbol}:{indicator}:{period} = {
    "symbol": "AAPL",
    "indicator": "RSI",
    "period": 14,
    "value": 68.5,
    "timestamp": "2025-01-26T15:30:00Z",
    "params": {"period": 14}
}
TTL: 3600秒
```

## 3. 核心服务设计

### 3.1 数据采集服务

#### 数据源管理器
```typescript
// lib/market-data/DataSourceManager.ts
interface DataSourceConfig {
    name: string;
    provider: string;
    baseUrl: string;
    apiKey: string;
    rateLimit: {
        perMinute: number;
        perDay: number;
    };
    priority: number;
    isActive: boolean;
    supportedAssetTypes: string[];
    supportedMarkets: string[];
}

export class DataSourceManager {
    private sources: Map<string, DataSourceConfig> = new Map();
    private rateLimiters: Map<string, RateLimiter> = new Map();
    private healthCheckers: Map<string, HealthChecker> = new Map();
    
    async initialize(): Promise<void> {
        // 从数据库加载数据源配置
        const configs = await this.loadDataSourceConfigs();
        
        for (const config of configs) {
            this.sources.set(config.name, config);
            
            // 初始化限流器
            this.rateLimiters.set(config.name, new RateLimiter({
                windowMs: 60 * 1000, // 1分钟
                max: config.rateLimit.perMinute
            }));
            
            // 初始化健康检查
            this.healthCheckers.set(config.name, new HealthChecker(config));
        }
        
        // 启动健康检查定时任务
        this.startHealthCheck();
    }
    
    async fetchMarketData(
        symbols: string[],
        options: FetchOptions = {}
    ): Promise<MarketDataResponse> {
        const availableSources = this.getAvailableSources(options);
        
        for (const source of availableSources) {
            try {
                // 检查限流
                if (!await this.checkRateLimit(source.name)) {
                    continue;
                }
                
                // 获取数据
                const adapter = this.getDataAdapter(source.provider);
                const data = await adapter.fetchMarketData(symbols, source, options);
                
                // 更新成功率统计
                await this.updateSourceStats(source.name, true);
                
                return {
                    data,
                    source: source.name,
                    timestamp: new Date()
                };
                
            } catch (error) {
                console.error(`Data fetch failed from ${source.name}:`, error);
                await this.updateSourceStats(source.name, false);
                continue;
            }
        }
        
        throw new Error('All data sources failed');
    }
    
    private getAvailableSources(options: FetchOptions): DataSourceConfig[] {
        return Array.from(this.sources.values())
            .filter(source => {
                if (!source.isActive) return false;
                
                // 检查资产类型支持
                if (options.assetType && !source.supportedAssetTypes.includes(options.assetType)) {
                    return false;
                }
                
                // 检查市场支持
                if (options.market && !source.supportedMarkets.includes(options.market)) {
                    return false;
                }
                
                return true;
            })
            .sort((a, b) => b.priority - a.priority); // 按优先级排序
    }
    
    private async checkRateLimit(sourceName: string): Promise<boolean> {
        const limiter = this.rateLimiters.get(sourceName);
        if (!limiter) return true;
        
        return await limiter.checkLimit();
    }
    
    private getDataAdapter(provider: string): DataAdapter {
        switch (provider) {
            case 'yahoo':
                return new YahooFinanceAdapter();
            case 'alphavantage':
                return new AlphaVantageAdapter();
            case 'polygon':
                return new PolygonAdapter();
            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }
    }
    
    private async updateSourceStats(sourceName: string, success: boolean): Promise<void> {
        const source = this.sources.get(sourceName);
        if (!source) return;
        
        // 更新数据库中的统计信息
        await this.db.query(`
            UPDATE data_sources 
            SET 
                success_rate = CASE 
                    WHEN success_rate IS NULL THEN $2::decimal
                    ELSE (success_rate * 0.99 + $2::decimal * 0.01)
                END,
                error_count = CASE 
                    WHEN $2::boolean THEN 0
                    ELSE error_count + 1
                END,
                last_error_at = CASE 
                    WHEN $2::boolean THEN last_error_at
                    ELSE CURRENT_TIMESTAMP
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE name = $1
        `, [sourceName, success ? 100 : 0]);
    }
    
    private startHealthCheck(): void {
        setInterval(async () => {
            for (const [name, checker] of this.healthCheckers) {
                try {
                    const isHealthy = await checker.check();
                    if (!isHealthy) {
                        console.warn(`Data source ${name} health check failed`);
                        // 可以在这里实现告警逻辑
                    }
                } catch (error) {
                    console.error(`Health check error for ${name}:`, error);
                }
            }
        }, 60000); // 每分钟检查一次
    }
}
```

#### Yahoo Finance数据适配器
```typescript
// lib/market-data/adapters/YahooFinanceAdapter.ts
export class YahooFinanceAdapter implements DataAdapter {
    private baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart';
    
    async fetchMarketData(
        symbols: string[],
        source: DataSourceConfig,
        options: FetchOptions
    ): Promise<MarketData[]> {
        const results: MarketData[] = [];
        
        // Yahoo Finance支持批量查询，但有数量限制
        const batches = this.chunkArray(symbols, 100);
        
        for (const batch of batches) {
            try {
                const symbolsParam = batch.join(',');
                const url = `${this.baseUrl}/${symbolsParam}`;
                
                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'SmartFin/1.0',
                        'Accept': 'application/json'
                    },
                    timeout: 10000
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                const marketData = this.parseYahooResponse(data);
                results.push(...marketData);
                
            } catch (error) {
                console.error('Yahoo Finance API error:', error);
                throw error;
            }
        }
        
        return results;
    }
    
    async fetchHistoricalData(
        symbol: string,
        interval: string,
        range: string,
        source: DataSourceConfig
    ): Promise<HistoricalData[]> {
        try {
            const url = `${this.baseUrl}/${symbol}?interval=${interval}&range=${range}`;
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'SmartFin/1.0',
                    'Accept': 'application/json'
                },
                timeout: 15000
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return this.parseYahooHistoricalData(data);
            
        } catch (error) {
            console.error('Yahoo Finance historical data error:', error);
            throw error;
        }
    }
    
    private parseYahooResponse(data: any): MarketData[] {
        const results: MarketData[] = [];
        
        if (!data.chart || !data.chart.result) {
            return results;
        }
        
        for (const result of data.chart.result) {
            try {
                const meta = result.meta;
                const quote = result.indicators?.quote?.[0];
                
                if (!meta || !quote) continue;
                
                const marketData: MarketData = {
                    symbol: meta.symbol,
                    name: meta.longName || meta.symbol,
                    market: this.getMarketFromSymbol(meta.symbol),
                    assetType: this.getAssetTypeFromSymbol(meta.symbol),
                    price: meta.regularMarketPrice || quote.close?.[quote.close.length - 1],
                    change: meta.regularMarketPrice - meta.previousClose,
                    changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
                    volume: meta.regularMarketVolume || 0,
                    high: meta.regularMarketDayHigh,
                    low: meta.regularMarketDayLow,
                    open: meta.regularMarketOpen,
                    close: meta.previousClose,
                    timestamp: new Date(meta.regularMarketTime * 1000),
                    dataSource: 'yahoo',
                    currency: meta.currency || 'USD'
                };
                
                results.push(marketData);
            } catch (error) {
                console.error('Error parsing Yahoo data for symbol:', result.meta?.symbol, error);
            }
        }
        
        return results;
    }
    
    private parseYahooHistoricalData(data: any): HistoricalData[] {
        const results: HistoricalData[] = [];
        
        if (!data.chart?.result?.[0]) {
            return results;
        }
        
        const result = data.chart.result[0];
        const timestamps = result.timestamp || [];
        const quote = result.indicators?.quote?.[0];
        
        if (!quote) return results;
        
        const { open, high, low, close, volume } = quote;
        
        for (let i = 0; i < timestamps.length; i++) {
            if (open[i] !== null && high[i] !== null && low[i] !== null && close[i] !== null) {
                results.push({
                    symbol: result.meta.symbol,
                    timestamp: new Date(timestamps[i] * 1000),
                    open: open[i],
                    high: high[i],
                    low: low[i],
                    close: close[i],
                    volume: volume?.[i] || 0,
                    dataSource: 'yahoo'
                });
            }
        }
        
        return results;
    }
    
    private getMarketFromSymbol(symbol: string): string {
        // 简化的市场识别逻辑
        if (symbol.includes('.SS') || symbol.includes('.SZ')) return 'SSE';
        if (symbol.includes('.HK')) return 'HKEX';
        if (symbol.includes('.T')) return 'TSE';
        return 'NASDAQ'; // 默认
    }
    
    private getAssetTypeFromSymbol(symbol: string): string {
        if (symbol.includes('-USD') || symbol.includes('=X')) return 'forex';
        if (symbol.includes('BTC') || symbol.includes('ETH')) return 'crypto';
        return 'stock'; // 默认
    }
    
    private chunkArray<T>(array: T[], size: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
}
```

### 3.2 实时推送服务

#### WebSocket连接管理器
```typescript
// lib/market-data/WebSocketManager.ts
import { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { authenticateWebSocket } from '@/lib/auth/websocketAuth';

interface WebSocketClient {
    id: string;
    userId?: string;
    subscriptions: Set<string>;
    lastPing: Date;
    rateLimit: {
        count: number;
        resetTime: Date;
    };
}

export class MarketDataWebSocketManager {
    private wss: WebSocketServer;
    private clients: Map<string, WebSocketClient> = new Map();
    private subscriptionMap: Map<string, Set<string>> = new Map(); // symbol -> clientIds
    private heartbeatInterval: NodeJS.Timeout;
    
    constructor(server: any) {
        this.wss = new WebSocketServer({
            server,
            path: '/ws/market-data',
            clientTracking: true
        });
        
        this.setupWebSocketServer();
        this.startHeartbeat();
    }
    
    private setupWebSocketServer(): void {
        this.wss.on('connection', async (ws, request: IncomingMessage) => {
            try {
                // 认证WebSocket连接
                const authResult = await authenticateWebSocket(request);
                if (!authResult.success) {
                    ws.close(1008, 'Authentication failed');
                    return;
                }
                
                // 创建客户端记录
                const clientId = this.generateClientId();
                const client: WebSocketClient = {
                    id: clientId,
                    userId: authResult.userId,
                    subscriptions: new Set(),
                    lastPing: new Date(),
                    rateLimit: {
                        count: 0,
                        resetTime: new Date(Date.now() + 60000) // 1分钟后重置
                    }
                };
                
                this.clients.set(clientId, client);
                
                // 设置WebSocket事件处理
                ws.on('message', (data) => this.handleMessage(clientId, data));
                ws.on('close', () => this.handleDisconnect(clientId));
                ws.on('pong', () => this.handlePong(clientId));
                ws.on('error', (error) => this.handleError(clientId, error));
                
                // 存储WebSocket连接引用
                (ws as any).clientId = clientId;
                
                // 发送连接成功消息
                this.sendToClient(clientId, {
                    type: 'connection',
                    status: 'connected',
                    clientId: clientId,
                    timestamp: new Date().toISOString()
                });
                
                console.log(`WebSocket client connected: ${clientId}`);
                
            } catch (error) {
                console.error('WebSocket connection error:', error);
                ws.close(1011, 'Server error');
            }
        });
    }
    
    private handleMessage(clientId: string, data: any): void {
        try {
            const client = this.clients.get(clientId);
            if (!client) return;
            
            // 检查限流
            if (!this.checkRateLimit(client)) {
                this.sendToClient(clientId, {
                    type: 'error',
                    message: 'Rate limit exceeded',
                    code: 'RATE_LIMIT'
                });
                return;
            }
            
            const message = JSON.parse(data.toString());
            
            switch (message.type) {
                case 'subscribe':
                    this.handleSubscribe(clientId, message.symbols);
                    break;
                    
                case 'unsubscribe':
                    this.handleUnsubscribe(clientId, message.symbols);
                    break;
                    
                case 'ping':
                    this.handlePing(clientId);
                    break;
                    
                case 'get_subscriptions':
                    this.handleGetSubscriptions(clientId);
                    break;
                    
                default:
                    this.sendToClient(clientId, {
                        type: 'error',
                        message: 'Unknown message type',
                        code: 'UNKNOWN_TYPE'
                    });
            }
            
        } catch (error) {
            console.error('WebSocket message handling error:', error);
            this.sendToClient(clientId, {
                type: 'error',
                message: 'Invalid message format',
                code: 'INVALID_FORMAT'
            });
        }
    }
    
    private handleSubscribe(clientId: string, symbols: string[]): void {
        const client = this.clients.get(clientId);
        if (!client) return;
        
        const validSymbols: string[] = [];
        const errors: string[] = [];
        
        for (const symbol of symbols) {
            // 验证symbol格式
            if (!this.isValidSymbol(symbol)) {
                errors.push(`Invalid symbol: ${symbol}`);
                continue;
            }
            
            // 检查订阅限制
            if (client.subscriptions.size >= this.getSubscriptionLimit(client.userId)) {
                errors.push(`Subscription limit reached`);
                break;
            }
            
            // 添加订阅
            client.subscriptions.add(symbol);
            
            // 更新订阅映射
            if (!this.subscriptionMap.has(symbol)) {
                this.subscriptionMap.set(symbol, new Set());
            }
            this.subscriptionMap.get(symbol)!.add(clientId);
            
            validSymbols.push(symbol);
        }
        
        // 发送订阅确认
        this.sendToClient(clientId, {
            type: 'subscribed',
            symbols: validSymbols,
            errors: errors.length > 0 ? errors : undefined,
            timestamp: new Date().toISOString()
        });
        
        // 立即发送当前数据
        this.sendCurrentData(clientId, validSymbols);
    }
    
    private handleUnsubscribe(clientId: string, symbols: string[]): void {
        const client = this.clients.get(clientId);
        if (!client) return;
        
        const unsubscribed: string[] = [];
        
        for (const symbol of symbols) {
            if (client.subscriptions.has(symbol)) {
                client.subscriptions.delete(symbol);
                
                // 从订阅映射中移除
                const subscribers = this.subscriptionMap.get(symbol);
                if (subscribers) {
                    subscribers.delete(clientId);
                    if (subscribers.size === 0) {
                        this.subscriptionMap.delete(symbol);
                    }
                }
                
                unsubscribed.push(symbol);
            }
        }
        
        this.sendToClient(clientId, {
            type: 'unsubscribed',
            symbols: unsubscribed,
            timestamp: new Date().toISOString()
        });
    }
    
    private async sendCurrentData(clientId: string, symbols: string[]): Promise<void> {
        try {
            // 从缓存获取当前数据
            const marketDataService = new MarketDataService();
            const data = await marketDataService.getCurrentData(symbols);
            
            if (data.length > 0) {
                this.sendToClient(clientId, {
                    type: 'market_data',
                    data: data,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Error sending current data:', error);
        }
    }
    
    // 广播市场数据更新
    public broadcastMarketData(data: MarketData[]): void {
        const updates = new Map<string, MarketData[]>();
        
        for (const item of data) {
            const subscribers = this.subscriptionMap.get(item.symbol);
            if (!subscribers || subscribers.size === 0) continue;
            
            for (const clientId of subscribers) {
                if (!updates.has(clientId)) {
                    updates.set(clientId, []);
                }
                updates.get(clientId)!.push(item);
            }
        }
        
        // 发送更新给相关客户端
        for (const [clientId, clientData] of updates) {
            this.sendToClient(clientId, {
                type: 'market_data',
                data: clientData,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    private sendToClient(clientId: string, message: any): void {
        try {
            const ws = this.findWebSocketByClientId(clientId);
            if (ws && ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify(message));
            }
        } catch (error) {
            console.error('Error sending message to client:', error);
        }
    }
    
    private findWebSocketByClientId(clientId: string): any {
        for (const ws of this.wss.clients) {
            if ((ws as any).clientId === clientId) {
                return ws;
            }
        }
        return null;
    }
    
    private checkRateLimit(client: WebSocketClient): boolean {
        const now = new Date();
        
        // 重置限流计数器
        if (now > client.rateLimit.resetTime) {
            client.rateLimit.count = 0;
            client.rateLimit.resetTime = new Date(now.getTime() + 60000);
        }
        
        // 检查限流
        const limit = this.getRateLimit(client.userId);
        if (client.rateLimit.count >= limit) {
            return false;
        }
        
        client.rateLimit.count++;
        return true;
    }
    
    private getRateLimit(userId?: string): number {
        // 根据用户等级返回不同的限流值
        if (!userId) return 60; // 游客用户
        // 这里可以根据用户VIP等级返回不同的限制
        return 300; // 注册用户
    }
    
    private getSubscriptionLimit(userId?: string): number {
        if (!userId) return 10; // 游客用户
        return 50; // 注册用户
    }
    
    private isValidSymbol(symbol: string): boolean {
        return /^[A-Z0-9._-]+$/.test(symbol) && symbol.length <= 20;
    }
    
    private generateClientId(): string {
        return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    private startHeartbeat(): void {
        this.heartbeatInterval = setInterval(() => {
            const now = new Date();
            
            for (const [clientId, client] of this.clients) {
                const ws = this.findWebSocketByClientId(clientId);
                
                if (!ws || ws.readyState !== ws.OPEN) {
                    this.handleDisconnect(clientId);
                    continue;
                }
                
                // 检查心跳超时
                if (now.getTime() - client.lastPing.getTime() > 60000) {
                    console.log(`Client ${clientId} heartbeat timeout`);
                    ws.close(1000, 'Heartbeat timeout');
                    continue;
                }
                
                // 发送ping
                ws.ping();
            }
        }, 30000); // 每30秒检查一次
    }
    
    private handlePing(clientId: string): void {
        const client = this.clients.get(clientId);
        if (client) {
            client.lastPing = new Date();
            this.sendToClient(clientId, {
                type: 'pong',
                timestamp: new Date().toISOString()
            });
        }
    }
    
    private handlePong(clientId: string): void {
        const client = this.clients.get(clientId);
        if (client) {
            client.lastPing = new Date();
        }
    }
    
    private handleDisconnect(clientId: string): void {
        const client = this.clients.get(clientId);
        if (!client) return;
        
        // 清理订阅
        for (const symbol of client.subscriptions) {
            const subscribers = this.subscriptionMap.get(symbol);
            if (subscribers) {
                subscribers.delete(clientId);
                if (subscribers.size === 0) {
                    this.subscriptionMap.delete(symbol);
                }
            }
        }
        
        // 移除客户端
        this.clients.delete(clientId);
        
        console.log(`WebSocket client disconnected: ${clientId}`);
    }
    
    private handleError(clientId: string, error: Error): void {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.handleDisconnect(clientId);
    }
    
    // 获取连接统计
    public getStats(): any {
        return {
            totalClients: this.clients.size,
            totalSubscriptions: Array.from(this.subscriptionMap.values())
                .reduce((sum, set) => sum + set.size, 0),
            activeSymbols: this.subscriptionMap.size,
            memoryUsage: process.memoryUsage()
        };
    }
    
    // 优雅关闭
    public async shutdown(): Promise<void> {
        clearInterval(this.heartbeatInterval);
        
        // 通知所有客户端连接即将关闭
        for (const clientId of this.clients.keys()) {
            this.sendToClient(clientId, {
                type: 'server_shutdown',
                message: 'Server is shutting down',
                timestamp: new Date().toISOString()
            });
        }
        
        // 等待一段时间让消息发送完成
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 关闭所有连接
        this.wss.close();
    }
}
```

### 3.3 技术指标计算服务

#### 技术指标计算器
```typescript
// lib/market-data/TechnicalIndicators.ts
export interface IndicatorOptions {
    period?: number;
    [key: string]: any;
}

export interface IndicatorResult {
    indicator: string;
    symbol: string;
    value: number | number[];
    timestamp: Date;
    params: IndicatorOptions;
}

export class TechnicalIndicatorCalculator {
    private cache: Map<string, IndicatorResult> = new Map();
    
    async calculateSMA(
        symbol: string,
        prices: number[],
        period: number = 20
    ): Promise<IndicatorResult> {
        const cacheKey = `${symbol}:SMA:${period}:${prices.length}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }
        
        if (prices.length < period) {
            throw new Error(`Insufficient data: need ${period}, got ${prices.length}`);
        }
        
        const smaValues: number[] = [];
        
        for (let i = period - 1; i < prices.length; i++) {
            const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            smaValues.push(sum / period);
        }
        
        const result: IndicatorResult = {
            indicator: 'SMA',
            symbol,
            value: smaValues,
            timestamp: new Date(),
            params: { period }
        };
        
        this.cache.set(cacheKey, result);
        setTimeout(() => this.cache.delete(cacheKey), 3600000); // 1小时后清除缓存
        
        return result;
    }
    
    async calculateEMA(
        symbol: string,
        prices: number[],
        period: number = 20
    ): Promise<IndicatorResult> {
        const cacheKey = `${symbol}:EMA:${period}:${prices.length}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }
        
        if (prices.length < period) {
            throw new Error(`Insufficient data: need ${period}, got ${prices.length}`);
        }
        
        const emaValues: number[] = [];
        const multiplier = 2 / (period + 1);
        
        // 第一个EMA值是SMA
        let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
        emaValues.push(ema);
        
        // 计算后续EMA值
        for (let i = period; i < prices.length; i++) {
            ema = (prices[i] - ema) * multiplier + ema;
            emaValues.push(ema);
        }
        
        const result: IndicatorResult = {
            indicator: 'EMA',
            symbol,
            value: emaValues,
            timestamp: new Date(),
            params: { period }
        };
        
        this.cache.set(cacheKey, result);
        setTimeout(() => this.cache.delete(cacheKey), 3600000);
        
        return result;
    }
    
    async calculateRSI(
        symbol: string,
        prices: number[],
        period: number = 14
    ): Promise<IndicatorResult> {
        const cacheKey = `${symbol}:RSI:${period}:${prices.length}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }
        
        if (prices.length < period + 1) {
            throw new Error(`Insufficient data: need ${period + 1}, got ${prices.length}`);
        }
        
        const gains: number[] = [];
        const losses: number[] = [];
        
        // 计算价格变化
        for (let i = 1; i < prices.length; i++) {
            const change = prices[i] - prices[i - 1];
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? Math.abs(change) : 0);
        }
        
        const rsiValues: number[] = [];
        
        // 计算第一个RSI值
        let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
        let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
        
        let rs = avgGain / avgLoss;
        let rsi = 100 - (100 / (1 + rs));
        rsiValues.push(rsi);
        
        // 计算后续RSI值
        for (let i = period; i < gains.length; i++) {
            avgGain = (avgGain * (period - 1) + gains[i]) / period;
            avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
            
            rs = avgGain / avgLoss;
            rsi = 100 - (100 / (1 + rs));
            rsiValues.push(rsi);
        }
        
        const result: IndicatorResult = {
            indicator: 'RSI',
            symbol,
            value: rsiValues,
            timestamp: new Date(),
            params: { period }
        };
        
        this.cache.set(cacheKey, result);
        setTimeout(() => this.cache.delete(cacheKey), 3600000);
        
        return result;
    }
    
    async calculateMACD(
        symbol: string,
        prices: number[],
        fastPeriod: number = 12,
        slowPeriod: number = 26,
        signalPeriod: number = 9
    ): Promise<IndicatorResult> {
        const cacheKey = `${symbol}:MACD:${fastPeriod}:${slowPeriod}:${signalPeriod}:${prices.length}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }
        
        if (prices.length < slowPeriod + signalPeriod) {
            throw new Error(`Insufficient data for MACD calculation`);
        }
        
        // 计算快线和慢线EMA
        const fastEMA = await this.calculateEMA(symbol, prices, fastPeriod);
        const slowEMA = await this.calculateEMA(symbol, prices, slowPeriod);
        
        const fastValues = Array.isArray(fastEMA.value) ? fastEMA.value : [fastEMA.value];
        const slowValues = Array.isArray(slowEMA.value) ? slowEMA.value : [slowEMA.value];
        
        // 计算MACD线
        const macdLine: number[] = [];
        const startIndex = slowPeriod - fastPeriod;
        
        for (let i = 0; i < slowValues.length; i++) {
            macdLine.push(fastValues[i + startIndex] - slowValues[i]);
        }
        
        // 计算信号线（MACD线的EMA）
        const signalValues: number[] = [];
        const signalMultiplier = 2 / (signalPeriod + 1);
        
        // 第一个信号值是MACD线前signalPeriod个值的平均
        let signal = macdLine.slice(0, signalPeriod).reduce((a, b) => a + b, 0) / signalPeriod;
        signalValues.push(signal);
        
        // 计算后续信号值
        for (let i = signalPeriod; i < macdLine.length; i++) {
            signal = (macdLine[i] - signal) * signalMultiplier + signal;
            signalValues.push(signal);
        }
        
        // 计算柱状图
        const histogram: number[] = [];
        for (let i = 0; i < signalValues.length; i++) {
            histogram.push(macdLine[i + signalPeriod - 1] - signalValues[i]);
        }
        
        const result: IndicatorResult = {
            indicator: 'MACD',
            symbol,
            value: {
                macd: macdLine,
                signal: signalValues,
                histogram: histogram
            },
            timestamp: new Date(),
            params: { fastPeriod, slowPeriod, signalPeriod }
        };
        
        this.cache.set(cacheKey, result);
        setTimeout(() => this.cache.delete(cacheKey), 3600000);
        
        return result;
    }
    
    async calculateBollingerBands(
        symbol: string,
        prices: number[],
        period: number = 20,
        standardDeviations: number = 2
    ): Promise<IndicatorResult> {
        const cacheKey = `${symbol}:BB:${period}:${standardDeviations}:${prices.length}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }
        
        if (prices.length < period) {
            throw new Error(`Insufficient data: need ${period}, got ${prices.length}`);
        }
        
        const sma = await this.calculateSMA(symbol, prices, period);
        const smaValues = Array.isArray(sma.value) ? sma.value : [sma.value];
        
        const upperBand: number[] = [];
        const lowerBand: number[] = [];
        
        for (let i = 0; i < smaValues.length; i++) {
            const dataIndex = i + period - 1;
            const dataSlice = prices.slice(dataIndex - period + 1, dataIndex + 1);
            
            // 计算标准差
            const mean = smaValues[i];
            const variance = dataSlice.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period;
            const stdDev = Math.sqrt(variance);
            
            upperBand.push(mean + (standardDeviations * stdDev));
            lowerBand.push(mean - (standardDeviations * stdDev));
        }
        
        const result: IndicatorResult = {
            indicator: 'BB',
            symbol,
            value: {
                upper: upperBand,
                middle: smaValues,
                lower: lowerBand
            },
            timestamp: new Date(),
            params: { period, standardDeviations }
        };
        
        this.cache.set(cacheKey, result);
        setTimeout(() => this.cache.delete(cacheKey), 3600000);
        
        return result;
    }
    
    // 批量计算多个指标
    async calculateMultipleIndicators(
        symbol: string,
        prices: number[],
        indicators: Array<{
            type: string;
            params: IndicatorOptions;
        }>
    ): Promise<IndicatorResult[]> {
        const results: IndicatorResult[] = [];
        
        for (const indicator of indicators) {
            try {
                let result: IndicatorResult;
                
                switch (indicator.type.toLowerCase()) {
                    case 'sma':
                        result = await this.calculateSMA(symbol, prices, indicator.params.period);
                        break;
                    case 'ema':
                        result = await this.calculateEMA(symbol, prices, indicator.params.period);
                        break;
                    case 'rsi':
                        result = await this.calculateRSI(symbol, prices, indicator.params.period);
                        break;
                    case 'macd':
                        result = await this.calculateMACD(
                            symbol,
                            prices,
                            indicator.params.fastPeriod,
                            indicator.params.slowPeriod,
                            indicator.params.signalPeriod
                        );
                        break;
                    case 'bb':
                        result = await this.calculateBollingerBands(
                            symbol,
                            prices,
                            indicator.params.period,
                            indicator.params.standardDeviations
                        );
                        break;
                    default:
                        throw new Error(`Unsupported indicator: ${indicator.type}`);
                }
                
                results.push(result);
            } catch (error) {
                console.error(`Error calculating ${indicator.type} for ${symbol}:`, error);
            }
        }
        
        return results;
    }
    
    // 清理缓存
    public clearCache(): void {
        this.cache.clear();
    }
    
    // 获取缓存统计
    public getCacheStats(): any {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}
```

## 4. API接口设计

### 4.1 RESTful API规范

#### 获取实时市场数据
```typescript
// pages/api/market/realtime/[...symbols].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { MarketDataService } from '@/lib/services/marketDataService';
import { authenticateApiRequest } from '@/lib/auth/apiAuth';
import { checkRateLimit } from '@/lib/middleware/rateLimit';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: { code: 'METHOD_NOT_ALLOWED', message: '仅支持GET请求' }
        });
    }
    
    try {
        // 身份验证
        const auth = await authenticateApiRequest(req);
        
        // 限流检查
        const rateLimitResult = await checkRateLimit(
            req,
            auth.userId || req.ip,
            'market-data',
            auth.userTier
        );
        
        if (!rateLimitResult.allowed) {
            return res.status(429).json({
                success: false,
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: '请求频率超限',
                    retryAfter: rateLimitResult.retryAfter
                }
            });
        }
        
        // 解析参数
        const { symbols } = req.query;
        const symbolList = Array.isArray(symbols) ? symbols : [symbols as string];
        const validSymbols = symbolList.filter(s => s && typeof s === 'string');
        
        if (validSymbols.length === 0) {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_SYMBOLS', message: '无效的股票代码' }
            });
        }
        
        if (validSymbols.length > 100) {
            return res.status(400).json({
                success: false,
                error: { code: 'TOO_MANY_SYMBOLS', message: '一次最多查询100个股票' }
            });
        }
        
        // 获取市场数据
        const marketDataService = new MarketDataService();
        const data = await marketDataService.getRealtimeData(validSymbols, {
            userTier: auth.userTier,
            includeExtended: req.query.extended === 'true'
        });
        
        return res.status(200).json({
            success: true,
            data: data,
            metadata: {
                count: data.length,
                timestamp: new Date().toISOString(),
                rateLimitRemaining: rateLimitResult.remaining
            }
        });
        
    } catch (error) {
        console.error('Realtime data API error:', error);
        return res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' }
        });
    }
}
```

#### 获取历史数据
```typescript
// pages/api/market/historical/[symbol].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { MarketDataService } from '@/lib/services/marketDataService';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: { code: 'METHOD_NOT_ALLOWED', message: '仅支持GET请求' }
        });
    }
    
    try {
        const { symbol } = req.query;
        const {
            interval = '1d',
            from,
            to,
            limit = '100'
        } = req.query;
        
        if (!symbol || typeof symbol !== 'string') {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_SYMBOL', message: '无效的股票代码' }
            });
        }
        
        // 验证时间间隔
        const validIntervals = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M'];
        if (!validIntervals.includes(interval as string)) {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_INTERVAL', message: '无效的时间间隔' }
            });
        }
        
        // 解析时间范围
        let fromDate: Date | undefined;
        let toDate: Date | undefined;
        
        if (from) {
            fromDate = new Date(from as string);
            if (isNaN(fromDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'INVALID_FROM_DATE', message: '无效的开始时间' }
                });
            }
        }
        
        if (to) {
            toDate = new Date(to as string);
            if (isNaN(toDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'INVALID_TO_DATE', message: '无效的结束时间' }
                });
            }
        }
        
        const limitNum = parseInt(limit as string);
        if (isNaN(limitNum) || limitNum <= 0 || limitNum > 5000) {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_LIMIT', message: '无效的数量限制（1-5000）' }
            });
        }
        
        // 获取历史数据
        const marketDataService = new MarketDataService();
        const data = await marketDataService.getHistoricalData(symbol, {
            interval: interval as string,
            from: fromDate,
            to: toDate,
            limit: limitNum
        });
        
        return res.status(200).json({
            success: true,
            data: data,
            metadata: {
                symbol: symbol,
                interval: interval,
                count: data.length,
                from: fromDate?.toISOString(),
                to: toDate?.toISOString(),
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Historical data API error:', error);
        return res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' }
        });
    }
}
```

#### 技术指标计算API
```typescript
// pages/api/market/indicators/[symbol].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { TechnicalIndicatorCalculator } from '@/lib/market-data/TechnicalIndicators';
import { MarketDataService } from '@/lib/services/marketDataService';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: { code: 'METHOD_NOT_ALLOWED', message: '仅支持GET请求' }
        });
    }
    
    try {
        const { symbol } = req.query;
        const {
            indicators,
            period = '100',
            interval = '1d'
        } = req.query;
        
        if (!symbol || typeof symbol !== 'string') {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_SYMBOL', message: '无效的股票代码' }
            });
        }
        
        if (!indicators || typeof indicators !== 'string') {
            return res.status(400).json({
                success: false,
                error: { code: 'MISSING_INDICATORS', message: '请指定要计算的技术指标' }
            });
        }
        
        // 解析指标参数
        const indicatorList = (indicators as string).split(',').map(ind => {
            const [type, ...params] = ind.split(':');
            const options: any = {};
            
            // 解析参数，例如: "sma:20" 或 "macd:12:26:9"
            switch (type.toLowerCase()) {
                case 'sma':
                case 'ema':
                case 'rsi':
                    options.period = params[0] ? parseInt(params[0]) : undefined;
                    break;
                case 'macd':
                    options.fastPeriod = params[0] ? parseInt(params[0]) : undefined;
                    options.slowPeriod = params[1] ? parseInt(params[1]) : undefined;
                    options.signalPeriod = params[2] ? parseInt(params[2]) : undefined;
                    break;
                case 'bb':
                    options.period = params[0] ? parseInt(params[0]) : undefined;
                    options.standardDeviations = params[1] ? parseFloat(params[1]) : undefined;
                    break;
            }
            
            return { type, params: options };
        });
        
        // 获取历史价格数据
        const marketDataService = new MarketDataService();
        const historicalData = await marketDataService.getHistoricalData(symbol, {
            interval: interval as string,
            limit: parseInt(period as string)
        });
        
        if (historicalData.length === 0) {
            return res.status(404).json({
                success: false,
                error: { code: 'NO_DATA', message: '没有找到历史数据' }
            });
        }
        
        // 提取收盘价
        const prices = historicalData.map(d => d.close);
        
        // 计算技术指标
        const calculator = new TechnicalIndicatorCalculator();
        const results = await calculator.calculateMultipleIndicators(
            symbol,
            prices,
            indicatorList
        );
        
        return res.status(200).json({
            success: true,
            data: {
                symbol: symbol,
                indicators: results,
                priceData: historicalData.slice(-20) // 返回最近20个价格点用于图表显示
            },
            metadata: {
                count: results.length,
                dataPoints: prices.length,
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Technical indicators API error:', error);
        return res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' }
        });
    }
}
```

## 5. 部署和监控

### 5.1 Docker容器化部署

#### Dockerfile
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

CMD ["node", "server.js"]
```

#### Docker Compose配置
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@postgres:5432/smartfin
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: smartfin
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 5.2 监控和告警配置

#### 系统监控配置
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'smartfin-app'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/api/metrics'
    
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']
      
  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

#### 告警规则
```yaml
# monitoring/alert_rules.yml
groups:
  - name: market_data_alerts
    rules:
      - alert: HighAPILatency
        expr: http_request_duration_seconds{quantile="0.95"} > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "API响应时间过长"
          description: "95%的API请求响应时间超过2秒"
          
      - alert: DataSourceDown
        expr: up{job="data_source"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "数据源不可用"
          description: "数据源 {{ $labels.instance }} 已离线"
          
      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes / 1024 / 1024 > 1000
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "内存使用率过高"
          description: "应用内存使用超过1GB"
          
      - alert: WebSocketConnectionsHigh
        expr: websocket_connections_total > 5000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "WebSocket连接数过多"
          description: "当前WebSocket连接数: {{ $value }}"
```

---

**文档版本**: v1.0  
**创建日期**: 2025-01-26  
**最后更新**: 2025-01-26  
**审核状态**: 待审核  
**下一步**: 开发任务分解