'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, User, Heart, MessageSquare, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';
import { useState } from 'react';

interface Notification {
  id: string;
  type: 'REPLY' | 'LIKE' | 'REWARD' | 'MENTION';
  content: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
  sender: { username: string, avatarUrl: string | null } | null;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications');
      return data;
    },
    refetchInterval: 30000, // Prefetch every 30s
  });

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.post(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.post('/notifications/read-all'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  return (
    <div className="relative">
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 md:w-96 rounded-3xl bg-white border border-zinc-200 shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <span className="font-black text-sm uppercase tracking-widest text-zinc-900">Thông báo</span>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-tighter"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto divide-y divide-zinc-100 custom-scrollbar">
              {notifications?.length === 0 ? (
                <div className="p-12 text-center text-zinc-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Chưa có thông báo nào</p>
                </div>
              ) : (
                notifications?.map((n) => (
                  <Link 
                    key={n.id} 
                    href={n.link || '#'} 
                    onClick={() => {
                      if (!n.isRead) markReadMutation.mutate(n.id);
                      setIsOpen(false);
                    }}
                    className={`p-4 flex gap-4 hover:bg-zinc-50 transition-colors ${!n.isRead ? 'bg-emerald-50/30' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 shrink-0 flex items-center justify-center overflow-hidden border border-zinc-200">
                       {n.sender ? (
                         <img src={n.sender.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.sender.username}`} className="w-full h-full object-cover" />
                       ) : (
                         <Award className="w-5 h-5 text-yellow-600" />
                       )}
                    </div>
                    <div className="flex-1 space-y-1">
                       <p className="text-xs text-zinc-900 leading-snug">
                          <span className="font-black text-zinc-900">{n.sender?.username || 'Hệ thống'}</span> {n.content}
                       </p>
                       <span className="text-[10px] text-zinc-500 font-bold">{new Date(n.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {!n.isRead && <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shadow-lg shadow-emerald-500/20" />}
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
