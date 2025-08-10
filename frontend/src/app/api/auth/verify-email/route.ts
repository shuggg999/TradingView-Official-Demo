import { NextRequest } from "next/server"
import { prisma } from "@/lib/clients/prisma"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-error"
import { z } from "zod"

const verifyEmailSchema = z.object({
  token: z.string().min(1, "验证令牌不能为空"),
  email: z.string().email("请输入有效的邮箱地址").optional()
})

const resendVerificationSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址")
})

// 验证邮箱
async function handleVerifyEmail(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  // 验证参数
  const validatedData = verifyEmailSchema.parse({ token, email })

  // 查找验证令牌
  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email || "unknown",
        token: validatedData.token
      }
    }
  })

  if (!verificationToken) {
    throw new ApiError("无效的验证链接或链接已过期", 400, "INVALID_TOKEN")
  }

  // 检查令牌是否过期
  if (verificationToken.expires < new Date()) {
    // 删除过期令牌
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token
        }
      }
    })
    throw new ApiError("验证链接已过期，请重新申请", 400, "TOKEN_EXPIRED")
  }

  // 查找并更新用户
  const user = await prisma.user.findUnique({
    where: { email: verificationToken.identifier }
  })

  if (!user) {
    throw new ApiError("用户不存在", 404, "USER_NOT_FOUND")
  }

  if (user.emailVerified) {
    throw new ApiError("邮箱已经验证过了", 400, "ALREADY_VERIFIED")
  }

  // 更新用户邮箱验证状态
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() }
  })

  // 删除验证令牌
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: verificationToken.identifier,
        token: verificationToken.token
      }
    }
  })

  return successResponse({ verified: true }, "邮箱验证成功！您现在可以登录了。")
}

// 重新发送验证邮件
async function handleResendVerification(request: NextRequest) {
  const body = await request.json()
  const validatedData = resendVerificationSchema.parse(body)

  // 查找用户
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email }
  })

  if (!user) {
    throw new ApiError("该邮箱尚未注册", 404, "USER_NOT_FOUND")
  }

  if (user.emailVerified) {
    throw new ApiError("邮箱已经验证过了", 400, "ALREADY_VERIFIED")
  }

  // 删除旧的验证令牌
  await prisma.verificationToken.deleteMany({
    where: { identifier: validatedData.email }
  })

  // 生成新的验证令牌
  const token = generateVerificationToken()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24小时后过期

  await prisma.verificationToken.create({
    data: {
      identifier: validatedData.email,
      token,
      expires: expiresAt
    }
  })

  // TODO: 发送验证邮件
  // await sendVerificationEmail(validatedData.email, token)

  return successResponse(
    { sent: true },
    "验证邮件已重新发送，请检查您的邮箱。"
  )
}

// 生成验证令牌
function generateVerificationToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const GET = withErrorHandler(handleVerifyEmail)
export const POST = withErrorHandler(handleResendVerification)