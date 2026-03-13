'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Search, 
  Filter, 
  LayoutDashboard,
  Clock,
  ArrowRightCircle,
  Banknote,
  MoreVertical,
  ShieldCheck
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import Link from 'next/link';

interface AdminTask {
  id: string;
  sharedUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  rewardAmount: number;
  createdAt: string;
  updatedAt: string;
  proofNote: string | null;
  user: { id: string, username: string, email: string };
  thread: { title: string, slug: string };
}

export default function AdminTasksPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED'>('ALL');

  const { data: tasks, isLoading } = useQuery<AdminTask[]>({
    queryKey: ['admin-tasks'],
    queryFn: async () => {
      const { data } = await api.get('/admin/tasks');
      return data;
    },
    enabled: user?.role === 'ADMIN'
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.post(`/admin/tasks/approve/${id}`),
    onSuccess: () => {
      toast.success('Đã duyệt nhiệm vụ!');
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) => api.post(`/admin/tasks/reject/${id}`, { reason }),
    onSuccess: () => {
      toast.success('Đã từ chối nhiệm vụ!');
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
    }
  });

  const payMutation = useMutation({
    mutationFn: (id: string) => api.post(`/admin/tasks/pay/${id}`),
    onSuccess: () => {
      toast.success('Đã xác nhận thanh toán thành công!');
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
    }
  });

  const payoutMutation = useMutation({
    mutationFn: () => api.post('/admin/process-payouts'),
    onSuccess: (res) => {
      toast.success(`Đã tự động thanh toán cho ${res.data.paidCount} nhiệm vụ (đã đủ 7 ngày).`);
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
    }
  });

  if (!user || user.role !== 'ADMIN') return null;

  const filteredTasks = tasks?.filter(t => filter === 'ALL' ? true : t.status === filter);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h1 className="text-3xl font-black tracking-tight">Duyệt Nhiệm vụ Marketing</h1>
            <p className="text-gray-500 font-medium text-sm">Quản lý và thanh toán các tác vụ Chia sẻ</p>
         </div>

         <div className="flex">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => payoutMutation.mutate()}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 text-white font-black flex items-center gap-3 shadow-xl hover:bg-black transition-all text-sm"
            >
              <Banknote className="w-4 h-4" />
              Duyệt Payout tự động (7 Ngày)
            </motion.button>
         </div>
      </header>

      {/* DASHBOARD STATS (MINI) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Cần Duyệt', count: tasks?.filter(t => t.status === 'PENDING').length || 0, icon: <Clock />, color: 'text-amber-500' },
           { label: 'Đã Duyệt', count: tasks?.filter(t => t.status === 'APPROVED').length || 0, icon: <CheckCircle2 />, color: 'text-green-500' },
           { label: 'Đã Thanh toán', count: tasks?.filter(t => t.status === 'PAID').length || 0, icon: <ArrowRightCircle />, color: 'text-primary-500' },
           { label: 'Từ Chối', count: tasks?.filter(t => t.status === 'REJECTED').length || 0, icon: <XCircle />, color: 'text-red-500' },
         ].map((stat, i) => (
           <div key={i} className="p-6 rounded-3xl glass border border-white/20 flex flex-col items-center justify-center space-y-2 text-center">
              <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center ${stat.color}`}>
                 {stat.icon}
              </div>
              <span className="text-3xl font-black">{stat.count}</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
           </div>
         ))}
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-center justify-between px-6 py-4 rounded-3xl glass border border-white/20">
         <div className="flex gap-2">
            {(['ALL', 'PENDING', 'APPROVED', 'PAID', 'REJECTED'] as const).map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-primary-500 text-black shadow-lg' : 'text-zinc-400 hover:bg-zinc-800'}`}
              >
                {f}
              </button>
            ))}
         </div>
         <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-950/50 rounded-xl border border-gray-100 dark:border-slate-800">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm kiếm user..." className="bg-transparent text-sm outline-none border-none w-48" />
         </div>
      </div>

      {/* TASKS TABLE */}
      <div className="rounded-[2.5rem] glass border border-white/20 shadow-xl overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-slate-950/50">
               <tr>
                  <th className="px-8 py-5 text-xs font-black uppercase text-gray-400 tracking-widest">Thành viên</th>
                  <th className="px-8 py-5 text-xs font-black uppercase text-gray-400 tracking-widest">Nội dung</th>
                  <th className="px-8 py-5 text-xs font-black uppercase text-gray-400 tracking-widest">Bằng chứng</th>
                  <th className="px-8 py-5 text-xs font-black uppercase text-gray-400 tracking-widest">Trạng thái</th>
                  <th className="px-8 py-5 text-xs font-black uppercase text-gray-400 tracking-widest">Thao tác</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
               {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                       <td colSpan={5} className="px-8 py-5"><div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-full" /></td>
                    </tr>
                  ))
               ) : (
                  filteredTasks?.map((task) => (
                     <tr key={task.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.user.username}`} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-900 p-1" />
                              <div>
                                 <span className="block font-black text-sm">{task.user.username}</span>
                                 <span className="text-[10px] text-gray-400 font-bold uppercase">{task.user.email}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 max-w-xs">
                           <Link href={`/thread/${task.thread.slug}`} className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors line-clamp-1">
                              {task.thread.title}
                           </Link>
                           <span className="text-[10px] text-gray-400 font-medium">Sáng tạo ngày {new Date(task.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col gap-1">
                              <a href={task.sharedUrl} target="_blank" className="inline-flex items-center gap-1.5 text-xs font-black text-primary-500 hover:underline">
                                 Kiểm tra Proof <ExternalLink className="w-3 h-3" />
                              </a>
                              {task.proofNote && <span className="text-[10px] text-gray-500 italic max-w-[200px] truncate">{task.proofNote}</span>}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              {task.status === 'PENDING' && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                              <span className={`text-[10px] font-black uppercase tracking-widest ${task.status === 'PENDING' ? 'text-amber-500' : task.status === 'REJECTED' ? 'text-red-500' : 'text-green-500'}`}>
                                 {task.status}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              {task.status === 'PENDING' ? (
                                <>
                                  <button 
                                    onClick={() => approveMutation.mutate(task.id)}
                                    className="p-2 rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-sm"
                                    title="Xác nhận nhiệm vụ"
                                  >
                                    <CheckCircle2 className="w-5 h-5" />
                                  </button>
                                  <button 
                                    onClick={() => rejectMutation.mutate({ id: task.id, reason: 'Nội dung không hợp lệ' })}
                                    className="p-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    title="Từ chối"
                                  >
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                </>
                              ) : task.status === 'APPROVED' ? (
                                  <button 
                                    onClick={() => payMutation.mutate(task.id)}
                                    className="px-4 py-2 rounded-xl bg-primary-500 text-black font-black text-[10px] uppercase hover:bg-primary-400 transition-all shadow-lg active:scale-95"
                                  >
                                    Xác nhận Thanh toán ($5)
                                  </button>
                               ) : (
                                 <button className="p-2 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-400 cursor-not-allowed">
                                    <ShieldCheck className="w-5 h-5 text-primary-500" />
                                 </button>
                               )}
                            </div>
                         </td>
                     </tr>
                  ))
               )}
            </tbody>
         </table>
         {filteredTasks?.length === 0 && !isLoading && (
            <div className="p-20 text-center text-gray-400 font-bold bg-white/50 dark:bg-slate-900/50">
               Không tìm thấy dữ liệu nào.
            </div>
         )}
      </div>
    </div>
  );
}
