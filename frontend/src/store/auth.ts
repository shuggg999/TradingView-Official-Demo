'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData, AuthError } from '@/types/auth';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3456';

// 令牌信息接口
interface TokenInfo {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: string | number;
}

// 认证状态接口
interface AuthState {
  // 状态
  user: User | null;
  tokens: TokenInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
  isInitialized: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: (logoutAll?: boolean) => Promise<void>;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
  initialize: () => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  checkPasswordStrength: (password: string, username?: string, email?: string) => Promise<any>;
}

// API 调用辅助函数
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'API request failed');
  }

  return data;
};

// 创建认证store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      tokens: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      isInitialized: false,

      // 清除错误
      clearError: () => set({ error: null }),

      // 初始化认证状态
      initialize: async () => {
        const { tokens, refreshToken } = get();
        
        if (tokens) {
          // 检查token是否过期
          const now = Date.now() / 1000;
          const expiresAt = typeof tokens.expires_at === 'string' 
            ? parseInt(tokens.expires_at) 
            : tokens.expires_at;

          if (expiresAt > now) {
            // Token有效，获取用户信息
            try {
              const response = await apiCall('/api/auth/me', {
                headers: {
                  Authorization: `Bearer ${tokens.access_token}`,
                },
              });

              if (response.success) {
                set({
                  user: response.data.user,
                  isAuthenticated: true,
                  isInitialized: true,
                });
                return;
              }
            } catch (error) {
              console.error('Failed to get user info:', error);
            }
          }

          // Token过期，尝试刷新
          const refreshSuccess = await refreshToken();
          if (!refreshSuccess) {
            // 刷新失败，清除状态
            set({
              user: null,
              tokens: null,
              isAuthenticated: false,
              isInitialized: true,
            });
          }
        } else {
          set({ isInitialized: true });
        }
      },

      // 用户登录
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiCall('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              remember_me: credentials.rememberMe || false,
              device_info: {
                platform: navigator.platform,
                userAgent: navigator.userAgent,
                screen: `${screen.width}x${screen.height}`,
              },
            }),
          });

          if (response.success) {
            const userInfo: User = {
              id: response.user.id,
              email: response.user.email,
              username: response.user.username,
              fullName: response.user.full_name,
              emailVerified: response.user.email_verified,
              isActive: true,
              role: response.user.role as any,
              subscriptionTier: 'FREE' as any, // 默认免费用户
              preferences: {
                theme: 'light',
                language: 'zh-CN',
                timezone: 'Asia/Shanghai',
                notifications: {
                  email: true,
                  push: false,
                  marketAlerts: true,
                  priceAlerts: true,
                  newsUpdates: false,
                },
                trading: {
                  defaultCurrency: 'USD',
                  riskTolerance: 'medium',
                  investmentGoals: [],
                  preferredMarkets: [],
                },
              },
              createdAt: response.user.created_at ? new Date(response.user.created_at) : new Date(),
              updatedAt: new Date(),
            };

            set({
              user: userInfo,
              tokens: response.tokens,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return true;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: {
              code: 'LOGIN_FAILED',
              message: error.message || '登录失败，请检查邮箱和密码',
            },
          });
        }

        return false;
      },

      // 用户注册
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiCall('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
              email: data.email,
              username: data.username,
              full_name: data.fullName,
              password: data.password,
              phone: data.phone,
              agree_to_terms: data.agreeToTerms,
              preferences: {
                theme: data.preferences?.theme || 'light',
                language: data.preferences?.language || 'zh-CN',
                timezone: data.preferences?.timezone || 'Asia/Shanghai',
              },
            }),
          });

          if (response.success) {
            set({
              isLoading: false,
              error: null,
            });
            return true;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: {
              code: 'REGISTER_FAILED',
              message: error.message || '注册失败，请检查输入信息',
            },
          });
        }

        return false;
      },

      // 邮箱验证
      verifyEmail: async (email: string, code: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiCall('/api/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ email, code }),
          });

          if (response.success) {
            set({ isLoading: false });
            return true;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: {
              code: 'VERIFY_FAILED',
              message: error.message || '验证失败，请检查验证码',
            },
          });
        }

        return false;
      },

      // 密码强度检查
      checkPasswordStrength: async (password: string, username?: string, email?: string) => {
        try {
          const response = await apiCall('/api/auth/check-password-strength', {
            method: 'POST',
            body: JSON.stringify({ password, username, email }),
          });

          return response;
        } catch (error: any) {
          console.error('Password strength check failed:', error);
          return {
            valid: false,
            score: 0,
            strength: '未知',
            errors: ['无法检查密码强度'],
            suggestions: ['请稍后重试'],
          };
        }
      },

      // 刷新令牌
      refreshToken: async () => {
        const { tokens } = get();
        
        if (!tokens?.refresh_token) {
          return false;
        }

        try {
          const response = await apiCall('/api/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({
              refresh_token: tokens.refresh_token,
            }),
          });

          if (response.success) {
            set({
              tokens: response.tokens,
              isAuthenticated: true,
            });
            return true;
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          // 刷新失败，清除状态
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
          });
        }

        return false;
      },

      // 用户登出
      logout: async (logoutAll = false) => {
        const { tokens } = get();
        set({ isLoading: true });

        try {
          if (tokens?.access_token) {
            await apiCall('/api/auth/logout', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
              body: JSON.stringify({
                logout_all: logoutAll,
              }),
            });
          }
        } catch (error) {
          console.error('Logout API call failed:', error);
        } finally {
          // 无论API调用是否成功，都清除本地状态
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },
    }),
    {
      name: 'smartfin-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tokens: state.tokens,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// 自动token刷新
let refreshInterval: NodeJS.Timeout | null = null;

// 启动自动刷新
export const startTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }

  refreshInterval = setInterval(async () => {
    const { tokens, refreshToken, isAuthenticated } = useAuthStore.getState();
    
    if (!isAuthenticated || !tokens) {
      return;
    }

    // 在token过期前5分钟刷新
    const now = Date.now() / 1000;
    const expiresAt = typeof tokens.expires_at === 'string' 
      ? parseInt(tokens.expires_at) 
      : tokens.expires_at;
    
    if (expiresAt - now < 300) { // 5分钟
      await refreshToken();
    }
  }, 60000); // 每分钟检查一次
};

// 停止自动刷新
export const stopTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

// Hook for easier usage
export const useAuth = () => {
  const state = useAuthStore();
  
  return {
    ...state,
    isLoggedIn: state.isAuthenticated && !!state.user,
  };
};