import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateProfileSchema } from "@/lib/validations"
import { withErrorHandler, successResponse } from "@/lib/api-error"
import { authMiddlewares } from "@/lib/auth-middleware"

// 获取用户资料
async function handleGetProfile(request: NextRequest) {
  const token = await authMiddlewares.authenticated(request)
  
  const user = await prisma.user.findUnique({
    where: { id: token.sub! },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      emailVerified: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      subscription: {
        select: {
          plan: true,
          status: true,
          currentPeriodEnd: true
        }
      },
      _count: {
        select: {
          watchlists: true,
          learningProgress: true,
          apiKeys: true
        }
      }
    }
  })

  return successResponse(user)
}

// 更新用户资料  
async function handleUpdateProfile(request: NextRequest) {
  const token = await authMiddlewares.authenticated(request)
  const body = await request.json()
  
  // 验证请求数据
  const validatedData = updateProfileSchema.parse(body)
  
  const updatedUser = await prisma.user.update({
    where: { id: token.sub! },
    data: validatedData,
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      updatedAt: true
    }
  })

  return successResponse(updatedUser, "资料更新成功")
}

export const GET = withErrorHandler(handleGetProfile)
export const PUT = withErrorHandler(handleUpdateProfile)