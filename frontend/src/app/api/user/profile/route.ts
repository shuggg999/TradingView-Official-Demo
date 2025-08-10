import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/config/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取用户资料
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        location: true,
        website: true,
        occupation: true,
        interests: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('获取用户资料失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 更新用户资料
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

    const { name, bio, location, website, occupation, interests } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || user.name,
        bio,
        location,
        website,
        occupation,
        interests,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        location: true,
        website: true,
        occupation: true,
        interests: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('更新用户资料失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}