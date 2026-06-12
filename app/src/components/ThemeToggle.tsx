"use client";

import { useEffect } from 'react';
import { useUIStore } from '../stores/uiStore';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode, initDarkMode } = useUIStore();

  // Initialize from localStorage / prefers-color-scheme on mount
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ? stored === 'dark' : prefersDark;
    initDarkMode(initial);
  }, [initDarkMode]);

  return (
    <button
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      style={{ padding: 8, borderRadius: 8 }}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}
