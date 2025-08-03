export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high52Week?: number;
  low52Week?: number;
  peRatio?: number;
  dividendYield?: number;
  lastUpdated: Date;
}

export interface HistoricalData {
  symbol: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose?: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
  timestamp: Date;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  components?: string[];
}

export interface CryptocurrencyData extends MarketData {
  totalSupply?: number;
  circulatingSupply?: number;
  rank?: number;
}

export interface ForexData {
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  change: number;
  changePercent: number;
  bid: number;
  ask: number;
  spread: number;
  lastUpdated: Date;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  symbol: string;
  addedAt: Date;
  alertPrice?: number;
  notes?: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  positions: PortfolioPosition[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioPosition {
  id: string;
  portfolioId: string;
  symbol: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPercent: number;
  addedAt: Date;
  updatedAt: Date;
}

export interface MarketAlert {
  id: string;
  userId: string;
  symbol: string;
  condition: 'ABOVE' | 'BELOW' | 'CROSSES_ABOVE' | 'CROSSES_BELOW';
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  triggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
}

export interface MarketNews {
  id: string;
  title: string;
  content: string;
  source: string;
  author?: string;
  publishedAt: Date;
  symbols?: string[];
  sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  importance: 'LOW' | 'MEDIUM' | 'HIGH';
  url?: string;
  imageUrl?: string;
}