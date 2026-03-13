'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  AlertCircle,
  History,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import WithdrawModal from '@/components/forum/WithdrawModal';

interface Transaction {
  id: string;
  amount: number;
  type: 'WITHDRAW' | 'REWARD';
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  description: string;
  createdAt: string;
}

interface WalletData {
  balance: number;
  pendingBalance: number;
  transactions: Transaction[];
}

export default function WalletPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const { data: wallet, isLoading: isWalletLoading } = useQuery<WalletData>({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data } = await api.get('/forum/me/wallet');
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
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
          <WalletIcon className="w-10 h-10 text-emerald-500" />
          Ví của tôi
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Quản lý số dư, lịch sử giao dịch và rút tiền về tài khoản.</p>
      </header>

      {/* BANK INFO ALERT */}
      {(!user?.bankName || !user?.bankAccountNumber) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-[2rem] bg-amber-500/10 border-2 border-dashed border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6"
        >
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                 <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-center md:text-left">
                 <h4 className="font-black text-amber-700 dark:text-amber-400">Thiếu thông tin nhận thanh toán</h4>
                 <p className="text-sm font-medium text-amber-600/80">Vui lòng cập nhật số tài khoản ngân hàng để có thể rút tiền từ hệ thống.</p>
              </div>
           </div>
           <Link 
             href="/settings" 
             className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-black text-sm hover:bg-amber-600 shadow-xl shadow-amber-500/10 transition-all"
           >
              Cập nhật ngay
           </Link>
        </motion.div>
      )}

      {/* BALANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 p-8 rounded-[2.5rem] bg-linear-to-br from-emerald-600 to-emerald-900 text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700" />
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <CreditCard className="w-8 h-8" />
              </div>
              <button 
                onClick={() => setIsWithdrawModalOpen(true)}
                className="px-8 py-3 bg-white text-emerald-700 rounded-2xl font-black hover:bg-zinc-50 transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                Rút tiền ngay
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest opacity-70">Số dư khả dụng</span>
                <h3 className="text-5xl font-black tracking-tighter">{formatCurrency(wallet?.balance || 0)}</h3>
              </div>
              <div className="space-y-1 sm:pl-8 pt-6 sm:pt-0">
                <span className="text-xs font-black uppercase tracking-widest opacity-70">Đang chờ xử lý</span>
                <h3 className="text-3xl font-black opacity-80">{formatCurrency(wallet?.pendingBalance || 0)}</h3>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-[2.5rem] forum-card border border-white/10 flex flex-col justify-center items-center text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
             <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
             <h4 className="font-black text-lg">Bảo mật & An toàn</h4>
             <p className="text-xs font-medium text-zinc-500 mt-2">Mọi giao dịch rút tiền đều được kiểm soát và bảo mật 100% bởi đội ngũ Picpee Forum.</p>
          </div>
        </motion.div>
      </div>

      {/* TRANSACTION HISTORY */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-2xl font-black flex items-center gap-3">
              <History className="w-7 h-7 text-emerald-500" />
              Biến động số dư
           </h3>
           <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Hiển thị các giao dịch gần nhất</div>
        </div>

        <div className="p-8 rounded-[2.5rem] forum-card border border-white/10 min-h-[400px]">
           {isWalletLoading ? (
             <div className="space-y-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />)}
             </div>
           ) : wallet?.transactions.length === 0 ? (
             <div className="h-64 flex flex-col items-center justify-center text-zinc-400 space-y-4">
                <History className="w-12 h-12 opacity-10" />
                <p className="font-bold text-sm uppercase tracking-widest opacity-40">Chưa có giao dịch nào</p>
             </div>
           ) : (
             <div className="space-y-2">
                {wallet?.transactions.map((tx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={tx.id} 
                    className="flex items-center justify-between p-5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all border border-transparent hover:border-white/5 group"
                  >
                     <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                          tx.type === 'REWARD' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                           {tx.type === 'REWARD' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                        </div>
                        <div>
                           <span className="block font-black text-sm text-zinc-800 dark:text-zinc-100">{tx.description}</span>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</span>
                              <span className="text-zinc-700 dark:text-zinc-600">•</span>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${
                                tx.status === 'COMPLETED' ? 'text-emerald-500' : tx.status === 'REJECTED' ? 'text-rose-500' : 'text-amber-500'
                              }`}>
                                {tx.status === 'COMPLETED' ? 'Thành công' : tx.status === 'REJECTED' ? 'Bị từ chối' : 'Đang xử lý'}
                              </span>
                           </div>
                        </div>
                     </div>
                     <span className={`text-lg font-black ${tx.type === 'REWARD' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {tx.type === 'REWARD' ? '+' : '-'}{formatCurrency(tx.amount)}
                     </span>
                  </motion.div>
                ))}
             </div>
           )}
        </div>
      </section>

      <WithdrawModal 
        isOpen={isWithdrawModalOpen} 
        onClose={() => setIsWithdrawModalOpen(false)} 
        balance={wallet?.balance || 0}
      />
    </div>
  );
}
