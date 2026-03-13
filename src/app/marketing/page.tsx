'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  History,
  Rocket,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

interface ShareTask {
  id: string;
  sharedUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  rewardAmount: number;
  createdAt: string;
  thread: { title: string, slug: string };
}

export default function MarketingDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const { data: tasks, isLoading: isTasksLoading } = useQuery<ShareTask[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get('/forum/me/tasks');
      return data;
    },
    enabled: !!user
  });

  if (!user) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="lg:col-span-12 space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Rocket className="w-10 h-10 text-emerald-500" />
            Trung tâm Tiếp thị
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium font-bold">Chia sẻ bài viết để nhận thưởng và phát triển cộng đồng Picpee.</p>
        </div>
        <Link 
          href="/" 
          className="px-8 py-3 bg-emerald-500 text-black rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Làm nhiệm vụ mới
        </Link>
      </header>

      {/* MARKETING STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 space-y-4">
             <div className="text-xs font-black uppercase tracking-widest text-emerald-500/80">Tổng doanh thu tiếp thị</div>
             <h3 className="text-4xl font-black text-white">
                {formatCurrency(tasks?.reduce((acc, t) => acc + (t.status === 'PAID' || t.status === 'APPROVED' ? Number(t.rewardAmount) : 0), 0) || 0)}
             </h3>
             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Cộng dồn tất cả nhiệm vụ đã hoàn tất</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-[2.5rem] forum-card border border-white/5 flex flex-col justify-center space-y-2"
        >
          <div className="flex items-center gap-3 text-emerald-500">
             <CheckCircle2 className="w-6 h-6" />
             <span className="text-3xl font-black">{tasks?.filter(t => t.status === 'APPROVED' || t.status === 'PAID').length || 0}</span>
          </div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nhiệm vụ hoàn tất</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-[2.5rem] forum-card border border-white/5 flex flex-col justify-center space-y-2"
        >
          <div className="flex items-center gap-3 text-amber-500">
             <Clock className="w-6 h-6" />
             <span className="text-3xl font-black">{tasks?.filter(t => t.status === 'PENDING').length || 0}</span>
          </div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Đang chờ duyệt</span>
        </motion.div>
      </div>

      {/* TASKS LIST */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-2xl font-black flex items-center gap-3">
              <History className="w-7 h-7 text-emerald-500" />
              Lịch sử nhiệm vụ
           </h3>
           <Link href="/wallet" className="text-xs font-black text-emerald-500 hover:underline uppercase tracking-widest">Xem Ví tiền của tôi &rarr;</Link>
        </div>

        <div className="space-y-4">
          {isTasksLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-3xl animate-pulse bg-zinc-100 dark:bg-zinc-900" />)}
            </div>
          ) : tasks?.length === 0 ? (
             <div className="p-16 text-center rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 space-y-6">
                <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto opacity-50">
                   <TrendingUp className="w-8 h-8" />
                </div>
                <div className="max-w-xs mx-auto space-y-2">
                   <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Chưa có dữ liệu tiếp thị</p>
                   <p className="text-sm font-medium text-zinc-500">Hãy chọn một bài viết hay bất kỳ và nhấn nút "Chia sẻ & Kiếm tiền" để bắt đầu hành trình của bạn.</p>
                </div>
                <Link href="/" className="inline-block px-10 py-3 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white rounded-2xl text-xs font-black uppercase shadow-xl">Bắt đầu ngay</Link>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks?.map((task) => (
                  <motion.div 
                    whileHover={{ y: -5 }}
                    key={task.id} 
                    className="p-6 rounded-[2rem] forum-card border border-white/5 flex flex-col justify-between group hover:border-emerald-500/20 transition-all shadow-sm"
                  >
                    <div className="space-y-4">
                       <div className="flex justify-between items-start">
                          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            task.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            task.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            task.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                            'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                          }`}>
                            {task.status === 'PENDING' ? 'Chờ duyệt' : task.status === 'APPROVED' ? 'Đã duyệt' : task.status === 'REJECTED' ? 'Từ chối' : 'Đã thanh toán'}
                          </div>
                          <span className="text-sm font-black text-emerald-500">+{formatCurrency(task.rewardAmount)}</span>
                       </div>
                       
                       <h4 className="font-black text-sm text-zinc-800 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-emerald-500 transition-colors">
                         {task.thread.title}
                       </h4>
                    </div>

                    <div className="pt-6 mt-6 border-t border-zinc-50 dark:border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          {new Date(task.createdAt).toLocaleDateString('vi-VN')}
                       </div>
                       <a 
                         href={task.sharedUrl} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest group/link"
                       >
                         Xem minh chứng <ExternalLink className="w-3 h-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                       </a>
                    </div>
                  </motion.div>
                ))}
             </div>
          )}
        </div>
      </section>

      {/* QUICK GUIDE */}
      <section className="p-10 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 space-y-6">
         <h4 className="text-lg font-black flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <Rocket className="w-6 h-6" />
            Làm thế nào để kiếm thêm thu nhập?
         </h4>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
               <div className="text-2xl font-black text-emerald-500/30">01</div>
               <h5 className="font-black text-sm">Chọn bài viết</h5>
               <p className="text-xs font-medium text-zinc-500 leading-relaxed">Chọn các bài viết có nội dung chất lượng cao mà bạn muốn giới thiệu.</p>
            </div>
            <div className="space-y-2">
               <div className="text-2xl font-black text-emerald-500/30">02</div>
               <h5 className="font-black text-sm">Chia sẻ lên MXH</h5>
               <p className="text-xs font-medium text-zinc-500 leading-relaxed">Đăng bài lên Facebook, Telegram, Group... kèm link bài viết gốc.</p>
            </div>
            <div className="space-y-2">
               <div className="text-2xl font-black text-emerald-500/30">03</div>
               <h5 className="font-black text-sm">Gửi minh chứng</h5>
               <p className="text-xs font-medium text-zinc-500 leading-relaxed">Copy link bài đã chia sẻ và dán vào mục "Cộng tác" của bài viết đó.</p>
            </div>
         </div>
      </section>
    </div>
  );
}
