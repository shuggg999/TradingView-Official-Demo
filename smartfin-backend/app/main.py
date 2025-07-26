from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.redis import redis_client
from app.api.v1 import auth, market, users

# 创建FastAPI应用
app = FastAPI(
    title=settings.APP_NAME,
    description="企业级金融数据分析平台 - TradingView申请专用",
    version=settings.VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 启动事件
@app.on_event("startup")
async def startup_event():
    """应用启动时执行"""
    await redis_client.connect()
    print(f"🚀 {settings.APP_NAME} started on port {settings.PORT}")

# 关闭事件
@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭时执行"""
    await redis_client.disconnect()
    print("👋 Application shutdown")

# API路由
app.include_router(auth.router, prefix="/api/v1/auth", tags=["认证"])
app.include_router(users.router, prefix="/api/v1/users", tags=["用户"])
app.include_router(market.router, prefix="/api/v1/market", tags=["市场数据"])

# 根路径
@app.get("/")
async def root():
    return {
        "message": f"欢迎使用 {settings.APP_NAME}",
        "version": settings.VERSION,
        "docs": "/api/docs",
        "status": "运行中"
    }

# 健康检查
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "SmartFin Tech API"}