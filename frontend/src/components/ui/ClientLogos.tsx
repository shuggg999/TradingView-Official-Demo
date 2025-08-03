'use client';

import { useEffect, useRef } from 'react';

const clients = [
  { name: '华泰证券', type: '证券公司' },
  { name: '中信证券', type: '证券公司' },
  { name: '易方达基金', type: '基金公司' },
  { name: '南方基金', type: '基金公司' },
  { name: '中金财富', type: '投资顾问' },
  { name: '恒生电子', type: '技术服务' },
  { name: '同花顺', type: '金融科技' },
  { name: '东方财富', type: '综合金融' },
];

export const ClientLogos = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;

    const animate = () => {
      scrollPosition += 0.5;
      if (scrollContainer.scrollWidth / 2 <= scrollPosition) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            服务50+领先金融机构
          </h2>
          <p className="text-lg text-gray-600">
            我们的平台已经成为众多金融机构的核心基础设施
          </p>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-12 overflow-x-hidden whitespace-nowrap"
          style={{ scrollBehavior: 'auto' }}
        >
          {/* 复制两次以实现无缝滚动 */}
          {[...clients, ...clients].map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="flex-none"
            >
              <div className="w-48 h-24 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-lg font-semibold text-gray-800">
                  {client.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {client.type}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            * 部分客户展示，更多客户案例请联系销售团队
          </p>
        </div>
      </div>
    </section>
  );
};