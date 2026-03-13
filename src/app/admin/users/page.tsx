'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, Search, ShieldAlert, Award, Calendar, Layers, AtSign, 
  Trash2, Ban, CheckCircle, Activity, Wallet, X, ArrowDownLeft, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

interface UserAdmin {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  status: 'ACTIVE' | 'BANNED';
  reputation: number;
  createdAt: string;
  _count: { threads: number; posts: number };
  wallet: { balance: number } | null;
}

interface UserActivityDetail {
  id: string;
  username: string;
  threads: any[];
  posts: any[];
  wallet: { transactions: any[] } | null;
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'USER' | 'MODERATOR' | 'ADMIN'>('ALL');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { data: users, isLoading } = useQuery<UserAdmin[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data;
    },
  });

  const { data: activity, isLoading: isActivityLoading } = useQuery<UserActivityDetail>({
    queryKey: ['user-activity', selectedUser],
    queryFn: async () => {
      const { data } = await api.get(`/admin/users/activity/${selectedUser}`);
      return data;
    },
    enabled: !!selectedUser
  });

  const updateRoleMutation = useMutation({
    mutationFn: (args: { id: string, role: string }) => api.post(`/admin/users/role/${args.id}`, { role: args.role }),
    onSuccess: () => {
      toast.success('Đã cập nhật quyền hạn');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: (args: { id: string, status: string }) => api.post(`/admin/users/status/${args.id}`, { status: args.status }),
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success('Đã xóa người dùng');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  });

  if (isLoading) return <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" /></div>;

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black">Người dùng</h1>
          <p className="text-gray-500 font-medium">Quản lý tài khoản, trạng thái và theo dõi hoạt động.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Username, email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-full sm:w-80 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-sm outline-none font-bold"
            />
          </div>

          <div className="flex bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-1">
            {['ALL', 'USER', 'MODERATOR', 'ADMIN'].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role as any)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterRole === role ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto text-black dark:text-white">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 dark:bg-slate-900/50 text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-8 py-5">Thành viên</th>
                <th className="px-8 py-5">Ví tiền (USD)</th>
                <th className="px-8 py-5">Vai trò & Trạng thái</th>
                <th className="px-8 py-5">Hoạt động</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
              {filteredUsers?.map((u) => (
                <motion.tr 
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50/30 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative group/avatar cursor-pointer" onClick={() => setSelectedUser(u.id)}>
                         <img src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-900 p-0.5" />
                         <div className="absolute inset-0 bg-primary-500/80 rounded-2xl opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-all">
                            <Activity className="w-5 h-5 text-black" />
                         </div>
                      </div>
                      <div>
                         <div className="font-black text-gray-900 dark:text-zinc-100 text-base">{u.username}</div>
                         <div className="text-xs text-gray-400 font-bold uppercase tracking-tighter">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Wallet className="w-4 h-4 text-emerald-500" />
                       <span className="font-black text-emerald-500">{formatCurrency(u.wallet?.balance || 0)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 space-y-2">
                     <select 
                        value={u.role}
                        onChange={(e) => updateRoleMutation.mutate({ id: u.id, role: e.target.value })}
                        className={`block w-full text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                           u.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                           u.role === 'MODERATOR' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                           'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-transparent'
                        }`}
                     >
                        <option value="USER">USER</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                     </select>
                     <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          u.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {u.status}
                        </span>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-zinc-600" /> {u._count.threads} chủ đề</span>
                       <span className="flex items-center gap-2"><AtSign className="w-3.5 h-3.5 text-zinc-600" /> {u._count.posts} trả lời</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedUser(u.id)}
                          className="p-2.5 rounded-xl bg-primary-500/10 text-primary-600 hover:bg-primary-500 hover:text-black transition-all"
                          title="Hoạt động"
                        >
                          <Activity className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => {
                            const newStatus = u.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
                            if (confirm(`Bạn muốn ${newStatus === 'BANNED' ? 'KHÓA' : 'MỞ'} tài khoản này?`)) {
                              updateStatusMutation.mutate({ id: u.id, status: newStatus });
                            }
                          }}
                          className={`p-2.5 rounded-xl transition-all ${
                            u.status === 'ACTIVE' ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? <Ban className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => confirm('Bạn thực sự muốn xóa vĩnh viễn user này?') && deleteUserMutation.mutate(u.id)}
                          className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACTIVITY MODAL */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 30 }}
               className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl flex flex-col border border-white/5"
            >
               <header className="p-8 border-b border-gray-100 dark:border-slate-900 bg-gray-50/50 dark:bg-slate-900/30 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center">
                        <Activity className="w-8 h-8 text-black" />
                     </div>
                     <div>
                        <h2 className="text-2xl font-black tracking-tight">{activity?.username || 'Đang tải...'}</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tracking hoạt động & Biến động số dư</p>
                     </div>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                     <X className="w-6 h-6" />
                  </button>
               </header>

               <div className="p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-8 custom-scrollbar scroll-smooth">
                  {/* THREADS & POSTS */}
                  <div className="space-y-8">
                     <section className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-primary-500 border-l-4 border-primary-500 pl-3">Bài viết gần nhất</h3>
                        <div className="space-y-2">
                           {isActivityLoading ? <div className="h-20 animate-pulse bg-zinc-100 dark:bg-zinc-900 rounded-2xl" /> :
                            activity?.threads.length === 0 ? <p className="text-xs italic text-zinc-500 ml-4">Chưa có bài viết.</p> :
                            activity?.threads.map((t: any) => (
                              <Link 
                                key={t.id} 
                                href={`/thread/${t.slug}`}
                                className="block p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-transparent hover:border-primary-500/20 transition-all group/item"
                              >
                                 <h4 className="font-bold text-sm line-clamp-1 group-hover/item:text-primary-500 transition-colors">{t.title}</h4>
                                 <p className="text-[9px] font-black text-zinc-400 mt-1 uppercase">{new Date(t.createdAt).toLocaleDateString('vi-VN')}</p>
                              </Link>
                            ))}
                        </div>
                     </section>
                     <section className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 border-l-4 border-indigo-500 pl-3">Bình luận gần nhất</h3>
                        <div className="space-y-2">
                           {isActivityLoading ? <div className="h-20 animate-pulse bg-zinc-100 dark:bg-zinc-900 rounded-2xl" /> :
                            activity?.posts.length === 0 ? <p className="text-xs italic text-zinc-500 ml-4">Chưa có bình luận.</p> :
                            activity?.posts.map((p: any) => (
                              <Link 
                                key={p.id} 
                                href={`/thread/${p.thread.slug}`}
                                className="block p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-transparent hover:border-indigo-500/20 transition-all group/item"
                              >
                                 <p className="text-sm font-medium line-clamp-2 group-hover/item:text-indigo-500 transition-colors">{p.content}</p>
                                 <p className="text-[9px] font-black text-indigo-500/70 mt-1 uppercase tracking-tighter">Trong bài: {p.thread.title}</p>
                              </Link>
                            ))}
                        </div>
                     </section>
                  </div>

                  {/* WALLET TRANSACTIONS */}
                  <div className="space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 border-l-4 border-emerald-500 pl-3">Biến động số dư gần nhất</h3>
                     <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 min-h-[400px]">
                        {isActivityLoading ? <div className="h-64 animate-pulse bg-zinc-100 dark:bg-zinc-900 rounded-2xl" /> :
                         activity?.wallet?.transactions.length === 0 ? <p className="text-sm text-center text-zinc-500 mt-20">Chưa có giao dịch.</p> :
                         <div className="space-y-4">
                           {activity?.wallet?.transactions.map((tx: any) => (
                              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/50 dark:bg-black/20">
                                 <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg ${tx.type === 'REWARD' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                       {tx.type === 'REWARD' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                    </div>
                                    <div>
                                       <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">{tx.description}</span>
                                       <span className="text-[8px] font-black text-zinc-500 uppercase">{new Date(tx.createdAt).toLocaleDateString()}</span>
                                    </div>
                                 </div>
                                 <span className={`text-xs font-black ${tx.type === 'REWARD' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {tx.type === 'REWARD' ? '+' : '-'}{formatCurrency(tx.amount)}
                                 </span>
                              </div>
                           ))}
                         </div>
                        }
                     </div>
                  </div>
               </div>

               <footer className="p-8 bg-gray-50/50 dark:bg-slate-900/30 border-t border-gray-100 dark:border-slate-900 flex justify-end">
                  <button onClick={() => setSelectedUser(null)} className="px-8 py-3 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest">Đóng Tracking</button>
               </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
