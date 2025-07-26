import { NextResponse } from 'next/server'
import { logger } from './logger'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: any) {
  logger.error('API Error:', {
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode,
    code: error.code,
  })

  if (error instanceof ApiError) {
    return NextResponse.json(
      { 
        error: error.message, 
        code: error.code 
      },
      { status: error.statusCode }
    )
  }

  // Prisma 错误处理
  if (error.code === 'P2002') { // Unique constraint
    return NextResponse.json(
      { error: '数据已存在', code: 'DUPLICATE_ERROR' },
      { status: 409 }
    )
  }

  if (error.code === 'P2025') { // Record not found
    return NextResponse.json(
      { error: '数据不存在', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  // Zod 验证错误
  if (error.name === 'ZodError') {
    return NextResponse.json(
      { 
        error: '请求参数不正确', 
        code: 'VALIDATION_ERROR',
        details: error.errors 
      },
      { status: 400 }
    )
  }

  // 默认服务器错误
  return NextResponse.json(
    { error: '服务器内部错误', code: 'INTERNAL_ERROR' },
    { status: 500 }
  )
}

// API路由包装器
export function withErrorHandler(handler: Function) {
  return async (request: Request, context?: any) => {
    try {
      return await handler(request, context)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// 成功响应包装器
export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  })
}

// 分页响应包装器
export function paginatedResponse<T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
) {
  return NextResponse.json({
    success: true,
    data,
    pagination,
    timestamp: new Date().toISOString()
  })
}