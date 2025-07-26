import Navigation from '@/components/Navigation'
import MarketData, { StockMarketData, CryptoMarketData, IndexMarketData } from '@/components/MarketData'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '市场数据 - 智投教育',
  description: '实时股票、外汇、加密货币市场数据，配合专业图表分析工具，提供全面的市场信息。',
}

export default function MarketPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">市场数据</h1>
          <p className="text-lg text-muted-foreground">
            实时金融市场数据，配合TradingView专业图表进行技术分析学习
          </p>
        </div>

        {/* TradingView Integration Preview */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/20 to-slate-800/20 rounded-lg border border-border">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              📈 TradingView 专业图表即将上线
            </h2>
            <p className="text-muted-foreground mb-4">
              正在申请 TradingView 企业级高级图表库，为教育平台提供专业的技术分析工具
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-card p-3 rounded-lg shadow-sm border border-border">
                <div className="text-sm font-medium text-foreground">✓ 100+ 技术指标</div>
              </div>
              <div className="bg-card p-3 rounded-lg shadow-sm border border-border">
                <div className="text-sm font-medium text-foreground">✓ 专业绘图工具</div>
              </div>
              <div className="bg-card p-3 rounded-lg shadow-sm border border-border">
                <div className="text-sm font-medium text-foreground">✓ 多时间周期</div>
              </div>
              <div className="bg-card p-3 rounded-lg shadow-sm border border-border">
                <div className="text-sm font-medium text-foreground">✓ 历史数据回放</div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Data Grid */}
        <div className="space-y-8">
          {/* Stock Market */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">美股市场</h2>
            <StockMarketData />
          </div>

          {/* Index Market */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">主要指数</h2>
            <IndexMarketData />
          </div>

          {/* Crypto Market */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">加密货币</h2>
            <CryptoMarketData />
          </div>

          {/* Forex Market */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">外汇市场</h2>
            <MarketData symbols={['EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'USDCAD=X']} />
          </div>
        </div>

        {/* Educational Notice */}
        <div className="mt-12 p-6 bg-amber-900/20 border border-amber-800/30 rounded-lg">
          <h3 className="text-lg font-semibold text-amber-400 mb-2">
            📚 教育目的声明
          </h3>
          <p className="text-amber-200/80">
            本平台提供的市场数据仅供教育和学习目的使用，不构成投资建议。
            投资有风险，请理性决策，做好风险管理。
          </p>
        </div>
      </main>
    </div>
  )
}