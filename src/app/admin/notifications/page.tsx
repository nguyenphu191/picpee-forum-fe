'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Bell, Send, Users, User, Link as LinkIcon, AlertCircle, Info, Award } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminNotificationsPage() {
  const [targetType, setTargetType] = useState<'ALL' | 'SPECIFIC'>('ALL');
  const [receiverId, setReceiverId] = useState('');
  const [type, setType] = useState('SYSTEM');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');

  // Fetch users for the specific user selection dropdown
  const { data: users } = useQuery<any[]>({
    queryKey: ['admin-users-minimal'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data;
    },
    enabled: targetType === 'SPECIFIC'
  });

  const sendMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/admin/notifications', data);
    },
    onSuccess: () => {
      toast.success('Gửi thông báo thành công!');
      setContent('');
      setLink('');
      setReceiverId('');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi gửi thông báo');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      toast.error('Vui lòng nhập nội dung thông báo');
      return;
    }
    if (targetType === 'SPECIFIC' && !receiverId) {
      toast.error('Vui lòng chọn người nhận');
      return;
    }

    sendMutation.mutate({
      receiverId: targetType === 'SPECIFIC' ? receiverId : undefined,
      type,
      content,
      link: link || undefined
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black">Gửi Thông báo</h1>
        <p className="text-gray-500 font-medium">Truyền tải thông điệp đến một người hoặc toàn bộ cộng đồng.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* FORM */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl space-y-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6 text-black dark:text-white">
            {/* TARGET SELECTOR */}
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Đối tượng nhận</label>
               <div className="flex gap-2 p-1 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setTargetType('ALL')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${targetType === 'ALL' ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <Users className="w-4 h-4" />
                    Tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('SPECIFIC')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${targetType === 'SPECIFIC' ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <User className="w-4 h-4" />
                    Cụ thể
                  </button>
               </div>
            </div>

            {targetType === 'SPECIFIC' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Chọn người nhận</label>
                <select 
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 text-sm font-bold outline-none"
                >
                  <option value="">Chọn một thành viên...</option>
                  {users?.map(u => (
                    <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                  ))}
                </select>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Loại thông báo</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 text-sm font-bold outline-none"
                >
                  <option value="SYSTEM">Hệ thống</option>
                  <option value="REWARD">Thưởng</option>
                  <option value="ANNOUNCEMENT">Thông báo chung</option>
                  <option value="PAYMENT">Thanh toán</option>
                  <option value="MENTION">Nhắc tên</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Đường dẫn liên kết (Tùy chọn)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="/thread/slug..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 text-sm font-bold outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nội dung thông báo</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                required
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 text-sm font-bold outline-none resize-none"
                placeholder="Nhập thông điệp bạn muốn gửi..."
              />
            </div>

            <button 
              type="submit"
              disabled={sendMutation.isPending}
              className="w-full py-4 bg-zinc-900 dark:bg-primary-500 dark:text-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary-500/10 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {sendMutation.isPending ? 'Đang gửi...' : (
                <>
                  <Send className="w-5 h-5" />
                  Gửi thông báo ngay
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* PREVIEW */}
        <div className="space-y-6">
           <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-4 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Xem trước hiển thị
           </h3>
           <motion.div 
             className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-2xl overflow-hidden max-w-sm"
           >
              <div className="flex gap-4 items-start">
                 <div className="w-10 h-10 rounded-xl bg-zinc-100 shrink-0 flex items-center justify-center">
                    {type === 'REWARD' ? <Award className="w-5 h-5 text-yellow-600" /> : <Bell className="w-5 h-5 text-zinc-400" />}
                 </div>
                 <div className="flex-1 space-y-1">
                    <p className="text-xs text-zinc-900 leading-snug">
                       <span className="font-black text-zinc-900">Hệ thống</span> {content || 'Nội dung thông báo sẽ hiển thị ở đây...'}
                    </p>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Vừa xong</span>
                 </div>
                 <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shadow-lg shadow-emerald-500/20" />
              </div>
           </motion.div>

           <div className="p-6 rounded-[2rem] bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                 <Info className="w-5 h-5" />
                 <h4 className="font-black text-sm uppercase tracking-widest">Lưu ý cho Admin</h4>
              </div>
              <ul className="space-y-2">
                 <li className="flex gap-2 text-xs font-bold text-zinc-500">
                    <span className="text-indigo-500">01.</span> Gửi cho "Tất cả" sẽ tạo một bản ghi cho mọi User hiện có. Tránh lạm dụng để giảm tải DB.
                 </li>
                 <li className="flex gap-2 text-xs font-bold text-zinc-500">
                    <span className="text-indigo-500">02.</span> Thông báo sẽ xuất hiện ngay lập tức trong Dropdown của người dùng.
                 </li>
                 <li className="flex gap-2 text-xs font-bold text-zinc-500">
                    <span className="text-indigo-500">03.</span> Nếu có liên kết, người dùng sẽ được chuyển hướng khi click vào thông báo.
                 </li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
