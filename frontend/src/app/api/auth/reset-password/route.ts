import { NextRequest } from "next/server"
import { prisma } from "@/lib/clients/prisma"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-error"
import { z } from "zod"
import { hash } from "bcryptjs"

const resetPasswordSchema = z.object({
  token: z.string().min(1, "重置令牌不能为空"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码至少需要8个字符").max(100, "密码过长"),
  confirmPassword: z.string().min(1, "请确认密码")
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"]
})

// 重置密码
async function handleResetPassword(request: NextRequest) {
  const body = await request.json()
  const validatedData = resetPasswordSchema.parse(body)

  // 查找重置令牌
  const resetToken = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: `reset_${validatedData.email}`,
        token: validatedData.token
      }
    }
  })

  if (!resetToken) {
    throw new ApiError("无效的重置链接或链接已过期", 400, "INVALID_TOKEN")
  }

  // 检查令牌是否过期
  if (resetToken.expires < new Date()) {
    // 删除过期令牌
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: resetToken.identifier,
          token: resetToken.token
        }
      }
    })
    throw new ApiError("重置链接已过期，请重新申请", 400, "TOKEN_EXPIRED")
  }

  // 查找用户
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email }
  })

  if (!user) {
    throw new ApiError("用户不存在", 404, "USER_NOT_FOUND")
  }

  // 加密新密码
  const hashedPassword = await hash(validatedData.password, 12)

  // 更新用户密码
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      password: hashedPassword,
      // 如果用户通过密码重置，可以认为邮箱已验证
      emailVerified: user.emailVerified || new Date()
    }
  })

  // 删除重置令牌
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: resetToken.identifier,
        token: resetToken.token
      }
    }
  })

  // 删除该用户的所有其他重置令牌
  await prisma.verificationToken.deleteMany({
    where: { 
      identifier: `reset_${validatedData.email}`
    }
  })

  return successResponse(
    { reset: true },
    "密码重置成功！您现在可以使用新密码登录了。"
  )
}

export const POST = withErrorHandler(handleResetPassword)