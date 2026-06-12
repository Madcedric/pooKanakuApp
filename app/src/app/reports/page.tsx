'use client';

import React from 'react';
import Link from 'next/link';
import { useLangStore } from '../../stores/langStore';
import { t } from '../../lib/i18n';



export default function ReportsPage() {
  const { lang } = useLangStore();
  const REPORTS = [
    { titleKey: 'rpt.revenue', descKey: 'rpt.revenueDesc', href: '/reports/revenue', icon: '📈', color: '#2E7D32' },
    { titleKey: 'rpt.expense', descKey: 'rpt.expenseDesc', href: '/reports/expenses', icon: '📊', color: '#F57C00' },
    { titleKey: 'rpt.profit', descKey: 'rpt.profitDesc', href: '/reports/profit', icon: '💰', color: '#1976D2' },
    { titleKey: 'rpt.customer', descKey: 'rpt.customerDesc', href: '/reports/customers', icon: '👥', color: '#7B1FA2' },
    { titleKey: 'rpt.outstanding', descKey: 'rpt.outstandingDesc', href: '/reports/outstanding', icon: '⏳', color: '#E53935' },
    { titleKey: 'rpt.leaveReport', descKey: 'rpt.leaveReportDesc', href: '/reports/leaves', icon: '🏖️', color: '#6b7280' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>{t(lang, 'rpt.title')}</h1>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '0.5rem',
      }}>
        {REPORTS.map(report => (
          <Link
            key={report.href}
            href={report.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.625rem 0.75rem',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
            }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              backgroundColor: report.color + '18',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.125rem', flexShrink: 0,
            }}>
              {report.icon}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-text)' }}>{t(lang, report.titleKey)}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{t(lang, report.descKey)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
