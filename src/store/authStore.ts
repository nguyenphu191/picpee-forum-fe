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
  setUser: (user: User | null) => void;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null });
    } catch (error) {}
  },
}));
