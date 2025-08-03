"""
User Authentication Models for SmartFin Technology Platform
Based on the technical design specification in docs/specs/user-auth/design.md
"""

from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, DateTime, Text, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

Base = declarative_base()


class Role(Base):
    """角色表 - 用户权限角色管理"""
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    role_name = Column(String(50), unique=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    description = Column(Text)
    permissions = Column(JSONB, default=list)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关系
    users = relationship("User", back_populates="role")


class User(Base):
    """用户表 - 核心用户信息"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255))  # 可为空，支持OAuth用户
    full_name = Column(String(100), nullable=False)
    avatar_url = Column(Text)
    phone = Column(String(20))
    bio = Column(Text)
    
    # 状态字段
    email_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    role_id = Column(Integer, ForeignKey("roles.id"), default=1)
    
    # OAuth字段
    oauth_provider = Column(String(50))  # 'google', 'github', null
    oauth_provider_id = Column(String(255))
    
    # 偏好设置
    preferences = Column(JSONB, default=dict)
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_login_at = Column(DateTime(timezone=True))
    
    # 约束
    __table_args__ = (
        CheckConstraint(
            "email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'",
            name="valid_email"
        ),
        CheckConstraint(
            "LENGTH(username) >= 3 AND LENGTH(username) <= 50",
            name="valid_username"
        ),
    )
    
    # 关系
    role = relationship("Role", back_populates="users")
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    password_reset_tokens = relationship("PasswordResetToken", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuthAuditLog", back_populates="user")


class UserSession(Base):
    """会话表 - 用户登录会话管理"""
    __tablename__ = "user_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_token = Column(String(255), unique=True, nullable=False)
    refresh_token = Column(Text, unique=True)  # 改为Text类型支持长JWT令牌
    device_info = Column(JSONB, default=dict)
    ip_address = Column(INET)
    user_agent = Column(Text)
    is_remember_me = Column(Boolean, default=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_accessed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关系
    user = relationship("User", back_populates="sessions")


class PasswordResetToken(Base):
    """密码重置表 - 密码重置令牌管理"""
    __tablename__ = "password_reset_tokens"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 约束
    __table_args__ = (
        CheckConstraint("expires_at > created_at", name="token_not_expired"),
    )
    
    # 关系
    user = relationship("User", back_populates="password_reset_tokens")


class AuthAuditLog(Base):
    """审计日志表 - 认证操作审计记录"""
    __tablename__ = "auth_audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    action = Column(String(100), nullable=False)  # 'login', 'logout', 'register', 'password_reset'
    result = Column(String(20), nullable=False)  # 'success', 'failure', 'blocked'
    ip_address = Column(INET)
    user_agent = Column(Text)
    details = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关系
    user = relationship("User", back_populates="audit_logs")