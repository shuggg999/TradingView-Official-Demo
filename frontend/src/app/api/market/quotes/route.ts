import { NextRequest, NextResponse } from 'next/server';
import { marketDataService } from '@/lib/services/market-data';

/**
 * GET /api/market/quotes?symbols=AAPL,GOOGL,MSFT
 * POST /api/market/quotes (with body: { symbols: ['AAPL', 'GOOGL'] })
 * 批量获取股票实时报价
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get('symbols');

    if (!symbolsParam) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_SYMBOLS',
            message: 'Symbols parameter is required',
          }
        },
        { status: 400 }
      );
    }

    const symbols = symbolsParam.split(',').map(s => s.trim()).filter(s => s.length > 0);

    if (symbols.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMPTY_SYMBOLS',
            message: 'At least one symbol is required',
          }
        },
        { status: 400 }
      );
    }

    if (symbols.length > 50) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TOO_MANY_SYMBOLS',
            message: 'Maximum 50 symbols allowed per request',
          }
        },
        { status: 400 }
      );
    }

    const result = await marketDataService.getQuotes(symbols);

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=60', // 1分钟缓存
      },
    });
  } catch (error) {
    console.error('Error in quotes GET API:', error);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbols } = body;

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_SYMBOLS',
            message: 'Symbols must be an array',
          }
        },
        { status: 400 }
      );
    }

    if (symbols.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMPTY_SYMBOLS',
            message: 'At least one symbol is required',
          }
        },
        { status: 400 }
      );
    }

    if (symbols.length > 50) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TOO_MANY_SYMBOLS',
            message: 'Maximum 50 symbols allowed per request',
          }
        },
        { status: 400 }
      );
    }

    const result = await marketDataService.getQuotes(symbols);

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in quotes POST API:', error);
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