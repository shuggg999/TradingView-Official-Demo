from fastapi import APIRouter, Depends
from app.schemas.auth import UserResponse

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_user_profile():
    """获取用户资料"""
    # 临时返回示例数据
    return UserResponse(
        id=1,
        username="demo_user",
        email="demo@smartfin.tech",
        full_name="Demo User",
        company="SmartFin Tech",
        subscription_plan="PRO",
        is_active=True,
        created_at="2024-01-01T00:00:00"
    )

@router.get("/dashboard")
async def get_user_dashboard():
    """获取用户仪表板数据"""
    return {
        "message": "用户仪表板",
        "stats": {
            "watchlist_count": 15,
            "alerts_count": 3,
            "portfolio_value": 125000.50
        }
    }