import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { UserRole } from "@prisma/client"
import { ApiError } from "./api-error"

// 角色层级定义
const ROLE_HIERARCHY = {
  [UserRole.FREE]: 0,
  [UserRole.PRO]: 1,
  [UserRole.ENTERPRISE]: 2,
  [UserRole.ADMIN]: 3
} as const

// 认证中间件
export async function withAuth(
  request: NextRequest,
  requiredRole: UserRole = UserRole.FREE
) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })

  if (!token) {
    throw new ApiError("未授权访问，请先登录", 401, "UNAUTHORIZED")
  }

  // 检查用户角色权限
  const userRoleLevel = ROLE_HIERARCHY[token.role as UserRole]
  const requiredRoleLevel = ROLE_HIERARCHY[requiredRole]

  if (userRoleLevel < requiredRoleLevel) {
    throw new ApiError("权限不足", 403, "INSUFFICIENT_PERMISSIONS")
  }

  return token
}

// 订阅检查中间件
export async function withSubscription(
  request: NextRequest,
  requiredPlan?: string[]
) {
  const token = await withAuth(request)

  if (!token.subscription) {
    throw new ApiError("需要有效的订阅", 402, "SUBSCRIPTION_REQUIRED")
  }

  if (token.subscription.status !== "ACTIVE") {
    throw new ApiError("订阅已过期或无效", 402, "SUBSCRIPTION_INACTIVE")
  }

  if (requiredPlan && !requiredPlan.includes(token.subscription.plan)) {
    throw new ApiError("需要升级订阅计划", 402, "PLAN_UPGRADE_REQUIRED")
  }

  return token
}

// API限流中间件
export async function withRateLimit(
  request: NextRequest,
  key: string,
  limit: number = 100,
  window: number = 3600 // 1小时
) {
  const { CacheService } = await import("./redis")
  const rateLimitKey = `rate_limit:${key}`
  
  const allowed = await CacheService.rateLimitCheck(rateLimitKey, limit, window)
  
  if (!allowed) {
    throw new ApiError("请求过于频繁，请稍后再试", 429, "RATE_LIMIT_EXCEEDED")
  }
}

// API密钥认证中间件
export async function withApiKey(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key")
  
  if (!apiKey) {
    throw new ApiError("缺少API密钥", 401, "API_KEY_REQUIRED")
  }

  const { prisma } = await import("./prisma")
  
  const keyRecord = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { user: true }
  })

  if (!keyRecord || !keyRecord.isActive) {
    throw new ApiError("无效的API密钥", 401, "INVALID_API_KEY")
  }

  // 更新使用统计
  await prisma.apiKey.update({
    where: { id: keyRecord.id },
    data: {
      lastUsed: new Date(),
      totalRequests: { increment: 1 }
    }
  })

  // 检查API限流
  await withRateLimit(request, `api_key:${keyRecord.id}`, keyRecord.rateLimit)

  return {
    apiKey: keyRecord,
    user: keyRecord.user
  }
}

// 邮箱验证检查
export async function withEmailVerification(request: NextRequest) {
  const token = await withAuth(request)

  if (!token.emailVerified) {
    throw new ApiError("请先验证您的邮箱", 403, "EMAIL_NOT_VERIFIED")
  }

  return token
}

// 组合中间件工厂
export function createAuthMiddleware(options: {
  requireAuth?: boolean
  requiredRole?: UserRole
  requireSubscription?: boolean
  requiredPlan?: string[]
  requireEmailVerification?: boolean
  rateLimit?: {
    limit: number
    window: number
  }
}) {
  return async (request: NextRequest) => {
    let token = null

    // 认证检查
    if (options.requireAuth || options.requiredRole) {
      token = await withAuth(request, options.requiredRole)
    }

    // 邮箱验证检查
    if (options.requireEmailVerification) {
      await withEmailVerification(request)
    }

    // 订阅检查
    if (options.requireSubscription) {
      await withSubscription(request, options.requiredPlan)
    }

    // 限流检查
    if (options.rateLimit) {
      const userId = token?.sub || request.ip || "anonymous"
      await withRateLimit(
        request, 
        `user:${userId}`, 
        options.rateLimit.limit, 
        options.rateLimit.window
      )
    }

    return token
  }
}

// 常用的中间件配置
export const authMiddlewares = {
  // 需要登录
  authenticated: createAuthMiddleware({ requireAuth: true }),
  
  // 需要专业版订阅
  proSubscription: createAuthMiddleware({ 
    requireAuth: true,
    requireSubscription: true,
    requiredPlan: ["PRO", "ENTERPRISE"]
  }),
  
  // 需要企业版订阅
  enterpriseSubscription: createAuthMiddleware({ 
    requireAuth: true,
    requireSubscription: true,
    requiredPlan: ["ENTERPRISE"]
  }),
  
  // 管理员权限
  adminOnly: createAuthMiddleware({ 
    requireAuth: true,
    requiredRole: UserRole.ADMIN
  }),
  
  // 基础限流
  rateLimited: createAuthMiddleware({
    rateLimit: { limit: 100, window: 3600 }
  }),
  
  // 严格限流（API密集型操作）
  strictRateLimit: createAuthMiddleware({
    requireAuth: true,
    rateLimit: { limit: 10, window: 60 }
  })
}