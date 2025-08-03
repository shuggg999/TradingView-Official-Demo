import { NextRequest } from "next/server"
import { MarketDataService } from "@/lib/services/market-data.service"
import { marketSearchQuerySchema } from "@/lib/validations"
import { withErrorHandler, successResponse } from "@/lib/api-error"
import { authMiddlewares } from "@/lib/middleware/auth-middleware"
import { AssetType } from "@prisma/client"

async function handleSearchSymbols(request: NextRequest) {
  // 基础限流
  await authMiddlewares.rateLimited(request)
  
  // 解析查询参数
  const url = new URL(request.url)
  const queryParams = Object.fromEntries(url.searchParams)
  const { q, type, limit } = marketSearchQuerySchema.parse(queryParams)
  
  // 转换资产类型
  const assetType = type ? (type as AssetType) : undefined
  
  // 搜索符号
  const results = await MarketDataService.searchSymbols(q, assetType, limit)
  
  return successResponse({
    query: q,
    type: type || 'all',
    count: results.length,
    results
  })
}

export const GET = withErrorHandler(handleSearchSymbols)