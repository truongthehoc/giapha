'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  GitFork, 
  Users, 
  CalendarDays, 
  Coins, 
  Sparkles, 
  BookOpen, 
  Home, 
  Menu, 
  X,
  TreeDeciduous
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Trang Chủ', icon: Home },
  { href: '/tree', label: 'Phả Đồ', icon: GitFork },
  { href: '/members', label: 'Thành Viên', icon: Users },
  { href: '/events', label: 'Giỗ Chạp & Sự Kiện', icon: CalendarDays },
  { href: '/kinship', label: 'Tra Cứu Xưng Hô', icon: Sparkles },
  { href: '/funds', label: 'Quỹ Dòng Họ', icon: Coins },
  { href: '/culture', label: 'Tộc Ước & Lịch Sử', icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#341d13]/95 backdrop-blur-md border-b border-[#6f432d] text-amber-50 shadow-lg">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Tên Dòng Họ (Không xuống dòng) */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-[#341d13] shadow-md group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <TreeDeciduous className="w-6 h-6" />
            </div>
            <div className="whitespace-nowrap flex flex-col justify-center">
              <span className="block text-[10px] sm:text-xs uppercase tracking-widest text-amber-300 font-semibold leading-tight">
                Gia Phả Đại Tộc
              </span>
              <span className="text-base sm:text-lg xl:text-xl font-bold font-serif text-amber-100 group-hover:text-amber-300 transition-colors leading-tight">
                Nguyễn Tộc Tiên Điền
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Luôn trên 1 dòng duy nhất) */}
          <nav className="hidden xl:flex items-center space-x-1.5 flex-nowrap overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs 2xl:text-sm font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
                    isActive
                      ? 'bg-amber-700/70 text-amber-200 border border-amber-500/50 shadow-sm'
                      : 'text-stone-300 hover:text-amber-100 hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile / Tablet Menu Button */}
          <div className="flex xl:hidden flex-shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-amber-200 hover:bg-stone-800 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#2a170f] border-b border-[#6f432d] px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-700/60 text-amber-200'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
