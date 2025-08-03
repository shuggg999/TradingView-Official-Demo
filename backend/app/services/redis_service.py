"""
Redis Cache Service for SmartFin Technology Platform
Implements session caching, rate limiting, and email verification caching
Based on the technical design specification in docs/specs/user-auth/design.md
"""

import json
import redis
from typing import Dict, Any, Optional, Union
from datetime import datetime, timedelta
from app.core.config import settings


class RedisService:
    """Redis服务类 - 管理缓存、会话和速率限制"""
    
    def __init__(self):
        self.redis_client = redis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            encoding='utf-8'
        )
    
    async def ping(self) -> bool:
        """检查Redis连接状态"""
        try:
            self.redis_client.ping()
            return True
        except Exception as e:
            print(f"Redis ping失败: {e}")
            return False
    
    # ==================== 会话缓存管理 ====================
    
    async def set_user_session(
        self, 
        session_id: str, 
        user_data: Dict[str, Any], 
        ttl_seconds: int = 7200  # 2小时默认过期
    ) -> bool:
        """设置用户会话缓存"""
        try:
            session_key = f"user:session:{session_id}"
            session_data = {
                "userId": user_data["user_id"],
                "email": user_data["email"],
                "role": user_data["role"],
                "permissions": user_data.get("permissions", []),
                "lastAccessed": datetime.utcnow().isoformat(),
                "expiresAt": (datetime.utcnow() + timedelta(seconds=ttl_seconds)).isoformat()
            }
            
            # 设置会话数据
            self.redis_client.setex(
                session_key, 
                ttl_seconds, 
                json.dumps(session_data)
            )
            
            # 添加到用户活跃会话列表
            await self._add_to_user_sessions(user_data["user_id"], session_id)
            
            return True
        except Exception as e:
            print(f"设置用户会话失败: {e}")
            return False
    
    async def get_user_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """获取用户会话数据"""
        try:
            session_key = f"user:session:{session_id}"
            session_data = self.redis_client.get(session_key)
            
            if session_data:
                data = json.loads(session_data)
                
                # 更新最后访问时间（滑动过期）
                data["lastAccessed"] = datetime.utcnow().isoformat()
                self.redis_client.setex(
                    session_key, 
                    7200,  # 重置2小时过期时间
                    json.dumps(data)
                )
                
                return data
            return None
        except Exception as e:
            print(f"获取用户会话失败: {e}")
            return None
    
    async def delete_user_session(self, session_id: str, user_id: str = None) -> bool:
        """删除用户会话"""
        try:
            session_key = f"user:session:{session_id}"
            
            # 如果提供了user_id，从用户会话列表中移除
            if user_id:
                await self._remove_from_user_sessions(user_id, session_id)
            
            self.redis_client.delete(session_key)
            return True
        except Exception as e:
            print(f"删除用户会话失败: {e}")
            return False
    
    async def _add_to_user_sessions(self, user_id: str, session_id: str):
        """添加会话ID到用户会话列表"""
        sessions_key = f"user:sessions:{user_id}"
        self.redis_client.sadd(sessions_key, session_id)
        self.redis_client.expire(sessions_key, 30 * 24 * 3600)  # 30天过期
    
    async def _remove_from_user_sessions(self, user_id: str, session_id: str):
        """从用户会话列表中移除会话ID"""
        sessions_key = f"user:sessions:{user_id}"
        self.redis_client.srem(sessions_key, session_id)
    
    async def get_user_active_sessions(self, user_id: str) -> list:
        """获取用户所有活跃会话"""
        sessions_key = f"user:sessions:{user_id}"
        session_ids = self.redis_client.smembers(sessions_key)
        
        active_sessions = []
        for session_id in session_ids:
            session_data = await self.get_user_session(session_id)
            if session_data:
                active_sessions.append({
                    "sessionId": session_id,
                    **session_data
                })
        
        return active_sessions
    
    async def clear_user_all_sessions(self, user_id: str) -> bool:
        """清除用户所有会话"""
        try:
            sessions_key = f"user:sessions:{user_id}"
            session_ids = self.redis_client.smembers(sessions_key)
            
            # 删除所有会话
            for session_id in session_ids:
                session_key = f"user:session:{session_id}"
                self.redis_client.delete(session_key)
            
            # 清空会话列表
            self.redis_client.delete(sessions_key)
            return True
        except Exception as e:
            print(f"清除用户所有会话失败: {e}")
            return False
    
    # ==================== 速率限制 ====================
    
    async def check_rate_limit(
        self, 
        key: str, 
        max_attempts: int, 
        window_seconds: int,
        block_duration_seconds: int = None
    ) -> Dict[str, Union[bool, int]]:
        """检查速率限制"""
        try:
            rate_limit_key = f"rate_limit:{key}"
            current_time = datetime.utcnow()
            
            # 检查是否被封禁
            block_key = f"{rate_limit_key}:blocked"
            block_end = self.redis_client.get(block_key)
            if block_end:
                block_end_time = datetime.fromisoformat(block_end)
                if current_time < block_end_time:
                    return {
                        "allowed": False,
                        "remaining": 0,
                        "resetTime": int(block_end_time.timestamp()),
                        "blocked": True
                    }
            
            # 获取当前窗口内的尝试次数
            window_start = current_time - timedelta(seconds=window_seconds)
            
            # 使用有序集合存储时间戳
            pipe = self.redis_client.pipeline()
            pipe.zremrangebyscore(rate_limit_key, 0, window_start.timestamp())
            pipe.zcard(rate_limit_key)
            pipe.zadd(rate_limit_key, {str(current_time.timestamp()): current_time.timestamp()})
            pipe.expire(rate_limit_key, window_seconds)
            
            results = pipe.execute()
            attempts_count = results[1]
            
            if attempts_count >= max_attempts:
                # 超过限制，设置封禁
                if block_duration_seconds:
                    block_until = current_time + timedelta(seconds=block_duration_seconds)
                    self.redis_client.setex(
                        block_key, 
                        block_duration_seconds, 
                        block_until.isoformat()
                    )
                
                return {
                    "allowed": False,
                    "remaining": 0,
                    "resetTime": int((current_time + timedelta(seconds=window_seconds)).timestamp()),
                    "blocked": bool(block_duration_seconds)
                }
            
            return {
                "allowed": True,
                "remaining": max_attempts - attempts_count - 1,
                "resetTime": int((current_time + timedelta(seconds=window_seconds)).timestamp()),
                "blocked": False
            }
            
        except Exception as e:
            print(f"速率限制检查失败: {e}")
            # 失败时允许请求（fail-open策略）
            return {
                "allowed": True,
                "remaining": max_attempts - 1,
                "resetTime": int((current_time + timedelta(seconds=window_seconds)).timestamp()),
                "blocked": False
            }
    
    async def check_login_rate_limit(self, email: str) -> Dict[str, Union[bool, int]]:
        """检查登录速率限制"""
        return await self.check_rate_limit(
            key=f"login:{email}",
            max_attempts=5,
            window_seconds=15 * 60,  # 15分钟窗口
            block_duration_seconds=15 * 60  # 封禁15分钟
        )
    
    async def check_api_rate_limit(self, ip_address: str, endpoint: str) -> Dict[str, Union[bool, int]]:
        """检查API速率限制"""
        return await self.check_rate_limit(
            key=f"api:{ip_address}:{endpoint}",
            max_attempts=10,
            window_seconds=60  # 1分钟窗口
        )
    
    # ==================== 邮件验证缓存 ====================
    
    async def set_email_verification_code(
        self, 
        email: str, 
        code: str, 
        ttl_seconds: int = 24 * 3600  # 24小时
    ) -> bool:
        """设置邮箱验证码"""
        try:
            verification_key = f"email:verification:{email}"
            verification_data = {
                "code": code,
                "attempts": 0,
                "createdAt": datetime.utcnow().isoformat()
            }
            
            self.redis_client.setex(
                verification_key, 
                ttl_seconds, 
                json.dumps(verification_data)
            )
            return True
        except Exception as e:
            print(f"设置邮箱验证码失败: {e}")
            return False
    
    async def verify_email_code(self, email: str, code: str, max_attempts: int = 3) -> Dict[str, Any]:
        """验证邮箱验证码"""
        try:
            verification_key = f"email:verification:{email}"
            verification_data = self.redis_client.get(verification_key)
            
            if not verification_data:
                return {
                    "valid": False,
                    "error": "验证码不存在或已过期"
                }
            
            data = json.loads(verification_data)
            
            # 检查尝试次数
            if data["attempts"] >= max_attempts:
                return {
                    "valid": False,
                    "error": "验证码尝试次数过多"
                }
            
            # 验证码匹配
            if data["code"] == code:
                # 验证成功，删除验证码
                self.redis_client.delete(verification_key)
                return {
                    "valid": True,
                    "message": "邮箱验证成功"
                }
            else:
                # 验证失败，增加尝试次数
                data["attempts"] += 1
                ttl = self.redis_client.ttl(verification_key)
                self.redis_client.setex(
                    verification_key, 
                    ttl if ttl > 0 else 3600, 
                    json.dumps(data)
                )
                
                return {
                    "valid": False,
                    "error": f"验证码错误，剩余尝试次数: {max_attempts - data['attempts']}"
                }
                
        except Exception as e:
            print(f"验证邮箱验证码失败: {e}")
            return {
                "valid": False,
                "error": "验证过程出错"
            }
    
    # ==================== 密码重置令牌缓存 ====================
    
    async def set_password_reset_token(
        self, 
        token: str, 
        user_id: str, 
        email: str,
        ttl_seconds: int = 3600  # 1小时
    ) -> bool:
        """设置密码重置令牌"""
        try:
            reset_key = f"password:reset:{token}"
            reset_data = {
                "userId": user_id,
                "email": email,
                "createdAt": datetime.utcnow().isoformat()
            }
            
            self.redis_client.setex(
                reset_key, 
                ttl_seconds, 
                json.dumps(reset_data)
            )
            return True
        except Exception as e:
            print(f"设置密码重置令牌失败: {e}")
            return False
    
    async def get_password_reset_token(self, token: str) -> Optional[Dict[str, Any]]:
        """获取密码重置令牌数据"""
        try:
            reset_key = f"password:reset:{token}"
            reset_data = self.redis_client.get(reset_key)
            
            if reset_data:
                return json.loads(reset_data)
            return None
        except Exception as e:
            print(f"获取密码重置令牌失败: {e}")
            return None
    
    async def delete_password_reset_token(self, token: str) -> bool:
        """删除密码重置令牌"""
        try:
            reset_key = f"password:reset:{token}"
            self.redis_client.delete(reset_key)
            return True
        except Exception as e:
            print(f"删除密码重置令牌失败: {e}")
            return False
    
    # ==================== 通用缓存操作 ====================
    
    async def set_cache(self, key: str, value: Any, ttl_seconds: int = 3600) -> bool:
        """设置缓存数据"""
        try:
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            
            self.redis_client.setex(key, ttl_seconds, value)
            return True
        except Exception as e:
            print(f"设置缓存失败: {e}")
            return False
    
    async def get_cache(self, key: str) -> Optional[Any]:
        """获取缓存数据"""
        try:
            value = self.redis_client.get(key)
            if value:
                try:
                    # 尝试解析JSON
                    return json.loads(value)
                except json.JSONDecodeError:
                    # 如果不是JSON，返回原始字符串
                    return value
            return None
        except Exception as e:
            print(f"获取缓存失败: {e}")
            return None
    
    async def delete_cache(self, key: str) -> bool:
        """删除缓存数据"""
        try:
            self.redis_client.delete(key)
            return True
        except Exception as e:
            print(f"删除缓存失败: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """检查键是否存在"""
        try:
            return bool(self.redis_client.exists(key))
        except Exception as e:
            print(f"检查键存在失败: {e}")
            return False
    
    async def set_ttl(self, key: str, ttl_seconds: int) -> bool:
        """设置键的过期时间"""
        try:
            return bool(self.redis_client.expire(key, ttl_seconds))
        except Exception as e:
            print(f"设置TTL失败: {e}")
            return False


# 全局Redis服务实例
redis_service = RedisService()