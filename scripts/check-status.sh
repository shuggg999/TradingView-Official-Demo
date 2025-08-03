#!/bin/bash

echo "🔍 检查 SmartFin Tech 服务状态..."
echo ""

# 检查后端服务
echo "📊 后端服务 (http://localhost:3456):"
if curl -s http://localhost:3456/health > /dev/null; then
    echo "✅ 后端服务正常运行"
    echo "📚 API文档: http://localhost:3456/api/docs"
else
    echo "❌ 后端服务未运行"
    echo "启动命令: ./scripts/start-backend.sh"
fi

echo ""

# 检查前端服务  
echo "🖥️ 前端服务:"
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ 前端服务运行在 http://localhost:3000"
else
    echo "❌ 前端服务未运行"
    echo "启动命令: npm run dev"
fi

echo ""
echo "🌐 访问地址总结:"
echo "   - 企业官网: http://localhost:3000"
echo "   - API服务: http://localhost:3456"
echo "   - API文档: http://localhost:3456/api/docs"
echo ""
echo "✨ SmartFin Tech - 企业级金融数据分析平台已就绪！"