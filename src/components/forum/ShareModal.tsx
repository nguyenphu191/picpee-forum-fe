'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Send, AlertCircle, Share2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  threadId: string;
  threadTitle: string;
  threadSlug: string;
}

export default function ShareModal({ isOpen, onClose, threadId, threadTitle, threadSlug }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [sharedUrl, setSharedUrl] = useState('');
  const [proofNote, setProofNote] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Base referral URL (simulated for now)
  const refUrl = `${window.location.origin}/thread/${threadSlug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(refUrl);
    setCopied(true);
    toast.success('Đã sao chép link chia sẻ!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sharedUrl) return;
    
    setLoading(true);
    try {
      await api.post('/forum/share/submit', {
        threadId,
        sharedUrl,
        proofNote
      });
      toast.success('Báo cáo thành công! Admin sẽ duyệt trong vòng 24h.');
      onClose();
      setSharedUrl('');
      setProofNote('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể gửi báo cáo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden p-8 border border-white/20"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Chia sẻ & Kiếm tiền</h2>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">Chia sẻ bài viết này lên mạng xã hội khác và nhận ngay $5.00 USD tiền thưởng.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1">Link định danh của bạn</label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-950/50 border border-gray-100 dark:border-slate-800 text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                      {refUrl}
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="p-3 rounded-xl bg-primary-500 text-black hover:bg-primary-400 transition-colors shadow-lg shadow-primary-500/20"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex gap-3">
                   <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                   <p className="text-xs text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                     Bạn phải sao chép link trên và đăng lên một nền tảng khác (Facebook, Blog, Forum...), sau đó gửi link bài đăng đó làm bằng chứng bên dưới.
                   </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-8 pt-8 border-t border-gray-100 dark:border-slate-800">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1">Link bài đăng của bạn (Proof)</label>
                    <input 
                      type="url" 
                      required
                      value={sharedUrl}
                      onChange={(e) => setSharedUrl(e.target.value)}
                      placeholder="https://facebook.com/posts/123..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-950/50 border border-gray-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1">Ghi chú (Tùy chọn)</label>
                    <textarea 
                      value={proofNote}
                      onChange={(e) => setProofNote(e.target.value)}
                      placeholder="Nhập thêm bằng chứng hoặc lời nhắn cho Admin..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-950/50 border border-gray-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm h-24 resize-none"
                    />
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading || !sharedUrl}
                    className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-primary-500/30 disabled:opacity-50"
                  >
                    {loading ? 'Đang gửi...' : (
                      <>
                        Gửi báo cáo hoàn tất
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
