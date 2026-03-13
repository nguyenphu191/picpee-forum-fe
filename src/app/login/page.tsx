'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Github, AtSign, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const fetchMe = useAuthStore((state) => state.fetchMe);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/login', { email, password });
      toast.success('Đăng nhập thành công!');
      await fetchMe();
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-12 flex justify-center items-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/50 space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Chào mừng trở lại!</h1>
          <p className="text-zinc-400">Vui lòng đăng nhập để tiếp tục thảo luận.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-300 pl-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-semibold text-zinc-300">Mật khẩu</label>
              <Link href="/forgot" className="text-xs text-emerald-500 hover:text-emerald-400 hover:underline font-medium">Quên mật khẩu?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-3 bg-linear-to-r from-emerald-500 to-emerald-700 text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : (
              <>
                <LogIn className="w-5 h-5" />
                Đăng nhập
              </>
            )}
          </motion.button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-700"></span></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-3 text-zinc-500 font-medium tracking-wider">Hoặc tiếp tục với</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 hover:border-zinc-600 transition-all text-sm font-semibold text-zinc-200">
            <Github className="w-4 h-4" /> Github
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 hover:border-zinc-600 transition-all text-sm font-semibold text-zinc-200">
            <AtSign className="w-4 h-4" /> Google
          </button>
        </div>

        <p className="text-center text-sm text-zinc-500">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-emerald-500 hover:text-emerald-400 font-bold hover:underline">Đăng ký ngay</Link>
        </p>
      </motion.div>
    </div>
  );
}
