// src/components/Providers.tsx
// Client-side providers wrapper — bundles all context providers.
'use client';

import AuthProvider from './AuthProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
