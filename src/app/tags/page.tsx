'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Tag, Search, TrendingUp, Hash, Layers } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useState } from 'react';

interface TagData {
  id: string;
  name: string;
  slug: string;
  _count: { threads: number };
}

export default function TagsPage() {
  const [search, setSearch] = useState('');

  const { data: tags, isLoading } = useQuery<TagData[]>({
    queryKey: ['tags-all'],
    queryFn: async () => {
      // Fetching all tags. In a real app, this would be a dedicated tags endpoint.
      // For now, let's assume /forum/tags or similar exists or we mock from categories.
      try {
        const { data } = await api.get('/forum/tags');
        return data;
      } catch (e) {
        // Fallback or mock if endpoint doesn't exist yet
        return [
          { id: '1', name: 'Crypto', slug: 'crypto', _count: { threads: 156 } },
          { id: '2', name: 'MMO', slug: 'mmo', _count: { threads: 89 } },
          { id: '3', name: 'Freelance', slug: 'freelance', _count: { threads: 42 } },
          { id: '4', name: 'Airdrop', slug: 'airdrop', _count: { threads: 120 } },
          { id: '5', name: 'Design', slug: 'design', _count: { threads: 34 } },
          { id: '6', name: 'Marketing', slug: 'marketing', _count: { threads: 67 } },
          { id: '7', name: 'Tiền ảo', slug: 'tien-ao', _count: { threads: 210 } },
          { id: '8', name: 'Kiếm tiền online', slug: 'kiem-tien-online', _count: { threads: 150 } },
        ];
      }
    },
  });

  const filteredTags = tags?.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="xl:col-span-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
             <Tag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-100 font-heading">Tìm kiếm theo Tag</h1>
            <p className="text-zinc-500 text-sm font-medium">Khám phá nội dung theo chủ đề bạn quan tâm</p>
          </div>
        </div>

        <div className="relative group max-w-sm w-full">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
           <input 
             type="text" 
             placeholder="Tìm tag..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border-none focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm outline-none font-bold"
           />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-20 rounded-2xl animate-pulse bg-zinc-100 dark:bg-zinc-800" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTags?.map((tag) => (
            <motion.div 
              key={tag.id}
              whileHover={{ y: -4 }}
            >
              <Link href={`/tag/${tag.slug}`}>
                <div className="p-5 forum-card rounded-2xl flex flex-col gap-2 hover:border-emerald-500/40 group">
                   <div className="flex items-center justify-between">
                      <Hash className="w-4 h-4 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
                      <span className="text-[10px] font-black text-zinc-400 shrink-0">{tag._count.threads} bài</span>
                   </div>
                   <h3 className="font-black text-zinc-200 group-hover:text-emerald-600 transition-colors truncate">
                      {tag.name}
                   </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {filteredTags?.length === 0 && (
        <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
           <Hash className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
           <p className="text-zinc-400 font-bold">Không tìm thấy tag nào phù hợp với "{search}"</p>
        </div>
      )}
    </div>
  );
}
