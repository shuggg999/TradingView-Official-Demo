import { NextRequest, NextResponse } from 'next/server';
import { marketDataService } from '@/lib/services/market-data';

/**
 * GET /api/market/search?q=AAPL&limit=10
 * 搜索股票
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query');
    const limitParam = searchParams.get('limit');

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_QUERY',
            message: 'Query parameter (q or query) is required',
          }
        },
        { status: 400 }
      );
    }

    if (query.trim().length < 1) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMPTY_QUERY',
            message: 'Query cannot be empty',
          }
        },
        { status: 400 }
      );
    }

    let limit = 10; // 默认限制
    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_LIMIT',
              message: 'Limit must be a positive integer',
            }
          },
          { status: 400 }
        );
      }
      if (parsedLimit > 50) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'LIMIT_TOO_HIGH',
              message: 'Limit cannot exceed 50',
            }
          },
          { status: 400 }
        );
      }
      limit = parsedLimit;
    }

    const result = await marketDataService.searchStocks(query, limit);

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // 1小时缓存
      },
    });
  } catch (error) {
    console.error('Error in search API:', error);
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