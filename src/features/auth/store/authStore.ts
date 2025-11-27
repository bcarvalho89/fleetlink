import { User as FirebaseUser } from 'firebase/auth';
import { create } from 'zustand';

import { User } from '../types/User';

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: FirebaseUser | null) => void;
};

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  user: null,
  login: user => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
  setUser: user => {
    if (user) {
      set({
        isAuthenticated: true,
        user: { uid: user.uid, email: user.email },
      });
    } else {
      set({ isAuthenticated: false, user: null });
    }
  },
}));
