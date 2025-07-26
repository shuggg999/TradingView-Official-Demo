import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, Users, BookOpen, Shield, TrendingUp, Award } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于我们 - 智投教育',
  description: '了解智投教育的使命、愿景和价值观，为投资者提供专业、免费的金融教育服务。',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              关于智投教育
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              致力于提升大众金融素养，打造专业、免费的投资教育平台
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Target className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">我们的使命</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  透过免费、专业的金融教育，帮助更多人掌握投资知识和技能，实现财富的稳健增长。
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 提供系统化的投资教育课程</li>
                  <li>• 普及正确的投资理念和方法</li>
                  <li>• 帮助投资者避免常见错误</li>
                  <li>• 提升整个社会的金融素养</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">我们的愿景</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  成为中国领先的互联网金融教育平台，让每个普通人都能获得专业的投资教育。
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 打破金融教育的门槛和壁垒</li>
                  <li>• 让优质教育资源惠及更多人群</li>
                  <li>• 培养理性、成熟的投资者</li>
                  <li>• 促进金融市场健康发展</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">核心价值观</h2>
            <p className="text-muted-foreground">
              指导我们行动的基本原则和信念
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-blue-500/10 rounded-full w-fit mb-4">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle>专业至上</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  始终坚持专业标准，提供科学、准确的投资知识和方法。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-green-500/10 rounded-full w-fit mb-4">
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle>免费公益</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  所有核心教育内容完全免费，让知识不再成为少数人的特权。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-purple-500/10 rounded-full w-fit mb-4">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle>用户至上</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  以用户需求为中心，不断优化学习体验和教育质量。
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">为什么选择我们</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">免费承诺</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10万+</div>
              <div className="text-sm text-muted-foreground">用户信赖</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">专业内容</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">在线学习</div>
            </div>
          </div>
        </section>

        {/* TradingView Integration */}
        <section className="mb-20">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">专业工具支持</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                我们正在申请集成 TradingView 企业级高级图表库，为学习者提供业界顶级的技术分析工具。
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">教育价值</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 100+ 专业技术指标教学</li>
                    <li>• 绘图工具实战练习</li>
                    <li>• 历史数据回放分析</li>
                    <li>• 多时间周期对比学习</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">免费承诺</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 所有功能对学习者完全免费</li>
                    <li>• 无付费会员制度</li>
                    <li>• 纯教育目的，非商业交易</li>
                    <li>• 广告收入维持运营</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <section className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">联系我们</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                有任何问题或建议，欢迎随时与我们联系
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button>反馈建议</Button>
                <Button variant="outline">加入交流群</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}