'use client';

import { useQuery } from '@tanstack/react-query';
import { 
  BarChart3, 
  MousePointerClick, 
  ThumbsUp, 
  Eye, 
  TrendingUp, 
  Search,
  ArrowUpRight
} from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';

interface AnalyticsStat {
  totalViews: number;
  totalClicks: number;
  totalLikes: number;
  topThreads: {
    title: string;
    views: number;
    likes: number;
  }[];
}

export default function AdminAnalyticsPage() {
  const { data: stats, isLoading } = useQuery<AnalyticsStat>({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data } = await api.get('/forum/admin/analytics');
      return data;
    },
  });

  if (isLoading) return (
    <div className="space-y-6 animate-pulse">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-3xl" />)}
       </div>
       <div className="h-96 bg-zinc-100 dark:bg-zinc-800 rounded-3xl" />
    </div>
  );

  const cards = [
    { label: 'Tổng lượt xem', value: stats?.totalViews, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Tổng lượt Click', value: stats?.totalClicks, icon: MousePointerClick, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Tổng lượt Thích', value: stats?.totalLikes, icon: ThumbsUp, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/20">
               <BarChart3 className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-2xl font-black text-zinc-100">Thống kê hệ thống</h1>
               <p className="text-sm font-medium text-zinc-500">Dữ liệu phân tích thời gian thực</p>
            </div>
         </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {cards.map((card, i) => (
            <motion.div 
               key={card.label}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="p-6 forum-card rounded-3xl space-y-4"
            >
               <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                     <card.icon className="w-5 h-5" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
               </div>
               <div>
                  <div className="text-3xl font-black text-zinc-100">{card.value?.toLocaleString() || 0}</div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{card.label}</div>
               </div>
            </motion.div>
         ))}
      </div>

      {/* Top Threads List */}
      <div className="p-8 forum-card rounded-[2.5rem] space-y-6">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black flex items-center gap-2 text-zinc-100">
               <TrendingUp className="w-5 h-5 text-emerald-500" />
               Bài viết nổi bật nhất
            </h3>
            <button className="text-xs font-black uppercase text-emerald-600 hover:underline">Xuất báo cáo</button>
         </div>

         <div className="space-y-2">
            {stats?.topThreads.map((thread, i) => (
               <div 
                  key={i}
                  className="group flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
               >
                  <div className="flex items-center gap-4 min-w-0">
                     <span className="w-6 text-xs font-black text-zinc-300 italic">{i + 1}</span>
                     <h4 className="font-bold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-emerald-500 transition-colors">
                        {thread.title}
                     </h4>
                  </div>
                  <div className="flex items-center gap-8 shrink-0 ml-4">
                     <div className="text-right">
                        <div className="text-sm font-black flex items-center gap-1.5 justify-end">
                           <Eye className="w-3 h-3 text-zinc-400" /> {thread.views}
                        </div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Lượt xem</div>
                     </div>
                     <div className="text-right">
                        <div className="text-sm font-black flex items-center gap-1.5 justify-end text-red-500">
                           <ThumbsUp className="w-3 h-3" /> {thread.likes}
                        </div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Yêu thích</div>
                     </div>
                     <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-emerald-500 transition-all" />
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
