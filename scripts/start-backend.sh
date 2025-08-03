#!/bin/bash
echo "🚀 启动 SmartFin Tech 后端服务..."
cd /Users/shuggg/Projects/TradingView-Official-Demo/backend
source venv/bin/activate
uvicorn app.main_simple:app --host 0.0.0.0 --port 3456 --reload