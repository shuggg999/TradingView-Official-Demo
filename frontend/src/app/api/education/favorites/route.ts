import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/config/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取收藏列表
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

    const favorites = await prisma.courseFavorite.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            category: true,
            lessons: { where: { isPublished: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 添加/移除收藏
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

    const { courseId, action } = await request.json();

    if (!courseId || !action) {
      return NextResponse.json({ error: 'Course ID and action required' }, { status: 400 });
    }

    if (action === 'add') {
      const favorite = await prisma.courseFavorite.upsert({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId
          }
        },
        update: {},
        create: {
          userId: user.id,
          courseId: courseId
        }
      });
      return NextResponse.json({ ...favorite, favorited: true });
    } else if (action === 'remove') {
      await prisma.courseFavorite.delete({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId
          }
        }
      });
      return NextResponse.json({ favorited: false });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('操作收藏失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}