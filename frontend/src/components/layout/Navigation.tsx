'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/education', label: '课程中心' },
    { href: '/practice', label: '实操训练' },
    { href: '/community', label: '学习社区' },
    { href: '/about', label: '关于我们' }
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="bg-white border-b border-gray-300 px-8 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold text-[#002244]">
          SmartFin Education
        </Link>
        
        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors relative ${
                isActive(item.href)
                  ? 'text-[#002244]'
                  : 'text-gray-700 hover:text-[#002244]'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-[#002244]"></div>
              )}
            </Link>
          ))}
        </div>
        
        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Link 
            href="/login" 
            className="px-6 py-2 text-[#002244] border border-[#002244] rounded-md hover:bg-[#002244] hover:text-white transition-all text-sm font-medium"
          >
            登录
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-2 bg-[#002244] text-white rounded-md hover:bg-[#001122] transition-all text-sm font-medium"
          >
            注册
          </Link>
        </div>
      </div>
    </nav>
  );
}