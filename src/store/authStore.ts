import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  reputation: number;
  avatarUrl?: string;
  signature?: string;
  phoneNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: (User & { accessToken?: string }) | null) => void;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (userData) => {
    if (userData) {
      const { accessToken, ...user } = userData;
      if (accessToken && typeof window !== 'undefined') {
        localStorage.setItem('picpee-token', accessToken);
      }
      set({ user, isLoading: false });
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('picpee-token');
      }
      set({ user: null, isLoading: false });
    }
  },
  fetchMe: async () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('picpee-token')) {
      set({ user: null, isLoading: false });
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data, isLoading: false });
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('picpee-token');
      }
      set({ user: null, isLoading: false });
    }
  },
  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('picpee-token');
    }
    set({ user: null });
  },
}));
