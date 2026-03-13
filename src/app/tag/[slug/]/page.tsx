'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Clock, User, Hash, Tag as TagIcon, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import Sidebar from '@/components/layout/Sidebar';

interface Thread {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  author: { username: string; avatarUrl: string | null };
  board: { name: string; slug: string };
  _count: { posts: number; likes: number };
  tags: { name: string; slug: string }[];
}

interface TagData {
  id: string;
  name: string;
  slug: string;
  threads: Thread[];
  _count: { threads: number };
}

export default function TagPage() {
  const { slug } = useParams();
  const router = useRouter();

  const { data: tag, isLoading } = useQuery<TagData>({
    queryKey: ['tag', slug],
    queryFn: async () => {
      const { data } = await api.get(`/forum/tags/${slug}`);
      return data;
    },
  });

  if (isLoading) return (
    <div className="xl:col-span-8 animate-pulse space-y-8">
       <div className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-3xl" />
       <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />)}
       </div>
    </div>
  );

  if (!tag) return (
    <div className="xl:col-span-8 text-center py-20 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
       <Hash className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
       <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Không tìm thấy tag</h2>
       <p className="text-zinc-500 mb-6 font-medium">Tag này không tồn tại hoặc chưa có bài viết nào.</p>
       <Link href="/tags">
          <button className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold transition-all hover:scale-105 active:scale-95">
             Khám phá các Tag khác
          </button>
       </Link>
    </div>
  );

  return (
    <div className="xl:col-span-8 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden p-8 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-500/20">
         <div className="relative z-10 space-y-4">
            <Link href="/tags" className="inline-flex items-center gap-2 text-indigo-100 hover:text-white font-bold text-sm transition-colors group">
               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Xem tất cả tag
            </Link>
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Hash className="w-8 h-8" />
               </div>
               <div>
                  <h1 className="text-3xl font-black font-heading">{tag.name}</h1>
                  <p className="text-indigo-100 font-medium">Đang có {tag._count.threads} bài viết liên quan</p>
               </div>
            </div>
         </div>
         {/* Decorative backgrounds */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Threads List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Bài viết mới nhất
           </h2>
        </div>

        {tag.threads.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200 dark:border-zinc-800">
             <p className="text-zinc-400 font-bold">Chưa có bài viết nào gắn thẻ này.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tag.threads.map((thread) => (
              <motion.div 
                key={thread.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                onClick={() => router.push(`/thread/${thread.slug}`)}
                className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all"
              >
                <div className="flex gap-5">
                   <div className="hidden sm:flex flex-col items-center gap-1 shrink-0 pt-1">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-500 transition-colors">
                         <MessageSquare className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black text-zinc-400">{thread._count.posts}</span>
                   </div>

                   <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                         <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors leading-tight">
                            {thread.title}
                         </h3>
                         <div className="flex items-center gap-3 text-xs text-zinc-500 font-bold">
                            <Link href={`/board/${thread.board.slug}`} onClick={(e) => e.stopPropagation()} className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                               {thread.board.name}
                            </Link>
                            <span className="w-1 h-1 rounded-full bg-zinc-300" />
                            <Link href={`/user/${thread.author.username}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                               <User className="w-3 h-3" /> {thread.author.username}
                            </Link>
                            <span className="w-1 h-1 rounded-full bg-zinc-300" />
                            <span className="flex items-center gap-1">
                               <Clock className="w-3 h-3" /> {new Date(thread.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                         </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                         {thread.tags.map(t => (
                            <Link 
                               key={t.slug} 
                               href={`/tag/${t.slug}`} 
                               onClick={(e) => e.stopPropagation()}
                               className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md transition-all ${
                                  t.slug === slug 
                                     ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                                     : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                               }`}
                            >
                               #{t.name}
                            </Link>
                         ))}
                      </div>
                   </div>

                   <div className="shrink-0 flex flex-col justify-center items-end gap-1">
                      <div className="text-xs font-black text-zinc-400 uppercase tracking-tighter">Bình luận</div>
                      <div className="text-xl font-black text-zinc-900 dark:text-zinc-100">{thread._count.posts}</div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
