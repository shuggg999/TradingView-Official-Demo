import yfinance as yf
import pandas as pd
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.market import MarketData, HistoricalData
from app.core.redis import redis_client
from app.schemas.market import MarketDataResponse, HistoricalDataResponse, SymbolSearchResponse
import asyncio
import httpx

class MarketService:
    def __init__(self, db: Session):
        self.db = db
    
    async def get_symbol_data(self, symbol: str) -> MarketDataResponse:
        """获取单个股票实时数据"""
        # 先尝试从缓存获取
        cache_key = f"market:{symbol}"
        cached_data = await redis_client.get_json(cache_key)
        
        if cached_data:
            return MarketDataResponse(**cached_data)
        
        # 从Yahoo Finance获取数据
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            hist = ticker.history(period="2d")
            
            if hist.empty:
                raise ValueError(f"No data found for symbol {symbol}")
            
            latest = hist.iloc[-1]
            prev = hist.iloc[-2] if len(hist) > 1 else latest
            
            # 构造响应数据
            data = {
                "symbol": symbol,
                "name": info.get("longName", symbol),
                "price": float(latest["Close"]),
                "open": float(latest["Open"]),
                "high": float(latest["High"]),
                "low": float(latest["Low"]),
                "prev_close": float(prev["Close"]),
                "change": float(latest["Close"] - prev["Close"]),
                "change_percent": float((latest["Close"] - prev["Close"]) / prev["Close"] * 100),
                "volume": int(latest["Volume"]) if latest["Volume"] else 0,
                "market_cap": info.get("marketCap"),
                "market": info.get("exchange", "UNKNOWN"),
                "sector": info.get("sector"),
                "currency": info.get("currency", "USD"),
                "updated_at": datetime.now().isoformat()
            }
            
            # 缓存5分钟
            await redis_client.set_json(cache_key, data, expire=300)
            
            return MarketDataResponse(**data)
            
        except Exception as e:
            raise ValueError(f"Failed to fetch data for {symbol}: {str(e)}")
    
    async def search_symbols(self, query: str, limit: int = 10) -> List[SymbolSearchResponse]:
        """搜索股票符号"""
        cache_key = f"search:{query}:{limit}"
        cached_results = await redis_client.get_json(cache_key)
        
        if cached_results:
            return [SymbolSearchResponse(**item) for item in cached_results]
        
        # 使用Yahoo Finance搜索API
        try:
            async with httpx.AsyncClient() as client:
                url = "https://query1.finance.yahoo.com/v1/finance/search"
                params = {
                    "q": query,
                    "newsCount": 0,
                    "listsCount": 0,
                    "quotesCount": limit
                }
                
                response = await client.get(url, params=params, timeout=10)
                response.raise_for_status()
                data = response.json()
                
                results = []
                for quote in data.get("quotes", [])[:limit]:
                    results.append({
                        "symbol": quote.get("symbol", ""),
                        "name": quote.get("longname") or quote.get("shortname", ""),
                        "type": quote.get("typeDisp", "Stock"),
                        "exchange": quote.get("exchange", ""),
                        "market": quote.get("market", "")
                    })
                
                # 缓存30分钟
                await redis_client.set_json(cache_key, results, expire=1800)
                
                return [SymbolSearchResponse(**item) for item in results]
                
        except Exception as e:
            # 如果API失败，返回一些常见的符号作为备选
            common_symbols = [
                {"symbol": "AAPL", "name": "Apple Inc.", "type": "Stock", "exchange": "NASDAQ", "market": "us_market"},
                {"symbol": "GOOGL", "name": "Alphabet Inc.", "type": "Stock", "exchange": "NASDAQ", "market": "us_market"},
                {"symbol": "MSFT", "name": "Microsoft Corporation", "type": "Stock", "exchange": "NASDAQ", "market": "us_market"},
                {"symbol": "TSLA", "name": "Tesla, Inc.", "type": "Stock", "exchange": "NASDAQ", "market": "us_market"},
                {"symbol": "AMZN", "name": "Amazon.com, Inc.", "type": "Stock", "exchange": "NASDAQ", "market": "us_market"}
            ]
            
            filtered = [s for s in common_symbols if query.upper() in s["symbol"] or query.lower() in s["name"].lower()]
            return [SymbolSearchResponse(**item) for item in filtered[:limit]]
    
    async def get_batch_data(self, symbols: List[str]) -> List[MarketDataResponse]:
        """批量获取股票数据"""
        tasks = [self.get_symbol_data(symbol) for symbol in symbols]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        valid_results = []
        for result in results:
            if isinstance(result, MarketDataResponse):
                valid_results.append(result)
            elif isinstance(result, Exception):
                # 对于失败的请求，返回空数据
                continue
        
        return valid_results
    
    async def get_historical_data(self, symbol: str, interval: str, period: str) -> List[HistoricalDataResponse]:
        """获取历史数据"""
        cache_key = f"history:{symbol}:{interval}:{period}"
        cached_data = await redis_client.get_json(cache_key)
        
        if cached_data:
            return [HistoricalDataResponse(**item) for item in cached_data]
        
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period, interval=interval)
            
            if hist.empty:
                return []
            
            results = []
            for timestamp, row in hist.iterrows():
                results.append({
                    "timestamp": timestamp.isoformat(),
                    "open": float(row["Open"]),
                    "high": float(row["High"]),
                    "low": float(row["Low"]),
                    "close": float(row["Close"]),
                    "volume": int(row["Volume"]) if row["Volume"] else 0
                })
            
            # 缓存15分钟
            await redis_client.set_json(cache_key, results, expire=900)
            
            return [HistoricalDataResponse(**item) for item in results]
            
        except Exception as e:
            raise ValueError(f"Failed to fetch historical data for {symbol}: {str(e)}")
    
    async def get_trending_symbols(self, limit: int = 20) -> List[Dict[str, Any]]:
        """获取热门股票"""
        cache_key = f"trending:{limit}"
        cached_data = await redis_client.get_json(cache_key)
        
        if cached_data:
            return cached_data
        
        # 返回一些热门股票作为示例
        trending_symbols = [
            "AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "META", "NVDA", "BRK-B", 
            "JPM", "JNJ", "V", "PG", "UNH", "HD", "MA", "DIS", "PYPL", "ADBE", "NFLX", "CRM"
        ]
        
        # 获取这些符号的当前数据
        tasks = [self.get_symbol_data(symbol) for symbol in trending_symbols[:limit]]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        valid_results = []
        for result in results:
            if isinstance(result, MarketDataResponse):
                valid_results.append(result.dict())
        
        # 按涨跌幅排序
        valid_results.sort(key=lambda x: x.get("change_percent", 0), reverse=True)
        
        # 缓存10分钟
        await redis_client.set_json(cache_key, valid_results, expire=600)
        
        return valid_results
    
    async def get_sector_performance(self) -> List[Dict[str, Any]]:
        """获取板块表现"""
        cache_key = "sector_performance"
        cached_data = await redis_client.get_json(cache_key)
        
        if cached_data:
            return cached_data
        
        # 示例板块数据
        sectors = [
            {"name": "Technology", "symbol": "XLK", "change_percent": 2.1},
            {"name": "Healthcare", "symbol": "XLV", "change_percent": 1.8},
            {"name": "Financial", "symbol": "XLF", "change_percent": -0.5},
            {"name": "Consumer Discretionary", "symbol": "XLY", "change_percent": 0.9},
            {"name": "Communication Services", "symbol": "XLC", "change_percent": 1.2},
            {"name": "Industrial", "symbol": "XLI", "change_percent": 0.3},
            {"name": "Consumer Staples", "symbol": "XLP", "change_percent": -0.2},
            {"name": "Energy", "symbol": "XLE", "change_percent": -1.1},
            {"name": "Utilities", "symbol": "XLU", "change_percent": 0.7},
            {"name": "Real Estate", "symbol": "XLRE", "change_percent": 0.4}
        ]
        
        # 缓存30分钟
        await redis_client.set_json(cache_key, sectors, expire=1800)
        
        return sectors