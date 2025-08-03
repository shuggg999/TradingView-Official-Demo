'use client';

import { BookOpen, BarChart3, Users, Lightbulb } from 'lucide-react';

const learningNeeds = [
  {
    icon: BarChart3,
    title: '技术指标教学限制',
    current: '仅能演示10个基础指标',
    needed: '需要100+专业指标进行完整教学',
    impact: '用户无法掌握完整的技术分析体系',
    studentFeedback: '"希望能学到更多专业指标的使用方法"'
  },
  {
    icon: BookOpen,
    title: '绘图工具教学不足',
    current: '缺少专业绘图工具',
    needed: '完整的趋势线、斐波那契等绘图套件',
    impact: '无法教授高级技术分析技巧',
    studentFeedback: '"想要学会像专业分析师一样绘制图表"'
  },
  {
    icon: Users,
    title: '实战体验差距',
    current: '简化版界面与真实环境差异大',
    needed: '专业级交易界面体验',
    impact: '用户难以适应真实交易环境',
    studentFeedback: '"希望在学习中就能熟悉真实的交易界面"'
  },
  {
    icon: Lightbulb,
    title: '高级功能缺失',
    current: '无法展示策略回测、多图表联动',
    needed: '完整的专业分析功能集',
    impact: '无法培养用户的高级分析能力',
    studentFeedback: '"想要学习量化分析和策略回测"'
  }
];

export const LearningNeeds = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            提升教学质量的迫切需求
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            当前图表功能限制影响教学效果，用户反馈希望获得更专业的学习体验
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {learningNeeds.map((need, index) => {
            const Icon = need.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {need.title}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-orange-600 font-medium text-sm">当前：</span>
                        <span className="text-gray-700 text-sm">{need.current}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-medium text-sm">需求：</span>
                        <span className="text-gray-700 text-sm">{need.needed}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <span className="text-sm text-gray-600">
                        <strong>教学影响：</strong> {need.impact}
                      </span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="text-sm text-blue-700 italic">
                        用户反馈：{need.studentFeedback}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-center gap-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <p className="text-lg text-blue-800 font-medium text-center">
              为了给用户提供更好的教育体验，我们正在申请TradingView Advanced Charts访问权限
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};