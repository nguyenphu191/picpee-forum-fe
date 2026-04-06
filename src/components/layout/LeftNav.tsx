'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  TrendingUp,
  Tag,
  Zap,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  LayoutDashboard,
  Wallet,
  FileText,
  Bookmark
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

export default function LeftNav() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { icon: Home, label: 'Trang chủ', href: '/' },
    { icon: TrendingUp, label: 'Xu hướng', href: '/trending' },
    { icon: Tag, label: 'Thanh tìm kiếm Tag', href: '/tags' },
    { icon: Zap, label: 'Nhiệm vụ Marketing', href: '/marketing', color: 'text-emerald-500' },
    { icon: Wallet, label: 'Ví tiền của tôi', href: '/wallet', color: 'text-blue-400' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] sticky top-16 py-6 pr-4 space-y-8 overflow-y-auto">
      {/* Main Nav */}
      <nav className="space-y-1">
        <div className="h-4.5 mb-2" />
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`nav-item ${isActive(item.href) ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : ''}`}>
              <item.icon className={`w-4 h-4 ${item.color || ''}`} />
              <span className="flex-1">{item.label}</span>
              {isActive(item.href) && <motion.div layoutId="nav-indicator" className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </div>
          </Link>
        ))}
      </nav>

      {/* Boards Quick Access (Static for now) */}
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 px-4 mb-2 block">Cộng đồng</span>
        <Link href="/board/share-earn-tips">
           <div className="nav-item">
              <div className="w-4 h-4 rounded text-[10px] flex items-center justify-center font-black bg-zinc-100 dark:bg-zinc-800">S</div>
              <span>Share & Earn</span>
           </div>
        </Link>
        <Link href="/board/thiet-ke-do-hoa">
           <div className="nav-item">
              <div className="w-4 h-4 rounded text-[10px] flex items-center justify-center font-black bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20">D</div>
              <span>Thiết kế đồ họa</span>
           </div>
        </Link>
      </div>

      {/* Account Section */}
      <div className="mt-auto space-y-1 pt-6 border-t border-zinc-200 dark:border-zinc-700">
        {user ? (
          <>
            {user.role === 'ADMIN' && (
              <Link href="/admin">
                <div className={`nav-item ${pathname.startsWith('/admin') ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : ''}`}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Panel</span>
                </div>
              </Link>
            )}
            <Link href="/bookmarks">
              <div className={`nav-item ${isActive('/bookmarks') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : ''}`}>
                <Bookmark className="w-4 h-4" />
                <span>Bài viết đã lưu</span>
              </div>
            </Link>
            <Link href="/my-threads">
              <div className={`nav-item ${isActive('/my-threads') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : ''}`}>
                <FileText className="w-4 h-4" />
                <span>Bài viết của tôi</span>
              </div>
            </Link>
            <Link href="/settings">
              <div className={`nav-item ${isActive('/settings') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : ''}`}>
                <Settings className="w-4 h-4" />
                <span>Cài đặt</span>
              </div>
            </Link>
            <button 
              onClick={() => logout()}
              className="w-full nav-item text-red-400! hover:text-red-300! hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </>
        ) : (
          <Link href="/login">
            <div className="nav-item bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
              <Users className="w-4 h-4" />
              <span>Tham gia Picpee</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
