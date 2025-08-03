import { PrismaClient, AssetType, Difficulty, UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始数据库种子数据填充...')

  // 创建课程分类
  const categories = await Promise.all([
    prisma.courseCategory.upsert({
      where: { slug: 'basics' },
      update: {},
      create: {
        name: '投资基础',
        slug: 'basics'
      }
    }),
    prisma.courseCategory.upsert({
      where: { slug: 'technical-analysis' },
      update: {},
      create: {
        name: '技术分析',
        slug: 'technical-analysis'
      }
    }),
    prisma.courseCategory.upsert({
      where: { slug: 'risk-management' },
      update: {},
      create: {
        name: '风险管理',
        slug: 'risk-management'
      }
    })
  ])

  console.log('✅ 课程分类创建完成')

  // 创建课程标签
  const tags = await Promise.all([
    prisma.courseTag.upsert({
      where: { name: '新手入门' },
      update: {},
      create: { name: '新手入门' }
    }),
    prisma.courseTag.upsert({
      where: { name: '股票投资' },
      update: {},
      create: { name: '股票投资' }
    }),
    prisma.courseTag.upsert({
      where: { name: 'K线图' },
      update: {},
      create: { name: 'K线图' }
    }),
    prisma.courseTag.upsert({
      where: { name: '技术指标' },
      update: {},
      create: { name: '技术指标' }
    })
  ])

  console.log('✅ 课程标签创建完成')

  // 创建示例课程
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { slug: 'investment-basics-101' },
      update: {},
      create: {
        title: '投资理财基础入门',
        slug: 'investment-basics-101',
        description: '从零开始学习投资理财的基本概念和方法',
        excerpt: '适合完全没有投资经验的初学者，系统性地介绍投资基础知识。',
        content: `# 投资理财基础入门

## 什么是投资？

投资是指将资金投入到能够产生收益的项目或资产中，以期在未来获得更多的资金回报。

## 常见的投资品种

1. **股票** - 购买公司的所有权份额
2. **债券** - 借钱给政府或企业
3. **基金** - 专业机构代为投资
4. **房地产** - 购买不动产获得租金或升值

## 投资的基本原则

- **分散投资** - 不要把鸡蛋放在一个篮子里
- **长期持有** - 时间是投资的朋友
- **风险控制** - 只投资你能承受损失的资金

## 开始投资前的准备

1. 建立应急基金
2. 了解自己的风险承受能力
3. 设定明确的投资目标
4. 学习基础的投资知识`,
        categoryId: categories[0].id,
        difficulty: Difficulty.BEGINNER,
        duration: 30,
        order: 1,
        isPublished: true,
        isFeatured: true,
        metaTitle: '投资理财基础入门 - SmartFin Tech',
        metaDescription: '从零开始学习投资理财，掌握基本概念和投资原则。'
      }
    }),
    prisma.course.upsert({
      where: { slug: 'candlestick-patterns' },
      update: {},
      create: {
        title: 'K线图形态分析',
        slug: 'candlestick-patterns',
        description: '学习如何读懂K线图，识别关键的价格形态',
        excerpt: '掌握K线图的基本知识，学会识别常见的看涨和看跌形态。',
        content: `# K线图形态分析

## K线的基本构成

每根K线包含四个关键价格信息：
- **开盘价** - 时间段开始时的价格
- **收盘价** - 时间段结束时的价格  
- **最高价** - 时间段内的最高价格
- **最低价** - 时间段内的最低价格

## 基本K线形态

### 看涨形态
1. **锤子线** - 下影线很长，实体很小
2. **早晨之星** - 三根K线组合，暗示反转
3. **吞没形态** - 大阳线吞没前一根阴线

### 看跌形态
1. **流星线** - 上影线很长，实体很小
2. **黄昏之星** - 三根K线组合，暗示见顶
3. **乌云盖顶** - 阴线覆盖前一根阳线

## 实战应用注意事项

- K线形态需要结合成交量分析
- 单独的形态可靠性有限
- 要在趋势背景下分析形态
- 设置止损位控制风险`,
        categoryId: categories[1].id,
        difficulty: Difficulty.INTERMEDIATE,
        duration: 45,
        order: 1,
        isPublished: true,
        metaTitle: 'K线图形态分析教程 - 技术分析基础',
        metaDescription: '学习K线图的基本知识，掌握常见的看涨看跌形态识别方法。'
      }
    })
  ])

  console.log('✅ 示例课程创建完成')

  // 创建管理员用户
  const adminPassword = await hash('admin123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smartfin.tech' },
    update: {},
    create: {
      email: 'admin@smartfin.tech',
      name: 'SmartFin Admin',
      password: adminPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date()
    }
  })

  console.log('✅ 管理员用户创建完成')

  // 创建示例符号
  const symbols = await Promise.all([
    prisma.symbol.upsert({
      where: { symbol: 'AAPL' },
      update: {},
      create: {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        exchange: 'NASDAQ',
        type: AssetType.STOCK,
        currency: 'USD',
        description: '苹果公司 - 全球领先的科技公司',
        sector: 'Technology',
        industry: 'Consumer Electronics'
      }
    }),
    prisma.symbol.upsert({
      where: { symbol: 'MSFT' },
      update: {},
      create: {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        exchange: 'NASDAQ',
        type: AssetType.STOCK,
        currency: 'USD',
        description: '微软公司 - 全球最大的软件公司之一',
        sector: 'Technology',
        industry: 'Software'
      }
    }),
    prisma.symbol.upsert({
      where: { symbol: 'BTC-USD' },
      update: {},
      create: {
        symbol: 'BTC-USD',
        name: 'Bitcoin',
        exchange: 'CRYPTO',
        type: AssetType.CRYPTO,
        currency: 'USD',
        description: '比特币 - 首个去中心化数字货币'
      }
    }),
    prisma.symbol.upsert({
      where: { symbol: '^GSPC' },
      update: {},
      create: {
        symbol: '^GSPC',
        name: 'S&P 500',
        exchange: 'INDEX',
        type: AssetType.INDEX,
        currency: 'USD',
        description: '标准普尔500指数 - 美国股市基准指数'
      }
    })
  ])

  console.log('✅ 示例符号创建完成')

  // 关联课程和标签
  await prisma.course.update({
    where: { id: courses[0].id },
    data: {
      tags: {
        connect: [
          { id: tags[0].id }, // 新手入门
          { id: tags[1].id }  // 股票投资
        ]
      }
    }
  })

  await prisma.course.update({
    where: { id: courses[1].id },
    data: {
      tags: {
        connect: [
          { id: tags[2].id }, // K线图
          { id: tags[3].id }  // 技术指标
        ]
      }
    }
  })

  console.log('✅ 课程标签关联完成')

  console.log('🎉 数据库种子数据填充完成！')
  console.log('👤 管理员账号: admin@smartfin.tech')
  console.log('🔑 管理员密码: admin123456')
}

main()
  .catch((e) => {
    console.error('❌ 种子数据填充失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })