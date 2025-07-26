import React from 'react'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calculator, TrendingUp, BarChart3, PieChart, Target, Zap } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '学习工具 - 智投教育',
  description: '丰富的投资学习工具和计算器，帮助你更好地理解和应用投资知识。',
}

interface Tool {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  status: '可用' | '即将推出'
}

const tools: Tool[] = [
  {
    id: '1',
    title: '复利计算器',
    description: '计算复利投资的未来价值，了解复利的威力',
    icon: Calculator,
    category: '计算工具',
    status: '可用'
  },
  {
    id: '2',
    title: '风险评估工具',
    description: '评估投资组合的风险水平，制定合适的投资策略',
    icon: Target,
    category: '风险管理',
    status: '可用'
  },
  {
    id: '3',
    title: '资产配置建议',
    description: '根据个人情况提供个性化的资产配置建议',
    icon: PieChart,
    category: '投资规划',
    status: '可用'
  },
  {
    id: '4',
    title: '技术指标模拟器',
    description: '在线模拟各种技术指标，理解其计算方法和应用',
    icon: TrendingUp,
    category: '技术分析',
    status: '即将推出'
  },
  {
    id: '5',
    title: '图表形态识别练习',
    description: '通过互动练习提升图表形态的识别能力',
    icon: BarChart3,
    category: '技术分析',
    status: '即将推出'
  },
  {
    id: '6',
    title: '实时数据分析工具',
    description: '结合TradingView高级图表，进行专业的实时数据分析',
    icon: Zap,
    category: '实时分析',
    status: '即将推出'
  }
]

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon
  
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6" />
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${
            tool.status === '可用' 
              ? 'bg-green-500/10 text-green-600' 
              : 'bg-yellow-500/10 text-yellow-600'
          }`}>
            {tool.status}
          </span>
        </div>
        <CardTitle className="text-xl">{tool.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{tool.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{tool.category}</span>
          <Button 
            variant={tool.status === '可用' ? 'default' : 'outline'}
            size="sm"
            disabled={tool.status !== '可用'}
          >
            {tool.status === '可用' ? '立即使用' : '正在开发'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ToolsPage() {
  const categories = [...new Set(tools.map(tool => tool.category))]
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              学习工具
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              丰富的投资学习工具和计算器，让理论知识与实践相结合
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        {/* TradingView Integration Notice */}
        <section className="mb-16">
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-xl">📈 TradingView 高级图表即将集成</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                我们正在申请 TradingView 企业级高级图表库，将为以下工具提供专业的图表支持：
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>技术指标实时分析</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>绘图工具交互练习</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>历史数据回放分析</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tools by Category */}
        {categories.map(category => {
          const categoryTools = tools.filter(tool => tool.category === category)
          
          return (
            <section key={category} className="mb-16">
              <h2 className="text-2xl font-bold mb-8">{category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )
        })}

        {/* Coming Soon */}
        <section className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">更多工具正在开发中</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                我们正在不断完善平台功能，更多实用的学习工具即将上线。
                欢迎关注我们的更新动态！
              </p>
              <Button>反馈建议</Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}