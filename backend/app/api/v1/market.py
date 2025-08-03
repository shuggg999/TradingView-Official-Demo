from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime, timedelta
from app.services.market_service import MarketService
from app.schemas.market import MarketDataResponse, HistoricalDataResponse, SymbolSearchResponse
from app.core.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/symbols/{symbol}", response_model=MarketDataResponse)
async def get_symbol_data(
    symbol: str,
    db: Session = Depends(get_db)
):
    """获取单个股票实时数据"""
    try:
        market_service = MarketService(db)
        data = await market_service.get_symbol_data(symbol.upper())
        return data
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Symbol {symbol} not found: {str(e)}")

@router.get("/search", response_model=List[SymbolSearchResponse])
async def search_symbols(
    q: str = Query(..., min_length=1, max_length=50, description="搜索关键词"),
    limit: int = Query(10, ge=1, le=50, description="返回数量限制"),
    db: Session = Depends(get_db)
):
    """搜索股票符号"""
    try:
        market_service = MarketService(db)
        results = await market_service.search_symbols(q, limit)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.post("/batch")
async def get_batch_data(
    symbols: List[str],
    db: Session = Depends(get_db)
):
    """批量获取股票数据"""
    if len(symbols) > 50:
        raise HTTPException(status_code=400, detail="最多支持50个符号")
    
    try:
        market_service = MarketService(db)
        # 转换为大写
        upper_symbols = [s.upper() for s in symbols]
        data = await market_service.get_batch_data(upper_symbols)
        
        return {
            "symbols": upper_symbols,
            "count": len(data),
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch request failed: {str(e)}")

@router.get("/symbols/{symbol}/history", response_model=List[HistoricalDataResponse])
async def get_historical_data(
    symbol: str,
    interval: str = Query("1d", regex="^(1m|5m|15m|1h|4h|1d|1w)$", description="时间间隔"),
    period: str = Query("1mo", regex="^(1d|5d|1mo|3mo|6mo|1y|2y|5y|10y|ytd|max)$", description="时间范围"),
    db: Session = Depends(get_db)
):
    """获取历史数据"""
    try:
        market_service = MarketService(db)
        data = await market_service.get_historical_data(
            symbol.upper(), 
            interval, 
            period
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Historical data not found: {str(e)}")

@router.get("/trending")
async def get_trending_symbols(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """获取热门股票"""
    try:
        market_service = MarketService(db)
        data = await market_service.get_trending_symbols(limit)
        return {
            "trending": data,
            "count": len(data),
            "updated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get trending symbols: {str(e)}")

@router.get("/sectors")
async def get_sector_performance(db: Session = Depends(get_db)):
    """获取板块表现"""
    try:
        market_service = MarketService(db)
        data = await market_service.get_sector_performance()
        return {
            "sectors": data,
            "updated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get sector data: {str(e)}")