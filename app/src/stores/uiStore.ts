// src/stores/uiStore.ts
// Zustand store for UI state (theme, sidebar, toasts)
import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UIState {
  /** Dark mode enabled */
  darkMode: boolean;
  /** Sidebar open on mobile */
  sidebarOpen: boolean;
  /** Active toasts */
  toasts: Toast[];

  /** Toggle dark mode and persist to localStorage */
  toggleDarkMode: () => void;
  /** Initialize dark mode from localStorage / system preference */
  initDarkMode: (isDark: boolean) => void;
  /** Toggle sidebar on mobile */
  toggleSidebar: () => void;
  /** Close sidebar */
  closeSidebar: () => void;
  /** Show a toast notification */
  showToast: (message: string, type?: Toast['type']) => void;
  /** Remove a toast by id */
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  darkMode: false,
  sidebarOpen: false,
  toasts: [],

  toggleDarkMode: () => {
    const next = !get().darkMode;
    set({ darkMode: next });
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', next ? 'dark' : 'light');
      const html = document.documentElement;
      html.classList.toggle('dark', next);
      html.classList.toggle('light', !next);
    }
  },

  initDarkMode: (isDark) => {
    set({ darkMode: isDark });
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      html.classList.toggle('dark', isDark);
      html.classList.toggle('light', !isDark);
    }
  },

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),

  showToast: (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    // Auto-remove after 4 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
