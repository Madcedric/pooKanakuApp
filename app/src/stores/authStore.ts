// src/stores/authStore.ts
// Zustand store for authentication state
import { create } from 'zustand';
import type { User } from '../types/database';

interface AuthState {
  /** Current authenticated user (null if not logged in) */
  user: User | null;
  /** Whether the auth state has been initialized */
  initialized: boolean;
  /** Whether a login/logout operation is in progress */
  loading: boolean;

  /** Set the current user after login or session restore */
  setUser: (user: User | null) => void;
  /** Mark auth as initialized (after first session check) */
  setInitialized: () => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Clear all auth state on logout */
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  loading: false,

  setUser: (user) => set({ user, initialized: true }),
  setInitialized: () => set({ initialized: true }),
  setLoading: (loading) => set({ loading }),
  clearAuth: () => set({ user: null, initialized: true, loading: false }),
}));
