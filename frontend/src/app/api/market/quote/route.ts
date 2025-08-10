import { NextRequest, NextResponse } from 'next/server';
import { marketDataService } from '@/lib/services/market-data';

/**
 * GET /api/market/quote?symbol=AAPL
 * 获取单个股票实时报价
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

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

    const result = await marketDataService.getQuote(symbol);

    if (!result.success) {
      return NextResponse.json(result, { 
        status: result.error?.code === 'INVALID_SYMBOL' ? 400 : 500 
      });
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=60', // 1分钟缓存
      },
    });
  } catch (error) {
    console.error('Error in quote API:', error);
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