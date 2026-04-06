'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Clock, User, PlusCircle, Filter, Search } from 'lucide-react';
import api from '@/lib/api';
import Sidebar from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/authStore';

interface Thread {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  author: { username: string; avatarUrl: string | null };
  _count: { posts: number };
  isPinned: boolean;
  isLocked: boolean;
}

interface BoardData {
  id: string;
  name: string;
  description: string;
  category: { name: string };
  threads: Thread[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function BoardPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data: board, isLoading } = useQuery<BoardData>({
    queryKey: ['board', slug, page],
    queryFn: async () => {
      const { data } = await api.get(`/forum/boards/${slug}?page=${page}&limit=10`);
      return data;
    },
  });

  if (isLoading) return <div className="lg:col-span-12 h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" /></div>;
  if (!board) return <div className="lg:col-span-12 text-center p-20">Board not found</div>;

  return (
    <div className="lg:col-span-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-500 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Quay lại diễn đàn
          </Link>
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-500">{board.category.name}</span>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{board.name}</h1>
            <p className="text-zinc-400 text-lg max-w-2xl">{board.description}</p>
          </div>
        </div>

        <button
          onClick={() => user ? router.push(`/board/${slug}/new`) : router.push('/login')}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-black hover:bg-emerald-400 transition-all font-bold shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          Tạo bài mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl">
            <div className="flex gap-2">
              <button className="text-sm font-bold text-emerald-600 dark:text-emerald-500 bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 rounded-xl">Mới nhất</button>
              <button className="text-sm font-bold text-zinc-500 hover:text-emerald-500 px-4 py-1.5 transition-colors">Yêu thích</button>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400"><Filter className="w-4 h-4" /></button>
              <button className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400"><Search className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            {board.threads.length === 0 ? (
              <div className="p-20 text-center text-zinc-500 font-medium">Chưa có bài viết nào trong khu vực này.</div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {board.threads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => router.push(`/thread/${thread.slug}`)}
                    className="cursor-pointer"
                  >
                    <motion.div
                      className="p-6 flex items-center gap-6 group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 transition-colors">
                        <MessageSquare className="w-6 h-6 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">{thread.title}</h3>
                          {thread.isPinned && <span className="px-2 py-0.5 rounded-md bg-yellow-400/10 text-yellow-600 dark:text-yellow-500 text-[10px] font-black uppercase">Ghim</span>}
                          {thread.isLocked && <span className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 text-[10px] font-black uppercase">Khóa</span>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-500 font-medium">
                          <Link href={`/user/${thread.author.username}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors relative z-10">
                            <User className="w-3.5 h-3.5" /> {thread.author.username}
                          </Link>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(thread.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>

                      <div className="text-right hidden sm:block">
                        <span className="block text-lg font-black text-zinc-900 dark:text-zinc-100">{thread._count.posts}</span>
                        <span className="text-xs text-zinc-500 font-bold uppercase tracking-tighter">Bình luận</span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {board?.pagination && board.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {Array.from({ length: board.pagination.totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === board.pagination.page;
                return (
                  <Link
                    key={pageNum}
                    href={`/board/${slug}?page=${pageNum}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 scale-110'
                        : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
