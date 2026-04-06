'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  User, 
  Heart, 
  Share2, 
  MoreVertical, 
  Send,
  Award,
  BookMarked,
  Tag,
  Eye,
  ThumbsUp
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import RichTextEditor from '@/components/common/RichTextEditor';

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string, username: string, avatarUrl: string | null, signature?: string | null };
  _count: { likes: number };
}

interface ThreadData {
  id: string;
  title: string;
  content: string;
  slug: string;
  createdAt: string;
  views: number;
  author: { id: string, username: string, avatarUrl: string | null, reputation: number, signature?: string | null };
  board: { id: string, name: string, slug: string };
  posts: Post[];
  tags: { id: string, name: string, slug: string }[];
  _count: { likes: number, posts: number };
}

interface RelatedThread {
  id: string;
  title: string;
  slug: string;
  views: number;
  createdAt: string;
  author: { username: string, avatarUrl: string | null };
  board: { name: string, slug: string };
  tags: { id: string, name: string, slug: string }[];
  _count: { posts: number, likes: number };
}

import ShareModal from '@/components/forum/ShareModal';
import Sidebar from '@/components/layout/Sidebar';

export default function ThreadPage() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [comment, setComment] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const { data: thread, isLoading } = useQuery<ThreadData>({
    queryKey: ['thread', slug],
    queryFn: async () => {
      const { data } = await api.get(`/forum/threads/${slug}`);
      return data;
    },
  });

  const { data: relatedThreads } = useQuery<RelatedThread[]>({
    queryKey: ['related', slug],
    queryFn: async () => {
      const { data } = await api.get(`/forum/threads/${slug}/related`);
      return data;
    },
    enabled: !!thread
  });

  const likeMutation = useMutation({
    mutationFn: async (id: { threadId?: string, postId?: string }) => {
      const { data } = await api.post('/forum/likes/toggle', id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', slug] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Không thể thả tim. Vui lòng đăng nhập.');
    }
  });

  const handleLike = (id: { threadId?: string, postId?: string }) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thả tim');
      return;
    }
    likeMutation.mutate(id);
  };

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data } = await api.post('/forum/posts', {
        content,
        threadId: thread?.id
      });
      return data;
    },
    onSuccess: () => {
      setComment('');
      toast.success('Bình luận thành công!');
      queryClient.invalidateQueries({ queryKey: ['thread', slug] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Không thể gửi bình luận');
    }
  });

  const handleReply = (authorName: string, content: string) => {
    const shortContent = content.length > 150 ? content.substring(0, 150) + '...' : content;
    setComment(prev => `${prev}> @${authorName}: ${shortContent}\n\n`);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const renderContent = (content: string) => {
    // If it looks like HTML (from TipTap), render it directly
    if (content.includes('<') && content.includes('>')) {
      return (
        <div 
          className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-200 leading-relaxed text-lg"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      );
    }

    // Default fallback for old plain text / markdown-like posts
    return content.split('\n').map((line, i) => {
      if (line.trim().startsWith('>')) {
        return (
          <blockquote key={i} className="border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-900/20 px-4 py-3 text-primary-700 dark:text-primary-300 rounded-r-2xl my-3 text-sm italic shadow-inner">
            {line.trim().substring(1).trim()}
          </blockquote>
        );
      }
      
      const imageMatch = line.match(/!\[.*?\]\((.*?)\)/);
      if (imageMatch) {
        return (
          <div key={i} className="my-4">
            <img 
              src={imageMatch[1]} 
              alt="uploaded content" 
              className="max-w-full h-auto rounded-2xl shadow-lg border border-white/10" 
            />
          </div>
        );
      }

      return <span key={i} className="block min-h-[1.5rem]">{line}</span>;
    });
  };

  if (isLoading) return <div className="lg:col-span-12 h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" /></div>;
  if (!thread) return <div className="lg:col-span-12 text-center p-20">Không tìm thấy bài viết</div>;

  return (
    <>
      <div className="lg:col-span-8 space-y-8 pb-20">
        <Link href={`/board/${thread.board.slug}`} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-primary-400 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại {thread.board.name}
        </Link>

        <div className="space-y-6">
          <div className="space-y-3">
             <h1 className="text-4xl font-black leading-tight tracking-tight text-zinc-900 dark:text-zinc-100">{thread.title}</h1>
             <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(thread.createdAt).toLocaleDateString('vi-VN')}</span>
                <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> {thread._count.posts} bình luận</span>
                <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{thread.views} Lượt xem</span>
             </div>
             {thread.tags && thread.tags.length > 0 && (
               <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-zinc-400" />
                  {thread.tags.map(tag => (
                    <motion.span
                      key={tag.id}
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 cursor-pointer hover:bg-primary-500/20 transition-colors tracking-wide"
                    >
                      #{tag.name}
                    </motion.span>
                  ))}
               </div>
             )}
          </div>

          {/* AUTHOR & CONTENT */}
          <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
             {/* Row 1: Author info */}
             <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80">
                <img
                   src={thread.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${thread.author.username}`}
                   alt="avatar"
                   className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 object-cover shrink-0"
                />
                <Link href={`/user/${thread.author.username}`} className="font-black text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                   {thread.author.username}
                </Link>
                <span className="flex items-center gap-1 text-[11px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                   <Award className="w-3 h-3" /> {thread.author.reputation}
                </span>
                <span className="text-zinc-600 text-xs">•</span>
                <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                   <Clock className="w-3 h-3" /> {new Date(thread.createdAt).toLocaleDateString('vi-VN')}
                </span>
             </div>

             {/* Row 2: Content */}
             <div className="px-6 py-6 space-y-4">
                <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-200 leading-relaxed text-base whitespace-pre-wrap">
                   {renderContent(thread.content)}
                </div>
                {thread.author.signature && (
                   <p className="text-sm italic text-zinc-500 pt-4 border-t border-zinc-200 dark:border-zinc-800/60">"{thread.author.signature}"</p>
                )}
             </div>

             {/* Row 3: Actions */}
             <div className="flex items-center gap-2 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60">
                <motion.button
                   whileHover={{ scale: 1.04 }}
                   whileTap={{ scale: 0.96 }}
                   onClick={() => handleLike({ threadId: thread.id })}
                   className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${thread._count.likes > 0 ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-red-500/30 hover:text-red-400'}`}
                >
                   <Heart className={`w-4 h-4 ${thread._count.likes > 0 ? 'fill-current' : ''}`} />
                   {thread._count.likes} Thích
                </motion.button>

                <motion.button
                   whileHover={{ scale: 1.04 }}
                   whileTap={{ scale: 0.96 }}
                   title="Lưu bài viết"
                   className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:text-primary-400 hover:border-primary-500/30 transition-all"
                >
                   <BookMarked className="w-4 h-4" />
                   Lưu
                </motion.button>

                <motion.button
                   whileHover={{ scale: 1.04 }}
                   whileTap={{ scale: 0.96 }}
                   onClick={() => handleReply(thread.author.username, thread.content)}
                   className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                >
                   <MessageSquare className="w-4 h-4" />
                   Trả lời
                </motion.button>

                <motion.button
                   whileHover={{ scale: 1.04 }}
                   whileTap={{ scale: 0.96 }}
                   onClick={() => user ? setIsShareModalOpen(true) : toast.error('Vui lòng đăng nhập để tham gia marketing')}
                   className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all ml-auto"
                >
                   <Share2 className="w-4 h-4" />
                   Chia sẻ (Kiếm tiền)
                </motion.button>
             </div>
          </div>

          {/* Modal */}
          <ShareModal 
            isOpen={isShareModalOpen} 
            onClose={() => setIsShareModalOpen(false)}
            threadId={thread.id}
            threadTitle={thread.title}
            threadSlug={thread.slug}
          />

          {/* COMMENTS SECTION */}
          <section className="pt-8 space-y-8">
             <h3 className="text-2xl font-black flex items-center gap-3 text-zinc-100">
                <MessageSquare className="w-7 h-7 text-primary-500" />
                Thảo luận ({thread._count.posts})
             </h3>

             <div className="space-y-4">
                {thread.posts.map((post) => (
                  <motion.div
                     key={post.id}
                     initial={{ opacity: 0, y: 6 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                  >
                     {/* Row 1: Author */}
                     <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80">
                        <img src={post.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.username}`} className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 object-cover shrink-0" />
                        <Link href={`/user/${post.author.username}`} className="font-black text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                           {post.author.username}
                        </Link>
                        <span className="text-zinc-600 text-xs">•</span>
                        <span className="text-xs text-zinc-500 font-medium">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                        <button className="ml-auto p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500">
                           <MoreVertical className="w-4 h-4" />
                        </button>
                     </div>
                     {/* Row 2: Content */}
                     <div className="px-5 py-4 space-y-2">
                        <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{renderContent(post.content)}</div>
                        {post.author.signature && (
                           <p className="text-xs italic text-zinc-500 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800">"{post.author.signature}"</p>
                        )}
                     </div>
                     {/* Row 3: Actions */}
                     <div className="flex items-center gap-2 px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60">
                        <button
                           onClick={() => handleLike({ postId: post.id })}
                           className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${post._count.likes > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent'}`}
                        >
                           <Heart className={`w-3.5 h-3.5 ${post._count.likes > 0 ? 'fill-current' : ''}`} /> {post._count.likes} Thích
                        </button>
                        <button
                           onClick={() => handleReply(post.author.username, post.content)}
                           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent transition-all"
                        >
                           <MessageSquare className="w-3.5 h-3.5" /> Trả lời
                        </button>
                     </div>
                  </motion.div>
                ))}
             </div>

             {/* COMMENT INPUT */}
             <div className="pt-4">
                {user ? (
                   <div className="p-4 rounded-2xl glass border border-primary-500 shadow-lg space-y-3">
                      <h4 className="font-black text-xs text-zinc-500 uppercase tracking-widest">Viết bình luận của bạn</h4>
                      <RichTextEditor 
                         content={comment} 
                         onChange={setComment} 
                         placeholder="Nhập suy nghĩ của bạn..."
                      />
                      <div className="flex justify-end">
                         <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => commentMutation.mutate(comment)}
                            disabled={!comment.replace(/<[^>]*>/g, '').trim() || commentMutation.isPending}
                            className="px-8 py-3 bg-primary-500 text-black rounded-xl font-black flex items-center gap-3 hover:bg-primary-400 shadow-lg shadow-primary-500/20 disabled:opacity-50"
                         >
                            Gửi bình luận
                            <Send className="w-5 h-5" />
                         </motion.button>
                      </div>
                   </div>
                ) : (
                   <div className="p-10 rounded-3xl bg-zinc-50 dark:bg-zinc-900 text-center space-y-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700">
                      <p className="font-bold text-zinc-400">Bạn cần đăng nhập để tham gia thảo luận này</p>
                      <Link href="/login" className="inline-block px-8 py-2 rounded-xl bg-primary-500 text-black font-black hover:bg-primary-400 transition-colors">
                         Đăng nhập ngay
                      </Link>
                   </div>
                )}
             </div>
          </section>
        </div>

        {/* RELATED ARTICLES */}
        {relatedThreads && relatedThreads.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xl font-black flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
               <Tag className="w-5 h-5 text-primary-500" />
               Bài viết liên quan
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {relatedThreads.map((rt, i) => (
                <motion.div
                  key={rt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/thread/${rt.slug}`} className="group block p-5 rounded-2xl glass border border-white/20 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5 transition-all">
                    <div className="flex items-start gap-4">
                       <img
                         src={rt.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rt.author.username}`}
                         alt={rt.author.username}
                         className="w-10 h-10 rounded-xl bg-zinc-800 shrink-0 object-cover"
                       />
                       <div className="flex-1 min-w-0 space-y-2">
                          <h4 className="font-black text-sm leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {rt.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                             <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {rt.views}</span>
                             <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {rt._count.posts}</span>
                             <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {rt._count.likes}</span>
                             <span className="text-primary-500">• {rt.board.name}</span>
                          </div>
                          {rt.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {rt.tags.slice(0, 3).map(tag => (
                                <span key={tag.id} className="px-2 py-0.5 rounded-full text-[9px] font-black bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                                  #{tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                       </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="lg:col-span-4">
        <Sidebar />
      </div>
    </>
  );
}
