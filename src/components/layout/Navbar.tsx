'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { Moon, Sun, Search, User, Menu, LogOut, Bell, Settings, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { user, fetchMe, logout } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* LOGO */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link href="/" className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent tracking-tighter">
            PICPEE FORUM
          </Link>
        </div>
        
        {/* SEARCH - CENTERED */}
        <div className="hidden md:flex relative flex-1 max-w-xl group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Tìm kiếm chủ đề, bài viết, thành viên..." 
            className="block w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border-none focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20 transition-all text-base outline-none placeholder:text-zinc-400 font-bold"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              <NotificationDropdown />
              <div className="hidden sm:block h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />
            </>
          )}

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </motion.button>

          <AnimatePresence mode='wait'>
            {user ? (
              <div className="flex items-center gap-2">
                <Link href={`/user/${user.username}`} className="group flex items-center gap-3 p-1.5 pr-4 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-sm overflow-hidden p-0.5">
                    <img 
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                      alt="avatar" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-zinc-100">{user.username}</span>
                    <span className="text-[10px] font-bold text-emerald-500 leading-none">Uy tín: {user.reputation}</span>
                  </div>
                </Link>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                Đăng nhập
              </Link>
            )}
          </AnimatePresence>

          <button className="md:hidden p-2 text-zinc-500">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
