import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/config/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取用户学习进度
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
    const lessonId = searchParams.get('lessonId');
    const courseId = searchParams.get('courseId');

    if (lessonId) {
      // 获取单个课时进度
      const progress = await prisma.progress.findUnique({
        where: {
          userId_lessonId: {
            userId: user.id,
            lessonId: lessonId
          }
        }
      });
      return NextResponse.json(progress);
    } else if (courseId) {
      // 获取课程整体进度
      const courseProgress = await prisma.learningProgress.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId
          }
        }
      });
      return NextResponse.json(courseProgress);
    } else {
      // 获取所有进度
      const allProgress = await prisma.learningProgress.findMany({
        where: { userId: user.id },
        include: { course: true }
      });
      return NextResponse.json(allProgress);
    }
  } catch (error) {
    console.error('获取学习进度失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 更新学习进度
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

    const { lessonId, courseId, completed, watchTime } = await request.json();

    if (lessonId) {
      // 更新课时进度
      const progress = await prisma.progress.upsert({
        where: {
          userId_lessonId: {
            userId: user.id,
            lessonId: lessonId
          }
        },
        update: {
          completed,
          watchTime,
          lastWatched: new Date()
        },
        create: {
          userId: user.id,
          lessonId: lessonId,
          completed: completed || false,
          watchTime: watchTime || 0
        }
      });

      // 更新课程整体进度
      if (courseId) {
        const lesson = await prisma.lesson.findUnique({
          where: { id: lessonId },
          include: { course: { include: { lessons: true } } }
        });

        if (lesson) {
          const allLessonsProgress = await prisma.progress.findMany({
            where: {
              userId: user.id,
              lessonId: { in: lesson.course.lessons.map(l => l.id) }
            }
          });

          const completedLessons = allLessonsProgress.filter(p => p.completed).length;
          const totalLessons = lesson.course.lessons.length;
          const progressPercentage = (completedLessons / totalLessons) * 100;

          await prisma.learningProgress.upsert({
            where: {
              userId_courseId: {
                userId: user.id,
                courseId: courseId
              }
            },
            update: {
              progress: progressPercentage,
              completed: progressPercentage === 100
            },
            create: {
              userId: user.id,
              courseId: courseId,
              progress: progressPercentage,
              completed: progressPercentage === 100
            }
          });
        }
      }

      return NextResponse.json(progress);
    }

    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  } catch (error) {
    console.error('更新学习进度失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}