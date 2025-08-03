'use client';

import { useState, useEffect } from 'react';

export const UrgentNotification = () => {
  const [daysWaiting, setDaysWaiting] = useState(45);

  useEffect(() => {
    // 模拟等待天数递增
    const timer = setInterval(() => {
      setDaysWaiting(prev => prev + 1);
    }, 86400000); // 每24小时增加1天

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-red-600 text-white relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-red-700 opacity-50 animate-pulse"></div>
      <div className="relative z-10 py-3 px-4 text-center">
        <p className="font-semibold text-sm md:text-base flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-block animate-bounce">⚠️</span>
          <span className="text-center">
            重要通知：50+企业客户正在等待高级图表功能升级 
            <span className="font-bold ml-2 text-yellow-300">
              (已等待{daysWaiting}天)
            </span>
          </span>
          <span className="hidden lg:inline-block ml-2 text-yellow-300">
            • 3家客户正在考虑转向竞争对手
          </span>
        </p>
      </div>
    </div>
  );
};