from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 创建FastAPI应用
app = FastAPI(
    title="SmartFin Tech API",
    description="企业级金融数据分析平台 - TradingView申请专用",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8456", "http://127.0.0.1:8456"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 根路径
@app.get("/")
async def root():
    return {
        "message": "欢迎使用 SmartFin Tech API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "status": "运行中"
    }

# 健康检查
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "SmartFin Tech API"}

# 市场数据API (示例)
@app.get("/api/v1/market/symbols/{symbol}")
async def get_symbol_data(symbol: str):
    # 返回模拟数据
    return {
        "symbol": symbol,
        "name": f"{symbol} Corp",
        "price": 150.25,
        "change": 2.35,
        "change_percent": 1.59,
        "volume": 1250000,
        "updated_at": "2024-01-01T12:00:00Z"
    }

@app.get("/api/v1/market/trending")
async def get_trending():
    return {
        "trending": [
            {"symbol": "AAPL", "name": "Apple Inc.", "price": 175.43, "change_percent": 1.36},
            {"symbol": "MSFT", "name": "Microsoft Corp", "price": 384.52, "change_percent": -0.32},
            {"symbol": "GOOGL", "name": "Alphabet Inc.", "price": 142.87, "change_percent": 2.30},
        ]
    }