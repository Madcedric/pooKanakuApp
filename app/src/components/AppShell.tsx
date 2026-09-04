"use client";

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUIStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, initialized, loading } = useAuthStore();
  const isLoginPage = pathname?.startsWith('/login');

  useEffect(() => {
    if (initialized && !user && !isLoginPage) {
      router.replace('/login');
    }
  }, [initialized, user, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (!initialized || loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'var(--color-background)',
      }}>
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌺</div>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, closeSidebar } = useUIStore();

  if (pathname && pathname.startsWith('/login')) {
    return <>{children}</>;
  }

  return (
    <AuthGate>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="pkk-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 40,
          }}
        />
      )}

      <div className="pkk-main-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{ borderBottom: '1px solid var(--color-border)' }}>
          <TopNav onMenuToggle={toggleSidebar} />
        </header>
        <main style={{ padding: '1rem', flex: 1 }} className="pkk-main-content">
          {children}
        </main>
      </div>

      <style>{`
        .pkk-overlay { display: none; }
        .pkk-main-area { margin-left: 260px; }

        @media (max-width: 1023px) {
          .pkk-overlay { display: block !important; }
          .pkk-main-area { margin-left: 0 !important; }
          .pkk-main-content { padding: 0.75rem !important; }
        }
      `}</style>
    </div>
    </AuthGate>
  );
}
