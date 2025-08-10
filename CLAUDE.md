# SmartFin Tech - 金融数据展示平台

## 🎯 项目概述

**项目名称**: SmartFin Technology Platform  
**项目定位**: 现代化金融数据展示与投资者教育平台  
**核心目标**: 建立符合TradingView Advanced Charts申请标准的专业金融服务前端应用

### 关键特性
- **现代化设计**: 参考专业金融平台的设计标准
- **Next.js 全栈**: 基于Next.js 15的完整前端应用
- **双主题支持**: 白色主题（专业简洁）+ 黑色主题（护眼专业）
- **完整功能**: 用户系统、市场数据、教育内容、API接口

## 📁 项目结构

```
TradingView-Official-Demo/
├── frontend/                              # Next.js 前端应用
│   ├── src/
│   │   ├── app/                          # Next.js 15 App Router
│   │   │   ├── api/                      # API Routes (服务端API)
│   │   │   ├── (auth)/                   # 认证页面
│   │   │   ├── dashboard/                # 仪表板
│   │   │   ├── market/                   # 市场数据
│   │   │   ├── education/                # 教育内容
│   │   │   └── trading/                  # 交易功能
│   │   ├── components/                   # React组件
│   │   ├── hooks/                        # 自定义Hooks
│   │   ├── lib/                          # 工具函数和服务
│   │   └── store/                        # 状态管理
│   ├── prisma/                          # 数据库模型
│   ├── public/                          # 静态资源
│   └── package.json                     # 前端依赖
├── docker-compose.yml                    # Docker服务配置
├── .env.example                         # 环境变量模板
├── .gitignore                           # Git忽略文件
└── CLAUDE.md                            # 项目说明文档
```

## 🎨 设计系统

### 白色主题（专业简洁）
```css
主色调: #003366 (深蓝)
背景色: #FFFFFF (纯白)
文字色: #111827 (深灰)
强调色: #0066CC (亮蓝)
成功色: #00AA44 (绿)
警告色: #DD3333 (红)
```

### 黑色主题（护眼专业）
```css
主背景: #0a0a0a (深黑)
次背景: #1a1a1a (浅黑)
卡片色: #2a2a2a (灰黑)
文字色: #ffffff (纯白)
强调色: #0066cc (蓝)
成功色: #00dd88 (绿)
警告色: #ff4444 (红)
```

## 🏗️ 技术架构

### 前端技术栈
- **框架**: Next.js 15 (App Router) + TypeScript
- **样式**: Tailwind CSS + 自定义设计系统
- **组件**: shadcn/ui (深度定制) + Radix UI
- **图表**: TradingView Lightweight Charts → Advanced Charts
- **状态**: Zustand + TanStack Query
- **认证**: NextAuth.js
- **数据库**: Prisma + PostgreSQL
- **缓存**: Redis

### API架构
```
Next.js API Routes (/app/api/...)
├── 认证服务 (/api/auth/...)
├── 市场数据 (/api/market/...)  
├── 用户管理 (/api/user/...)
├── 教育内容 (/api/education/...)
└── 交易功能 (/api/trading/...)

数据层
├── PostgreSQL (主数据库)
│   ├── 用户信息
│   ├── 教育内容
│   ├── 系统配置
│   └── 交易记录
├── Redis (缓存层)
│   ├── 市场数据缓存
│   ├── 会话管理
│   └── API限流
└── 外部API
    ├── Yahoo Finance (免费数据)
    └── TradingView Charts
```

## 🚀 快速开始

### 开发环境配置

1. **安装依赖**
   ```bash
   cd frontend
   npm install
   ```

2. **环境变量配置**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 配置数据库连接等
   ```

3. **启动数据库服务**
   ```bash
   docker-compose up postgres redis -d
   ```

4. **数据库初始化**
   ```bash
   cd frontend
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   # 访问 http://localhost:3005
   ```

### 生产环境部署

1. **使用Docker部署**
   ```bash
   docker-compose up -d
   ```

2. **使用nginx proxy manager**
   - 部署应用到3005端口
   - 在nginx proxy manager中配置反向代理
   - 配置SSL证书

## 💼 功能特性

### 核心功能
- **用户认证系统**: 注册、登录、密码重置、邮箱验证
- **市场数据展示**: 实时股价、历史数据、技术指标
- **TradingView图表**: 专业级交互式图表
- **教育内容**: 投资学习课程、进度跟踪
- **交易模拟**: 虚拟交易、投资组合管理
- **个人面板**: 用户设置、学习统计、活动记录

### API功能
- **RESTful API**: 完整的API接口设计
- **实时数据**: WebSocket支持（规划中）
- **缓存优化**: Redis缓存提升性能
- **错误处理**: 统一的错误处理机制
- **日志系统**: Winston日志记录

## 🎯 开发规范

### 代码规范
```typescript
// 组件命名: PascalCase
const MarketDataCard: React.FC<Props> = ({ ... }) => {
  // Hook使用
  const { data, loading } = useMarketData();
  
  // 条件渲染
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="market-card">
      {/* JSX内容 */}
    </div>
  );
};

export default MarketDataCard;
```

### API设计规范
```typescript
// GET /api/market/[symbol]
export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const data = await fetchMarketData(params.symbol);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
```

### 文件命名规范
- 组件: `PascalCase.tsx`
- 页面: `page.tsx`, `layout.tsx`
- API: `route.ts`
- 工具: `camelCase.ts`
- 样式: `globals.css`

## 📋 环境变量

```bash
# 数据库连接
DATABASE_URL="postgresql://smartfin:dev_password@localhost:5433/smartfin_dev"

# Redis连接
REDIS_URL="redis://localhost:6379"

# 认证配置
NEXTAUTH_URL="http://localhost:3005"
NEXTAUTH_SECRET="your-secret-key"

# 外部API
YAHOO_FINANCE_API_KEY="your-api-key"
```

## 🔧 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build           # 构建生产版本
npm run start           # 启动生产服务器

# 数据库
npm run db:generate     # 生成Prisma客户端
npm run db:push         # 推送数据库模式
npm run db:migrate      # 运行迁移
npm run db:seed         # 填充测试数据
npm run db:studio       # 打开数据库管理界面

# 测试
npm run test            # 运行测试
npm run test:watch      # 监听模式测试
npm run test:coverage   # 生成测试覆盖率报告

# 代码质量
npm run lint            # 代码检查
npm run lint:fix        # 自动修复代码问题
```

## 📞 项目信息

**项目类型**: Next.js 前端应用  
**开发目的**: TradingView Advanced Charts申请  
**技术栈**: Next.js + TypeScript + Tailwind + Prisma  
**部署方式**: Docker + nginx proxy manager  

## 📝 更新日志

### v1.0.0 (2025-08-09)
- ✅ 项目架构简化为纯前端应用
- ✅ 删除不必要的后端FastAPI服务
- ✅ 简化Docker配置，专注前端部署
- ✅ 优化项目结构，便于维护
- ✅ 更新文档，明确项目定位

---

**最后更新**: 2025年8月9日  
**当前版本**: v1.0.0  
**项目状态**: 纯前端应用，准备部署