import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/config/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取学习计划
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

    const plans = await prisma.learningPlan.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            course: {
              include: {
                category: true,
                lessons: { where: { isPublished: true } }
              }
            }
          }
        }
      },
      orderBy: { targetDate: 'asc' }
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error('获取学习计划失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 创建学习计划
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

    const { courseId, targetDate, title, description } = await request.json();

    if (!courseId || !targetDate || !title) {
      return NextResponse.json({ error: 'Course ID, title and target date required' }, { status: 400 });
    }

    // 检查课程是否存在
    const course = await prisma.course.findUnique({
      where: { id: courseId, isPublished: true }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // 创建学习计划并同时创建学习计划项
    const plan = await prisma.learningPlan.create({
      data: {
        userId: user.id,
        title,
        description: description || `学习计划: ${course.title}`,
        targetDate: new Date(targetDate),
        isCompleted: false,
        items: {
          create: {
            courseId,
            order: 1,
            isCompleted: false
          }
        }
      },
      include: {
        items: {
          include: {
            course: {
              include: {
                category: true,
                lessons: { where: { isPublished: true } }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error('创建学习计划失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 更新学习计划状态
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

    const { planId, title, description, targetDate, isCompleted } = await request.json();

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });
    }

    const plan = await prisma.learningPlan.update({
      where: {
        id: planId,
        userId: user.id
      },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(targetDate && { targetDate: new Date(targetDate) }),
        ...(isCompleted !== undefined && { isCompleted })
      },
      include: {
        items: {
          include: {
            course: {
              include: {
                category: true,
                lessons: { where: { isPublished: true } }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error('更新学习计划失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}