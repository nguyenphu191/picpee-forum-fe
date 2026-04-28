'use client';

import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useFirebaseAuth() {
  const { setUser } = useAuthStore();
  const router = useRouter();

  const loginWith = async (provider: 'google' | 'github') => {
    try {
      const p = provider === 'google' ? googleProvider : githubProvider;
      const result = await signInWithPopup(auth, p);
      const idToken = await result.user.getIdToken();

      const { data } = await api.post('/auth/firebase', { idToken });
      setUser(data);
      toast.success('Đăng nhập thành công!');
      router.push('/');
    } catch (err: any) {
      const code = err?.code;
      if (code === 'auth/popup-closed-by-user') return;
      toast.error(err?.message || 'Đăng nhập thất bại');
    }
  };

  return { loginWith };
}
