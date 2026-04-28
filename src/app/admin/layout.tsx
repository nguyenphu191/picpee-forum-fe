'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ShieldCheck, Users, ListTodo, Settings, Banknote, Tag, FolderTree } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  if (isLoading) return null;
  if (!user || user.role !== 'ADMIN') {
     if (typeof window !== 'undefined') router.push('/');
     return null;
  }

  const tabs = [
    { name: 'Thống kê', href: '/admin/analytics', icon: <ShieldCheck className="w-4 h-4" /> },
    { name: 'Nhiệm vụ', href: '/admin/tasks', icon: <ListTodo className="w-4 h-4" /> },
    { name: 'Rút tiền', href: '/admin/withdrawals', icon: <Banknote className="w-4 h-4" /> },
    { name: 'Người dùng', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { name: 'Chủ đề', href: '/admin/categories', icon: <FolderTree className="w-4 h-4" /> },
    { name: 'Thẻ (Tags)', href: '/admin/tags', icon: <Tag className="w-4 h-4" /> },
    { name: 'Thông báo', href: '/admin/notifications', icon: <ShieldCheck className="w-4 h-4" /> },
    { name: 'Cài đặt hệ thống', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="lg:col-span-12 space-y-6">
      {/* Admin Tab Navigation */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-3xl glass border border-white/20 shadow-sm overflow-hidden">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-xl font-black">Trung tâm Quản trị</h2>
               <p className="text-xs font-bold text-gray-500">Quản lý toàn diện hệ thống</p>
            </div>
         </div>
         
         <div className="flex gap-1 p-1 bg-gray-50 rounded-2xl dark:bg-slate-900 border border-gray-100 dark:border-slate-800 overflow-x-auto scrollbar-none">
            {tabs.map(tab => {
              const isActive = pathname.startsWith(tab.href);
              return (
                 <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                       isActive
                          ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm border border-gray-100 dark:border-slate-700'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-slate-800/50'
                    }`}
                 >
                    {tab.icon} {tab.name}
                 </Link>
              );
            })}
         </div>
      </div>

      {/* Admin Content */}
      <div className="pb-20">
         {children}
      </div>
    </div>
  );
}
