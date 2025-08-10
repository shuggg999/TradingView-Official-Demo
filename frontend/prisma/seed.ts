import { PrismaClient, Difficulty, ContentType, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始种子数据创建...');

  // 1. 创建课程分类
  const categories = await Promise.all([
    prisma.courseCategory.upsert({
      where: { slug: 'basics' },
      update: {},
      create: {
        name: '投资基础',
        slug: 'basics',
      },
    }),
    prisma.courseCategory.upsert({
      where: { slug: 'technical-analysis' },
      update: {},
      create: {
        name: '技术分析',
        slug: 'technical-analysis',
      },
    }),
    prisma.courseCategory.upsert({
      where: { slug: 'advanced' },
      update: {},
      create: {
        name: '高级策略',
        slug: 'advanced',
      },
    }),
  ]);

  console.log('✅ 课程分类创建完成');

  // 2. 创建课程标签
  const tags = await Promise.all([
    prisma.courseTag.upsert({
      where: { name: '股票' },
      update: {},
      create: { name: '股票' },
    }),
    prisma.courseTag.upsert({
      where: { name: 'K线' },
      update: {},
      create: { name: 'K线' },
    }),
    prisma.courseTag.upsert({
      where: { name: '技术指标' },
      update: {},
      create: { name: '技术指标' },
    }),
    prisma.courseTag.upsert({
      where: { name: '风险管理' },
      update: {},
      create: { name: '风险管理' },
    }),
  ]);

  console.log('✅ 课程标签创建完成');

  // 3. 创建示例课程
  const course1 = await prisma.course.upsert({
    where: { slug: 'stock-investment-basics' },
    update: {},
    create: {
      title: '股票投资入门指南',
      slug: 'stock-investment-basics',
      description: '从零开始学习股票投资的基础知识，包括市场机制、投资理念和基本操作。',
      content: `# 股票投资入门指南

## 课程简介

本课程专为投资新手设计，将带您从零开始了解股票投资的基础知识。通过学习本课程，您将掌握：

- 股票市场的基本概念和运作机制
- 如何选择和分析股票
- 投资风险管理的基本原则
- 实际操作的注意事项

## 学习目标

1. 理解股票投资的基本概念
2. 掌握投资决策的基本方法
3. 学会风险控制和资金管理
4. 建立正确的投资心态

## 适合人群

- 投资新手
- 想要系统学习股票投资的人群
- 希望改善投资效果的投资者`,
      excerpt: '从零开始学习股票投资，掌握基础知识和投资技巧。',
      categoryId: categories[0].id,
      difficulty: Difficulty.BEGINNER,
      duration: 120, // 2小时
      order: 1,
      isPublished: true,
      isFeatured: true,
      metaTitle: '股票投资入门指南 - SmartFin教育平台',
      metaDescription: '专业的股票投资入门课程，适合新手学习投资基础知识。',
    },
  });

  // 为课程1创建课时
  await Promise.all([
    prisma.lesson.create({
      data: {
        title: '什么是股票投资？',
        description: '了解股票的基本概念，投资与投机的区别，以及股票市场的基本运作机制。',
        contentType: ContentType.VIDEO,
        videoUrl: 'https://www.youtube.com/watch?v=p7HKvqRI_Bo',
        videoProvider: 'YouTube',
        videoDuration: 15,
        content: '## 学习要点\n\n1. 股票代表什么\n2. 投资与投机的区别\n3. 股票市场如何运作\n4. 为什么要投资股票',
        order: 1,
        courseId: course1.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: '如何开设投资账户',
        description: '学习如何选择券商，开设投资账户，以及账户安全的注意事项。',
        contentType: ContentType.VIDEO,
        videoUrl: 'https://www.bilibili.com/video/BV1Lh411e7zz',
        videoProvider: 'Bilibili',
        videoDuration: 20,
        content: '## 账户开设步骤\n\n1. 选择合适的券商\n2. 准备开户资料\n3. 风险评估\n4. 账户安全设置',
        order: 2,
        courseId: course1.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: '股票基本面分析入门',
        description: '学习如何分析公司的财务状况，理解市盈率、市净率等基本指标。',
        contentType: ContentType.VIDEO,
        videoUrl: 'https://www.youtube.com/watch?v=7pwNERP6mg4',
        videoProvider: 'YouTube',
        videoDuration: 25,
        content: '## 基本面分析要点\n\n1. 财务报表解读\n2. 关键财务指标\n3. 行业对比分析\n4. 估值方法',
        order: 3,
        courseId: course1.id,
      },
    }),
  ]);

  // 创建第二门课程
  const course2 = await prisma.course.upsert({
    where: { slug: 'candlestick-analysis' },
    update: {},
    create: {
      title: 'K线图技术分析',
      slug: 'candlestick-analysis',
      description: '掌握K线图的基本形态和技术分析方法，学会识别市场趋势和交易信号。',
      content: `# K线图技术分析

## 课程简介

K线图是技术分析的基础工具，本课程将系统讲解K线图的构成、常见形态和应用方法。

## 主要内容

1. K线的基本构成
2. 经典K线形态
3. K线组合分析
4. 实战应用技巧`,
      excerpt: '系统学习K线图分析，掌握技术分析的基础工具。',
      categoryId: categories[1].id,
      difficulty: Difficulty.INTERMEDIATE,
      duration: 90,
      order: 2,
      isPublished: true,
      isFeatured: true,
    },
  });

  // 为课程2创建课时
  await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'K线图基础知识',
        description: '了解K线图的组成要素：开盘价、收盘价、最高价、最低价。',
        contentType: ContentType.VIDEO,
        videoUrl: 'https://www.youtube.com/watch?v=8T7kOpzvOSY',
        videoProvider: 'YouTube',
        videoDuration: 18,
        content: '## K线四要素\n\n1. 开盘价\n2. 收盘价\n3. 最高价\n4. 最低价',
        order: 1,
        courseId: course2.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: '经典K线形态识别',
        description: '学习锤子线、吞没形态、十字星等经典K线形态的识别和应用。',
        contentType: ContentType.VIDEO,
        videoUrl: 'https://www.bilibili.com/video/BV1Kt411e7cH',
        videoProvider: 'Bilibili',
        videoDuration: 30,
        content: '## 经典形态\n\n1. 锤子线\n2. 吞没形态\n3. 十字星\n4. 纺锤线',
        order: 2,
        courseId: course2.id,
      },
    }),
  ]);

  // 创建第三门课程
  const course3 = await prisma.course.upsert({
    where: { slug: 'risk-management' },
    update: {},
    create: {
      title: '投资风险管理',
      slug: 'risk-management',
      description: '学习如何识别、评估和管理投资风险，建立科学的风险控制体系。',
      content: `# 投资风险管理

风险管理是投资成功的关键因素，本课程将帮助您建立完整的风险管理体系。`,
      excerpt: '掌握风险管理的核心原则，保护您的投资资本。',
      categoryId: categories[2].id,
      difficulty: Difficulty.ADVANCED,
      duration: 75,
      order: 3,
      isPublished: true,
    },
  });

  // 为课程3创建课时
  await prisma.lesson.create({
    data: {
      title: '风险管理基本原则',
      description: '了解投资风险的种类，学习风险评估和控制的基本方法。',
      contentType: ContentType.VIDEO,
      videoUrl: 'https://www.youtube.com/watch?v=uOoHGweyyLc',
      videoProvider: 'YouTube',
      videoDuration: 22,
      content: '## 风险管理要点\n\n1. 风险识别\n2. 风险评估\n3. 风险控制\n4. 止损策略',
      order: 1,
      courseId: course3.id,
    },
  });

  // 4. 创建一些股票符号
  await Promise.all([
    prisma.symbol.upsert({
      where: { symbol: 'AAPL' },
      update: {},
      create: {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        exchange: 'NASDAQ',
        type: 'STOCK',
        currency: 'USD',
        sector: 'Technology',
        industry: 'Consumer Electronics',
      },
    }),
    prisma.symbol.upsert({
      where: { symbol: 'GOOGL' },
      update: {},
      create: {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        exchange: 'NASDAQ',
        type: 'STOCK',
        currency: 'USD',
        sector: 'Technology',
        industry: 'Internet Content & Information',
      },
    }),
    prisma.symbol.upsert({
      where: { symbol: 'TSLA' },
      update: {},
      create: {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        exchange: 'NASDAQ',
        type: 'STOCK',
        currency: 'USD',
        sector: 'Consumer Cyclical',
        industry: 'Auto Manufacturers',
      },
    }),
  ]);

  console.log('✅ 股票符号创建完成');

  console.log('🎉 种子数据创建完成！');
  console.log('📚 已创建 3 门课程，6 个课时');
  console.log('🏷️ 已创建课程分类和标签');
  console.log('📈 已创建示例股票数据');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据创建失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });