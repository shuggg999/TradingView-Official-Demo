"""
Authentication Service for SmartFin Technology Platform
Core authentication business logic implementation
Based on the technical design specification in docs/specs/user-auth/design.md
"""

from typing import Dict, Any, Optional, Tuple
from datetime import datetime, timedelta, timezone
from uuid import UUID
import secrets
import asyncio
from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.services.redis_service import redis_service
from app.utils.jwt_utils import jwt_manager
from app.utils.password_utils import hash_password, verify_password, password_validator
from app.models.auth import User, Role
from app.core.database import get_db


class AuthService:
    """认证服务类 - 处理所有认证相关的业务逻辑"""
    
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.redis = redis_service
        self.jwt = jwt_manager
    
    # ==================== 用户注册 ====================
    
    async def register_user(self, registration_data: Dict[str, Any]) -> Dict[str, Any]:
        """用户注册"""
        try:
            # 1. 验证输入数据
            validation_result = await self._validate_registration_data(registration_data)
            if not validation_result["valid"]:
                return {
                    "success": False,
                    "error": validation_result["error"],
                    "error_code": "VALIDATION_ERROR"
                }
            
            # 2. 检查邮箱是否已存在
            if await self.user_repo.check_email_exists(registration_data["email"]):
                return {
                    "success": False,
                    "error": "该邮箱已被注册",
                    "error_code": "EMAIL_EXISTS"
                }
            
            # 3. 检查用户名是否已存在
            if await self.user_repo.check_username_exists(registration_data["username"]):
                return {
                    "success": False,
                    "error": "该用户名已被使用",
                    "error_code": "USERNAME_EXISTS"
                }
            
            # 4. 验证密码强度
            password_check = password_validator.validate_password(
                registration_data["password"],
                username=registration_data["username"],
                email=registration_data["email"]
            )
            
            if not password_check["valid"]:
                return {
                    "success": False,
                    "error": "密码不符合安全要求",
                    "error_code": "WEAK_PASSWORD",
                    "details": password_check["errors"]
                }
            
            # 5. 创建用户
            user_data = {
                "email": registration_data["email"].lower(),
                "username": registration_data["username"],
                "password_hash": hash_password(registration_data["password"]),
                "full_name": registration_data["full_name"],
                "phone": registration_data.get("phone"),
                "role_id": 2,  # 默认注册用户角色
                "email_verified": False,
                "preferences": registration_data.get("preferences", {})
            }
            
            user = await self.user_repo.create_user(user_data)
            if not user:
                return {
                    "success": False,
                    "error": "创建用户失败",
                    "error_code": "CREATE_USER_FAILED"
                }
            
            # 6. 生成邮箱验证码
            verification_code = self._generate_verification_code()
            await self.redis.set_email_verification_code(
                user.email,
                verification_code
            )
            
            # 7. TODO: 发送验证邮件（需要邮件服务）
            # await email_service.send_verification_email(user.email, verification_code)
            
            # 8. 记录审计日志
            await self.user_repo.create_audit_log({
                "user_id": user.id,
                "action": "register",
                "result": "success",
                "ip_address": registration_data.get("ip_address"),
                "user_agent": registration_data.get("user_agent"),
                "details": {"method": "email"}
            })
            
            return {
                "success": True,
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "username": user.username,
                    "full_name": user.full_name
                },
                "message": "注册成功，请查收验证邮件",
                "debug_code": verification_code  # 仅用于开发环境
            }
            
        except Exception as e:
            print(f"用户注册失败: {e}")
            return {
                "success": False,
                "error": "注册过程中出现错误",
                "error_code": "REGISTRATION_ERROR"
            }
    
    # ==================== 用户登录 ====================
    
    async def authenticate_user(
        self, 
        email: str, 
        password: str,
        remember_me: bool = False,
        ip_address: str = None,
        user_agent: str = None,
        device_info: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """用户登录认证"""
        try:
            # 1. 检查登录速率限制
            rate_limit_result = await self.redis.check_login_rate_limit(email)
            if not rate_limit_result["allowed"]:
                # 记录失败的登录尝试
                await self._record_login_attempt(
                    email=email,
                    success=False,
                    reason="rate_limited",
                    ip_address=ip_address,
                    user_agent=user_agent
                )
                
                return {
                    "success": False,
                    "error": "登录尝试次数过多，请稍后再试",
                    "error_code": "RATE_LIMITED",
                    "reset_time": rate_limit_result["resetTime"]
                }
            
            # 2. 查找用户
            user = await self.user_repo.get_user_by_email(email.lower())
            if not user:
                await self._record_login_attempt(
                    email=email,
                    success=False,
                    reason="user_not_found",
                    ip_address=ip_address,
                    user_agent=user_agent
                )
                
                return {
                    "success": False,
                    "error": "邮箱或密码错误",
                    "error_code": "INVALID_CREDENTIALS"
                }
            
            # 3. 验证密码
            if not user.password_hash or not verify_password(password, user.password_hash):
                await self._record_login_attempt(
                    email=email,
                    success=False,
                    reason="invalid_password",
                    ip_address=ip_address,
                    user_agent=user_agent,
                    user_id=user.id
                )
                
                return {
                    "success": False,
                    "error": "邮箱或密码错误",
                    "error_code": "INVALID_CREDENTIALS"
                }
            
            # 4. 检查账户状态
            if not user.is_active:
                await self._record_login_attempt(
                    email=email,
                    success=False,
                    reason="account_inactive",
                    ip_address=ip_address,
                    user_agent=user_agent,
                    user_id=user.id
                )
                
                return {
                    "success": False,
                    "error": "账户已被停用",
                    "error_code": "ACCOUNT_INACTIVE"
                }
            
            # 5. 生成令牌对
            permissions = user.role.permissions if user.role else []
            tokens = self.jwt.generate_token_pair(
                user_id=str(user.id),
                email=user.email,
                role=user.role.role_name if user.role else "user",
                permissions=permissions
            )
            
            # 6. 创建会话记录
            session_expiry = datetime.now(timezone.utc) + timedelta(
                days=30 if remember_me else 0,
                hours=2 if not remember_me else 0
            )
            
            session = await self.user_repo.create_user_session({
                "user_id": user.id,
                "session_token": tokens["session_id"],
                "refresh_token": tokens["refresh_token"],
                "device_info": device_info or {},
                "ip_address": ip_address,
                "user_agent": user_agent,
                "is_remember_me": remember_me,
                "expires_at": session_expiry
            })
            
            # 7. 缓存会话信息到Redis
            await self.redis.set_user_session(
                tokens["session_id"],
                {
                    "user_id": str(user.id),
                    "email": user.email,
                    "role": user.role.role_name if user.role else "user",
                    "permissions": permissions
                },
                ttl_seconds=7200 if not remember_me else 30 * 24 * 3600
            )
            
            # 8. 更新最后登录时间
            await self.user_repo.update_last_login(user.id)
            
            # 9. 记录成功的登录
            await self._record_login_attempt(
                email=email,
                success=True,
                reason="success",
                ip_address=ip_address,
                user_agent=user_agent,
                user_id=user.id
            )
            
            return {
                "success": True,
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "username": user.username,
                    "full_name": user.full_name,
                    "role": user.role.role_name if user.role else "user",
                    "avatar_url": user.avatar_url,
                    "email_verified": user.email_verified
                },
                "tokens": {
                    "access_token": tokens["access_token"],
                    "refresh_token": tokens["refresh_token"],
                    "token_type": tokens["token_type"],
                    "expires_in": tokens["expires_in"],
                    "expires_at": tokens["expires_at"].isoformat() if hasattr(tokens["expires_at"], 'isoformat') else str(tokens["expires_at"])
                }
            }
            
        except Exception as e:
            print(f"用户登录失败: {e}")
            return {
                "success": False,
                "error": "登录过程中出现错误",
                "error_code": "LOGIN_ERROR"
            }
    
    # ==================== 会话管理 ====================
    
    async def logout_user(self, session_token: str, logout_all: bool = False) -> Dict[str, Any]:
        """用户登出"""
        try:
            # 1. 从Redis获取会话信息
            session_data = await self.redis.get_user_session(session_token)
            if not session_data:
                # 尝试从数据库获取
                db_session = await self.user_repo.get_session_by_token(session_token)
                if not db_session:
                    return {
                        "success": False,
                        "error": "会话不存在",
                        "error_code": "SESSION_NOT_FOUND"
                    }
                user_id = db_session.user_id
            else:
                user_id = UUID(session_data["userId"])
            
            # 2. 删除会话
            if logout_all:
                # 登出所有设备
                await self.user_repo.delete_user_sessions(user_id)
                await self.redis.clear_user_all_sessions(str(user_id))
            else:
                # 只登出当前会话
                await self.user_repo.delete_session(session_token)
                await self.redis.delete_user_session(session_token, str(user_id))
            
            # 3. 记录登出
            await self.user_repo.create_audit_log({
                "user_id": user_id,
                "action": "logout",
                "result": "success",
                "details": {"logout_all": logout_all}
            })
            
            return {
                "success": True,
                "message": "登出成功"
            }
            
        except Exception as e:
            print(f"用户登出失败: {e}")
            return {
                "success": False,
                "error": "登出过程中出现错误",
                "error_code": "LOGOUT_ERROR"
            }
    
    async def refresh_token(self, refresh_token: str) -> Dict[str, Any]:
        """刷新访问令牌"""
        try:
            # 1. 验证刷新令牌
            payload = self.jwt.verify_refresh_token(refresh_token)
            if not payload:
                return {
                    "success": False,
                    "error": "无效的刷新令牌",
                    "error_code": "INVALID_REFRESH_TOKEN"
                }
            
            # 2. 获取用户信息
            user_id = UUID(payload["sub"])
            user = await self.user_repo.get_user_by_id(user_id)
            
            if not user or not user.is_active:
                return {
                    "success": False,
                    "error": "用户不存在或已停用",
                    "error_code": "USER_NOT_FOUND"
                }
            
            # 3. 生成新的访问令牌
            permissions = user.role.permissions if user.role else []
            new_tokens = self.jwt.refresh_access_token(
                refresh_token,
                {
                    "user_id": str(user.id),
                    "email": user.email,
                    "role": user.role.role_name if user.role else "user",
                    "permissions": permissions
                }
            )
            
            if not new_tokens:
                return {
                    "success": False,
                    "error": "刷新令牌失败",
                    "error_code": "REFRESH_FAILED"
                }
            
            return {
                "success": True,
                "tokens": new_tokens
            }
            
        except Exception as e:
            print(f"刷新令牌失败: {e}")
            return {
                "success": False,
                "error": "刷新令牌过程中出现错误",
                "error_code": "REFRESH_ERROR"
            }
    
    # ==================== 邮箱验证 ====================
    
    async def verify_email(self, email: str, code: str) -> Dict[str, Any]:
        """验证邮箱"""
        try:
            # 1. 验证邮箱验证码
            verification_result = await self.redis.verify_email_code(email, code)
            
            if not verification_result["valid"]:
                return {
                    "success": False,
                    "error": verification_result["error"],
                    "error_code": "INVALID_VERIFICATION_CODE"
                }
            
            # 2. 更新用户邮箱验证状态
            user = await self.user_repo.get_user_by_email(email.lower())
            if not user:
                return {
                    "success": False,
                    "error": "用户不存在",
                    "error_code": "USER_NOT_FOUND"
                }
            
            await self.user_repo.verify_user_email(user.id)
            
            # 3. 记录审计日志
            await self.user_repo.create_audit_log({
                "user_id": user.id,
                "action": "email_verification",
                "result": "success"
            })
            
            return {
                "success": True,
                "message": "邮箱验证成功"
            }
            
        except Exception as e:
            print(f"邮箱验证失败: {e}")
            return {
                "success": False,
                "error": "邮箱验证过程中出现错误",
                "error_code": "VERIFICATION_ERROR"
            }
    
    async def resend_verification_email(self, email: str) -> Dict[str, Any]:
        """重新发送验证邮件"""
        try:
            # 1. 查找用户
            user = await self.user_repo.get_user_by_email(email.lower())
            if not user:
                return {
                    "success": False,
                    "error": "用户不存在",
                    "error_code": "USER_NOT_FOUND"
                }
            
            # 2. 检查是否已验证
            if user.email_verified:
                return {
                    "success": False,
                    "error": "邮箱已经验证过了",
                    "error_code": "EMAIL_ALREADY_VERIFIED"
                }
            
            # 3. 生成新的验证码
            verification_code = self._generate_verification_code()
            await self.redis.set_email_verification_code(
                user.email,
                verification_code
            )
            
            # 4. TODO: 发送验证邮件
            # await email_service.send_verification_email(user.email, verification_code)
            
            return {
                "success": True,
                "message": "验证邮件已重新发送",
                "debug_code": verification_code  # 仅用于开发环境
            }
            
        except Exception as e:
            print(f"重新发送验证邮件失败: {e}")
            return {
                "success": False,
                "error": "发送验证邮件过程中出现错误",
                "error_code": "RESEND_VERIFICATION_ERROR"
            }
    
    # ==================== 辅助方法 ====================
    
    async def _validate_registration_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """验证注册数据"""
        errors = []
        
        # 邮箱验证
        email = data.get("email", "").strip().lower()
        if not email:
            errors.append("邮箱不能为空")
        elif not self._is_valid_email(email):
            errors.append("邮箱格式不正确")
        
        # 用户名验证
        username = data.get("username", "").strip()
        if not username:
            errors.append("用户名不能为空")
        elif len(username) < 3:
            errors.append("用户名至少3个字符")
        elif len(username) > 50:
            errors.append("用户名最多50个字符")
        elif not username.replace("_", "").replace("-", "").isalnum():
            errors.append("用户名只能包含字母、数字、下划线和横线")
        
        # 密码验证
        password = data.get("password", "")
        if not password:
            errors.append("密码不能为空")
        
        # 全名验证
        full_name = data.get("full_name", "").strip()
        if not full_name:
            errors.append("姓名不能为空")
        elif len(full_name) > 100:
            errors.append("姓名最多100个字符")
        
        # 服务条款
        if not data.get("agree_to_terms"):
            errors.append("必须同意服务条款")
        
        return {
            "valid": len(errors) == 0,
            "error": "；".join(errors) if errors else None
        }
    
    def _is_valid_email(self, email: str) -> bool:
        """验证邮箱格式"""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def _generate_verification_code(self) -> str:
        """生成6位数字验证码"""
        import random
        return ''.join([str(random.randint(0, 9)) for _ in range(6)])
    
    async def _record_login_attempt(
        self,
        email: str,
        success: bool,
        reason: str,
        ip_address: str = None,
        user_agent: str = None,
        user_id: UUID = None
    ):
        """记录登录尝试"""
        try:
            await self.user_repo.create_audit_log({
                "user_id": user_id,
                "action": "login",
                "result": "success" if success else "failure",
                "ip_address": ip_address,
                "user_agent": user_agent,
                "details": {
                    "email": email,
                    "reason": reason
                }
            })
        except Exception as e:
            print(f"记录登录尝试失败: {e}")


def get_auth_service(db: Session = next(get_db())) -> AuthService:
    """获取认证服务实例"""
    return AuthService(db)