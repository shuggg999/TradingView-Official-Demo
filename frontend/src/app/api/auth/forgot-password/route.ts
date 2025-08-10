import { NextRequest } from "next/server"
import { prisma } from "@/lib/clients/prisma"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-error"
import { z } from "zod"
import { hash } from "bcryptjs"

const forgotPasswordSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址")
})

// 发送密码重置邮件
async function handleForgotPassword(request: NextRequest) {
  const body = await request.json()
  const validatedData = forgotPasswordSchema.parse(body)

  // 查找用户
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email }
  })

  if (!user) {
    // 为了安全，即使用户不存在也返回成功信息
    return successResponse(
      { sent: true },
      "如果该邮箱已注册，我们将发送密码重置链接。"
    )
  }

  // 删除该用户的旧重置令牌
  await prisma.verificationToken.deleteMany({
    where: { 
      identifier: `reset_${validatedData.email}`
    }
  })

  // 生成重置令牌
  const resetToken = generateResetToken()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1小时后过期

  // 保存重置令牌
  await prisma.verificationToken.create({
    data: {
      identifier: `reset_${validatedData.email}`,
      token: resetToken,
      expires: expiresAt
    }
  })

  // TODO: 发送密码重置邮件
  // await sendPasswordResetEmail(validatedData.email, resetToken)

  return successResponse(
    { sent: true },
    "如果该邮箱已注册，我们将发送密码重置链接。"
  )
}

// 生成重置令牌
function generateResetToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const POST = withErrorHandler(handleForgotPassword)