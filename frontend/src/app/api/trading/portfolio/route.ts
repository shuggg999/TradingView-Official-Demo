import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/config/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取用户投资组合
export async function GET() {
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

    // 查找或创建用户的投资组合
    let portfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id },
      include: {
        positions: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    // 如果用户没有投资组合，创建一个默认的
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          userId: user.id,
          cash: 500000, // 初始50万虚拟资金
        },
        include: {
          positions: true,
          orders: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('获取投资组合失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 更新投资组合（重置账户等）
export async function PUT(request: NextRequest) {
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

    const { action } = await request.json();

    if (action === 'reset') {
      // 重置投资组合
      await prisma.$transaction(async (tx) => {
        // 删除所有持仓
        await tx.position.deleteMany({
          where: {
            portfolio: {
              userId: user.id
            }
          }
        });

        // 取消所有未执行的订单
        await tx.order.updateMany({
          where: {
            portfolio: {
              userId: user.id
            },
            status: 'PENDING'
          },
          data: {
            status: 'CANCELLED'
          }
        });

        // 重置现金
        await tx.portfolio.update({
          where: { userId: user.id },
          data: { cash: 500000 }
        });
      });

      const updatedPortfolio = await prisma.portfolio.findUnique({
        where: { userId: user.id },
        include: {
          positions: true,
          orders: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });

      return NextResponse.json(updatedPortfolio);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('更新投资组合失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}