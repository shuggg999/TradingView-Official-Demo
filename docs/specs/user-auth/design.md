# 用户认证系统技术设计方案

## 项目信息
- **功能模块**: 用户认证系统技术设计
- **设计版本**: v1.0
- **技术栈**: Next.js 15 + NextAuth.js + PostgreSQL + Redis + TypeScript
- **设计日期**: 2025-01-26

## 1. 系统架构设计

### 1.1 整体架构图

```mermaid
graph TB
    subgraph "前端层 (Next.js 15)"
        A[登录页面] --> B[注册页面]
        B --> C[个人中心]
        C --> D[密码重置]
        A --> E[OAuth回调]
    end
    
    subgraph "API层 (Next.js API Routes)"
        F[/api/auth/signin] --> G[/api/auth/signup]
        G --> H[/api/auth/signout]
        H --> I[/api/auth/reset-password]
        I --> J[/api/auth/verify-email]
        J --> K[/api/auth/[...nextauth\]]
    end
    
    subgraph "业务逻辑层"
        L[认证服务] --> M[用户服务]
        M --> N[权限服务]
        N --> O[会话服务]
        O --> P[邮件服务]
    end
    
    subgraph "数据层"
        Q[(PostgreSQL)] --> R[(Redis缓存)]
        R --> S[邮件队列]
    end
    
    subgraph "第三方服务"
        T[Google OAuth] --> U[GitHub OAuth]
        U --> V[SMTP服务]
    end
    
    A --> F
    B --> G
    C --> H
    D --> I
    E --> K
    
    F --> L
    G --> M
    H --> O
    I --> P
    J --> P
    K --> L
    
    L --> Q
    M --> Q
    N --> R
    O --> R
    P --> S
    
    K --> T
    K --> U
    P --> V
```

### 1.2 技术选型说明

| 技术组件 | 选择方案 | 理由说明 |
|---------|---------|---------|
| 认证框架 | NextAuth.js v5 | 与Next.js深度集成，支持多种认证方式 |
| 数据库 | PostgreSQL | 企业级关系型数据库，支持复杂查询 |
| 缓存系统 | Redis | 高性能会话存储和速率限制实现 |
| 密码加密 | bcrypt | 行业标准，安全性高，可配置成本因子 |
| 令牌标准 | JWT | 无状态认证，便于分布式部署 |
| 邮件服务 | Nodemailer + SMTP | 灵活配置，支持多种邮件提供商 |

## 2. 数据模型设计

### 2.1 核心数据表结构

#### 用户表 (users)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- 可为空，支持OAuth用户
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    bio TEXT,
    
    -- 状态字段
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    role_id INTEGER REFERENCES roles(id) DEFAULT 1,
    
    -- OAuth字段
    oauth_provider VARCHAR(50), -- 'google', 'github', null
    oauth_provider_id VARCHAR(255),
    
    -- 偏好设置
    preferences JSONB DEFAULT '{}',
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- 索引优化
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_username CHECK (LENGTH(username) >= 3 AND LENGTH(username) <= 50)
);

-- 索引创建
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_oauth ON users(oauth_provider, oauth_provider_id);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### 角色表 (roles)
```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 初始角色数据
INSERT INTO roles (role_name, display_name, description, permissions) VALUES
('guest', '游客用户', '未注册用户，只能访问公开内容', '["read:public"]'),
('user', '注册用户', '普通注册用户，可访问基础功能', '["read:public", "read:education", "write:profile"]'),
('vip', 'VIP用户', 'VIP用户，可访问高级功能', '["read:public", "read:education", "read:advanced", "write:profile"]'),
('admin', '管理员', '系统管理员，拥有所有权限', '["*"]');
```

#### 会话表 (user_sessions)
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    is_remember_me BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引创建
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);
```

#### 密码重置表 (password_reset_tokens)
```sql
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT token_not_expired CHECK (expires_at > created_at)
);

-- 索引和自动清理
CREATE INDEX idx_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_reset_tokens_token ON password_reset_tokens(token);
```

#### 审计日志表 (auth_audit_logs)
```sql
CREATE TABLE auth_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'login', 'logout', 'register', 'password_reset'
    result VARCHAR(20) NOT NULL, -- 'success', 'failure', 'blocked'
    ip_address INET,
    user_agent TEXT,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 分区表（按月分区）
CREATE INDEX idx_audit_logs_user_id ON auth_audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON auth_audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON auth_audit_logs(action);
```

### 2.2 Redis数据结构设计

#### 会话缓存
```redis
# 用户会话信息
user:session:{sessionId} = {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "user",
    "permissions": ["read:public", "read:education"],
    "lastAccessed": "2025-01-26T10:00:00Z",
    "expiresAt": "2025-01-26T12:00:00Z"
}
TTL: 2小时（滑动过期）

# 用户活跃会话列表
user:sessions:{userId} = ["sessionId1", "sessionId2", "sessionId3"]
TTL: 30天
```

#### 速率限制
```redis
# 登录尝试限制
rate_limit:login:{email} = {
    "attempts": 3,
    "lastAttempt": "2025-01-26T10:00:00Z",
    "lockUntil": null
}
TTL: 15分钟

# API速率限制
rate_limit:api:{ip}:{endpoint} = {
    "count": 5,
    "window": "2025-01-26T10:00:00Z"
}
TTL: 1分钟
```

#### 邮件验证和密码重置
```redis
# 邮箱验证码
email:verification:{email} = {
    "code": "ABC123",
    "attempts": 0,
    "createdAt": "2025-01-26T10:00:00Z"
}
TTL: 24小时

# 密码重置令牌
password:reset:{token} = {
    "userId": "uuid",
    "email": "user@example.com",
    "createdAt": "2025-01-26T10:00:00Z"
}
TTL: 1小时
```

## 3. API接口设计

### 3.1 RESTful API规范

#### 基础规范
- **Base URL**: `/api/auth`
- **请求格式**: JSON
- **响应格式**: JSON
- **错误码标准**: HTTP状态码 + 自定义错误码
- **认证方式**: Bearer Token (JWT)

#### 统一响应格式
```typescript
interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    meta?: {
        timestamp: string;
        requestId: string;
    };
}
```

### 3.2 具体接口定义

#### 用户注册接口
```typescript
// POST /api/auth/register
interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    fullName: string;
    agreeToTerms: boolean;
}

interface RegisterResponse {
    success: boolean;
    data: {
        userId: string;
        email: string;
        message: string; // "验证邮件已发送"
    };
}

// 实现示例
export async function POST(request: Request) {
    try {
        const body: RegisterRequest = await request.json();
        
        // 验证输入
        const validation = validateRegisterInput(body);
        if (!validation.valid) {
            return NextResponse.json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: validation.message }
            }, { status: 400 });
        }
        
        // 检查邮箱是否已注册
        const existingUser = await findUserByEmail(body.email);
        if (existingUser) {
            return NextResponse.json({
                success: false,
                error: { code: 'EMAIL_EXISTS', message: '邮箱已被注册' }
            }, { status: 409 });
        }
        
        // 创建用户
        const hashedPassword = await bcrypt.hash(body.password, 12);
        const user = await createUser({
            ...body,
            passwordHash: hashedPassword
        });
        
        // 发送验证邮件
        await sendVerificationEmail(user.email, user.id);
        
        return NextResponse.json({
            success: true,
            data: {
                userId: user.id,
                email: user.email,
                message: '注册成功，请查收验证邮件'
            }
        });
        
    } catch (error) {
        return handleAuthError(error);
    }
}
```

#### 用户登录接口
```typescript
// POST /api/auth/signin
interface SignInRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

interface SignInResponse {
    success: boolean;
    data: {
        user: {
            id: string;
            email: string;
            username: string;
            fullName: string;
            role: string;
            avatarUrl?: string;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
            expiresAt: string;
        };
    };
}
```

#### OAuth认证配置
```typescript
// NextAuth.js配置
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        // 邮箱密码认证
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                
                const user = await authenticateUser(
                    credentials.email,
                    credentials.password
                );
                
                return user ? {
                    id: user.id,
                    email: user.email,
                    name: user.fullName,
                    image: user.avatarUrl
                } : null;
            }
        }),
        
        // Google OAuth
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: 'openid email profile'
                }
            }
        }),
        
        // GitHub OAuth
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        })
    ],
    
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google' || account?.provider === 'github') {
                // 处理OAuth用户创建或更新
                await handleOAuthUser(user, account, profile);
            }
            return true;
        },
        
        async jwt({ token, user, account }) {
            if (user) {
                token.userId = user.id;
                token.role = user.role;
            }
            return token;
        },
        
        async session({ session, token }) {
            session.user.id = token.userId as string;
            session.user.role = token.role as string;
            return session;
        }
    },
    
    pages: {
        signIn: '/auth/signin',
        signUp: '/auth/signup',
        error: '/auth/error'
    },
    
    session: {
        strategy: 'jwt',
        maxAge: 2 * 60 * 60, // 2小时
    },
    
    jwt: {
        maxAge: 2 * 60 * 60, // 2小时
    }
};
```

## 4. 前端组件设计

### 4.1 认证相关页面结构

#### 登录页面 (/auth/signin)
```typescript
// components/auth/SignInForm.tsx
interface SignInFormProps {
    callbackUrl?: string;
    error?: string;
}

const SignInForm: React.FC<SignInFormProps> = ({ callbackUrl, error }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false
            });
            
            if (result?.error) {
                throw new Error(result.error);
            }
            
            // 登录成功，重定向
            window.location.href = callbackUrl || '/dashboard';
            
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="auth-form-container">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium">
                        邮箱地址
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                
                <div>
                    <label htmlFor="password" className="block text-sm font-medium">
                        密码
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>
                
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={formData.rememberMe}
                            onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                        />
                        <span className="ml-2 text-sm">记住我</span>
                    </label>
                    
                    <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                        忘记密码？
                    </Link>
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? '登录中...' : '登录'}
                </button>
                
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">或使用以下方式登录</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => signIn('google')}
                            className="oauth-button google-btn"
                        >
                            <GoogleIcon />
                            Google
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => signIn('github')}
                            className="oauth-button github-btn"
                        >
                            <GitHubIcon />
                            GitHub
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
```

### 4.2 状态管理设计

#### 认证状态管理 (Zustand)
```typescript
// stores/authStore.ts
interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    tokens: {
        accessToken: string | null;
        refreshToken: string | null;
    };
    
    // Actions
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signOut: () => Promise<void>;
    refreshToken: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    tokens: {
        accessToken: null,
        refreshToken: null
    },
    
    signIn: async (credentials) => {
        set({ isLoading: true });
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            
            if (!response.ok) {
                throw new Error('登录失败');
            }
            
            const data = await response.json();
            
            set({
                user: data.user,
                isAuthenticated: true,
                tokens: data.tokens,
                isLoading: false
            });
            
            // 存储token到localStorage（如果选择了记住我）
            if (credentials.rememberMe) {
                localStorage.setItem('refreshToken', data.tokens.refreshToken);
            }
            
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
    
    signOut: async () => {
        try {
            await fetch('/api/auth/signout', { method: 'POST' });
        } catch (error) {
            console.error('登出失败:', error);
        } finally {
            set({
                user: null,
                isAuthenticated: false,
                tokens: { accessToken: null, refreshToken: null }
            });
            localStorage.removeItem('refreshToken');
        }
    },
    
    refreshToken: async () => {
        const { tokens } = get();
        if (!tokens.refreshToken) return;
        
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: tokens.refreshToken })
            });
            
            if (response.ok) {
                const data = await response.json();
                set({ tokens: data.tokens });
            } else {
                // Refresh token过期，需要重新登录
                get().signOut();
            }
        } catch (error) {
            console.error('Token刷新失败:', error);
            get().signOut();
        }
    },
    
    updateUser: (userData) => {
        set(state => ({
            user: state.user ? { ...state.user, ...userData } : null
        }));
    }
}));
```

### 4.3 权限控制组件

#### 高阶组件权限检查
```typescript
// components/auth/withAuth.tsx
interface WithAuthOptions {
    requireAuth?: boolean;
    requiredRole?: string;
    requiredPermissions?: string[];
    redirectTo?: string;
}

export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    options: WithAuthOptions = {}
) {
    const AuthorizedComponent: React.FC<P> = (props) => {
        const { user, isLoading, isAuthenticated } = useAuthStore();
        const router = useRouter();
        
        useEffect(() => {
            if (isLoading) return;
            
            // 需要登录但未登录
            if (options.requireAuth && !isAuthenticated) {
                router.push(options.redirectTo || '/auth/signin');
                return;
            }
            
            // 角色权限检查
            if (options.requiredRole && user?.role !== options.requiredRole) {
                router.push('/unauthorized');
                return;
            }
            
            // 权限检查
            if (options.requiredPermissions && !hasPermissions(user, options.requiredPermissions)) {
                router.push('/unauthorized');
                return;
            }
        }, [user, isLoading, isAuthenticated, router]);
        
        if (isLoading) {
            return <LoadingSpinner />;
        }
        
        if (options.requireAuth && !isAuthenticated) {
            return null;
        }
        
        return <WrappedComponent {...props} />;
    };
    
    return AuthorizedComponent;
}

// 使用示例
export default withAuth(UserDashboard, {
    requireAuth: true,
    requiredRole: 'user'
});
```

## 5. 安全机制设计

### 5.1 密码安全策略

#### 密码复杂度验证
```typescript
interface PasswordPolicy {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    forbiddenPatterns: string[];
}

const defaultPasswordPolicy: PasswordPolicy = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    forbiddenPatterns: [
        'password', '123456', 'qwerty', 'admin',
        'user', 'login', 'welcome'
    ]
};

export function validatePassword(password: string, policy = defaultPasswordPolicy): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];
    
    if (password.length < policy.minLength) {
        errors.push(`密码长度至少${policy.minLength}位`);
    }
    
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('密码必须包含大写字母');
    }
    
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('密码必须包含小写字母');
    }
    
    if (policy.requireNumbers && !/\d/.test(password)) {
        errors.push('密码必须包含数字');
    }
    
    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('密码必须包含特殊字符');
    }
    
    const lowerPassword = password.toLowerCase();
    for (const pattern of policy.forbiddenPatterns) {
        if (lowerPassword.includes(pattern)) {
            errors.push('密码不能包含常见弱密码模式');
            break;
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}
```

### 5.2 速率限制机制

#### Redis实现的速率限制
```typescript
// lib/rateLimit.ts
interface RateLimitConfig {
    windowMs: number; // 时间窗口（毫秒）
    maxAttempts: number; // 最大尝试次数
    blockDurationMs: number; // 封禁时长（毫秒）
}

export class RateLimiter {
    private redis: Redis;
    
    constructor(redis: Redis) {
        this.redis = redis;
    }
    
    async checkLimit(
        key: string,
        config: RateLimitConfig
    ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
        const now = Date.now();
        const windowStart = now - config.windowMs;
        
        // 获取当前时间窗口内的尝试次数
        const attempts = await this.redis.zcount(key, windowStart, now);
        
        if (attempts >= config.maxAttempts) {
            // 检查是否在封禁期内
            const blockKey = `${key}:blocked`;
            const blockEnd = await this.redis.get(blockKey);
            
            if (blockEnd && parseInt(blockEnd) > now) {
                return {
                    allowed: false,
                    remaining: 0,
                    resetTime: parseInt(blockEnd)
                };
            }
            
            // 设置封禁
            await this.redis.setex(blockKey, Math.ceil(config.blockDurationMs / 1000), (now + config.blockDurationMs).toString());
            
            return {
                allowed: false,
                remaining: 0,
                resetTime: now + config.blockDurationMs
            };
        }
        
        // 记录当前尝试
        await this.redis.zadd(key, now, `${now}-${Math.random()}`);
        await this.redis.expire(key, Math.ceil(config.windowMs / 1000));
        
        // 清理过期记录
        await this.redis.zremrangebyscore(key, 0, windowStart);
        
        return {
            allowed: true,
            remaining: config.maxAttempts - attempts - 1,
            resetTime: now + config.windowMs
        };
    }
}

// 使用示例
const loginLimiter = new RateLimiter(redis);

export async function checkLoginLimit(email: string) {
    return loginLimiter.checkLimit(`login:${email}`, {
        windowMs: 15 * 60 * 1000, // 15分钟
        maxAttempts: 5,
        blockDurationMs: 15 * 60 * 1000 // 封禁15分钟
    });
}
```

### 5.3 JWT安全实现

#### JWT工具类
```typescript
// lib/jwt.ts
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    sessionId: string;
    iat?: number;
    exp?: number;
}

export class JWTManager {
    private accessTokenSecret: string;
    private refreshTokenSecret: string;
    private accessTokenExpiry: string;
    private refreshTokenExpiry: string;
    
    constructor() {
        this.accessTokenSecret = process.env.JWT_ACCESS_SECRET!;
        this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET!;
        this.accessTokenExpiry = '2h';
        this.refreshTokenExpiry = '30d';
    }
    
    generateTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp'>): {
        accessToken: string;
        refreshToken: string;
        expiresAt: Date;
    } {
        const sessionId = randomBytes(32).toString('hex');
        const tokenPayload = { ...payload, sessionId };
        
        const accessToken = jwt.sign(tokenPayload, this.accessTokenSecret, {
            expiresIn: this.accessTokenExpiry,
            issuer: 'smartfin.tech',
            audience: 'smartfin-app'
        });
        
        const refreshToken = jwt.sign(
            { userId: payload.userId, sessionId },
            this.refreshTokenSecret,
            {
                expiresIn: this.refreshTokenExpiry,
                issuer: 'smartfin.tech',
                audience: 'smartfin-app'
            }
        );
        
        const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2小时后
        
        return { accessToken, refreshToken, expiresAt };
    }
    
    verifyAccessToken(token: string): JWTPayload | null {
        try {
            return jwt.verify(token, this.accessTokenSecret, {
                issuer: 'smartfin.tech',
                audience: 'smartfin-app'
            }) as JWTPayload;
        } catch (error) {
            return null;
        }
    }
    
    verifyRefreshToken(token: string): { userId: string; sessionId: string } | null {
        try {
            return jwt.verify(token, this.refreshTokenSecret, {
                issuer: 'smartfin.tech',
                audience: 'smartfin-app'
            }) as { userId: string; sessionId: string };
        } catch (error) {
            return null;
        }
    }
    
    refreshAccessToken(refreshToken: string, userInfo: { email: string; role: string }): {
        accessToken: string;
        expiresAt: Date;
    } | null {
        const payload = this.verifyRefreshToken(refreshToken);
        if (!payload) return null;
        
        const newAccessToken = jwt.sign(
            {
                userId: payload.userId,
                email: userInfo.email,
                role: userInfo.role,
                sessionId: payload.sessionId
            },
            this.accessTokenSecret,
            {
                expiresIn: this.accessTokenExpiry,
                issuer: 'smartfin.tech',
                audience: 'smartfin-app'
            }
        );
        
        return {
            accessToken: newAccessToken,
            expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
        };
    }
}
```

## 6. 测试策略

### 6.1 单元测试

#### 认证服务测试
```typescript
// tests/auth/authService.test.ts
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AuthService } from '@/lib/auth/authService';
import { UserRepository } from '@/lib/repositories/userRepository';

describe('AuthService', () => {
    let authService: AuthService;
    let mockUserRepository: jest.Mocked<UserRepository>;
    
    beforeEach(() => {
        mockUserRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
        } as any;
        authService = new AuthService(mockUserRepository);
    });
    
    describe('registerUser', () => {
        it('should create user with hashed password', async () => {
            const userData = {
                email: 'test@example.com',
                username: 'testuser',
                password: 'Password123!',
                fullName: 'Test User'
            };
            
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.create.mockResolvedValue({
                id: 'user-id',
                ...userData,
                passwordHash: 'hashed-password'
            });
            
            const result = await authService.registerUser(userData);
            
            expect(result.success).toBe(true);
            expect(mockUserRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: userData.email,
                    passwordHash: expect.any(String)
                })
            );
        });
        
        it('should reject registration if email already exists', async () => {
            mockUserRepository.findByEmail.mockResolvedValue({
                id: 'existing-user',
                email: 'test@example.com'
            });
            
            const userData = {
                email: 'test@example.com',
                username: 'testuser',
                password: 'Password123!',
                fullName: 'Test User'
            };
            
            const result = await authService.registerUser(userData);
            
            expect(result.success).toBe(false);
            expect(result.error?.code).toBe('EMAIL_EXISTS');
        });
    });
    
    describe('authenticateUser', () => {
        it('should authenticate valid credentials', async () => {
            const hashedPassword = await bcrypt.hash('Password123!', 12);
            mockUserRepository.findByEmail.mockResolvedValue({
                id: 'user-id',
                email: 'test@example.com',
                passwordHash: hashedPassword,
                isActive: true,
                emailVerified: true
            });
            
            const result = await authService.authenticateUser(
                'test@example.com',
                'Password123!'
            );
            
            expect(result.success).toBe(true);
            expect(result.user).toBeDefined();
        });
        
        it('should reject invalid password', async () => {
            const hashedPassword = await bcrypt.hash('Password123!', 12);
            mockUserRepository.findByEmail.mockResolvedValue({
                id: 'user-id',
                email: 'test@example.com',
                passwordHash: hashedPassword,
                isActive: true,
                emailVerified: true
            });
            
            const result = await authService.authenticateUser(
                'test@example.com',
                'WrongPassword'
            );
            
            expect(result.success).toBe(false);
            expect(result.error?.code).toBe('INVALID_CREDENTIALS');
        });
    });
});
```

### 6.2 集成测试

#### API端点测试
```typescript
// tests/api/auth.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { createTestApp } from '@/tests/helpers/testApp';
import { setupTestDatabase, cleanupTestDatabase } from '@/tests/helpers/database';

describe('/api/auth', () => {
    let app: any;
    
    beforeAll(async () => {
        await setupTestDatabase();
        app = await createTestApp();
    });
    
    afterAll(async () => {
        await cleanupTestDatabase();
    });
    
    describe('POST /api/auth/register', () => {
        it('should register new user successfully', async () => {
            const userData = {
                email: 'newuser@example.com',
                username: 'newuser',
                password: 'Password123!',
                fullName: 'New User',
                agreeToTerms: true
            };
            
            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);
            
            expect(response.body).toMatchObject({
                success: true,
                data: {
                    userId: expect.any(String),
                    email: userData.email,
                    message: expect.stringContaining('验证邮件')
                }
            });
        });
        
        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid-email',
                    password: '123'
                })
                .expect(400);
            
            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('VALIDATION_ERROR');
        });
    });
    
    describe('POST /api/auth/signin', () => {
        beforeEach(async () => {
            // 创建测试用户
            await createTestUser({
                email: 'testuser@example.com',
                password: 'Password123!',
                emailVerified: true
            });
        });
        
        it('should sign in with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/signin')
                .send({
                    email: 'testuser@example.com',
                    password: 'Password123!'
                })
                .expect(200);
            
            expect(response.body).toMatchObject({
                success: true,
                data: {
                    user: {
                        email: 'testuser@example.com'
                    },
                    tokens: {
                        accessToken: expect.any(String),
                        refreshToken: expect.any(String)
                    }
                }
            });
        });
    });
});
```

## 7. 部署和运维

### 7.1 环境变量配置

```bash
# .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/smartfin"
REDIS_URL="redis://localhost:6379"

# NextAuth配置
NEXTAUTH_URL="https://smartfin.tech"
NEXTAUTH_SECRET="your-super-secret-key"

# JWT密钥
JWT_ACCESS_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"

# OAuth配置
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# 邮件服务
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@smartfin.tech"
SMTP_PASS="your-app-password"

# 应用配置
APP_URL="https://smartfin.tech"
SUPPORT_EMAIL="support@smartfin.tech"
```

### 7.2 Docker部署配置

```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

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

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

---

**文档版本**: v1.0  
**创建日期**: 2025-01-26  
**最后更新**: 2025-01-26  
**审核状态**: 待审核  
**下一步**: 开发任务分解