import { NextRequest } from "next/server"
import { withErrorHandler, successResponse } from "@/lib/api-error"
import { z } from "zod"

const passwordStrengthSchema = z.object({
  password: z.string().min(1, "密码不能为空"),
  username: z.string().optional(),
  email: z.string().email().optional()
})

interface PasswordStrength {
  valid: boolean
  score: number // 1-5
  strength: string
  errors: string[]
  suggestions: string[]
}

// 检查密码强度
async function handlePasswordStrength(request: NextRequest) {
  const body = await request.json()
  const validatedData = passwordStrengthSchema.parse(body)

  const result = checkPasswordStrength(
    validatedData.password,
    validatedData.username,
    validatedData.email
  )

  return successResponse(result)
}

function checkPasswordStrength(
  password: string,
  username?: string,
  email?: string
): PasswordStrength {
  const errors: string[] = []
  const suggestions: string[] = []
  let score = 0

  // 基础长度检查
  if (password.length < 8) {
    errors.push("密码至少需要8个字符")
  } else if (password.length >= 8) {
    score += 1
  }

  if (password.length >= 12) {
    score += 1
  }

  // 复杂度检查
  const hasLowerCase = /[a-z]/.test(password)
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  if (hasLowerCase) score += 0.5
  if (hasUpperCase) score += 0.5
  if (hasNumbers) score += 0.5
  if (hasSpecialChars) score += 0.5

  if (!hasLowerCase) {
    errors.push("密码应包含小写字母")
    suggestions.push("添加小写字母 (a-z)")
  }

  if (!hasUpperCase) {
    errors.push("密码应包含大写字母")
    suggestions.push("添加大写字母 (A-Z)")
  }

  if (!hasNumbers) {
    errors.push("密码应包含数字")
    suggestions.push("添加数字 (0-9)")
  }

  if (!hasSpecialChars) {
    errors.push("密码应包含特殊字符")
    suggestions.push("添加特殊字符 (!@#$%^&*)")
  }

  // 常见密码检查
  const commonPasswords = [
    "password", "123456", "123456789", "12345678", "12345",
    "1234567", "admin", "qwerty", "abc123", "password123",
    "welcome", "monkey", "dragon", "letmein", "trustno1"
  ]

  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("这是一个常见密码，容易被猜到")
    suggestions.push("使用更独特的密码组合")
    score = Math.min(score, 2)
  }

  // 个人信息检查
  if (username && password.toLowerCase().includes(username.toLowerCase())) {
    errors.push("密码不应包含用户名")
    suggestions.push("避免在密码中使用用户名")
    score = Math.min(score, 2)
  }

  if (email) {
    const emailName = email.split('@')[0]
    if (password.toLowerCase().includes(emailName.toLowerCase())) {
      errors.push("密码不应包含邮箱地址")
      suggestions.push("避免在密码中使用邮箱信息")
      score = Math.min(score, 2)
    }
  }

  // 重复字符检查
  const hasRepeatingChars = /(.)\1{2,}/.test(password)
  if (hasRepeatingChars) {
    errors.push("密码包含过多重复字符")
    suggestions.push("减少重复字符的使用")
    score = Math.max(1, score - 0.5)
  }

  // 序列检查
  const hasSequence = /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)
  if (hasSequence) {
    errors.push("密码包含连续的字符序列")
    suggestions.push("避免使用连续的字符序列")
    score = Math.max(1, score - 0.5)
  }

  // 确保分数在1-5范围内
  score = Math.max(1, Math.min(5, Math.round(score)))

  // 确定强度等级
  let strength: string
  let valid = false

  switch (score) {
    case 1:
      strength = "非常弱"
      break
    case 2:
      strength = "弱"
      break
    case 3:
      strength = "一般"
      valid = true
      break
    case 4:
      strength = "强"
      valid = true
      break
    case 5:
      strength = "非常强"
      valid = true
      break
    default:
      strength = "未知"
  }

  // 如果密码长度不足8位，强制标记为无效
  if (password.length < 8) {
    valid = false
  }

  return {
    valid,
    score,
    strength,
    errors: errors.slice(0, 5), // 最多显示5个错误
    suggestions: suggestions.slice(0, 3) // 最多显示3个建议
  }
}

export const POST = withErrorHandler(handlePasswordStrength)