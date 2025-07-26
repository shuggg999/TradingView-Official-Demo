from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class MarketDataResponse(BaseModel):
    symbol: str = Field(..., description="股票代码")
    name: str = Field(..., description="公司名称")
    price: float = Field(..., description="当前价格")
    open: float = Field(..., description="开盘价")
    high: float = Field(..., description="最高价")
    low: float = Field(..., description="最低价")
    prev_close: float = Field(..., description="前收盘价")
    change: float = Field(..., description="涨跌额")
    change_percent: float = Field(..., description="涨跌幅(%)")
    volume: int = Field(..., description="成交量")
    market_cap: Optional[int] = Field(None, description="市值")
    market: Optional[str] = Field(None, description="交易所")
    sector: Optional[str] = Field(None, description="行业")
    currency: str = Field(default="USD", description="货币")
    updated_at: str = Field(..., description="更新时间")

class HistoricalDataResponse(BaseModel):
    timestamp: str = Field(..., description="时间戳")
    open: float = Field(..., description="开盘价")
    high: float = Field(..., description="最高价")
    low: float = Field(..., description="最低价")
    close: float = Field(..., description="收盘价")
    volume: int = Field(..., description="成交量")

class SymbolSearchResponse(BaseModel):
    symbol: str = Field(..., description="股票代码")
    name: str = Field(..., description="公司名称")
    type: str = Field(..., description="资产类型")
    exchange: str = Field(..., description="交易所")
    market: str = Field(..., description="市场")

class BatchDataRequest(BaseModel):
    symbols: list[str] = Field(..., min_items=1, max_items=50, description="股票代码列表")