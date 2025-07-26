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
    echo "启动命令: cd smartfin-backend && source venv/bin/activate && uvicorn app.main_simple:app --host 0.0.0.0 --port 3456 --reload"
fi

echo ""

# 检查前端服务
echo "🖥️ 前端服务:"
if lsof -i :8456 > /dev/null 2>&1; then
    echo "✅ 前端服务运行在 http://localhost:8456"
elif lsof -i :8457 > /dev/null 2>&1; then
    echo "✅ 前端服务运行在 http://localhost:8457"
else
    echo "❌ 前端服务未运行"
    echo "启动命令: cd smartfin-frontend && npm run dev"
fi

echo ""
echo "🌐 访问地址总结:"
echo "   - 企业官网: http://localhost:8457 (或 8456)"
echo "   - API服务: http://localhost:3456"
echo "   - API文档: http://localhost:3456/api/docs"
echo ""
echo "✨ SmartFin Tech - 企业级金融数据分析平台已就绪！"