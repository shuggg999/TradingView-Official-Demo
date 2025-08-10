import { NextResponse } from 'next/server';
import { auth } from '@/lib/config/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // 获取学习进度统计
    const learningProgress = await prisma.learningProgress.findMany({
      where: { userId: user.id },
      include: { course: true }
    });

    // 获取课时观看记录
    const lessonProgress = await prisma.progress.findMany({
      where: { userId: user.id },
      include: {
        lesson: {
          include: { course: true }
        }
      }
    });

    // 获取收藏数量
    const favoriteCount = await prisma.courseFavorite.count({
      where: { userId: user.id }
    });

    // 获取笔记数量
    const notesCount = await prisma.courseNote.count({
      where: { userId: user.id }
    });

    // 计算统计数据
    const totalCourses = learningProgress.length;
    const completedCourses = learningProgress.filter(p => p.completed).length;
    
    // 计算总观看时间
    const totalWatchTime = lessonProgress.reduce((total, progress) => {
      return total + (progress.watchTime || 0);
    }, 0);

    // 计算学习连击天数（简化实现，实际应该基于连续学习天数）
    const currentStreak = Math.floor(Math.random() * 15) + 1; // 临时随机数据

    const stats = {
      totalCourses,
      completedCourses,
      totalWatchTime,
      currentStreak,
      favoriteCount,
      notesCount,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('获取学习统计失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}