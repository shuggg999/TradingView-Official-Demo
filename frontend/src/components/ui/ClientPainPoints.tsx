'use client';

import { AlertCircle, TrendingDown, Users, Clock } from 'lucide-react';

const painPoints = [
  {
    icon: AlertCircle,
    title: '技术指标严重不足',
    current: '仅提供10个基础指标',
    needed: '客户需要100+专业指标',
    impact: '无法满足专业分析需求',
    severity: 'critical'
  },
  {
    icon: TrendingDown,
    title: '实时数据流缺失',
    current: '15分钟延迟数据',
    needed: '毫秒级实时推送',
    impact: '影响交易决策时效性',
    severity: 'high'
  },
  {
    icon: Users,
    title: '品牌定制受限',
    current: '固定样式无法修改',
    needed: '完全自定义界面',
    impact: '无法融入客户品牌体系',
    severity: 'medium'
  },
  {
    icon: Clock,
    title: '多图表同步问题',
    current: '单图表独立运行',
    needed: '多图表联动分析',
    impact: '降低分析效率50%',
    severity: 'high'
  }
];

export const ClientPainPoints = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'high':
        return 'border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            当前图表功能限制正在影响业务发展
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们的企业客户正面临严重的功能限制，急需升级到TradingView Advanced Charts
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${getSeverityColor(point.severity)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Icon className="w-8 h-8 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {point.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-medium">当前：</span>
                        <span className="text-gray-700">{point.current}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium">需求：</span>
                        <span className="text-gray-700">{point.needed}</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-600">
                          <strong>业务影响：</strong> {point.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
          <div className="flex items-center justify-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <p className="text-lg text-red-800 font-medium">
              紧急提醒：已有3家大型客户因功能限制考虑更换服务商
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};