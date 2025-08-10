import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/config/auth';
import Navigation from '@/components/layout/Navigation';
import { PortfolioAnalysis } from '@/components/trading/PortfolioAnalysis';
import { ReturnStatistics } from '@/components/trading/ReturnStatistics';
import { RiskMetrics } from '@/components/trading/RiskMetrics';

export const metadata: Metadata = {
  title: '投资分析 - SmartFin教育平台',
  description: '查看您的投资组合分析、收益统计和风险指标',
};

export default async function TradingAnalysisPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/trading/analysis');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">投资分析</h1>
          <p className="text-gray-600 mt-2">深入分析您的投资组合表现和风险指标</p>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Portfolio Composition */}
          <PortfolioAnalysis />
          
          {/* Return Statistics */}
          <ReturnStatistics />
          
          {/* Risk Metrics */}
          <RiskMetrics />
        </div>
      </div>
    </div>
  );
}