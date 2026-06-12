'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLangStore } from '../stores/langStore';
import { t } from '../lib/i18n';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open = false, onClose = () => {} }: SidebarProps) {
  const pathname = usePathname() || '';
  const { lang } = useLangStore();

  const navItems = [
    { key: 'nav.dashboard',    href: '/',          icon: '🏠' },
    { key: 'nav.customers',    href: '/customers',  icon: '👥' },
    { key: 'nav.flowers',      href: '/flowers',    icon: '🌸' },
    { key: 'nav.supply',       href: '/supply',     icon: '🚚' },
    { key: 'nav.calendar',     href: '/calendar',   icon: '📅' },
    { key: 'nav.billing',      href: '/billing',    icon: '🧾' },
    { key: 'nav.payments',     href: '/payments',   icon: '💵' },
    { key: 'nav.expenses',     href: '/expenses',   icon: '📊' },
    { key: 'nav.leaves',       href: '/leaves',     icon: '🏖️' },
    { key: 'nav.reports',      href: '/reports',    icon: '📈' },
    { key: 'nav.settings',     href: '/settings',   icon: '⚙️' },
  ];

  return (
    <>
      <aside
        className="pkk-sidebar"
        data-open={open ? 'true' : 'false'}
        style={{
          width: 260,
          height: '100vh',
          backgroundColor: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          transition: 'transform 0.25s ease',
          overflowY: 'auto',
        }}
      >
        {/* Brand */}
        <div style={{
          padding: '1rem 0.875rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🌺</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary)' }}>
              PooKanakuApp
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>
              Flower Ledger Pro
            </div>
          </div>
          <button
            className="pkk-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{
              display: 'none',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '1rem', color: 'var(--color-text-muted)', padding: '0.25rem',
            }}
          >✕</button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '0.5rem 0.5rem' }}>
          {navItems.map(item => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  marginBottom: '2px',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.8rem',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--color-text)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '1rem', minWidth: '1.125rem', textAlign: 'center' }}>
                  {item.icon}
                </span>
                {t(lang, item.key)}
                {isActive && (
                  <span style={{ marginLeft: 'auto', width: '5px', height: '5px', backgroundColor: '#fff', borderRadius: '50%', opacity: 0.8 }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '0.625rem 0.75rem',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.6rem',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
        }}>
          PooKanakuApp v1.0
        </div>
      </aside>

      <style>{`
        @media (max-width: 1023px) {
          .pkk-sidebar {
            transform: translateX(-100%);
          }
          .pkk-sidebar[data-open="true"] {
            transform: translateX(0);
          }
          .pkk-close-btn {
            display: inline-flex !important;
          }
        }
        @media (min-width: 1024px) {
          .pkk-sidebar {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
}
