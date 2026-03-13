'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Edit2, 
  Trash2, 
  MessageSquare, 
  Heart, 
  Eye, 
  Plus, 
  Search,
  AlertCircle,
  ExternalLink,
  Save,
  X
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import RichTextEditor from '@/components/common/RichTextEditor';

interface Thread {
  id: string;
  title: string;
  content: string;
  slug: string;
  views: number;
  createdAt: string;
  board: { name: string; slug: string; id: string };
  tags: { id: string; name: string }[];
  _count: { posts: number; likes: number };
}

export default function MyThreadsPage() {
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingThread, setEditingThread] = useState<Thread | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  const { data: threads, isLoading } = useQuery<Thread[]>({
    queryKey: ['my-threads'],
    queryFn: async () => {
      const { data } = await api.get('/forum/me/threads');
      return data;
    },
    enabled: !!user
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/forum/me/threads/${id}/delete`);
      return data;
    },
    onSuccess: () => {
      toast.success('Đã xóa bài viết thành công');
      queryClient.invalidateQueries({ queryKey: ['my-threads'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Không thể xóa bài viết');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/forum/me/threads/${id}/update`, {
        title: editTitle,
        content: editContent
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Đã cập nhật bài viết thành công');
      setEditingThread(null);
      queryClient.invalidateQueries({ queryKey: ['my-threads'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Không thể cập nhật bài viết');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.')) {
      deleteMutation.mutate(id);
    }
  };

  const startEditing = (thread: Thread) => {
    setEditingThread(thread);
    setEditTitle(thread.title);
    setEditContent(thread.content);
  };

  const filteredThreads = threads?.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isAuthLoading || !user) return null;

  return (
    <div className="lg:col-span-12 space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <FileText className="w-10 h-10 text-primary-500" />
             Bài viết của tôi
          </h1>
          <p className="text-zinc-500 font-medium font-heading">Quản lý và chỉnh sửa tất cả nội dung bạn đã đăng tải.</p>
        </div>
        
        <Link 
          href="/board/share-earn-tips/new" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-black rounded-2xl font-black shadow-xl shadow-primary-500/20 hover:bg-primary-400 transition-all text-sm group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Viết bài mới
        </Link>
      </header>

      {/* SEARCH BAR */}
      <div className="relative group max-w-md">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-primary-500 transition-colors" />
        </div>
        <input 
          type="text"
          placeholder="Tìm kiếm trong bài viết của bạn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-2xl bg-zinc-900 animate-pulse border border-zinc-800" />)}
        </div>
      ) : filteredThreads?.length === 0 ? (
        <div className="p-20 text-center space-y-6 bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-zinc-800 shadow-inner">
           <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-600">
              <FileText className="w-10 h-10 opacity-20" />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-black text-zinc-300">Không tìm thấy bài viết nào</h3>
              <p className="text-sm text-zinc-500">Bắt đầu chia sẻ kiến thức của bạn với cộng đồng ngay hôm nay.</p>
           </div>
           <Link href="/board/share-earn-tips/new" className="inline-block px-8 py-3 bg-zinc-800 text-zinc-300 rounded-xl font-bold hover:bg-zinc-700 transition-colors">
              Viết bài đầu tiên
           </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredThreads?.map((thread) => (
            <motion.div 
              layout
              key={thread.id}
              className="group p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-primary-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg hover:shadow-primary-500/5"
            >
              <div className="flex-1 flex gap-4 min-w-0">
                <div className="hidden sm:flex w-12 h-12 rounded-xl bg-zinc-800 items-center justify-center shrink-0 group-hover:bg-primary-500/10 group-hover:text-primary-500 transition-colors">
                   <FileText className="w-6 h-6 opacity-40 group-hover:opacity-100" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-full">{thread.board.name}</span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(thread.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <h3 className="text-lg font-black line-clamp-1 leading-tight group-hover:text-primary-500 transition-colors">{thread.title}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {thread.tags.map(tag => (
                      <span key={tag.id} className="text-[9px] font-black text-zinc-500 lowercase">#{tag.name}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-800/50">
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-tight text-zinc-500">
                  <span className="flex flex-col items-center gap-1"><Eye className="w-4 h-4" /> {thread.views || 0}</span>
                  <span className="flex flex-col items-center gap-1"><MessageSquare className="w-4 h-4" /> {thread._count.posts}</span>
                  <span className="flex flex-col items-center gap-1"><Heart className="w-4 h-4" /> {thread._count.likes}</span>
                </div>
                
                <div className="flex items-center gap-2 pl-6 border-l border-zinc-800/50">
                  <button 
                    onClick={() => startEditing(thread)}
                    className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all border border-zinc-700 hover:border-primary-500/30"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(thread.id)}
                    className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-zinc-700 hover:border-red-500/30"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link 
                    href={`/thread/${thread.slug}`}
                    className="p-2.5 rounded-xl bg-primary-500 text-black hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20"
                    title="Xem bài viết"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingThread && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setEditingThread(null)}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900/90 backdrop-blur-md z-10">
                <h3 className="text-xl font-black flex items-center gap-3">
                  <Edit2 className="w-6 h-6 text-primary-500" />
                  Chỉnh sửa bài viết
                </h3>
                <button onClick={() => setEditingThread(null)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500"><X className="w-6 h-6" /></button>
              </div>
              
              <div className="p-8 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Tiêu đề bài viết</label>
                   <input 
                      type="text"
                      className="w-full px-6 py-4 rounded-2xl bg-zinc-950 border border-zinc-800 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-black text-lg"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nội dung</label>
                   <RichTextEditor 
                      content={editContent}
                      onChange={setEditContent}
                   />
                </div>
              </div>

              <div className="p-6 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur-md sticky bottom-0 flex justify-end gap-3 rounded-b-[2.5rem]">
                 <button 
                   onClick={() => setEditingThread(null)}
                   className="px-6 py-3 rounded-xl font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
                 >
                   Hủy
                 </button>
                 <button 
                   onClick={() => updateMutation.mutate(editingThread.id)}
                   disabled={updateMutation.isPending}
                   className="px-10 py-3 bg-primary-500 text-black rounded-xl font-black flex items-center gap-2 shadow-xl shadow-primary-500/20 hover:bg-primary-400 transition-all disabled:opacity-50"
                 >
                   <Save className="w-5 h-5" />
                   Lưu thay đổi
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
