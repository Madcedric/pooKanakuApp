"use client";

import React, { useEffect, useState } from 'react';
import { getDashboardStats } from './dashboard/actions';
import { useLangStore } from '../stores/langStore';
import { t } from '../lib/i18n';

export default function HomePage() {
  const { lang } = useLangStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setStats({
        todayRevenue: 0, monthlyRevenue: 0, outstandingAmount: 0,
        totalCustomers: 0, monthlyExpenses: 0, netProfit: 0,
        recentPayments: [],
      }))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { labelKey: 'dash.todayRevenue',    value: `₹${(stats?.todayRevenue || 0).toLocaleString()}`,   icon: '💰', color: '#2E7D32' },
    { labelKey: 'dash.monthlyRevenue',  value: `₹${(stats?.monthlyRevenue || 0).toLocaleString()}`,  icon: '📈', color: '#1976D2' },
    { labelKey: 'dash.outstanding',     value: `₹${(stats?.outstandingAmount || 0).toLocaleString()}`, icon: '⏳', color: '#E53935' },
    { labelKey: 'dash.customers',       value: String(stats?.totalCustomers || 0),                   icon: '👥', color: '#7B1FA2' },
    { labelKey: 'dash.expenses',        value: `₹${(stats?.monthlyExpenses || 0).toLocaleString()}`, icon: '📊', color: '#F57C00' },
    { labelKey: 'dash.profit',          value: `₹${(stats?.netProfit || 0).toLocaleString()}`,       icon: '🏆', color: '#00796B' },
  ];

  const quickActions = [
    { labelKey: 'dash.supply',   href: '/supply',    icon: '🚚' },
    { labelKey: 'dash.customer', href: '/customers', icon: '👥' },
    { labelKey: 'dash.calendar', href: '/calendar',  icon: '📅' },
    { labelKey: 'dash.leave',    href: '/leaves',    icon: '🏖️' },
    { labelKey: 'dash.payment',  href: '/payments',  icon: '💵' },
    { labelKey: 'dash.expense',  href: '/expenses',  icon: '📊' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
          {t(lang, 'dash.title')}
        </h1>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.5rem', marginBottom: '1rem',
      }} className="pkk-stats-grid">
        {statCards.map(stat => (
          <div key={stat.labelKey} style={{
            backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: '10px', padding: '0.625rem 0.75rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span style={{
              fontSize: '1.125rem', backgroundColor: stat.color + '18',
              padding: '0.2rem', borderRadius: '6px', flexShrink: 0,
            }}>{stat.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 500, lineHeight: 1.2 }}>
                {t(lang, stat.labelKey)}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: stat.color, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {loading ? '...' : stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions + Recent payments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="pkk-bottom-grid">
        <div style={{
          backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: '10px', padding: '0.75rem',
        }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)' }}>
            {t(lang, 'dash.quickActions')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem' }}>
            {quickActions.map(a => (
              <a key={a.labelKey} href={a.href} style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.4rem 0.5rem', backgroundColor: 'var(--color-muted)',
                border: '1px solid var(--color-border)', borderRadius: '6px',
                textDecoration: 'none', fontSize: '0.7rem', fontWeight: 500,
                color: 'var(--color-text)',
              }}>
                <span style={{ fontSize: '0.875rem' }}>{a.icon}</span> {t(lang, a.labelKey)}
              </a>
            ))}
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: '10px', padding: '0.75rem',
        }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)' }}>
            {t(lang, 'dash.recentPayments')}
          </h2>
          {(!stats?.recentPayments || stats.recentPayments.length === 0) ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textAlign: 'center', padding: '0.5rem 0' }}>
              {t(lang, 'dash.noPayments')}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {stats.recentPayments.map((p: any) => (
                <div key={p.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.3rem 0', borderBottom: '1px solid var(--color-border)',
                }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.customers?.name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>
                      {new Date(p.payment_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, color: '#2E7D32', fontSize: '0.75rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                    ₹{p.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .pkk-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.375rem !important; }
          .pkk-bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
