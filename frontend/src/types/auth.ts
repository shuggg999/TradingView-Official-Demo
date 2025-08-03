export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  emailVerified: boolean;
  isActive: boolean;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  PREMIUM_USER = 'PREMIUM_USER',
  FREE_USER = 'FREE_USER',
}

export enum SubscriptionTier {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  trading: TradingPreferences;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketAlerts: boolean;
  priceAlerts: boolean;
  newsUpdates: boolean;
}

export interface TradingPreferences {
  defaultCurrency: string;
  riskTolerance: 'low' | 'medium' | 'high';
  investmentGoals: string[];
  preferredMarkets: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  fullName: string;
  password: string;
  phone?: string;
  agreeToTerms: boolean;
  preferences?: {
    language?: string;
    timezone?: string;
  };
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}