import { NextRequest } from "next/server"
import { MarketDataService } from "@/lib/market-data.service"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-error"
import { authMiddlewares } from "@/lib/auth-middleware"
import { z } from "zod"

const batchRequestSchema = z.object({
  symbols: z.array(z.string().min(1).max(20)).min(1).max(50), // 最多50个符号
})

async function handleBatchSymbolData(request: NextRequest) {
  // 专业版订阅检查（批量请求为高级功能）
  await authMiddlewares.proSubscription(request)
  
  const body = await request.json()
  
  // 验证请求数据
  const { symbols } = batchRequestSchema.parse(body)
  
  // 转换为大写
  const upperSymbols = symbols.map(s => s.toUpperCase())
  
  // 获取批量数据
  const data = await MarketDataService.getBatchSymbolData(upperSymbols)
  
  // 计算成功和失败的数量
  const successCount = data.filter(item => item.price > 0).length
  const failureCount = data.length - successCount
  
  return successResponse({
    requested: upperSymbols,
    count: data.length,
    successCount,
    failureCount,
    data
  })
}

export const POST = withErrorHandler(handleBatchSymbolData)