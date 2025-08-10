import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/config/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取笔记
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
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');

    const notes = await prisma.courseNote.findMany({
      where: {
        userId: user.id,
        ...(courseId && { courseId }),
        ...(lessonId && { lessonId })
      },
      include: {
        course: { select: { title: true } },
        lesson: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('获取笔记失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 创建笔记
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

    const { courseId, lessonId, title, content, timestamp } = await request.json();

    if (!courseId || !title || !content) {
      return NextResponse.json({ error: 'Course ID, title and content required' }, { status: 400 });
    }

    const note = await prisma.courseNote.create({
      data: {
        userId: user.id,
        courseId,
        lessonId,
        title,
        content,
        timestamp
      }
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('创建笔记失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}