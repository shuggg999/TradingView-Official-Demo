import { NextRequest } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-error"
import { UserRole } from "@prisma/client"

async function handleRegister(request: NextRequest) {
  const body = await request.json()
  
  // 验证请求数据
  const validatedData = registerSchema.parse(body)
  
  // 检查用户是否已存在
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email }
  })

  if (existingUser) {
    throw new ApiError("该邮箱已被注册", 409, "EMAIL_ALREADY_EXISTS")
  }

  // 加密密码
  const hashedPassword = await hash(validatedData.password, 12)

  // 创建用户
  const user = await prisma.user.create({
    data: {
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name,
      role: UserRole.FREE,
      isActive: true
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  })

  // 创建默认观察列表
  await prisma.watchlist.create({
    data: {
      userId: user.id,
      name: "默认观察列表",
      description: "系统自动创建的观察列表",
      isDefault: true
    }
  })

  // TODO: 发送验证邮件
  
  return successResponse(user, "注册成功！请查收验证邮件。")
}

export const POST = withErrorHandler(handleRegister)