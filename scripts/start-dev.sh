#!/bin/bash

echo "🚀 启动 SmartFin 开发环境..."

# 启动数据库和Redis
echo "📊 启动数据库和缓存服务..."
docker-compose -f docker-compose.dev.yml up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查数据库连接
echo "🔍 检查数据库连接..."
until docker exec smartfin_postgres_dev pg_isready; do
  echo "等待 PostgreSQL 启动..."
  sleep 2
done

# 启动后端
echo "🐍 启动 FastAPI 后端..."
cd backend
if [ ! -d "venv" ]; then
    echo "创建 Python 虚拟环境..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main_simple:app --host 0.0.0.0 --port 3456 --reload &
BACKEND_PID=$!
cd ..

# 启动前端
echo "⚛️ 启动 Next.js 前端..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "安装 Node.js 依赖..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ SmartFin 开发环境启动完成！"
echo ""
echo "🌐 访问地址:"
echo "   - 前端应用: http://localhost:3005"
echo "   - 后端API: http://localhost:3456"
echo "   - API文档: http://localhost:3456/api/docs"
echo ""
echo "🛑 停止开发环境: Ctrl+C"

# 等待中断信号
trap 'echo "正在停止服务..."; kill $BACKEND_PID $FRONTEND_PID; docker-compose -f docker-compose.dev.yml down; exit 0' INT

wait