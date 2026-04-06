'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, MessageSquare, Users, Star, Layers, ChevronRight, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import Sidebar from '@/components/layout/Sidebar';

interface Board {
  id: string;
  name: string;
  slug: string;
  description: string;
  _count: { threads: number };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  boards: Board[];
}

export default function Home() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/forum/categories');
      return data;
    },
  });

  return (
    <>
      <div className="xl:col-span-8 space-y-8">
        {/* COMPACT BANNER */}
        <header className="relative p-8 rounded-2xl overflow-hidden border border-emerald-500/10 shadow-sm">
          {/* Background effects */}
          <div className="absolute inset-0 bg-linear-to-br from-emerald-600 to-emerald-800 dark:from-emerald-700 dark:to-emerald-900" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-black text-white font-heading tracking-tight">
                Chào mừng bạn tới Picpee Forum
              </h1>
              <p className="text-emerald-50/80 text-sm max-w-md font-medium">
                Cộng đồng MMO & Freelance lớn nhất Việt Nam. Cùng nhau chia sẻ, cùng nhau kiếm tiền.
              </p>
            </div>
            <div className="flex shrink-0">
               <Link href="/marketing" className="px-6 py-2.5 bg-white text-emerald-700 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-emerald-50 transition-all shadow-lg shadow-black/5">
                 Bắt đầu kiếm tiền
               </Link>
            </div>
          </motion.div>
        </header>

        {/* FEED FILTERS */}
        <div className="flex items-center justify-between px-2">
           <div className="flex gap-4">
              <button className="text-xs font-black uppercase tracking-widest text-emerald-500 border-b-2 border-emerald-500 pb-1">Tất cả</button>
              <button className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors">Theo dõi</button>
              <button className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors">Trending</button>
           </div>
           <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
              <Activity className="w-3 h-3" />
              <span>1,240 Online</span>
           </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse bg-zinc-100 dark:bg-zinc-800" />)}
          </div>
        ) : (
          <section className="space-y-10 pb-10">
            {categories?.map((cat) => (
              <div key={cat.id} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                    <span className="w-1 h-3 bg-emerald-500 rounded-full" />
                    {cat.name}
                  </h2>
                  <Link href={`/category/${cat.slug}`} className="text-[10px] font-black uppercase text-emerald-500 hover:text-emerald-400 hover:underline">Xem tất cả</Link>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {cat.boards.map((board) => (
                    <Link href={`/board/${board.slug}`} key={board.id}>
                      <motion.div 
                        whileHover={{ x: 4 }}
                        className="group p-5 forum-card rounded-2xl flex items-center justify-between gap-6"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300">
                            <Layers className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-black text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {board.name}
                            </h3>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium line-clamp-1">
                              {board.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-tighter text-zinc-400 shrink-0">
                           <div className="hidden sm:flex flex-col items-center">
                              <span className="text-zinc-700 dark:text-zinc-200">{board._count.threads}</span>
                              <span className="text-[9px] opacity-70">Chủ đề</span>
                           </div>
                           <ChevronRight className="w-4 h-4 text-zinc-400 dark:text-zinc-300 group-hover:text-emerald-500 translate-x-0 group-hover:translate-x-1 transition-all" />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      <div className="xl:col-span-4 hidden xl:block">
        <Sidebar />
      </div>
    </>
  );
}
