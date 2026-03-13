'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Award, Calendar, MessageSquare, Layers, AtSign } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import Sidebar from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/authStore';
import { Settings } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string | null;
  signature: string | null;
  role: string;
  reputation: number;
  createdAt: string;
  _count: { threads: number; posts: number; likes: number };
  badges: any[];
  threads: any[];
  posts: any[];
}

export default function UserProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();
  const isOwnProfile = currentUser?.username === username;

  const { data: user, isLoading } = useQuery<UserProfile>({
    queryKey: ['user', username],
    queryFn: async () => {
      const { data } = await api.get(`/users/${username}`);
      return data;
    },
  });

  if (isLoading) return <div className="lg:col-span-12 h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" /></div>;
  if (!user) return <div className="lg:col-span-12 text-center p-20">Không tìm thấy thành viên này</div>;

  return (
    <>
      <div className="lg:col-span-8 space-y-8 pb-20">
        {/* HERO SECTION */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white overflow-hidden relative shadow-2xl shadow-primary-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-md p-1 border-2 border-white/20 shadow-xl"
            >
              <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="avatar" className="w-full h-full rounded-2xl object-cover" />
            </motion.div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">{user.username}</h1>
                <p className="text-primary-100 flex items-center justify-center md:justify-start gap-1 font-medium text-sm">
                  <AtSign className="w-3.5 h-3.5" /> Thành viên {user.role === 'ADMIN' ? 'Ban quản trị' : 'Cộng đồng'}
                </p>
                {user.signature && <p className="pt-2 text-sm italic text-gray-200 mt-2 border-t border-white/20">"{user.signature}"</p>}
                
                {isOwnProfile && (
                  <div className="pt-2">
                    <Link href="/settings" className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-xl text-xs font-black transition-all active:scale-95 shadow-lg">
                      <Settings className="w-3.5 h-3.5" />
                      Chỉnh sửa hồ sơ & Avatar
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Award className="w-4 h-4 text-yellow-400" /> Uy tín: {user.reputation}
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Calendar className="w-4 h-4 text-emerald-400" /> Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl glass border border-white/20 text-center space-y-2">
            <span className="block text-3xl font-black text-primary-600">{user._count.threads}</span>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Chủ đề</span>
          </div>
          <div className="p-6 rounded-3xl glass border border-white/20 text-center space-y-2">
            <span className="block text-3xl font-black text-indigo-600">{user._count.posts}</span>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Bình luận</span>
          </div>
          <div className="p-6 rounded-3xl glass border border-white/20 text-center space-y-2">
            <span className="block text-3xl font-black text-rose-600">{user._count.likes}</span>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Đã thích</span>
          </div>
          <div className="p-6 rounded-3xl glass border border-white/20 text-center space-y-2">
            <span className="block text-3xl font-black text-amber-500">{user.badges.length}</span>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Huy hiệu</span>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-black flex items-center gap-3 px-2">
            <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
            Hoạt động gần đây
          </h3>
          
          <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm divide-y divide-gray-100 dark:divide-slate-800">
            {user.threads.slice(0, 5).map(thread => (
              <Link key={`thread-${thread.id}`} href={`/thread/${thread.slug}`}>
                <div className="p-6 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-500 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">Đã tạo chủ đề trong <span className="text-primary-600 font-bold">{thread.board.name}</span></p>
                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-1">{thread.title}</h4>
                    <span className="text-xs text-gray-400 font-bold">{new Date(thread.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </Link>
            ))}

            {user.posts.slice(0, 5).map(post => (
              <Link key={`post-${post.id}`} href={`/thread/${post.thread.slug}`}>
                <div className="p-6 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">Đã bình luận trong <span className="font-bold">{post.thread.title}</span></p>
                    <p className="text-gray-900 dark:text-gray-300 line-clamp-2 text-sm leading-relaxed">{post.content}</p>
                    <span className="text-xs text-gray-400 font-bold">{new Date(post.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </Link>
            ))}

            {user.threads.length === 0 && user.posts.length === 0 && (
              <div className="p-12 text-center text-gray-400 font-medium">
                Thành viên chưa có hoạt động nào.
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="lg:col-span-4">
        <Sidebar />
      </div>
    </>
  );
}
