'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { ShieldCheck, User, Image as ImageIcon, CheckCircle2, FileSignature, Upload, Phone, Landmark, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

export default function SettingsPage() {
  const { user, isLoading, fetchMe } = useAuthStore();
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [signature, setSignature] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setAvatarUrl(user.avatarUrl || '');
      setSignature(user.signature || '');
      setPhoneNumber(user.phoneNumber || '');
      setBankName(user.bankName || '');
      setBankAccountNumber(user.bankAccountNumber || '');
      setBankAccountName(user.bankAccountName || '');
    } else if (!isLoading) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const updateMutation = useMutation({
     mutationFn: async (data: any) => {
        const { data: result } = await api.put('/users/profile', data);
        return result;
     },
     onSuccess: () => {
        toast.success('Đã cập nhật hồ sơ thành công!');
        fetchMe();
        setPassword('');
     },
     onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Không thể cập nhật hồ sơ');
     }
  });

  if (isLoading || !user) return null;

  const handleUpdate = () => {
    const data: any = {};
    if (username !== user.username) data.username = username;
    if (avatarUrl !== user.avatarUrl) data.avatarUrl = avatarUrl;
    if (signature !== user.signature) data.signature = signature;
    if (password) data.password = password;
    if (phoneNumber !== user.phoneNumber) data.phoneNumber = phoneNumber;
    if (bankName !== user.bankName) data.bankName = bankName;
    if (bankAccountNumber !== user.bankAccountNumber) data.bankAccountNumber = bankAccountNumber;
    if (bankAccountName !== user.bankAccountName) data.bankAccountName = bankAccountName;

    if (Object.keys(data).length === 0) {
      toast.info('Không có thay đổi nào');
      return;
    }

    updateMutation.mutate(data);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận file ảnh');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const { data } = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAvatarUrl(data.url || data.avatarUrl); // handle both formats
      toast.success('Đã tải ảnh lên thành công!');
      fetchMe();
    } catch (err: any) {
      toast.error('Không thể tải ảnh lên');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="lg:col-span-8 space-y-8 pb-20">
        <header className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <User className="w-8 h-8 text-primary-500" />
             Cài đặt Hồ sơ
          </h1>
          <p className="text-zinc-500 font-medium">Cập nhật thông tin cá nhân và tài khoản thanh toán.</p>
        </header>

        <div className="p-8 rounded-3xl glass border border-white/20 shadow-sm space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
           
           <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              <div className="flex flex-col items-center gap-4">
                 <div className="relative">
                    <img 
                      src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                      alt="Avatar Preview" 
                      className="w-32 h-32 rounded-3xl object-cover bg-zinc-100 dark:bg-zinc-900 border-4 border-white dark:border-zinc-800 shadow-xl"
                    />
                     <label className="absolute -bottom-3 -right-3 w-10 h-10 bg-primary-500 text-black rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-primary-400 transition-colors">
                        <input type="file" className="hidden" onChange={handleAvatarUpload} disabled={isUploading} accept="image/*" />
                        {isUploading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Upload className="w-4 h-4" /></motion.div> : <Upload className="w-5 h-5" />}
                     </label>
                  </div>
                  <div className="text-center w-full">
                    <h3 className="font-black text-lg">{user.username}</h3>
                    <p className="text-xs font-bold text-zinc-500 flex items-center justify-center gap-1 uppercase tracking-widest"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Vai trò: {user.role}</p>
                 </div>
              </div>

              <div className="flex-1 space-y-8 w-full">
                 <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                        <User className="w-4 h-4 text-primary-500" /> Tên người dùng
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Tên người dùng (chữ cái, số, gạch dưới)"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                      />
                      <p className="text-xs text-zinc-400 mt-1.5">Chỉ dùng chữ cái, số và dấu gạch dưới (_). Tối thiểu 3 ký tự.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                              <Phone className="w-4 h-4 text-primary-500" /> Số điện thoại
                           </label>
                           <input 
                             type="tel"
                             value={phoneNumber}
                             onChange={(e) => setPhoneNumber(e.target.value)}
                             placeholder="Nhập số điện thoại liên hệ..."
                             className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                           />
                        </div>
                        <div>
                           <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                              <Landmark className="w-4 h-4 text-primary-500" /> Ngân hàng
                           </label>
                           <input 
                             type="text"
                             value={bankName}
                             onChange={(e) => setBankName(e.target.value)}
                             placeholder="Tên ngân hàng (VD: MB, VCB...)"
                             className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                           />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                              <CreditCard className="w-4 h-4 text-emerald-500" /> Số tài khoản
                           </label>
                           <input 
                             type="text"
                             value={bankAccountNumber}
                             onChange={(e) => setBankAccountNumber(e.target.value)}
                             placeholder="Nhập số tài khoản ngân hàng..."
                             className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                           />
                        </div>
                        <div>
                           <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                              <User className="w-4 h-4 text-emerald-500" /> Chủ tài khoản
                           </label>
                           <input 
                             type="text"
                             value={bankAccountName}
                             onChange={(e) => setBankAccountName(e.target.value)}
                             placeholder="Tên chủ tài khoản (VIET HOA...)"
                             className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                           />
                        </div>
                    </div>

                    <div>
                       <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                          <FileSignature className="w-4 h-4 text-emerald-500" /> Chữ ký cá nhân (Signature)
                       </label>
                       <textarea 
                         rows={3}
                         value={signature}
                         onChange={(e) => setSignature(e.target.value)}
                         placeholder="Một câu trích dẫn hoặc thông tin bạn muốn hiển thị dưới bài viết..."
                         className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                       />
                    </div>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                       <label className="flex items-center gap-2 text-sm font-bold text-red-600 mb-2">
                          <ShieldCheck className="w-4 h-4" /> Đổi mật khẩu
                       </label>
                       <p className="text-xs text-zinc-500 font-medium mb-3">Bỏ trống nếu bạn không muốn đổi mật khẩu.</p>
                       <input 
                         type="password"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder="Nhập mật khẩu mới..."
                         className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                       />
                    </div>
                 </div>

                 <div className="flex justify-end pt-4">
                    <motion.button 
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={handleUpdate}
                       disabled={updateMutation.isPending}
                       className="px-8 py-3 bg-primary-500 text-black rounded-xl font-black flex items-center gap-2 hover:bg-primary-400 shadow-lg shadow-primary-500/20 disabled:opacity-50"
                    >
                       <CheckCircle2 className="w-5 h-5" />
                       Lưu thay đổi
                    </motion.button>
                 </div>
              </div>
           </div>
        </div>
      </div>
      <div className="lg:col-span-4">
        <Sidebar />
      </div>
    </>
  );
}
