'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getRevenueReport, type MonthlyRevenueSummary } from '../actions';
import { useLangStore } from '../../../stores/langStore';
import { t } from '../../../lib/i18n';

export default function RevenueReportPage() {
  const [data, setData] = useState<MonthlyRevenueSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLangStore();

  useEffect(() => {
    async function load() {
      const result = await getRevenueReport(6);
      setData(result);
      setLoading(false);
    }
    load();
  }, []);

  const chartData = data.map(d => ({
    name: d.month,
    revenue: d.totalRevenue,
  }));

  const totalRevenue = data.reduce((sum, d) => sum + d.totalRevenue, 0);

  return (
    <div>
      <div style={{ marginBottom: '0.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>{t(lang, 'rpt.revenue')}</h1>
      </div>

      {/* Summary card */}
      <div style={{
        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '8px', padding: '0.625rem 0.75rem', marginBottom: '0.75rem',
        display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{t(lang, 'rpt.total6mo')}</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#2E7D32' }}>₹{totalRevenue.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{t(lang, 'rpt.monthlyAvgLabel')}</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1976D2' }}>₹{data.length ? Math.round(totalRevenue / data.length).toLocaleString() : 0}</div>
        </div>
      </div>

      {/* Chart */}
      <div style={{
        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem',
      }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t(lang, 'common.loading')}</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '0.75rem' }}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i === chartData.length - 1 ? '#2E7D32' : '#81C784'} />
                ))}
              </Bar>
            </BarChart>
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
              </tr>
            </thead>
            <tbody>
              {data.map(d => (
                <tr key={d.month} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td data-label="Month" style={tdStyle}>{d.month}</td>
                  <td data-label="Revenue" style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#2E7D32' }}>₹{d.totalRevenue.toLocaleString()}</td>
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
