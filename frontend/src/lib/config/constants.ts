// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Authentication
export const AUTH_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REFRESH_TOKEN_EXPIRES_IN: '30d',
  SESSION_COOKIE_NAME: 'smartfin-session',
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;

// Database
export const DATABASE_CONFIG = {
  MAX_CONNECTIONS: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
  TIMEOUT: parseInt(process.env.DB_TIMEOUT || '30000'),
} as const;

// Redis
export const REDIS_CONFIG = {
  DEFAULT_TTL: 3600, // 1 hour
  SESSION_TTL: 7 * 24 * 3600, // 7 days
  MARKET_DATA_TTL: 60, // 1 minute
  RATE_LIMIT_TTL: 3600, // 1 hour
} as const;

// Market Data
export const MARKET_CONFIG = {
  DEFAULT_SYMBOLS: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'],
  UPDATE_INTERVAL: 30000, // 30 seconds
  HISTORY_LIMIT: 1000,
  WEBSOCKET_RECONNECT_INTERVAL: 5000,
  MAX_WEBSOCKET_RETRIES: 5,
} as const;

// Subscription Tiers
export const SUBSCRIPTION_LIMITS = {
  FREE: {
    maxWatchlistItems: 10,
    maxPortfolios: 1,
    maxAlerts: 5,
    dataDelay: 15 * 60 * 1000, // 15 minutes
    apiCallsPerHour: 100,
  },
  BASIC: {
    maxWatchlistItems: 50,
    maxPortfolios: 3,
    maxAlerts: 25,
    dataDelay: 5 * 60 * 1000, // 5 minutes
    apiCallsPerHour: 500,
  },
  PROFESSIONAL: {
    maxWatchlistItems: 200,
    maxPortfolios: 10,
    maxAlerts: 100,
    dataDelay: 0, // Real-time
    apiCallsPerHour: 2000,
  },
  ENTERPRISE: {
    maxWatchlistItems: -1, // Unlimited
    maxPortfolios: -1, // Unlimited
    maxAlerts: -1, // Unlimited
    dataDelay: 0, // Real-time
    apiCallsPerHour: 10000,
  },
} as const;

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/csv', 'application/json'],
} as const;

// Email
export const EMAIL_CONFIG = {
  FROM_ADDRESS: process.env.EMAIL_FROM || 'noreply@smartfin.tech',
  SUPPORT_ADDRESS: process.env.EMAIL_SUPPORT || 'support@smartfin.tech',
  TEMPLATE_DIR: './src/lib/email-templates',
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
  },
  API: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
  },
  WEBSOCKET: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 connections per minute
  },
} as const;

// Application
export const APP_CONFIG = {
  NAME: 'SmartFin Technology Platform',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  SUPPORT_EMAIL: 'support@smartfin.tech',
  COMPANY_NAME: 'SmartFin Technology Limited',
} as const;