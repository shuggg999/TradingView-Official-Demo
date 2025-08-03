import { NextRequest } from "next/server"
import { MarketDataService } from "@/lib/services/market-data.service"
import { symbolParamsSchema, marketHistoryQuerySchema } from "@/lib/validations"
import { withErrorHandler, successResponse } from "@/lib/api-error"
import { authMiddlewares } from "@/lib/middleware/auth-middleware"
import { TimeInterval } from "@prisma/client"

async function handleGetHistoricalData(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  // 专业版订阅检查（历史数据为高级功能）
  await authMiddlewares.proSubscription(request)
  
  // 验证参数
  const { symbol } = symbolParamsSchema.parse(params)
  
  // 解析查询参数
  const url = new URL(request.url)
  const queryParams = Object.fromEntries(url.searchParams)
  const { interval, from, to, limit } = marketHistoryQuerySchema.parse(queryParams)
  
  // 转换时间间隔
  const intervalMap: Record<string, TimeInterval> = {
    '1m': TimeInterval.ONE_MINUTE,
    '5m': TimeInterval.FIVE_MINUTES,
    '15m': TimeInterval.FIFTEEN_MINUTES,
    '1h': TimeInterval.ONE_HOUR,
    '4h': TimeInterval.FOUR_HOURS,
    '1d': TimeInterval.ONE_DAY,
    '1w': TimeInterval.ONE_WEEK
  }
  
  const timeInterval = intervalMap[interval]
  
  // 计算时间范围
  const toDate = to ? new Date(to) : new Date()
  const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 默认30天前
  
  // 获取历史数据
  const data = await MarketDataService.getHistoricalData(
    symbol.toUpperCase(),
    timeInterval,
    fromDate,
    toDate
  )
  
  // 限制返回数量
  const limitedData = data.slice(-limit)
  
  return successResponse({
    symbol: symbol.toUpperCase(),
    interval,
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
    count: limitedData.length,
    data: limitedData
  })
}

export const GET = withErrorHandler(handleGetHistoricalData)