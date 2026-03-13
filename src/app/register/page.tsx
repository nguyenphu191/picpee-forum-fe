'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { email, password, username });
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-12 flex justify-center items-center min-h-[80vh] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/50 space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-zinc-100">Tạo tài khoản mới</h1>
          <p className="text-zinc-400 font-medium">Tham gia cộng đồng Picpee và bắt đầu kiếm tiền.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-300 ml-1">Tên người dùng</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-zinc-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ví dụ: picpee_user"
                className="block w-full pl-12 pr-4 py-3 rounded-xl bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-300 ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-zinc-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="block w-full pl-12 pr-4 py-3 rounded-xl bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-300 ml-1">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-zinc-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="block w-full pl-12 pr-12 py-3 rounded-xl bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-sm"
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
            className="w-full py-4 bg-linear-to-r from-emerald-500 to-emerald-700 text-black rounded-xl font-black flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Đang tạo...' : (
              <>
                <UserPlus className="w-5 h-5" />
                Đăng ký thành viên
              </>
            )}
          </motion.button>
        </form>

        <div className="space-y-4">
          <p className="text-center text-xs text-zinc-500 font-medium leading-relaxed">
            Bằng cách đăng ký, bạn đồng ý với <Link href="/terms" className="text-emerald-500 hover:text-emerald-400 hover:underline font-bold">Điều khoản dịch vụ</Link> của chúng tôi.
          </p>

          <p className="text-center text-sm text-zinc-500 font-medium">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-black hover:underline">Đăng nhập ngay</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
