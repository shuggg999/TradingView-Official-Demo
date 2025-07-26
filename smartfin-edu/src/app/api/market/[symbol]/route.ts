import { NextRequest } from "next/server"
import { MarketDataService } from "@/lib/market-data.service"
import { symbolParamsSchema } from "@/lib/validations"
import { withErrorHandler, successResponse } from "@/lib/api-error"
import { authMiddlewares } from "@/lib/auth-middleware"

async function handleGetSymbolData(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  // 基础限流
  await authMiddlewares.rateLimited(request)
  
  // 验证参数
  const { symbol } = symbolParamsSchema.parse(params)
  
  // 获取市场数据
  const data = await MarketDataService.getSymbolData(symbol.toUpperCase())
  
  return successResponse(data)
}

export const GET = withErrorHandler(handleGetSymbolData)