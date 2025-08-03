"""
User Repository for SmartFin Technology Platform
Implements data access layer for user authentication operations
Based on the repository pattern from docs/specs/user-auth/design.md
"""

from typing import Optional, List, Dict, Any
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import and_, or_, desc, func
from datetime import datetime, timedelta

from app.models.auth import User, Role, UserSession, PasswordResetToken, AuthAuditLog
from app.core.database import get_db


class UserRepository:
    """用户仓储类 - 处理用户相关的数据库操作"""
    
    def __init__(self, db: Session):
        self.db = db
    
    # ==================== 用户CRUD操作 ====================
    
    async def create_user(self, user_data: Dict[str, Any]) -> Optional[User]:
        """创建新用户"""
        try:
            user = User(
                email=user_data["email"],
                username=user_data["username"],
                password_hash=user_data.get("password_hash"),
                full_name=user_data["full_name"],
                avatar_url=user_data.get("avatar_url"),
                phone=user_data.get("phone"),
                bio=user_data.get("bio"),
                role_id=user_data.get("role_id", 2),  # 默认为注册用户
                oauth_provider=user_data.get("oauth_provider"),
                oauth_provider_id=user_data.get("oauth_provider_id"),
                preferences=user_data.get("preferences", {}),
                email_verified=user_data.get("email_verified", False)
            )
            
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            return user
            
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"创建用户失败: {e}")
            return None
    
    async def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """根据用户ID获取用户"""
        try:
            return self.db.query(User).options(
                joinedload(User.role)
            ).filter(User.id == user_id).first()
        except SQLAlchemyError as e:
            print(f"获取用户失败: {e}")
            return None
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """根据邮箱获取用户"""
        try:
            return self.db.query(User).options(
                joinedload(User.role)
            ).filter(User.email == email).first()
        except SQLAlchemyError as e:
            print(f"根据邮箱获取用户失败: {e}")
            return None
    
    async def get_user_by_username(self, username: str) -> Optional[User]:
        """根据用户名获取用户"""
        try:
            return self.db.query(User).options(
                joinedload(User.role)
            ).filter(User.username == username).first()
        except SQLAlchemyError as e:
            print(f"根据用户名获取用户失败: {e}")
            return None
    
    async def get_user_by_oauth(self, provider: str, provider_id: str) -> Optional[User]:
        """根据OAuth信息获取用户"""
        try:
            return self.db.query(User).options(
                joinedload(User.role)
            ).filter(
                and_(
                    User.oauth_provider == provider,
                    User.oauth_provider_id == provider_id
                )
            ).first()
        except SQLAlchemyError as e:
            print(f"根据OAuth获取用户失败: {e}")
            return None
    
    async def update_user(self, user_id: UUID, update_data: Dict[str, Any]) -> Optional[User]:
        """更新用户信息"""
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                return None
            
            # 更新字段
            for field, value in update_data.items():
                if hasattr(user, field):
                    setattr(user, field, value)
            
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            self.db.refresh(user)
            return user
            
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"更新用户失败: {e}")
            return None
    
    async def update_last_login(self, user_id: UUID) -> bool:
        """更新用户最后登录时间"""
        try:
            self.db.query(User).filter(User.id == user_id).update({
                "last_login_at": datetime.utcnow()
            })
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"更新最后登录时间失败: {e}")
            return False
    
    async def verify_user_email(self, user_id: UUID) -> bool:
        """验证用户邮箱"""
        try:
            self.db.query(User).filter(User.id == user_id).update({
                "email_verified": True,
                "updated_at": datetime.utcnow()
            })
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"验证用户邮箱失败: {e}")
            return False
    
    async def deactivate_user(self, user_id: UUID) -> bool:
        """停用用户账户"""
        try:
            self.db.query(User).filter(User.id == user_id).update({
                "is_active": False,
                "updated_at": datetime.utcnow()
            })
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"停用用户失败: {e}")
            return False
    
    async def delete_user(self, user_id: UUID) -> bool:
        """删除用户（软删除，实际设为不活跃）"""
        return await self.deactivate_user(user_id)
    
    # ==================== 用户查询和统计 ====================
    
    async def check_email_exists(self, email: str, exclude_user_id: UUID = None) -> bool:
        """检查邮箱是否已存在"""
        try:
            query = self.db.query(User).filter(User.email == email)
            if exclude_user_id:
                query = query.filter(User.id != exclude_user_id)
            
            return query.first() is not None
        except SQLAlchemyError as e:
            print(f"检查邮箱存在失败: {e}")
            return False
    
    async def check_username_exists(self, username: str, exclude_user_id: UUID = None) -> bool:
        """检查用户名是否已存在"""
        try:
            query = self.db.query(User).filter(User.username == username)
            if exclude_user_id:
                query = query.filter(User.id != exclude_user_id)
            
            return query.first() is not None
        except SQLAlchemyError as e:
            print(f"检查用户名存在失败: {e}")
            return False
    
    async def get_users_list(
        self, 
        page: int = 1, 
        page_size: int = 20,
        search: str = None,
        role_id: int = None,
        is_active: bool = None
    ) -> Dict[str, Any]:
        """获取用户列表（分页）"""
        try:
            query = self.db.query(User).options(joinedload(User.role))
            
            # 搜索条件
            if search:
                search_pattern = f"%{search}%"
                query = query.filter(
                    or_(
                        User.email.ilike(search_pattern),
                        User.username.ilike(search_pattern),
                        User.full_name.ilike(search_pattern)
                    )
                )
            
            # 角色过滤
            if role_id:
                query = query.filter(User.role_id == role_id)
            
            # 状态过滤
            if is_active is not None:
                query = query.filter(User.is_active == is_active)
            
            # 总数统计
            total = query.count()
            
            # 分页和排序
            users = query.offset((page - 1) * page_size).limit(page_size).order_by(
                desc(User.created_at)
            ).all()
            
            return {
                "users": users,
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": (total + page_size - 1) // page_size
            }
            
        except SQLAlchemyError as e:
            print(f"获取用户列表失败: {e}")
            return {
                "users": [],
                "total": 0,
                "page": page,
                "page_size": page_size,
                "total_pages": 0
            }
    
    async def get_user_statistics(self) -> Dict[str, Any]:
        """获取用户统计信息"""
        try:
            total_users = self.db.query(User).count()
            active_users = self.db.query(User).filter(User.is_active == True).count()
            verified_users = self.db.query(User).filter(User.email_verified == True).count()
            
            # 本月注册用户
            month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            monthly_registrations = self.db.query(User).filter(
                User.created_at >= month_start
            ).count()
            
            # 角色分布
            role_distribution = self.db.query(
                Role.role_name,
                func.count(User.id).label('count')
            ).join(User, User.role_id == Role.id).group_by(Role.role_name).all()
            
            return {
                "total_users": total_users,
                "active_users": active_users,
                "verified_users": verified_users,
                "monthly_registrations": monthly_registrations,
                "role_distribution": dict(role_distribution)
            }
            
        except SQLAlchemyError as e:
            print(f"获取用户统计失败: {e}")
            return {}
    
    # ==================== 会话管理 ====================
    
    async def create_user_session(self, session_data: Dict[str, Any]) -> Optional[UserSession]:
        """创建用户会话"""
        try:
            session = UserSession(
                user_id=session_data["user_id"],
                session_token=session_data["session_token"],
                refresh_token=session_data.get("refresh_token"),
                device_info=session_data.get("device_info", {}),
                ip_address=session_data.get("ip_address"),
                user_agent=session_data.get("user_agent"),
                is_remember_me=session_data.get("is_remember_me", False),
                expires_at=session_data["expires_at"]
            )
            
            self.db.add(session)
            self.db.commit()
            self.db.refresh(session)
            return session
            
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"创建会话失败: {e}")
            return None
    
    async def get_session_by_token(self, session_token: str) -> Optional[UserSession]:
        """根据会话令牌获取会话"""
        try:
            return self.db.query(UserSession).options(
                joinedload(UserSession.user).joinedload(User.role)
            ).filter(UserSession.session_token == session_token).first()
        except SQLAlchemyError as e:
            print(f"获取会话失败: {e}")
            return None
    
    async def update_session_last_accessed(self, session_id: UUID) -> bool:
        """更新会话最后访问时间"""
        try:
            self.db.query(UserSession).filter(UserSession.id == session_id).update({
                "last_accessed_at": datetime.utcnow()
            })
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"更新会话访问时间失败: {e}")
            return False
    
    async def delete_session(self, session_token: str) -> bool:
        """删除会话"""
        try:
            self.db.query(UserSession).filter(
                UserSession.session_token == session_token
            ).delete()
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"删除会话失败: {e}")
            return False
    
    async def delete_user_sessions(self, user_id: UUID, exclude_session_id: UUID = None) -> bool:
        """删除用户所有会话"""
        try:
            query = self.db.query(UserSession).filter(UserSession.user_id == user_id)
            if exclude_session_id:
                query = query.filter(UserSession.id != exclude_session_id)
            
            query.delete()
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"删除用户会话失败: {e}")
            return False
    
    async def cleanup_expired_sessions(self) -> int:
        """清理过期会话"""
        try:
            deleted_count = self.db.query(UserSession).filter(
                UserSession.expires_at < datetime.utcnow()
            ).delete()
            self.db.commit()
            return deleted_count
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"清理过期会话失败: {e}")
            return 0
    
    # ==================== 密码重置管理 ====================
    
    async def create_password_reset_token(self, token_data: Dict[str, Any]) -> Optional[PasswordResetToken]:
        """创建密码重置令牌"""
        try:
            token = PasswordResetToken(
                user_id=token_data["user_id"],
                token=token_data["token"],
                expires_at=token_data["expires_at"]
            )
            
            self.db.add(token)
            self.db.commit()
            self.db.refresh(token)
            return token
            
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"创建密码重置令牌失败: {e}")
            return None
    
    async def get_password_reset_token(self, token: str) -> Optional[PasswordResetToken]:
        """获取密码重置令牌"""
        try:
            return self.db.query(PasswordResetToken).options(
                joinedload(PasswordResetToken.user)
            ).filter(
                and_(
                    PasswordResetToken.token == token,
                    PasswordResetToken.used_at.is_(None),
                    PasswordResetToken.expires_at > datetime.utcnow()
                )
            ).first()
        except SQLAlchemyError as e:
            print(f"获取密码重置令牌失败: {e}")
            return None
    
    async def mark_password_reset_token_used(self, token: str) -> bool:
        """标记密码重置令牌为已使用"""
        try:
            self.db.query(PasswordResetToken).filter(
                PasswordResetToken.token == token
            ).update({
                "used_at": datetime.utcnow()
            })
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"标记密码重置令牌失败: {e}")
            return False
    
    async def cleanup_expired_reset_tokens(self) -> int:
        """清理过期的密码重置令牌"""
        try:
            deleted_count = self.db.query(PasswordResetToken).filter(
                or_(
                    PasswordResetToken.expires_at < datetime.utcnow(),
                    PasswordResetToken.used_at.is_not(None)
                )
            ).delete()
            self.db.commit()
            return deleted_count
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"清理过期重置令牌失败: {e}")
            return 0
    
    # ==================== 审计日志 ====================
    
    async def create_audit_log(self, log_data: Dict[str, Any]) -> Optional[AuthAuditLog]:
        """创建审计日志"""
        try:
            log = AuthAuditLog(
                user_id=log_data.get("user_id"),
                action=log_data["action"],
                result=log_data["result"],
                ip_address=log_data.get("ip_address"),
                user_agent=log_data.get("user_agent"),
                details=log_data.get("details", {})
            )
            
            self.db.add(log)
            self.db.commit()
            self.db.refresh(log)
            return log
            
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"创建审计日志失败: {e}")
            return None
    
    async def get_user_audit_logs(
        self, 
        user_id: UUID, 
        page: int = 1, 
        page_size: int = 20,
        action: str = None
    ) -> Dict[str, Any]:
        """获取用户审计日志"""
        try:
            query = self.db.query(AuthAuditLog).filter(AuthAuditLog.user_id == user_id)
            
            if action:
                query = query.filter(AuthAuditLog.action == action)
            
            total = query.count()
            
            logs = query.offset((page - 1) * page_size).limit(page_size).order_by(
                desc(AuthAuditLog.created_at)
            ).all()
            
            return {
                "logs": logs,
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": (total + page_size - 1) // page_size
            }
            
        except SQLAlchemyError as e:
            print(f"获取用户审计日志失败: {e}")
            return {
                "logs": [],
                "total": 0,
                "page": page,
                "page_size": page_size,
                "total_pages": 0
            }
    
    # ==================== 角色管理 ====================
    
    async def get_all_roles(self) -> List[Role]:
        """获取所有角色"""
        try:
            return self.db.query(Role).filter(Role.is_active == True).all()
        except SQLAlchemyError as e:
            print(f"获取角色列表失败: {e}")
            return []
    
    async def get_role_by_name(self, role_name: str) -> Optional[Role]:
        """根据角色名获取角色"""
        try:
            return self.db.query(Role).filter(
                and_(
                    Role.role_name == role_name,
                    Role.is_active == True
                )
            ).first()
        except SQLAlchemyError as e:
            print(f"获取角色失败: {e}")
            return None
    
    async def update_user_role(self, user_id: UUID, role_id: int) -> bool:
        """更新用户角色"""
        try:
            self.db.query(User).filter(User.id == user_id).update({
                "role_id": role_id,
                "updated_at": datetime.utcnow()
            })
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"更新用户角色失败: {e}")
            return False


def get_user_repository(db: Session = next(get_db())) -> UserRepository:
    """获取用户仓储实例"""
    return UserRepository(db)