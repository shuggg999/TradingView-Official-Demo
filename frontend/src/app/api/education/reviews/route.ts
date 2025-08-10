import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/config/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取课程评价
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID required' }, { status: 400 });
    }

    const reviews = await prisma.courseReview.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('获取课程评价失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 创建/更新课程评价
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

    const { courseId, rating, comment } = await request.json();

    if (!courseId || !rating) {
      return NextResponse.json({ error: 'Course ID and rating required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const review = await prisma.courseReview.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId
        }
      },
      update: {
        rating,
        comment
      },
      create: {
        userId: user.id,
        courseId: courseId,
        rating,
        comment
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('创建课程评价失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}