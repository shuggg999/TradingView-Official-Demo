from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Index
from sqlalchemy.sql import func
from app.core.database import Base

class MarketData(Base):
    __tablename__ = "market_data"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), nullable=False, index=True)
    name = Column(String(200), nullable=True)
    
    # 价格数据
    price = Column(Float, nullable=False)
    open_price = Column(Float, nullable=True)
    high_price = Column(Float, nullable=True)
    low_price = Column(Float, nullable=True)
    prev_close = Column(Float, nullable=True)
    
    # 变化数据
    change = Column(Float, nullable=True)
    change_percent = Column(Float, nullable=True)
    
    # 交易数据
    volume = Column(Integer, nullable=True)
    market_cap = Column(Integer, nullable=True)
    
    # 元数据
    market = Column(String(50), nullable=True)  # NYSE, NASDAQ, etc.
    sector = Column(String(100), nullable=True)
    currency = Column(String(10), default="USD")
    
    # 时间戳
    data_time = Column(DateTime(timezone=True), nullable=False)  # 数据时间
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 创建复合索引
    __table_args__ = (
        Index('idx_symbol_time', 'symbol', 'data_time'),
    )
    
    def __repr__(self):
        return f"<MarketData {self.symbol}: ${self.price}>"

class HistoricalData(Base):
    __tablename__ = "historical_data"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), nullable=False, index=True)
    
    # OHLCV数据
    open = Column(Float, nullable=False)
    high = Column(Float, nullable=False)
    low = Column(Float, nullable=False)
    close = Column(Float, nullable=False)
    volume = Column(Integer, nullable=True)
    
    # 调整价格
    adj_close = Column(Float, nullable=True)
    
    # 时间间隔和时间戳
    interval = Column(String(10), nullable=False)  # 1m, 5m, 1h, 1d, etc.
    timestamp = Column(DateTime(timezone=True), nullable=False)
    
    # 元数据
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 创建复合索引
    __table_args__ = (
        Index('idx_symbol_interval_time', 'symbol', 'interval', 'timestamp'),
    )
    
    def __repr__(self):
        return f"<HistoricalData {self.symbol}@{self.timestamp}: ${self.close}>"