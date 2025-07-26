from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import UserCreate, Token, UserResponse
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    def create_access_token(self, data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt
    
    async def create_user(self, user_data: UserCreate) -> User:
        """创建新用户"""
        # 检查用户名是否已存在
        existing_user = self.db.query(User).filter(
            (User.username == user_data.username) | (User.email == user_data.email)
        ).first()
        
        if existing_user:
            raise ValueError("用户名或邮箱已存在")
        
        # 创建新用户
        hashed_password = self.get_password_hash(user_data.password)
        
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            company=user_data.company,
            position=user_data.position,
            subscription_plan="FREE"
        )
        
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        
        return new_user
    
    async def authenticate_user(self, username: str, password: str) -> Token:
        """用户身份验证"""
        user = self.db.query(User).filter(
            (User.username == username) | (User.email == username)
        ).first()
        
        if not user or not self.verify_password(password, user.hashed_password):
            raise ValueError("用户名或密码错误")
        
        if not user.is_active:
            raise ValueError("用户账户已被禁用")
        
        # 更新最后登录时间
        user.last_login = datetime.utcnow()
        self.db.commit()
        
        # 创建访问令牌
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = self.create_access_token(
            data={"sub": user.username, "user_id": user.id},
            expires_delta=access_token_expires
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=UserResponse(
                id=user.id,
                username=user.username,
                email=user.email,
                full_name=user.full_name,
                company=user.company,
                subscription_plan=user.subscription_plan,
                is_active=user.is_active,
                created_at=user.created_at.isoformat()
            )
        )
    
    async def get_current_user(self, token: str) -> User:
        """根据token获取当前用户"""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise ValueError("无效的token")
        except JWTError:
            raise ValueError("无效的token")
        
        user = self.db.query(User).filter(User.username == username).first()
        if user is None:
            raise ValueError("用户不存在")
        
        return user