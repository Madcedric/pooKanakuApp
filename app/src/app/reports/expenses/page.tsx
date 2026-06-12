'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getExpenseReport, type MonthlyExpenseSummary } from '../actions';
import { useLangStore } from '../../../stores/langStore';
import { t } from '../../../lib/i18n';

const PIE_COLORS = ['#2E7D32', '#F57C00', '#1976D2', '#E53935', '#7B1FA2', '#6b7280'];

export default function ExpenseReportPage() {
  const [data, setData] = useState<MonthlyExpenseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLangStore();

  useEffect(() => {
    async function load() {
      const result = await getExpenseReport(6);
      setData(result);
      setLoading(false);
    }
    load();
  }, []);

  // Monthly totals for bar chart
  const monthlyData = data.map(d => ({
    name: d.month,
    expenses: d.totalExpenses,
  }));

  // Aggregate categories across all months
  const categoryTotals = data.reduce((acc, d) => {
    d.byCategory.forEach(c => {
      acc.set(c.category, (acc.get(c.category) || 0) + c.amount);
    });
    return acc;
  }, new Map<string, number>());

  const pieData = Array.from(categoryTotals.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const totalExpenses = data.reduce((sum, d) => sum + d.totalExpenses, 0);

  return (
    <div>
      <div style={{ marginBottom: '0.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>{t(lang, 'rpt.expense')}</h1>
      </div>

      {/* Summary */}
      <div style={{
        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '8px', padding: '0.625rem 0.75rem', marginBottom: '0.75rem',
        display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{t(lang, 'rpt.total6mo')}</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F57C00' }}>₹{totalExpenses.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{t(lang, 'rpt.monthlyAvgLabel')}</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F57C00' }}>₹{data.length ? Math.round(totalExpenses / data.length).toLocaleString() : 0}</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '0.75rem' }}>
        {/* Bar chart - monthly */}
        <div style={{
          backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: '8px', padding: '0.75rem',
        }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{t(lang, 'rpt.monthlyLabel')}</h2>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t(lang, 'common.loading')}</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Expenses']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '0.75rem' }}
                />
                <Bar dataKey="expenses" fill="#F57C00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart - categories */}
        <div style={{
          backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: '8px', padding: '0.75rem',
        }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{t(lang, 'rpt.byCategory')}</h2>
          {loading || pieData.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              {loading ? t(lang, 'common.loading') : t(lang, 'rpt.noData')}
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '0.75rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category breakdown table */}
      <div style={{
        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '8px', padding: '0.75rem', overflowX: 'auto',
      }}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{t(lang, 'rpt.categoryBreakdown')}</h2>
        <div className="pkk-table-wrap" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                <th style={thStyle}>{t(lang, 'exp.category')}</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>{t(lang, 'common.total')}</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {pieData.map(c => (
                <tr key={c.name} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td data-label="Category" style={tdStyle}>{c.name}</td>
                  <td data-label="Total" style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>₹{c.value.toLocaleString()}</td>
                  <td data-label="% of Total" style={{ ...tdStyle, textAlign: 'right', color: 'var(--color-text-muted)' }}>
                    {totalExpenses ? ((c.value / totalExpenses) * 100).toFixed(1) : 0}%
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
