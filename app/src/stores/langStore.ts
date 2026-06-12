import { create } from 'zustand';
import type { Lang } from '../lib/i18n';

interface LanguageState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLangStore = create<LanguageState>((set) => ({
  lang: 'en',
  setLang: (lang: Lang) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pkk-lang', lang);
    }
    set({ lang });
  },
}));

// Initialize from localStorage on client
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('pkk-lang') as Lang | null;
  if (saved && (saved === 'en' || saved === 'ta')) {
    useLangStore.setState({ lang: saved });
  }
}
