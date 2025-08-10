import { NextRequest, NextResponse } from 'next/server';
import { marketDataService } from '@/lib/services/market-data';

/**
 * GET /api/market/history?symbol=AAPL&period1=2024-01-01&period2=2024-12-31&interval=1d
 * 获取股票历史数据
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const period1Param = searchParams.get('period1');
    const period2Param = searchParams.get('period2');
    const interval = searchParams.get('interval') as '1d' | '1wk' | '1mo' || '1d';

    if (!symbol) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_SYMBOL',
            message: 'Symbol parameter is required',
          }
        },
        { status: 400 }
      );
    }

    // 解析日期参数
    let period1: Date;
    let period2: Date = new Date();

    if (period1Param) {
      period1 = new Date(period1Param);
      if (isNaN(period1.getTime())) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_PERIOD1',
              message: 'Invalid period1 date format. Use YYYY-MM-DD',
            }
          },
          { status: 400 }
        );
      }
    } else {
      // 默认获取1年数据
      period1 = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    }

    if (period2Param) {
      period2 = new Date(period2Param);
      if (isNaN(period2.getTime())) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_PERIOD2',
              message: 'Invalid period2 date format. Use YYYY-MM-DD',
            }
          },
          { status: 400 }
        );
      }
    }

    // 验证日期范围
    if (period1 >= period2) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_DATE_RANGE',
            message: 'period1 must be earlier than period2',
          }
        },
        { status: 400 }
      );
    }

    // 验证间隔
    if (!['1d', '1wk', '1mo'].includes(interval)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INTERVAL',
            message: 'Interval must be one of: 1d, 1wk, 1mo',
          }
        },
        { status: 400 }
      );
    }

    const result = await marketDataService.getHistoricalData(
      symbol,
      period1,
      period2,
      interval
    );

    if (!result.success) {
      return NextResponse.json(result, { 
        status: result.error?.code === 'INVALID_SYMBOL' ? 400 : 500 
      });
    }

    // 根据间隔设置不同的缓存时间
    const cacheMaxAge = interval === '1d' ? 3600 : 86400; // 1小时或24小时

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': `public, max-age=${cacheMaxAge}`,
      },
    });
  } catch (error) {
    console.error('Error in history API:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
        }
      },
      { status: 500 }
    );
  }
}