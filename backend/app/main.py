from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import time
import logging

from app.core.config import settings
from app.routers import auth
# from app.api.v1 import market, users  # 暂时注释掉，稍后实现

# 设置日志
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用程序生命周期管理"""
    # 启动时执行
    logger.info("🚀 SmartFin Technology Platform API 启动中...")
    
    # 检查数据库连接
    try:
        from app.core.database import engine
        with engine.connect() as conn:
            logger.info("✅ 数据库连接成功")
    except Exception as e:
        logger.error(f"❌ 数据库连接失败: {e}")
        raise
    
    # 检查Redis连接
    try:
        from app.services.redis_service import redis_service
        await redis_service.ping()
        logger.info("✅ Redis连接成功")
    except Exception as e:
        logger.error(f"❌ Redis连接失败: {e}")
        raise
    
    logger.info("🎉 SmartFin API 启动完成")
    
    yield
    
    # 关闭时执行
    logger.info("🛑 SmartFin API 正在关闭...")


# 创建FastAPI应用
app = FastAPI(
    title="SmartFin Technology Platform API",
    description="""
    ## SmartFin 企业级金融数据平台 API
    
    专业的金融数据分析与投资者教育平台，符合TradingView Advanced Charts申请标准。
    
    ### 主要功能
    
    * **用户认证系统** - 注册、登录、邮箱验证、OAuth集成
    * **会话管理** - 多设备会话、自动刷新、安全登出
    * **密码安全** - 强度验证、安全重置、加密存储
    * **权限控制** - 基于角色的访问控制、API权限管理
    * **审计日志** - 完整的用户行为追踪和安全监控
    
    ### 安全特性
    
    * JWT令牌认证
    * bcrypt密码加密
    * 登录速率限制
    * SQL注入防护
    * XSS和CSRF防护
    
    ### 技术架构
    
    * FastAPI + PostgreSQL + Redis
    * 异步处理和高性能
    * RESTful API设计
    * 完整的错误处理
    """,
    version=settings.VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# ==================== 中间件配置 ====================

# CORS中间件 - 允许前端跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS + ["*"] if settings.DEBUG else settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=[
        "Authorization", 
        "Content-Type", 
        "Accept",
        "Origin",
        "User-Agent",
        "DNT",
        "Cache-Control",
        "X-Mx-ReqToken",
        "Keep-Alive",
        "X-Requested-With",
        "X-CSRF-Token"
    ],
)

# 受信任主机中间件（生产环境安全）
if not settings.DEBUG:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["localhost", "127.0.0.1", "*.smartfin.tech", "smartfin.tech"]
    )


# 请求时间记录中间件
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """记录API请求处理时间"""
    start_time = time.time()
    
    # 记录请求信息
    logger.info(f"📨 {request.method} {request.url.path} - {request.client.host}")
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # 添加处理时间头部
        response.headers["X-Process-Time"] = str(process_time)
        
        # 记录响应信息
        logger.info(f"✅ {request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s")
        
        return response
        
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(f"❌ {request.method} {request.url.path} - Error: {str(e)} - {process_time:.3f}s")
        raise


# ==================== 异常处理器 ====================

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """HTTP异常处理器"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail if isinstance(exc.detail, str) else exc.detail.get("error", "未知错误"),
            "error_code": exc.detail.get("error_code", "HTTP_ERROR") if isinstance(exc.detail, dict) else "HTTP_ERROR",
            "status_code": exc.status_code,
            "path": request.url.path,
            "method": request.method,
            "timestamp": time.time()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """通用异常处理器"""
    logger.error(f"未处理的异常: {type(exc).__name__}: {str(exc)}")
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "服务器内部错误" if not settings.DEBUG else str(exc),
            "error_code": "INTERNAL_SERVER_ERROR",
            "status_code": 500,
            "path": request.url.path,
            "method": request.method,
            "timestamp": time.time()
        }
    )


# ==================== 路由注册 ====================

# 注册认证路由
app.include_router(auth.router)

# TODO: 稍后添加其他路由
# app.include_router(users.router, prefix="/api/v1/users", tags=["用户"])
# app.include_router(market.router, prefix="/api/v1/market", tags=["市场数据"])

# ==================== 根路径和健康检查 ====================

@app.get("/")
async def root():
    """API根路径"""
    return {
        "message": "🚀 Welcome to SmartFin Technology Platform API",
        "version": settings.VERSION,
        "status": "running",
        "docs": "/docs" if settings.DEBUG else "Documentation available in development mode",
        "environment": "development" if settings.DEBUG else "production",
        "features": [
            "User Authentication & Authorization",
            "JWT Token Management", 
            "OAuth Integration (Google, GitHub)",
            "Password Security & Validation",
            "Session Management",
            "Audit Logging",
            "Rate Limiting",
            "Email Verification"
        ]
    }


@app.get("/health")
async def health_check():
    """系统健康检查"""
    try:
        # 检查数据库连接
        from app.core.database import engine
        with engine.connect() as conn:
            db_status = "healthy"
    except Exception as e:
        logger.error(f"数据库健康检查失败: {e}")
        db_status = "unhealthy"
    
    try:
        # 检查Redis连接
        from app.services.redis_service import redis_service
        await redis_service.ping()
        redis_status = "healthy"
    except Exception as e:
        logger.error(f"Redis健康检查失败: {e}")
        redis_status = "unhealthy"
    
    overall_status = "healthy" if db_status == "healthy" and redis_status == "healthy" else "degraded"
    
    return {
        "status": overall_status,
        "version": settings.VERSION,
        "timestamp": time.time(),
        "services": {
            "database": db_status,
            "redis": redis_status,
            "api": "healthy"
        },
        "uptime": "Running since startup"
    }


if __name__ == "__main__":
    import uvicorn
    
    logger.info(f"🌟 启动 SmartFin API 服务器...")
    logger.info(f"📍 地址: http://{settings.HOST}:{settings.PORT}")
    logger.info(f"📖 API文档: http://{settings.HOST}:{settings.PORT}/docs")
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )