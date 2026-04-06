'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Wallet as WalletIcon, 
  ChevronRight, 
  MessageSquare,
  Award,
  Zap,
  Info,
  Trophy,
  Star
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { AnimatePresence } from 'framer-motion';

interface SidebarThread {
  id: string;
  title: string;
  slug: string;
  _count: { posts: number };
}

interface WalletMini {
  balance: number;
  pendingBalance: number;
}

interface LeaderboardUser {
  id: string;
  username: string;
  avatarUrl: string | null;
  reputation: number;
}

export default function Sidebar() {
  const { user } = useAuthStore();

  const { data: hotThreads } = useQuery<SidebarThread[]>({
    queryKey: ['hot-threads'],
    queryFn: async () => {
      // For now, let's just get the latest threads as "hot"
      // In a real app, logic would be based on popularity
      const { data } = await api.get('/forum/categories');
      // Flatten all threads from all boards in first category for demo
      return data[0]?.boards[0]?.threads?.slice(0, 5) || [];
    }
  });

  const { data: wallet } = useQuery<WalletMini>({
    queryKey: ['wallet-mini'],
    queryFn: async () => {
      const { data } = await api.get('/forum/me/wallet');
      return data;
    },
    enabled: !!user
  });

  const { data: leaderboard } = useQuery<LeaderboardUser[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data } = await api.get('/users/leaderboard');
      return data;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getReputationRank = (points: number) => {
    const ranks = [
      { name: 'Mới', min: 0, max: 99, color: 'text-zinc-500', bg: 'bg-zinc-500', shadow: 'shadow-zinc-500/20' },
      { name: 'Đồng', min: 100, max: 299, color: 'text-amber-600', bg: 'bg-amber-600', shadow: 'shadow-amber-600/20' },
      { name: 'Bạc', min: 300, max: 599, color: 'text-slate-400', bg: 'bg-slate-400', shadow: 'shadow-slate-400/20' },
      { name: 'Vàng', min: 600, max: 999, color: 'text-yellow-500', bg: 'bg-yellow-500', shadow: 'shadow-yellow-500/20' },
      { name: 'Bạch Kim', min: 1000, max: 2499, color: 'text-cyan-400', bg: 'bg-cyan-400', shadow: 'shadow-cyan-400/20' },
      { name: 'Bậc Thầy', min: 2500, max: 4999, color: 'text-purple-500', bg: 'bg-purple-500', shadow: 'shadow-purple-500/20' },
      { name: 'Huyền Thoại', min: 5000, max: Infinity, color: 'text-emerald-500', bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/20' }
    ];
    const current = ranks.find(r => points >= r.min && points <= r.max) || ranks[0];
    const next = ranks[ranks.indexOf(current) + 1] || null;
    return { current, next };
  };

  const { current: rank, next: nextRank } = user ? getReputationRank(user.reputation) : { current: null, next: null };

  return (
    <aside className="space-y-6 sticky top-24 pb-12">
      {/* WALLET MINI CARD */}
      <AnimatePresence>
        {user && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-500/20 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all active:scale-[0.98]"
          >
            <Link href="/wallet" className="block p-6 relative z-10">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all" />
               <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-black uppercase tracking-widest text-zinc-700 dark:text-white/90">Số dư hiện tại</span>
                     <div className="p-2 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                        <WalletIcon className="w-6 h-6 text-emerald-500" />
                     </div>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <h3 className="text-2xl font-black text-emerald-400">{formatCurrency(wallet?.balance || 0)}</h3>
                     </div>
                     <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                        <ChevronRight className="w-5 h-5 text-emerald-500" />
                     </div>
                  </div>
               </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REPUTATION CARD */}
      {user && rank && (
        <div className="mt-8 p-7 rounded-[2rem] forum-card space-y-5 relative">
           {/* Contained blur effect */}
           <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
              <div className={`absolute top-0 right-0 w-32 h-32 ${rank.bg} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />
           </div>
           
           <div className="flex items-center justify-between gap-3 relative z-20">
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-2xl ${rank.bg}/12 flex items-center justify-center ${rank.color} border border-${rank.bg.replace('bg-', '')}/20`}>
                    <Award className="w-7 h-7" />
                 </div>
                 <div>
                    <div className="flex items-center gap-2 mb-0.5">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Hạng:</span>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${rank.color}`}>{rank.name}</span>
                    </div>
                    <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">{user.reputation.toLocaleString()} Điểm</span>
                 </div>
              </div>
              
              <div className="relative group/info">
                 <div className="w-7 h-7 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center cursor-help text-zinc-400 hover:bg-white/10 transition-colors">
                    <Info className="w-4 h-4" />
                 </div>
                 {/* Tooltip Positioned to the LEFT */}
                 <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 w-64 opacity-0 pointer-events-none group-hover/info:opacity-100 group-hover/info:pointer-events-auto transition-all duration-300 translate-x-2 group-hover/info:translate-x-0 z-[100]">
                    <div className="bg-white border border-zinc-200 text-zinc-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-6 space-y-5">
                       <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                          <Trophy className="w-5 h-5 text-amber-500" />
                          <span className="text-xs font-black uppercase tracking-widest text-zinc-900">BXH Danh Vọng</span>
                       </div>
                       <div className="space-y-2.5 text-[10px] font-bold">
                          <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-100 border border-zinc-200/50">
                             <span className="text-zinc-600">Mới</span><span className="text-zinc-500">0+ Điểm</span>
                          </div>
                          <div className="flex justify-between items-center p-2.5 rounded-xl bg-amber-50 border border-amber-200/50">
                             <span className="text-amber-700">Đồng</span><span className="text-amber-600">100+ Điểm</span>
                          </div>
                          <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-100 border border-slate-200/50">
                             <span className="text-slate-600">Bạc</span><span className="text-slate-500">300+ Điểm</span>
                          </div>
                          <div className="flex justify-between items-center p-2.5 rounded-xl bg-yellow-50 border border-yellow-200/50">
                             <span className="text-yellow-700">Vàng</span><span className="text-yellow-600">600+ Điểm</span>
                          </div>
                          <div className="flex justify-between items-center p-2.5 rounded-xl bg-cyan-50 border border-cyan-200/50">
                             <span className="text-cyan-700">Bạch Kim</span><span className="text-cyan-600">1.000+ Điểm</span>
                          </div>
                          <div className="flex justify-between items-center p-2.5 rounded-xl bg-purple-50 border border-purple-200/50">
                             <span className="text-purple-700">Bậc Thầy</span><span className="text-purple-600">2.500+ Điểm</span>
                          </div>
                          <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/50">
                             <span className="text-emerald-700">Huyền Thoại</span><span className="text-emerald-600">5.000+ Điểm</span>
                          </div>
                       </div>
                    </div>
                    {/* White Arrow */}
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-white border-r border-t border-zinc-200 rotate-45" />
                 </div>
              </div>
           </div>
           
           <div className="space-y-2 relative z-0">
              <div className="h-2 w-full bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ 
                      width: nextRank 
                        ? `${((user.reputation - rank.min) / (nextRank.min - rank.min)) * 100}%` 
                        : '100%' 
                    }}
                    className={`h-full ${rank.bg} ${rank.shadow} shadow-lg transition-all duration-1000`}
                  />
              </div>
              <div className="flex justify-between items-center px-1">
                 <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight">
                    {nextRank 
                      ? <>Cần thêm <span className={rank.color}>{nextRank.min - user.reputation}</span> cho <span className={nextRank.color}>{nextRank.name}</span></>
                      : <span className="text-emerald-500">Bạn đã đạt ngưỡng Huyền Thoại!</span>
                    }
                 </p>
                 {nextRank && (
                   <span className="text-[9px] font-black text-zinc-400">{((user.reputation / nextRank.min) * 100).toFixed(0)}%</span>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* LEADERBOARD */}
      <section className="p-6 rounded-2xl forum-card space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-500" />
          Bảng vinh danh
        </h3>
        <div className="space-y-3 pt-2">
           {leaderboard?.map((lUser, i) => (
             <div key={lUser.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                   <div className="relative">
                      <img 
                        src={lUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${lUser.username}`} 
                        className="w-8 h-8 rounded-lg object-cover ring-2 ring-transparent group-hover:ring-emerald-500/30 transition-all"
                      />
                   </div>
                   <Link href={`/user/${lUser.username}`} className="text-xs font-black text-zinc-700 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                      {lUser.username}
                   </Link>
                </div>
                <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full ring-1 ring-emerald-500/20">
                   {lUser.reputation}
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* HOT TOPICS */}
      <section className="p-6 rounded-2xl forum-card space-y-4">
         <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            Tin nóng 24h
         </h3>
         <div className="space-y-4">
            {hotThreads?.map((thread, i) => (
              <Link key={thread.id} href={`/thread/${thread.slug}`} className="group block space-y-1">
                 <h4 className="text-[11px] font-black leading-tight text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                   {thread.title}
                 </h4>
                 <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                   <span className="flex items-center gap-1"><MessageSquare className="w-2.5 h-2.5" /> {thread._count.posts}</span>
                 </div>
              </Link>
            ))}
         </div>
      </section>
    </aside>
  );
}
