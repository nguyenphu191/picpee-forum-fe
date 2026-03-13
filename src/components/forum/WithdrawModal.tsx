'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Send, Banknote, Landmark, CreditCard, AlertCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

export default function WithdrawModal({ isOpen, onClose, balance }: WithdrawModalProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<number | ''>('');

  const withdrawMutation = useMutation({
    mutationFn: async (amount: number) => {
      const { data } = await api.post('/forum/me/withdraw', { amount });
      return data;
    },
    onSuccess: () => {
      toast.success('Gửi yêu cầu rút tiền thành công!');
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      setAmount('');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi rút tiền');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.bankName || !user?.bankAccountNumber) {
       toast.error('Vui lòng cập nhật thông tin ngân hàng trước khi rút tiền');
       return;
    }
    if (!amount || amount < 50000) {
      toast.error('Số tiền tối thiểu là 50.000đ');
      return;
    }
    if (amount > balance) {
      toast.error('Số dư không đủ');
      return;
    }
    withdrawMutation.mutate(Number(amount));
  };

  const hasBankInfo = !!(user?.bankName && user?.bankAccountNumber);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800"
          >
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-8 text-white relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
               <div className="relative z-10 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                     <Banknote className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black">Yêu cầu rút tiền</h3>
                  <p className="text-indigo-100 font-medium text-sm">Tiền sẽ được gửi về tài khoản ngân hàng của bạn.</p>
               </div>
               <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
               >
                  <X className="w-5 h-5" />
               </button>
            </div>

            <div className="p-8 space-y-6">
              {!hasBankInfo ? (
                <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-center space-y-4">
                   <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                   <div className="space-y-1">
                      <h4 className="font-black text-amber-800 dark:text-amber-400">Chưa có thông tin ngân hàng</h4>
                      <p className="text-xs font-bold text-amber-600/80">Bạn cần cập nhật thông tin nhận thanh toán để thực hiện rút tiền.</p>
                   </div>
                   <Link 
                     href="/settings" 
                     onClick={onClose}
                     className="block w-full py-3 bg-amber-500 text-white rounded-xl font-black text-sm hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                   >
                      Cài đặt ngay
                   </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Bank Info Preview */}
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 space-y-3">
                     <div className="flex items-center gap-3">
                        <Landmark className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-black uppercase text-gray-400 tracking-widest">{user?.bankName}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-emerald-500" />
                        <div>
                           <span className="block font-black text-sm leading-none">{user?.bankAccountNumber}</span>
                           <span className="text-[10px] font-bold text-gray-500 uppercase">{user?.bankAccountName}</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                       <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Số dư khả dụng</label>
                       <div className="text-2xl font-black text-green-500">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(balance)}
                       </div>
                    </div>

                    <div>
                       <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Số tiền cần rút (VNĐ)</label>
                       <input 
                          type="number" 
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          placeholder="Nhập số tiền (VD: 50000)"
                          className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-black text-xl"
                          min={50000}
                          max={balance}
                       />
                       <p className="text-[10px] font-black text-gray-400 mt-2 flex items-center gap-1 uppercase tracking-tighter">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Rút tối thiểu: 50.000đ • Xử lý: 24h
                       </p>
                    </div>
                  </div>

                  <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     type="submit"
                     disabled={!amount || amount < 50000 || amount > balance || withdrawMutation.isPending}
                     className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                     {withdrawMutation.isPending ? 'Đang gửi...' : 'Xác nhận rút tiền'}
                     <Send className="w-5 h-5" />
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
