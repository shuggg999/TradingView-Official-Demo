#!/bin/bash

echo "🚀 部署 SmartFin 生产环境..."

# 检查环境变量
if [ ! -f ".env" ]; then
    echo "❌ 请先创建 .env 文件"
    exit 1
fi

# 构建和启动生产环境
echo "🏗️ 构建生产镜像..."
docker-compose build --no-cache

echo "🚀 启动生产服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 健康检查
echo "🔍 健康检查..."
if curl -f http://localhost:3456/health; then
    echo "✅ 后端服务正常"
else
    echo "❌ 后端服务异常"
    exit 1
fi

if curl -f http://localhost:3000; then
    echo "✅ 前端服务正常"
else
    echo "❌ 前端服务异常"
    exit 1
fi

echo ""
echo "✅ SmartFin 生产环境部署完成！"
echo ""
echo "🌐 访问地址:"
echo "   - 前端应用: http://localhost:3000"
echo "   - 后端API: http://localhost:3456"
echo "   - API文档: http://localhost:3456/api/docs"
echo ""
echo "📊 查看日志: docker-compose logs -f"
echo "🛑 停止服务: docker-compose down"