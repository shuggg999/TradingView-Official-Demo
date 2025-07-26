# SmartFin Tech - 企业级金融数据分析平台

## 🚀 快速启动

### 1. 启动后端服务
```bash
# 进入后端目录
cd smartfin-backend

# 激活虚拟环境
source venv/bin/activate

# 启动简化版API服务（推荐）
uvicorn app.main_simple:app --host 0.0.0.0 --port 3456 --reload
```

### 2. 启动前端服务
```bash
# 新开终端，进入前端目录
cd smartfin-frontend

# 启动开发服务器
npm run dev
```

## 🌐 访问地址

- **前端网站**: http://localhost:8456
- **后端API**: http://localhost:3456
- **API文档**: http://localhost:3456/api/docs

## ⚡ 解决常见问题

### 前端TailwindCSS问题
如果前端启动报错，请确保：
1. @import 语句在 @tailwind 之前
2. PostCSS配置正确
3. 所有依赖已安装

### 后端依赖问题
如果后端报错缺少模块：
```bash
cd smartfin-backend
source venv/bin/activate
pip install email-validator pydantic-settings
```

## 🏗️ 项目结构

```
├── docs/                    # 设计文档
├── smartfin-backend/        # Python FastAPI 后端
├── smartfin-frontend/       # React TypeScript 前端
├── smartfin-edu/           # 之前的Next.js版本（参考）
└── ui-preview.html         # UI设计预览
```

## 🎯 TradingView申请就绪

此平台已完全符合TradingView Advanced Charts申请要求：
- ✅ 专业企业级界面设计
- ✅ 集成TradingView Lightweight Charts
- ✅ 完整的市场数据展示
- ✅ 企业信息和联系方式
- ✅ API接口文档完善