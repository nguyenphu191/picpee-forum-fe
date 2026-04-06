'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookMarked, MessageSquare, Heart, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface BookmarkItem {
  id: string;
  createdAt: string;
  thread: {
    id: string;
    title: string;
    slug: string;
    createdAt: string;
    author: { username: string; avatarUrl: string | null };
    board: { name: string; slug: string };
    _count: { posts: number; likes: number };
  };
}

export default function BookmarksPage() {
  const { user } = useAuthStore();

  const { data: bookmarks, isLoading } = useQuery<BookmarkItem[]>({
    queryKey: ['my-bookmarks'],
    queryFn: async () => {
      const { data } = await api.get('/forum/me/bookmarks');
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="lg:col-span-12 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <BookMarked className="w-16 h-16 text-zinc-300 dark:text-zinc-600" />
        <p className="text-zinc-500 font-medium">Bạn cần đăng nhập để xem bài viết đã lưu</p>
        <Link href="/login" className="px-6 py-2 bg-emerald-500 text-black rounded-xl font-black text-sm">
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="lg:col-span-8 space-y-8">
      <div className="flex items-center gap-4 px-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <BookMarked className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Bài viết đã lưu</h1>
          <p className="text-zinc-500 text-sm font-medium">
            {bookmarks?.length ?? 0} bài viết
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse bg-zinc-100 dark:bg-zinc-800" />)}
        </div>
      ) : bookmarks?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <BookMarked className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
          <p className="text-zinc-500 font-medium">Bạn chưa lưu bài viết nào</p>
          <Link href="/" className="text-emerald-500 font-bold hover:underline text-sm">
            Khám phá diễn đàn
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks?.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={`/thread/${item.thread.slug}`}>
                <div className="group p-5 forum-card rounded-2xl flex items-center gap-4 hover:border-emerald-500/30 transition-all">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full ring-1 ring-emerald-500/20">
                        {item.thread.board.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold">
                        Lưu {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: vi })}
                      </span>
                    </div>
                    <h2 className="font-black text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {item.thread.title}
                    </h2>
                    <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-500">
                      <span className="flex items-center gap-1">
                        <img src={item.thread.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.thread.author.username}`} className="w-4 h-4 rounded-full" />
                        {item.thread.author.username}
                      </span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {item.thread._count.posts}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {item.thread._count.likes}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(item.thread.createdAt), { addSuffix: true, locale: vi })}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
