'use client';

import { BookOpen, TrendingUp } from 'lucide-react';

export const EducationNotice = () => {
  return (
    <div className="bg-blue-50 border-b border-blue-100">
      <div className="max-w-6xl mx-auto px-8 py-3">
        <div className="flex items-center justify-center gap-3 text-blue-800">
          <BookOpen className="w-5 h-5" />
          <p className="text-sm md:text-base font-medium">
            为提升教学质量，我们正在申请TradingView高级图表库访问权限
          </p>
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};