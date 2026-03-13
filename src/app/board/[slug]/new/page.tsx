'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, PenTool, Type, Tag } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import RichTextEditor from '@/components/common/RichTextEditor';
import { useEffect } from 'react';

export default function NewThreadPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: board } = useQuery({
    queryKey: ['board', slug],
    queryFn: async () => {
      const { data } = await api.get(`/forum/boards/${slug}`);
      return data;
    },
  });

  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await api.get('/forum/tags');
      return data;
    },
  });

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!board) return;
    if (content.length < 10) {
        toast.error('Nội dung quá ngắn!');
        return;
    }
    setLoading(true);
    try {
      await api.post('/forum/threads', {
        title,
        content,
        boardId: board.id,
        tags: selectedTags
      });
      toast.success('Đã đăng bài thành công!');
      router.push(`/board/${slug}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể đăng bài');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-12 max-w-4xl mx-auto w-full space-y-8 py-6">
      <div className="space-y-4">
        <Link href={`/board/${slug}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại {board?.name || 'khu vực'}
        </Link>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <PenTool className="w-8 h-8 text-primary-500" />
          Tạo bài viết mới
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6 p-8 rounded-3xl glass shadow-xl">
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Tiêu đề bài viết</label>
            <div className="relative group">
               <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
               <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề rõ ràng, thu hút người đọc..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none font-bold text-lg"
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Nội dung chuyên sâu</label>
            <RichTextEditor 
                content={content} 
                onChange={setContent} 
                placeholder="Chia sẻ kiến thức, kinh nghiệm hoặc thảo luận tại đây..." 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Gắn Thẻ / Nhãn
            </label>
            <div className="flex flex-wrap gap-2 pt-2">
              {tags?.map((tag: any) => (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag.id) ? prev.filter(t => t !== tag.id) : [...prev, tag.id]
                    );
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    selectedTags.includes(tag.id) 
                      ? 'bg-primary-500 text-black border-primary-500 shadow-lg shadow-primary-500/20' 
                      : 'bg-white dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-slate-700 hover:border-primary-500 hover:text-primary-500'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4">
             <div className="text-xs text-gray-400 italic">
               Lời khuyên: Sử dụng tiêu đề súc tích giúp bài viết dễ được quan tâm hơn.
             </div>
             
             <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="px-8 py-3 bg-primary-500 text-black rounded-xl font-black flex items-center justify-center gap-3 hover:bg-primary-400 transition-all shadow-xl shadow-primary-500/30 disabled:opacity-50"
             >
                {loading ? 'Đang gửi...' : (
                  <>
                    Gửi bài viết
                    <Send className="w-5 h-5" />
                  </>
                )}
             </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}
