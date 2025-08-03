from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(200), nullable=True)
    company = Column(String(200), nullable=True)
    position = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    
    # 认证相关
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # 订阅计划
    subscription_plan = Column(String(20), default="FREE")  # FREE, BASIC, PRO, ENTERPRISE
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # 元数据
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    def __repr__(self):
        return f"<User {self.username}>"