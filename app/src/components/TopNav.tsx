"use client";

import React from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function TopNav({ onMenuToggle }: { onMenuToggle?: () => void }) {
  return (
    <header style={{
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 0.75rem',
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={onMenuToggle}
          aria-label="Toggle navigation"
          className="pkk-hamburger"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.25rem',
            padding: '0.25rem',
            color: 'var(--color-text)',
            lineHeight: 1,
          }}
        >
          ☰
        </button>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>🌺 PooKanakuApp</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ThemeToggle />
        <Link
          href="/settings"
          style={{
            padding: '0.25rem 0.5rem', borderRadius: '6px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            textDecoration: 'none', fontSize: '1rem',
            display: 'flex', alignItems: 'center',
          }}
          title="Settings"
        >
          ⚙️
        </Link>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .pkk-hamburger {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}
