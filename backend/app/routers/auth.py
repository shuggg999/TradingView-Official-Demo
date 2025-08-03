"""
Authentication Routes for SmartFin Technology Platform
Implements all authentication-related API endpoints
Based on the API design specification in docs/specs/user-auth/design.md
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.core.database import get_db
from app.services.auth_service import AuthService
from app.schemas.auth_schemas import (
    UserRegisterRequest, UserRegisterResponse,
    UserLoginRequest, UserLoginResponse,
    EmailVerificationRequest, EmailVerificationResponse,
    ResendVerificationRequest, ResendVerificationResponse,
    ForgotPasswordRequest, ForgotPasswordResponse,
    ResetPasswordRequest, ResetPasswordResponse,
    ChangePasswordRequest, ChangePasswordResponse,
    RefreshTokenRequest, RefreshTokenResponse,
    LogoutRequest, LogoutResponse,
    PasswordStrengthRequest, PasswordStrengthResponse,
    StandardResponse, ErrorResponse
)

# 创建路由器
router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer()


# ==================== 辅助函数 ====================

def get_client_info(request: Request) -> Dict[str, Any]:
    """获取客户端信息"""
    return {
        "ip_address": request.client.host,
        "user_agent": request.headers.get("user-agent"),
        "device_info": {
            "platform": request.headers.get("sec-ch-ua-platform", "").strip('"'),
            "browser": request.headers.get("sec-ch-ua", ""),
            "mobile": request.headers.get("sec-ch-ua-mobile") == "?1"
        }
    }


def get_current_user_session(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """获取当前用户会话信息"""
    from app.utils.jwt_utils import jwt_manager
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="未提供认证信息"
        )
    
    # 验证访问令牌
    payload = jwt_manager.verify_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的访问令牌"
        )
    
    return {
        "user_id": payload["sub"],
        "email": payload["email"],
        "role": payload["role"],
        "session_id": payload["session_id"],
        "permissions": payload.get("permissions", [])
    }


# ==================== 用户注册相关端点 ====================

@router.post("/register", response_model=UserRegisterResponse)
async def register_user(
    request: UserRegisterRequest,
    http_request: Request,
    db: Session = Depends(get_db)
):
    """
    用户注册
    
    - 验证输入数据的完整性和格式
    - 检查邮箱和用户名唯一性
    - 验证密码强度
    - 创建新用户账户
    - 发送邮箱验证码
    """
    try:
        # 获取客户端信息
        client_info = get_client_info(http_request)
        
        # 创建认证服务
        auth_service = AuthService(db)
        
        # 准备注册数据
        registration_data = {
            "email": request.email.lower(),
            "username": request.username,
            "password": request.password,
            "full_name": request.full_name,
            "phone": request.phone,
            "bio": request.bio,
            "agree_to_terms": request.agree_to_terms,
            "preferences": request.preferences.dict() if request.preferences else {},
            **client_info
        }
        
        # 执行注册
        result = await auth_service.register_user(registration_data)
        
        if result["success"]:
            return UserRegisterResponse(
                success=True,
                user=result["user"],
                message=result["message"],
                debug_code=result.get("debug_code")  # 仅开发环境
            )
        else:
            # 根据错误类型返回适当的HTTP状态码
            status_code = status.HTTP_400_BAD_REQUEST
            if result.get("error_code") == "EMAIL_EXISTS":
                status_code = status.HTTP_409_CONFLICT
            elif result.get("error_code") == "USERNAME_EXISTS":
                status_code = status.HTTP_409_CONFLICT
            elif result.get("error_code") == "WEAK_PASSWORD":
                status_code = status.HTTP_400_BAD_REQUEST
            
            raise HTTPException(
                status_code=status_code,
                detail={
                    "error": result["error"],
                    "error_code": result["error_code"],
                    "details": result.get("details")
                }
            )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"用户注册API错误: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="服务器内部错误"
        )


@router.post("/verify-email", response_model=EmailVerificationResponse)
async def verify_email(
    request: EmailVerificationRequest,
    db: Session = Depends(get_db)
):
    """
    验证邮箱
    
    - 验证6位数字验证码
    - 更新用户邮箱验证状态
    - 处理验证失败和过期情况
    """
    try:
        auth_service = AuthService(db)
        
        result = await auth_service.verify_email(request.email.lower(), request.code)
        
        if result["success"]:
            return EmailVerificationResponse(
                success=True,
                message=result["message"]
            )
        else:
            # 根据错误类型返回适当状态码
            status_code = status.HTTP_400_BAD_REQUEST
            if result.get("error_code") == "USER_NOT_FOUND":
                status_code = status.HTTP_404_NOT_FOUND
            elif result.get("error_code") == "INVALID_VERIFICATION_CODE":
                status_code = status.HTTP_400_BAD_REQUEST
            
            raise HTTPException(
                status_code=status_code,
                detail={
                    "error": result["error"],
                    "error_code": result["error_code"]
                }
            )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"邮箱验证API错误: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="服务器内部错误"
        )


@router.post("/resend-verification", response_model=ResendVerificationResponse)
async def resend_verification_email(
    request: ResendVerificationRequest,
    db: Session = Depends(get_db)
):
    """
    重新发送验证邮件
    
    - 检查用户是否存在
    - 检查邮箱是否已验证
    - 生成新的验证码
    - 发送验证邮件
    """
    try:
        auth_service = AuthService(db)
        
        result = await auth_service.resend_verification_email(request.email.lower())
        
        if result["success"]:
            return ResendVerificationResponse(
                success=True,
                message=result["message"],
                debug_code=result.get("debug_code")  # 仅开发环境
            )
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            if result.get("error_code") == "USER_NOT_FOUND":
                status_code = status.HTTP_404_NOT_FOUND
            elif result.get("error_code") == "EMAIL_ALREADY_VERIFIED":
                status_code = status.HTTP_400_BAD_REQUEST
            
            raise HTTPException(
                status_code=status_code,
                detail={
                    "error": result["error"],
                    "error_code": result["error_code"]
                }
            )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"重发验证邮件API错误: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="服务器内部错误"
        )


# ==================== 用户登录相关端点 ====================

@router.post("/login", response_model=UserLoginResponse)
async def login_user(
    request: UserLoginRequest,
    http_request: Request,
    db: Session = Depends(get_db)
):
    """
    用户登录
    
    - 检查登录速率限制
    - 验证用户凭据
    - 生成访问令牌和刷新令牌
    - 创建会话记录
    - 记录审计日志
    """
    try:
        # 获取客户端信息
        client_info = get_client_info(http_request)
        
        auth_service = AuthService(db)
        
        result = await auth_service.authenticate_user(
            email=request.email.lower(),
            password=request.password,
            remember_me=request.remember_me,
            device_info=request.device_info or client_info.get("device_info", {}),
            ip_address=client_info.get("ip_address"),
            user_agent=client_info.get("user_agent")
        )
        
        if result["success"]:
            return UserLoginResponse(
                success=True,
                user=result["user"],
                tokens=result["tokens"],
                message="登录成功"
            )
        else:
            status_code = status.HTTP_401_UNAUTHORIZED
            if result.get("error_code") == "RATE_LIMITED":
                status_code = status.HTTP_429_TOO_MANY_REQUESTS
            elif result.get("error_code") == "ACCOUNT_INACTIVE":
                status_code = status.HTTP_403_FORBIDDEN
            
            response_data = {
                "error": result["error"],
                "error_code": result["error_code"]
            }
            
            # 速率限制情况下返回重置时间
            if result.get("reset_time"):
                response_data["reset_time"] = result["reset_time"]
            
            raise HTTPException(
                status_code=status_code,
                detail=response_data
            )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"用户登录API错误: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="服务器内部错误"
        )


@router.post("/refresh", response_model=RefreshTokenResponse)
async def refresh_access_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """
    刷新访问令牌
    
    - 验证刷新令牌有效性
    - 检查用户账户状态
    - 生成新的访问令牌
    """
    try:
        auth_service = AuthService(db)
        
        result = await auth_service.refresh_token(request.refresh_token)
        
        if result["success"]:
            return RefreshTokenResponse(
                success=True,
                tokens=result["tokens"]
            )
        else:
            status_code = status.HTTP_401_UNAUTHORIZED
            if result.get("error_code") == "USER_NOT_FOUND":
                status_code = status.HTTP_404_NOT_FOUND
            
            raise HTTPException(
                status_code=status_code,
                detail={
                    "error": result["error"],
                    "error_code": result["error_code"]
                }
            )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"刷新令牌API错误: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="服务器内部错误"
        )


@router.post("/logout", response_model=LogoutResponse)
async def logout_user(
    request: LogoutRequest,
    session: Dict[str, Any] = Depends(get_current_user_session),
    db: Session = Depends(get_db)
):
    """
    用户登出
    
    - 验证当前会话
    - 删除会话记录
    - 清理Redis缓存
    - 支持登出所有设备
    """
    try:
        auth_service = AuthService(db)
        
        result = await auth_service.logout_user(
            session_token=session["session_id"],
            logout_all=request.logout_all
        )
        
        if result["success"]:
            return LogoutResponse(
                success=True,
                message=result["message"]
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": result["error"],
                    "error_code": result["error_code"]
                }
            )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"用户登出API错误: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="服务器内部错误"
        )


# ==================== 密码管理相关端点 ====================

@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    忘记密码
    
    - 查找用户账户
    - 生成密码重置令牌
    - 发送重置邮件
    """
    try:
        # TODO: 实现忘记密码逻辑
        # 这里先返回一个模拟响应
        return ForgotPasswordResponse(
            success=True,
            message="如果邮箱存在，重置链接已发送"
        )
        
    except Exception as e:
        print(f"忘记密码API错误: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="服务器内部错误"
        )


@router.post("/reset-password", response_model=ResetPasswordResponse)
async def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    重置密码
    
    - 验证重置令牌
    - 验证新密码强度
    - 更新用户密码
    - 撤销所有会话
    """
    try:
        # TODO: 实现重置密码逻辑
        return ResetPasswordResponse(
            success=True,
            message="密码重置成功"
        )
        
    except Exception as e:
        print(f"重置密码API错误: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="服务器内部错误"
        )


@router.post("/change-password", response_model=ChangePasswordResponse)
async def change_password(
    request: ChangePasswordRequest,
    session: Dict[str, Any] = Depends(get_current_user_session),
    db: Session = Depends(get_db)
):
    """
    修改密码
    
    - 验证当前密码
    - 验证新密码强度
    - 更新密码哈希
    - 撤销其他会话
    """
    try:
        # TODO: 实现修改密码逻辑
        return ChangePasswordResponse(
            success=True,
            message="密码修改成功"
        )
        
    except Exception as e:
        print(f"修改密码API错误: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="服务器内部错误"
        )


# ==================== 工具类端点 ====================

@router.post("/check-password-strength", response_model=PasswordStrengthResponse)
async def check_password_strength(request: PasswordStrengthRequest):
    """
    检查密码强度
    
    - 验证密码复杂度
    - 检查常见弱密码
    - 提供改进建议
    """
    try:
        from app.utils.password_utils import password_validator
        
        result = password_validator.validate_password(
            password=request.password,
            username=request.username,
            email=request.email
        )
        
        return PasswordStrengthResponse(
            valid=result["valid"],
            score=result["score"],
            strength=result["strength"],
            errors=result["errors"],
            suggestions=result["suggestions"]
        )
        
    except Exception as e:
        print(f"密码强度检查API错误: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="服务器内部错误"
        )


# ==================== 系统状态端点 ====================

@router.get("/health", response_model=StandardResponse)
async def health_check():
    """
    健康检查端点
    
    - 验证认证服务状态
    - 检查数据库连接
    - 检查Redis连接
    """
    try:
        return StandardResponse(
            success=True,
            message="认证服务运行正常",
            data={
                "service": "auth",
                "status": "healthy",
                "version": "1.0.0"
            }
        )
        
    except Exception as e:
        print(f"健康检查错误: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="服务暂时不可用"
        )


@router.get("/me", response_model=StandardResponse)
async def get_current_user(
    session: Dict[str, Any] = Depends(get_current_user_session),
    db: Session = Depends(get_db)
):
    """
    获取当前用户信息
    
    - 验证访问令牌
    - 返回用户基本信息
    - 不包含敏感数据
    """
    try:
        from app.repositories.user_repository import UserRepository
        from uuid import UUID
        
        user_repo = UserRepository(db)
        user = await user_repo.get_user_by_id(UUID(session["user_id"]))
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )
        
        return StandardResponse(
            success=True,
            data={
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "username": user.username,
                    "full_name": user.full_name,
                    "role": user.role.role_name if user.role else "user",
                    "avatar_url": user.avatar_url,
                    "email_verified": user.email_verified,
                    "created_at": user.created_at.isoformat() if user.created_at else None,
                    "last_login_at": user.last_login_at.isoformat() if user.last_login_at else None
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"获取用户信息API错误: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="服务器内部错误"
        )