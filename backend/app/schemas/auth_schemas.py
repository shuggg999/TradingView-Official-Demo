"""
Pydantic Schemas for Authentication API
Defines request/response models for user authentication endpoints
Based on the technical design specification in docs/specs/user-auth/design.md
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


# ==================== 基础模型 ====================

class UserBase(BaseModel):
    """用户基础信息模型"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50, description="用户名，3-50字符")
    full_name: str = Field(..., min_length=1, max_length=100, description="用户全名")
    phone: Optional[str] = Field(None, max_length=20, description="手机号码")
    bio: Optional[str] = Field(None, max_length=500, description="个人简介")


class UserPreferences(BaseModel):
    """用户偏好设置"""
    theme: Optional[str] = Field("light", description="主题：light/dark")
    language: Optional[str] = Field("zh-CN", description="语言设置")
    timezone: Optional[str] = Field("Asia/Shanghai", description="时区")
    notifications: Optional[Dict[str, bool]] = Field(
        default_factory=dict,
        description="通知设置"
    )


# ==================== 注册相关模型 ====================

class UserRegisterRequest(UserBase):
    """用户注册请求模型"""
    password: str = Field(
        ..., 
        min_length=8, 
        max_length=128, 
        description="密码，至少8位，包含大小写字母、数字、特殊字符"
    )
    agree_to_terms: bool = Field(..., description="是否同意服务条款")
    preferences: Optional[UserPreferences] = Field(None, description="用户偏好设置")
    
    @validator('username')
    def validate_username(cls, v):
        """验证用户名格式"""
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('用户名只能包含字母、数字、下划线和横线')
        return v.lower()
    
    @validator('email')
    def validate_email(cls, v):
        """验证邮箱格式并转为小写"""
        return v.lower()
    
    @validator('agree_to_terms')
    def validate_terms(cls, v):
        """验证必须同意服务条款"""
        if not v:
            raise ValueError('必须同意服务条款')
        return v


class UserRegisterResponse(BaseModel):
    """用户注册响应模型"""
    success: bool
    user: Optional[Dict[str, Any]] = None
    message: str
    debug_code: Optional[str] = None  # 仅用于开发环境
    error: Optional[str] = None
    error_code: Optional[str] = None
    details: Optional[List[str]] = None


# ==================== 登录相关模型 ====================

class UserLoginRequest(BaseModel):
    """用户登录请求模型"""
    email: EmailStr
    password: str = Field(..., description="密码")
    remember_me: Optional[bool] = Field(False, description="记住登录状态")
    device_info: Optional[Dict[str, Any]] = Field(None, description="设备信息")
    
    @validator('email')
    def validate_email(cls, v):
        """验证邮箱格式并转为小写"""
        return v.lower()


class TokenInfo(BaseModel):
    """令牌信息模型"""
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int
    expires_at: str


class UserInfo(BaseModel):
    """用户信息模型"""
    id: str
    email: str
    username: str
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    email_verified: bool
    created_at: Optional[datetime] = None
    last_login_at: Optional[datetime] = None


class UserLoginResponse(BaseModel):
    """用户登录响应模型"""
    success: bool
    user: Optional[UserInfo] = None
    tokens: Optional[TokenInfo] = None
    message: Optional[str] = None
    error: Optional[str] = None
    error_code: Optional[str] = None
    reset_time: Optional[int] = None  # 限制重置时间


# ==================== 令牌相关模型 ====================

class RefreshTokenRequest(BaseModel):
    """刷新令牌请求模型"""
    refresh_token: str = Field(..., description="刷新令牌")


class RefreshTokenResponse(BaseModel):
    """刷新令牌响应模型"""
    success: bool
    tokens: Optional[TokenInfo] = None
    error: Optional[str] = None
    error_code: Optional[str] = None


# ==================== 登出相关模型 ====================

class LogoutRequest(BaseModel):
    """登出请求模型"""
    logout_all: Optional[bool] = Field(False, description="是否登出所有设备")


class LogoutResponse(BaseModel):
    """登出响应模型"""
    success: bool
    message: str
    error: Optional[str] = None
    error_code: Optional[str] = None


# ==================== 邮箱验证相关模型 ====================

class EmailVerificationRequest(BaseModel):
    """邮箱验证请求模型"""
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6, description="6位验证码")
    
    @validator('email')
    def validate_email(cls, v):
        return v.lower()


class EmailVerificationResponse(BaseModel):
    """邮箱验证响应模型"""
    success: bool
    message: str
    error: Optional[str] = None
    error_code: Optional[str] = None


class ResendVerificationRequest(BaseModel):
    """重发验证邮件请求模型"""
    email: EmailStr
    
    @validator('email')
    def validate_email(cls, v):
        return v.lower()


class ResendVerificationResponse(BaseModel):
    """重发验证邮件响应模型"""
    success: bool
    message: str
    debug_code: Optional[str] = None  # 仅用于开发环境
    error: Optional[str] = None
    error_code: Optional[str] = None


# ==================== 密码管理相关模型 ====================

class ForgotPasswordRequest(BaseModel):
    """忘记密码请求模型"""
    email: EmailStr
    
    @validator('email')
    def validate_email(cls, v):
        return v.lower()


class ForgotPasswordResponse(BaseModel):
    """忘记密码响应模型"""
    success: bool
    message: str
    debug_token: Optional[str] = None  # 仅用于开发环境


class ResetPasswordRequest(BaseModel):
    """重置密码请求模型"""
    token: str = Field(..., description="密码重置令牌")
    new_password: str = Field(
        ..., 
        min_length=8, 
        max_length=128, 
        description="新密码"
    )


class ResetPasswordResponse(BaseModel):
    """重置密码响应模型"""
    success: bool
    message: str
    error: Optional[str] = None
    error_code: Optional[str] = None
    details: Optional[List[str]] = None


class ChangePasswordRequest(BaseModel):
    """修改密码请求模型"""
    current_password: str = Field(..., description="当前密码")
    new_password: str = Field(
        ..., 
        min_length=8, 
        max_length=128, 
        description="新密码"
    )


class ChangePasswordResponse(BaseModel):
    """修改密码响应模型"""
    success: bool
    message: str
    error: Optional[str] = None
    error_code: Optional[str] = None
    details: Optional[List[str]] = None


# ==================== 密码强度检查模型 ====================

class PasswordStrengthRequest(BaseModel):
    """密码强度检查请求模型"""
    password: str = Field(..., description="要检查的密码")
    username: Optional[str] = Field(None, description="用户名（用于相似性检查）")
    email: Optional[EmailStr] = Field(None, description="邮箱（用于相似性检查）")


class PasswordStrengthResponse(BaseModel):
    """密码强度检查响应模型"""
    valid: bool
    score: float
    strength: str
    errors: List[str]
    suggestions: List[str]


# ==================== 用户资料相关模型 ====================

class UserProfileUpdateRequest(BaseModel):
    """用户资料更新请求模型"""
    full_name: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    bio: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[str] = Field(None, description="头像URL")
    preferences: Optional[UserPreferences] = None


class UserProfileResponse(BaseModel):
    """用户资料响应模型"""
    success: bool
    user: Optional[UserInfo] = None
    error: Optional[str] = None
    error_code: Optional[str] = None


# ==================== 会话管理相关模型 ====================

class SessionInfo(BaseModel):
    """会话信息模型"""
    session_id: str
    device_info: Dict[str, Any]
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    is_remember_me: bool
    created_at: datetime
    last_accessed_at: datetime
    expires_at: datetime


class UserSessionsResponse(BaseModel):
    """用户会话列表响应模型"""
    success: bool
    sessions: List[SessionInfo] = []
    current_session_id: Optional[str] = None
    error: Optional[str] = None
    error_code: Optional[str] = None


class RevokeSessionRequest(BaseModel):
    """撤销会话请求模型"""
    session_id: str = Field(..., description="要撤销的会话ID")


class RevokeSessionResponse(BaseModel):
    """撤销会话响应模型"""
    success: bool
    message: str
    error: Optional[str] = None
    error_code: Optional[str] = None


# ==================== 审计日志相关模型 ====================

class AuditLogEntry(BaseModel):
    """审计日志条目模型"""
    id: str
    action: str
    result: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    details: Dict[str, Any]
    created_at: datetime


class UserAuditLogsResponse(BaseModel):
    """用户审计日志响应模型"""
    success: bool
    logs: List[AuditLogEntry] = []
    total: int
    page: int
    page_size: int
    total_pages: int
    error: Optional[str] = None
    error_code: Optional[str] = None


# ==================== 通用响应模型 ====================

class StandardResponse(BaseModel):
    """标准API响应模型"""
    success: bool
    message: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    error_code: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None


class ErrorResponse(BaseModel):
    """错误响应模型"""
    success: bool = False
    error: str
    error_code: str
    details: Optional[List[str]] = None
    meta: Optional[Dict[str, Any]] = None


# ==================== OAuth 相关模型 ====================

class OAuthProvider(BaseModel):
    """OAuth提供商信息"""
    name: str
    display_name: str
    authorization_url: str
    enabled: bool


class OAuthProvidersResponse(BaseModel):
    """OAuth提供商列表响应"""
    success: bool
    providers: List[OAuthProvider]


class OAuthCallbackRequest(BaseModel):
    """OAuth回调请求模型"""
    provider: str = Field(..., description="OAuth提供商")
    code: str = Field(..., description="授权码")
    state: Optional[str] = Field(None, description="状态参数")


class OAuthCallbackResponse(BaseModel):
    """OAuth回调响应模型"""
    success: bool
    user: Optional[UserInfo] = None
    tokens: Optional[TokenInfo] = None
    is_new_user: Optional[bool] = None
    error: Optional[str] = None
    error_code: Optional[str] = None


# ==================== 角色和权限相关模型 ====================

class RoleInfo(BaseModel):
    """角色信息模型"""
    id: int
    role_name: str
    display_name: str
    description: Optional[str] = None
    permissions: List[str]
    is_active: bool


class RolesResponse(BaseModel):
    """角色列表响应模型"""
    success: bool
    roles: List[RoleInfo]
    error: Optional[str] = None
    error_code: Optional[str] = None


class UserRoleUpdateRequest(BaseModel):
    """用户角色更新请求模型"""
    user_id: str = Field(..., description="用户ID")
    role_id: int = Field(..., description="新角色ID")


class UserRoleUpdateResponse(BaseModel):
    """用户角色更新响应模型"""
    success: bool
    message: str
    error: Optional[str] = None
    error_code: Optional[str] = None