'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, MessageSquare, Clock, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Sidebar from '@/components/layout/Sidebar';

interface Thread {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  author: { username: string; avatarUrl: string | null };
  _count: { posts: number; likes: number };
  board: { name: string; slug: string };
  tags: { name: string; slug: string }[];
}

export default function TrendingPage() {
  const { data: threads, isLoading } = useQuery<Thread[]>({
    queryKey: ['trending-threads'],
    queryFn: async () => {
      const { data } = await api.get('/forum/trending');
      return data;
    },
  });

  return (
    <>
      <div className="lg:col-span-8 space-y-8">
      <div className="flex items-center gap-4 px-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
           <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-heading">Chủ đề Xu hướng</h1>
          <p className="text-zinc-500 text-sm font-medium">Bắt kịp những thảo luận nóng nhất trong cộng đồng</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse bg-zinc-100 dark:bg-zinc-800" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {threads?.map((thread, i) => (
            <motion.div 
              key={thread.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/thread/${thread.slug}`}>
                <div className="group p-5 forum-card rounded-2xl flex items-center gap-4 sm:gap-6 hover:border-emerald-500/30">
                  <div className="hidden sm:flex flex-col items-center justify-center w-12 text-zinc-400 dark:text-zinc-300 font-black text-xl italic group-hover:text-emerald-500 transition-colors">
                    {i + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full ring-1 ring-emerald-500/20">
                        {thread.board.name}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400">
                        • {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true, locale: vi })}
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-base font-black text-zinc-900 dark:text-zinc-200 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {thread.title}
                    </h2>
                    <div className="flex items-center gap-4 mt-2">
                       <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400">
                          <img 
                            src={thread.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${thread.author.username}`} 
                            className="w-4 h-4 rounded-full"
                          />
                          <span>{thread.author.username}</span>
                       </div>
                       <div className="flex items-center gap-3 text-[11px] font-black text-zinc-400">
                          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {thread._count.posts}</span>
                          <span className="flex items-center gap-1 text-emerald-500"><Star className="w-3.5 h-3.5 fill-current" /> {thread._count.likes || 0}</span>
                       </div>
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
    <div className="lg:col-span-4">
      <Sidebar />
    </div>
    </>
  );
}
