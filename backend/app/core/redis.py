import redis.asyncio as redis
from app.core.config import settings
from typing import Optional
import json

class RedisClient:
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
    
    async def connect(self):
        """连接到Redis"""
        self.redis_client = await redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
    
    async def disconnect(self):
        """断开Redis连接"""
        if self.redis_client:
            await self.redis_client.close()
    
    async def get(self, key: str) -> Optional[str]:
        """获取值"""
        if not self.redis_client:
            await self.connect()
        return await self.redis_client.get(key)
    
    async def set(self, key: str, value: str, expire: int = 300) -> bool:
        """设置值，默认5分钟过期"""
        if not self.redis_client:
            await self.connect()
        return await self.redis_client.setex(key, expire, value)
    
    async def get_json(self, key: str) -> Optional[dict]:
        """获取JSON值"""
        value = await self.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return None
        return None
    
    async def set_json(self, key: str, value: dict, expire: int = 300) -> bool:
        """设置JSON值"""
        try:
            json_str = json.dumps(value)
            return await self.set(key, json_str, expire)
        except (TypeError, ValueError):
            return False
    
    async def delete(self, key: str) -> bool:
        """删除键"""
        if not self.redis_client:
            await self.connect()
        return bool(await self.redis_client.delete(key))

# 全局Redis客户端
redis_client = RedisClient()