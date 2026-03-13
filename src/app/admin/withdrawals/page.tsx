'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Banknote,
  Clock,
  User,
  Phone,
  Landmark,
  CreditCard,
  History,
  AlertCircle
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { useState } from 'react';

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  description: string;
  createdAt: string;
  wallet: {
    user: {
      id: string;
      username: string;
      bankName: string;
      bankAccountNumber: string;
      bankAccountName: string;
      phoneNumber: string;
    }
  }
}

export default function AdminWithdrawalsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED'>('PENDING');

  const { data: withdrawals, isLoading } = useQuery<WithdrawalRequest[]>({
    queryKey: ['admin-withdrawals'],
    queryFn: async () => {
      const { data } = await api.get('/admin/withdrawals');
      return data;
    },
    enabled: user?.role === 'ADMIN'
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.post(`/admin/withdrawals/approve/${id}`),
    onSuccess: () => {
      toast.success('Đã xác nhận thanh toán thành công!');
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) => api.post(`/admin/withdrawals/reject/${id}`, { reason }),
    onSuccess: () => {
      toast.success('Đã từ chối yêu cầu rút tiền!');
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
    }
  });

  if (!user || user.role !== 'ADMIN') return null;

  const filteredData = withdrawals?.filter(w => filter === 'ALL' ? true : w.status === filter);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-8">
      <header>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <Banknote className="w-8 h-8 text-primary-500" />
             Quản lý Rút tiền
          </h1>
          <p className="text-gray-500 font-medium text-sm">Xử lý các yêu cầu rút tiền từ KOC/Thành viên</p>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Yêu cầu chờ duyệt', count: withdrawals?.filter(w => w.status === 'PENDING').length || 0, icon: <Clock />, color: 'text-amber-500' },
           { label: 'Đã hoàn tất', count: withdrawals?.filter(w => w.status === 'COMPLETED').length || 0, icon: <CheckCircle2 />, color: 'text-green-500' },
           { label: 'Đã từ chối', count: withdrawals?.filter(w => w.status === 'REJECTED').length || 0, icon: <XCircle />, color: 'text-red-500' },
         ].map((stat, i) => (
           <div key={i} className="p-6 rounded-3xl glass border border-white/20 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center ${stat.color} shadow-inner`}>
                 {stat.icon}
              </div>
              <div>
                 <span className="block text-2xl font-black">{stat.count}</span>
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
              </div>
           </div>
         ))}
      </div>

      {/* FILTER */}
      <div className="flex gap-2 p-1 bg-gray-50 dark:bg-slate-900 rounded-2xl w-fit border border-gray-100 dark:border-slate-800">
         {(['ALL', 'PENDING', 'COMPLETED', 'REJECTED'] as const).map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${filter === f ? 'bg-white dark:bg-slate-800 text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
               {f === 'ALL' ? 'Tất cả' : f === 'PENDING' ? 'Chờ duyệt' : f === 'COMPLETED' ? 'Hoàn tất' : 'Từ chối'}
            </button>
         ))}
      </div>

      {/* WITHDRAWALS LIST */}
      <div className="grid grid-cols-1 gap-6">
         {isLoading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="h-48 rounded-[2.5rem] animate-pulse bg-gray-100 dark:bg-slate-900" />)
         ) : filteredData?.length === 0 ? (
            <div className="p-20 text-center rounded-[2.5rem] bg-gray-50/50 dark:bg-slate-900/50 border-2 border-dashed border-gray-200 dark:border-slate-800">
               <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
               <p className="text-gray-400 font-bold text-lg">Không có yêu cầu nào trong danh sách này.</p>
            </div>
         ) : (
            filteredData?.map((w) => (
               <motion.div 
                 key={w.id}
                 layout
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="p-8 rounded-[2.5rem] glass border border-white/20 shadow-xl overflow-hidden relative group"
               >
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full transition-all group-hover:scale-150 ${w.status === 'PENDING' ? 'bg-amber-500' : w.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'}`} />
                  
                  <div className="flex flex-col lg:flex-row justify-between gap-8 relative z-10">
                     {/* User & Bank Info */}
                     <div className="space-y-6 flex-1">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center font-black text-xl">
                              {w.wallet.user.username.charAt(0).toUpperCase()}
                           </div>
                           <div>
                              <h3 className="text-lg font-black">{w.wallet.user.username}</h3>
                              <div className="flex items-center gap-3 text-sm text-gray-500 font-bold">
                                 <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {w.wallet.user.phoneNumber || 'N/A'}</span>
                                 <span className="text-primary-500/30">•</span>
                                 <span>Yêu cầu ngày: {new Date(w.createdAt).toLocaleString('vi-VN')}</span>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-slate-950/30 border border-gray-100 dark:border-slate-800 flex items-start gap-4">
                              <Landmark className="w-5 h-5 text-indigo-500 mt-1" />
                              <div>
                                 <span className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Ngân hàng</span>
                                 <span className="block font-black text-sm">{w.wallet.user.bankName || 'Chưa cập nhật'}</span>
                              </div>
                           </div>
                           <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-slate-950/30 border border-gray-100 dark:border-slate-800 flex items-start gap-4">
                              <CreditCard className="w-5 h-5 text-emerald-500 mt-1" />
                              <div>
                                 <span className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Thông tin TK</span>
                                 <span className="block font-black text-sm">{w.wallet.user.bankAccountNumber || 'N/A'}</span>
                                 <span className="block text-xs font-bold text-gray-500 uppercase">{w.wallet.user.bankAccountName || 'N/A'}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Amount & Actions */}
                     <div className="lg:w-72 flex flex-col items-center lg:items-end justify-center gap-6 lg:border-l lg:border-gray-100 dark:lg:border-slate-800 lg:pl-10">
                        <div className="text-center lg:text-right">
                           <span className="text-xs font-black uppercase text-gray-400 tracking-tighter">Số tiền rút</span>
                           <h4 className="text-3xl font-black text-primary-600 dark:text-primary-400">{formatCurrency(w.amount)}</h4>
                        </div>

                        {w.status === 'PENDING' ? (
                           <div className="flex gap-3 w-full">
                              <button 
                                onClick={() => approveMutation.mutate(w.id)}
                                disabled={approveMutation.isPending}
                                className="flex-1 py-3 bg-green-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all"
                              >
                                 <CheckCircle2 className="w-5 h-5" /> Duyệt
                              </button>
                              <button 
                                onClick={() => {
                                   const reason = window.prompt('Lý do từ chối:');
                                   if (reason) rejectMutation.mutate({ id: w.id, reason });
                                }}
                                disabled={rejectMutation.isPending}
                                className="flex-1 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all border border-red-100 dark:bg-red-500/10 dark:hover:bg-red-500"
                              >
                                 <XCircle className="w-5 h-5" /> Từ chối
                              </button>
                           </div>
                        ) : (
                           <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest ${w.status === 'COMPLETED' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                              {w.status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                              {w.status === 'COMPLETED' ? 'Đã thanh toán' : 'Bị từ chối'}
                           </div>
                        )}
                        {w.description && w.status === 'REJECTED' && <p className="text-[10px] text-red-400 font-bold text-right w-full italic">{w.description}</p>}
                     </div>
                  </div>
               </motion.div>
            ))
         )}
      </div>
    </div>
  );
}
