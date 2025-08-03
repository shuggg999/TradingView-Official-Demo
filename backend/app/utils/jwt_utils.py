"""
JWT Token Management Utilities for SmartFin Technology Platform
Implements secure JWT token generation and validation
Based on the design specification in docs/specs/user-auth/design.md
"""

from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional, Tuple
from jose import JWTError, jwt
from app.core.config import settings
import secrets


class JWTManager:
    """JWT管理器 - 处理访问令牌和刷新令牌的生成与验证"""
    
    def __init__(self):
        self.access_token_secret = settings.SECRET_KEY
        self.refresh_token_secret = f"{settings.SECRET_KEY}_refresh"
        self.algorithm = settings.ALGORITHM
        self.access_token_expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
        self.refresh_token_expire_days = 30
        self.issuer = "smartfin.tech"
        self.audience = "smartfin-app"
    
    def generate_token_pair(
        self, 
        user_id: str, 
        email: str, 
        role: str,
        permissions: list = None
    ) -> Dict[str, Any]:
        """生成访问令牌和刷新令牌对"""
        # 生成唯一的会话ID
        session_id = secrets.token_urlsafe(32)
        
        # 准备令牌payload
        now = datetime.now(timezone.utc)
        
        # 访问令牌payload
        access_payload = {
            "sub": user_id,  # Subject (用户ID)
            "email": email,
            "role": role,
            "permissions": permissions or [],
            "session_id": session_id,
            "type": "access",
            "iat": now,
            "exp": now + timedelta(minutes=self.access_token_expire_minutes),
            "iss": self.issuer,
            "aud": self.audience
        }
        
        # 刷新令牌payload（包含更少的信息）
        refresh_payload = {
            "sub": user_id,
            "session_id": session_id,
            "type": "refresh",
            "iat": now,
            "exp": now + timedelta(days=self.refresh_token_expire_days),
            "iss": self.issuer,
            "aud": self.audience
        }
        
        # 生成令牌
        access_token = jwt.encode(
            access_payload, 
            self.access_token_secret, 
            algorithm=self.algorithm
        )
        
        refresh_token = jwt.encode(
            refresh_payload, 
            self.refresh_token_secret, 
            algorithm=self.algorithm
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer",
            "expires_in": self.access_token_expire_minutes * 60,  # 秒数
            "expires_at": access_payload["exp"],
            "session_id": session_id
        }
    
    def verify_access_token(self, token: str) -> Optional[Dict[str, Any]]:
        """验证访问令牌"""
        try:
            payload = jwt.decode(
                token,
                self.access_token_secret,
                algorithms=[self.algorithm],
                issuer=self.issuer,
                audience=self.audience,
                options={"verify_exp": True}
            )
            
            # 验证令牌类型
            if payload.get("type") != "access":
                return None
            
            return payload
            
        except JWTError as e:
            print(f"访问令牌验证失败: {e}")
            return None
    
    def verify_refresh_token(self, token: str) -> Optional[Dict[str, Any]]:
        """验证刷新令牌"""
        try:
            payload = jwt.decode(
                token,
                self.refresh_token_secret,
                algorithms=[self.algorithm],
                issuer=self.issuer,
                audience=self.audience,
                options={"verify_exp": True}
            )
            
            # 验证令牌类型
            if payload.get("type") != "refresh":
                return None
            
            return payload
            
        except JWTError as e:
            print(f"刷新令牌验证失败: {e}")
            return None
    
    def refresh_access_token(
        self, 
        refresh_token: str, 
        user_data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """使用刷新令牌生成新的访问令牌"""
        # 验证刷新令牌
        refresh_payload = self.verify_refresh_token(refresh_token)
        if not refresh_payload:
            return None
        
        # 验证用户ID匹配
        if refresh_payload.get("sub") != user_data["user_id"]:
            return None
        
        # 生成新的访问令牌
        now = datetime.now(timezone.utc)
        
        access_payload = {
            "sub": user_data["user_id"],
            "email": user_data["email"],
            "role": user_data["role"],
            "permissions": user_data.get("permissions", []),
            "session_id": refresh_payload["session_id"],  # 保持相同的会话ID
            "type": "access",
            "iat": now,
            "exp": now + timedelta(minutes=self.access_token_expire_minutes),
            "iss": self.issuer,
            "aud": self.audience
        }
        
        access_token = jwt.encode(
            access_payload, 
            self.access_token_secret, 
            algorithm=self.algorithm
        )
        
        return {
            "access_token": access_token,
            "token_type": "Bearer",
            "expires_in": self.access_token_expire_minutes * 60,
            "expires_at": access_payload["exp"]
        }
    
    def decode_token_without_verification(self, token: str) -> Optional[Dict[str, Any]]:
        """解码令牌但不验证（仅用于调试或获取过期令牌信息）"""
        try:
            return jwt.decode(
                token,
                options={"verify_signature": False, "verify_exp": False}
            )
        except JWTError:
            return None
    
    def create_email_verification_token(self, user_id: str, email: str) -> str:
        """创建邮箱验证令牌"""
        payload = {
            "sub": user_id,
            "email": email,
            "type": "email_verification",
            "exp": datetime.now(timezone.utc) + timedelta(hours=24),
            "iss": self.issuer
        }
        
        return jwt.encode(
            payload, 
            self.access_token_secret, 
            algorithm=self.algorithm
        )
    
    def verify_email_verification_token(self, token: str) -> Optional[Dict[str, Any]]:
        """验证邮箱验证令牌"""
        try:
            payload = jwt.decode(
                token,
                self.access_token_secret,
                algorithms=[self.algorithm],
                issuer=self.issuer,
                options={"verify_exp": True}
            )
            
            if payload.get("type") != "email_verification":
                return None
            
            return payload
            
        except JWTError:
            return None
    
    def create_password_reset_token(self, user_id: str, email: str) -> str:
        """创建密码重置令牌"""
        payload = {
            "sub": user_id,
            "email": email,
            "type": "password_reset",
            "exp": datetime.now(timezone.utc) + timedelta(hours=1),
            "iss": self.issuer,
            "jti": secrets.token_urlsafe(16)  # 唯一令牌ID，防止重复使用
        }
        
        return jwt.encode(
            payload, 
            self.access_token_secret, 
            algorithm=self.algorithm
        )
    
    def verify_password_reset_token(self, token: str) -> Optional[Dict[str, Any]]:
        """验证密码重置令牌"""
        try:
            payload = jwt.decode(
                token,
                self.access_token_secret,
                algorithms=[self.algorithm],
                issuer=self.issuer,
                options={"verify_exp": True}
            )
            
            if payload.get("type") != "password_reset":
                return None
            
            return payload
            
        except JWTError:
            return None
    
    def extract_token_from_header(self, authorization: str) -> Optional[str]:
        """从Authorization头部提取令牌"""
        if not authorization:
            return None
        
        parts = authorization.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return None
        
        return parts[1]
    
    def get_token_expiry_time(self, token: str) -> Optional[datetime]:
        """获取令牌过期时间"""
        payload = self.decode_token_without_verification(token)
        if not payload or "exp" not in payload:
            return None
        
        return datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
    
    def is_token_expired(self, token: str) -> bool:
        """检查令牌是否已过期"""
        expiry = self.get_token_expiry_time(token)
        if not expiry:
            return True
        
        return datetime.now(timezone.utc) > expiry


# 创建全局JWT管理器实例
jwt_manager = JWTManager()