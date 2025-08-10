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

    const activities: Array<{
      id: string;
      type: 'course_completed' | 'lesson_viewed' | 'lesson_watched' | 'note_created' | 'review_posted' | 'course_favorited' | 'note_written';
      title: string;
      description: string;
      courseSlug?: string;
      lessonSlug?: string;
      createdAt: string;
    }> = [];

    // 获取最近完成的课程
    const recentCompletedCourses = await prisma.learningProgress.findMany({
      where: { 
        userId: user.id,
        completed: true 
      },
      include: { course: true },
      orderBy: { updatedAt: 'desc' },
      take: 5
    });

    recentCompletedCourses.forEach(progress => {
      activities.push({
        id: `course_completed_${progress.id}`,
        type: 'course_completed' as const,
        title: progress.course.title,
        description: '完成了这门课程的学习',
        courseSlug: progress.course.slug,
        createdAt: progress.updatedAt.toISOString(),
      });
    });

    // 获取最近观看的课时
    const recentLessons = await prisma.progress.findMany({
      where: { userId: user.id },
      include: {
        lesson: {
          include: { course: true }
        }
      },
      orderBy: { lastWatched: 'desc' },
      take: 5
    });

    recentLessons.forEach(progress => {
      if (progress.lastWatched) {
        activities.push({
          id: `lesson_watched_${progress.id}`,
          type: 'lesson_watched' as const,
          title: progress.lesson.title,
          description: `观看了课程"${progress.lesson.course.title}"中的课时`,
          courseSlug: progress.lesson.course.slug,
          createdAt: progress.lastWatched.toISOString(),
        });
      }
    });

    // 获取最近收藏的课程
    const recentFavorites = await prisma.courseFavorite.findMany({
      where: { userId: user.id },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    recentFavorites.forEach(favorite => {
      activities.push({
        id: `course_favorited_${favorite.id}`,
        type: 'course_favorited' as const,
        title: favorite.course.title,
        description: '收藏了这门课程',
        courseSlug: favorite.course.slug,
        createdAt: favorite.createdAt.toISOString(),
      });
    });

    // 获取最近创建的笔记
    const recentNotes = await prisma.courseNote.findMany({
      where: { userId: user.id },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    recentNotes.forEach(note => {
      activities.push({
        id: `note_created_${note.id}`,
        type: 'note_created' as const,
        title: note.title,
        description: `在课程"${note.course.title}"中创建了笔记`,
        courseSlug: note.course.slug,
        createdAt: note.createdAt.toISOString(),
      });
    });

    // 获取最近发布的评价
    const recentReviews = await prisma.courseReview.findMany({
      where: { userId: user.id },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    recentReviews.forEach(review => {
      activities.push({
        id: `review_posted_${review.id}`,
        type: 'review_posted' as const,
        title: review.course.title,
        description: `发布了${review.rating}星评价`,
        courseSlug: review.course.slug,
        createdAt: review.createdAt.toISOString(),
      });
    });

    // 按时间排序并限制返回数量
    const sortedActivities = activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    return NextResponse.json(sortedActivities);
  } catch (error) {
    console.error('获取最近活动失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}