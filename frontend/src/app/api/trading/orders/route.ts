import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/config/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取订单列表
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    const orders = await prisma.order.findMany({
      where: {
        portfolio: {
          userId: user.id
        },
        ...(status && { status: status as any })
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('获取订单失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 创建新订单
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { symbol, side, type, quantity, price } = await request.json();

    // 验证输入
    if (!symbol || !side || !type || !quantity || quantity <= 0) {
      return NextResponse.json({ error: '订单参数无效' }, { status: 400 });
    }

    if (type === 'LIMIT' && (!price || price <= 0)) {
      return NextResponse.json({ error: '限价单必须设置价格' }, { status: 400 });
    }

    // 获取用户投资组合
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id },
      include: { positions: true }
    });

    if (!portfolio) {
      return NextResponse.json({ error: '投资组合不存在' }, { status: 404 });
    }

    // 获取当前股价（模拟）
    const currentPrice = await getCurrentPrice(symbol);
    if (!currentPrice) {
      return NextResponse.json({ error: '无法获取股票价格' }, { status: 400 });
    }

    // 计算订单价格
    const orderPrice = type === 'MARKET' ? currentPrice : price;
    const totalCost = orderPrice * quantity;

    // 验证资金或持仓是否足够
    if (side === 'BUY') {
      if (portfolio.cash < totalCost) {
        return NextResponse.json({ error: '资金不足' }, { status: 400 });
      }
    } else { // SELL
      const position = portfolio.positions.find(p => p.symbol === symbol);
      if (!position || position.quantity < quantity) {
        return NextResponse.json({ error: '持仓不足' }, { status: 400 });
      }
    }

    // 创建订单并执行交易
    const result = await prisma.$transaction(async (tx) => {
      // 创建订单
      const order = await tx.order.create({
        data: {
          portfolioId: portfolio.id,
          symbol,
          side,
          type,
          quantity,
          price: orderPrice,
          status: 'EXECUTED' // 模拟交易立即执行
        }
      });

      // 更新投资组合
      if (side === 'BUY') {
        // 买入：减少现金，增加或创建持仓
        await tx.portfolio.update({
          where: { id: portfolio.id },
          data: { cash: portfolio.cash - totalCost }
        });

        const existingPosition = await tx.position.findUnique({
          where: {
            portfolioId_symbol: {
              portfolioId: portfolio.id,
              symbol
            }
          }
        });

        if (existingPosition) {
          // 更新现有持仓
          const newQuantity = existingPosition.quantity + quantity;
          const newAvgPrice = ((existingPosition.avgPrice * existingPosition.quantity) + totalCost) / newQuantity;
          
          await tx.position.update({
            where: { id: existingPosition.id },
            data: {
              quantity: newQuantity,
              avgPrice: newAvgPrice
            }
          });
        } else {
          // 创建新持仓
          await tx.position.create({
            data: {
              portfolioId: portfolio.id,
              symbol,
              quantity,
              avgPrice: orderPrice
            }
          });
        }
      } else { // SELL
        // 卖出：增加现金，减少持仓
        await tx.portfolio.update({
          where: { id: portfolio.id },
          data: { cash: portfolio.cash + totalCost }
        });

        const position = await tx.position.findUnique({
          where: {
            portfolioId_symbol: {
              portfolioId: portfolio.id,
              symbol
            }
          }
        });

        if (position) {
          if (position.quantity === quantity) {
            // 完全卖出，删除持仓
            await tx.position.delete({
              where: { id: position.id }
            });
          } else {
            // 部分卖出，更新持仓
            await tx.position.update({
              where: { id: position.id },
              data: { quantity: position.quantity - quantity }
            });
          }
        }
      }

      return order;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('创建订单失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 模拟获取股票当前价格
async function getCurrentPrice(symbol: string): Promise<number | null> {
  try {
    // 这里应该调用真实的股票API，现在用模拟数据
    const mockPrices: { [key: string]: number } = {
      'AAPL': 150.25,
      'GOOGL': 2500.50,
      'MSFT': 300.75,
      'TSLA': 800.00,
      'AMZN': 3200.25,
      'NVDA': 220.50,
      'META': 280.75,
      'NFLX': 400.25,
    };

    return mockPrices[symbol] || 100.00; // 默认价格
  } catch (error) {
    console.error('获取股价失败:', error);
    return null;
  }
}