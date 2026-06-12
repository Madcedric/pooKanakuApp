'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { getProfitReport, type MonthlyProfit } from '../actions';
import { useLangStore } from '../../../stores/langStore';
import { t } from '../../../lib/i18n';

export default function ProfitReportPage() {
  const [data, setData] = useState<MonthlyProfit[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLangStore();

  useEffect(() => {
    async function load() {
      const result = await getProfitReport(6);
      setData(result);
      setLoading(false);
    }
    load();
  }, []);

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = data.reduce((sum, d) => sum + d.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <div>
      <div style={{ marginBottom: '0.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>{t(lang, 'rpt.profit')}</h1>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {[
          { label: t(lang, 'rpt.revenueLabel'), value: `₹${totalRevenue.toLocaleString()}`, color: '#2E7D32' },
          { label: t(lang, 'rpt.expensesLabel'), value: `₹${totalExpenses.toLocaleString()}`, color: '#F57C00' },
          { label: t(lang, 'rpt.netProfit'), value: `₹${totalProfit.toLocaleString()}`, color: totalProfit >= 0 ? '#1976D2' : '#E53935' },
          { label: t(lang, 'rpt.margin'), value: totalRevenue ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}%` : '0%', color: '#7B1FA2' },
        ].map(card => (
          <div key={card.label} style={{
            backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: '8px', padding: '0.5rem 0.625rem',
          }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>{card.label}</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: card.color, lineHeight: 1.3 }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Combined bar chart */}
      <div style={{
        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem',
      }}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{t(lang, 'rpt.revenueVsExpenses')}</h2>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t(lang, 'common.loading')}</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value, name) => [`₹${Number(value).toLocaleString()}`, name === 'revenue' ? 'Revenue' : name === 'expenses' ? 'Expenses' : 'Profit']}
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '0.75rem' }}
              />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#2E7D32" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#F57C00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Profit line chart */}
      <div style={{
        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem',
      }}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{t(lang, 'rpt.profitTrend')}</h2>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t(lang, 'common.loading')}</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Profit']}
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '0.75rem' }}
              />
              <Line type="monotone" dataKey="profit" stroke="#1976D2" strokeWidth={2} dot={{ fill: '#1976D2', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Monthly breakdown table */}
      <div style={{
        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '8px', padding: '0.75rem', overflowX: 'auto',
      }}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{t(lang, 'rpt.monthlyBreakdown')}</h2>
        <div className="pkk-table-wrap" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                <th style={thStyle}>{t(lang, 'common.month')}</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>{t(lang, 'rpt.revenueLabel')}</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>{t(lang, 'rpt.expensesLabel')}</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>{t(lang, 'rpt.profit')}</th>
              </tr>
            </thead>
            <tbody>
              {data.map(d => (
                <tr key={d.month} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td data-label="Month" style={tdStyle}>{d.month}</td>
                  <td data-label="Revenue" style={{ ...tdStyle, textAlign: 'right', color: '#2E7D32', fontWeight: 500 }}>₹{d.revenue.toLocaleString()}</td>
                  <td data-label="Expenses" style={{ ...tdStyle, textAlign: 'right', color: '#F57C00', fontWeight: 500 }}>₹{d.expenses.toLocaleString()}</td>
                  <td data-label="Profit" style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: d.profit >= 0 ? '#1976D2' : '#E53935' }}>
                    ₹{d.profit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = { padding: '0.5rem 0.625rem', color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 500 };
const tdStyle = { padding: '0.5rem 0.625rem', color: 'var(--color-text)', fontSize: '0.75rem' };
