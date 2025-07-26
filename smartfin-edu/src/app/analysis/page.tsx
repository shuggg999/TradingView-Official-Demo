import React from 'react'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, BarChart3, LineChart, Activity, Target, Zap } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '技术分析 - 智投教育',
  description: '学习技术分析的核心概念和方法，掌握图表分析和技术指标的实战应用。',
}

interface AnalysisMethod {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  difficulty: '初级' | '中级' | '高级'
  chartRequired: boolean
}

const analysisMethods: AnalysisMethod[] = [
  {
    id: '1',
    title: 'K线图分析',
    description: '学会读懂K线图，掌握单根K线和K线组合的含义',
    icon: BarChart3,
    difficulty: '初级',
    chartRequired: true
  },
  {
    id: '2',
    title: '趋势线分析',
    description: '学习如何绘制和识别趋势线，判断价格趋势',
    icon: LineChart,
    difficulty: '初级',
    chartRequired: true
  },
  {
    id: '3',
    title: '支撑位与阻力位',
    description: '识别关键的价格水平，制定交易策略',
    icon: Target,
    difficulty: '中级',
    chartRequired: true
  },
  {
    id: '4',
    title: '移动平均线系统',
    description: '掌握各种平均线的计算和应用方法',
    icon: Activity,
    difficulty: '中级',
    chartRequired: true
  },
  {
    id: '5',
    title: 'MACD 指标分析',
    description: '学习MACD指标的原理和实战信号识别',
    icon: TrendingUp,
    difficulty: '中级',
    chartRequired: true
  },
  {
    id: '6',
    title: '高级技术形态',
    description: '学习复杂的图表形态和高级分析技巧',
    icon: Zap,
    difficulty: '高级',
    chartRequired: true
  }
]

function AnalysisCard({ method }: { method: AnalysisMethod }) {
  const Icon = method.icon
  
  const difficultyColors = {
    '初级': 'bg-green-500/10 text-green-600',
    '中级': 'bg-yellow-500/10 text-yellow-600',
    '高级': 'bg-red-500/10 text-red-600'
  }
  
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6" />
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${difficultyColors[method.difficulty]}`}>
            {method.difficulty}
          </span>
        </div>
        <CardTitle className="text-xl">{method.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{method.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {method.chartRequired && (
              <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded">
                需要图表
              </span>
            )}
          </div>
          <Button size="sm">开始学习</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalysisPage() {
  const beginnerMethods = analysisMethods.filter(m => m.difficulty === '初级')
  const intermediateMethods = analysisMethods.filter(m => m.difficulty === '中级')
  const advancedMethods = analysisMethods.filter(m => m.difficulty === '高级')
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              技术分析
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              掌握技术分析的核心方法，提升市场走势判断能力
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        {/* TradingView Integration Highlight */}
        <section className="mb-20">
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-2xl">📈 专业图表工具集成中</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">为什么技术分析需要专业图表？</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>精确指标计算</strong>：100+ 种技术指标实时计算</li>
                    <li>• <strong>绘图工具</strong>：支撑位、趋势线等绘制工具</li>
                    <li>• <strong>多时间周期</strong>：同时分析多个时间框架</li>
                    <li>• <strong>历史回放</strong>：学习经典案例分析</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">TradingView 高级功能</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>实时数据</strong>：全球金融市场实时价格</li>
                    <li>• <strong>专业指标</strong>：RSI、MACD、布林带等</li>
                    <li>• <strong>图表模式</strong>：头肩顶、双底等形态识别</li>
                    <li>• <strong>策略回测</strong>：验证技术分析的有效性</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-background/50 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  🔍 我们正在申请 TradingView 企业级高级图表库，为教育平台提供专业的技术分析工具
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Learning Path */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">学习路径</h2>
            <p className="text-muted-foreground">
              按照由浅入深的顺序，逐步掌握技术分析的核心技能
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-green-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">基础入门</h3>
              <p className="text-muted-foreground text-sm">
                学习K线、趋势线等基础概念
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">进阶提升</h3>
              <p className="text-muted-foreground text-sm">
                掌握技术指标和市场分析方法
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">高级应用</h3>
              <p className="text-muted-foreground text-sm">
                学习复杂形态和高级策略
              </p>
            </div>
          </div>
        </section>

        {/* Analysis Methods by Level */}
        <section className="space-y-16">
          {/* Beginner */}
          <div>
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <span className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm mr-3">初级</span>
              基础分析方法
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {beginnerMethods.map(method => (
                <AnalysisCard key={method.id} method={method} />
              ))}
            </div>
          </div>

          {/* Intermediate */}
          <div>
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <span className="bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-full text-sm mr-3">中级</span>
              技术指标分析
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {intermediateMethods.map(method => (
                <AnalysisCard key={method.id} method={method} />
              ))}
            </div>
          </div>

          {/* Advanced */}
          <div>
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <span className="bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-sm mr-3">高级</span>
              高级分析技巧
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {advancedMethods.map(method => (
                <AnalysisCard key={method.id} method={method} />
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-20">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">开始你的技术分析之旅</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                系统学习技术分析，从基础概念到高级技巧，一步步提升你的分析能力
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button>从基础开始</Button>
                <Button variant="outline">查看学习计划</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}