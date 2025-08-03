from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # 应用配置
    APP_NAME: str = "SmartFin Tech API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # 服务器配置
    HOST: str = "0.0.0.0"
    PORT: int = 3456
    
    # 数据库配置 - SmartFin 专用数据库
    DATABASE_URL: str = "postgresql://smartfin:dev_password@localhost:5433/smartfin_dev"
    
    # Redis配置 - 使用现有Docker Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT配置
    SECRET_KEY: str = "smartfin-tech-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS配置
    ALLOWED_ORIGINS: list[str] = ["http://localhost:8456", "http://127.0.0.1:8456"]
    
    # 外部API配置
    YAHOO_FINANCE_BASE_URL: str = "https://query1.finance.yahoo.com"
    
    class Config:
        env_file = ".env"

settings = Settings()