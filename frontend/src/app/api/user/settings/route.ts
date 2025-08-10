import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/config/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取用户设置
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
        email: true,
        name: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 返回默认设置（目前没有在数据库中存储设置）
    const defaultSettings = {
      theme: 'system',
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '24h',
      autoPlay: true,
      emailNotifications: true,
      pushNotifications: true,
    };

    return NextResponse.json(defaultSettings);
  } catch (error) {
    console.error('获取用户设置失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 更新用户设置
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

    const settings = await request.json();

    // 这里我们暂时返回成功，实际项目中需要在数据库中添加settings字段
    // const updatedUser = await prisma.user.update({
    //   where: { id: user.id },
    //   data: { settings }
    // });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('更新用户设置失败:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}