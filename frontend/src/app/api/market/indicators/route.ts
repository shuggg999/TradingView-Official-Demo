import { NextRequest, NextResponse } from 'next/server';
import { marketDataService } from '@/lib/services/market-data';

/**
 * GET /api/market/indicators?symbol=AAPL&type=sma&period=14
 * 计算技术指标
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const indicatorType = searchParams.get('type');
    const periodParam = searchParams.get('period');

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

    if (!indicatorType) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_TYPE',
            message: 'Indicator type parameter is required',
          }
        },
        { status: 400 }
      );
    }

    const validTypes = ['sma', 'ema', 'rsi', 'macd', 'bollinger', 'stochastic'];
    if (!validTypes.includes(indicatorType)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TYPE',
            message: `Invalid indicator type. Supported types: ${validTypes.join(', ')}`,
          }
        },
        { status: 400 }
      );
    }

    let period = 14; // 默认周期
    if (periodParam) {
      const parsedPeriod = parseInt(periodParam, 10);
      if (isNaN(parsedPeriod) || parsedPeriod < 1) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_PERIOD',
              message: 'Period must be a positive integer',
            }
          },
          { status: 400 }
        );
      }
      if (parsedPeriod > 200) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'PERIOD_TOO_HIGH',
              message: 'Period cannot exceed 200',
            }
          },
          { status: 400 }
        );
      }
      period = parsedPeriod;
    }

    const result = await marketDataService.calculateIndicator(
      symbol,
      indicatorType as any,
      period
    );

    if (!result.success) {
      return NextResponse.json(result, { 
        status: result.error?.code === 'INVALID_SYMBOL' ? 400 : 500 
      });
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // 1小时缓存
      },
    });
  } catch (error) {
    console.error('Error in indicators API:', error);
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