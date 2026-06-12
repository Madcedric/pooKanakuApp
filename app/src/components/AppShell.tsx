"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useUIStore } from '../stores/uiStore';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, closeSidebar } = useUIStore();

  if (pathname && pathname.startsWith('/login')) {
    return <>{children}</>;
  }

  return (
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
  );
}
