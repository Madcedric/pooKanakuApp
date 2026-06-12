'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCustomerReport, type CustomerRevenue } from '../actions';
import { useLangStore } from '../../../stores/langStore';
import { t } from '../../../lib/i18n';

export default function CustomerReportPage() {
  const [data, setData] = useState<CustomerRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const { lang } = useLangStore();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await getCustomerReport(month);
      setData(result);
      setLoading(false);
    }
    load();
  }, [month]);

  const chartData = data.slice(0, 10).map(d => ({
    name: d.customerName.length > 12 ? d.customerName.slice(0, 12) + '...' : d.customerName,
    revenue: d.totalRevenue,
  }));

  const totalRevenue = data.reduce((sum, d) => sum + d.totalRevenue, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>{t(lang, 'rpt.customer')}</h1>
        </div>
        <div style={{
          backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: '6px', padding: '0.375rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem',
        }}>
          <label style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{t(lang, 'common.monthLabel')}</label>
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            style={{ padding: '0.15rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.7rem' }}
          />
        </div>
      </div>

      {/* Summary */}
      <div style={{
        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '8px', padding: '0.5rem 0.75rem', marginBottom: '0.75rem',
        display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>{t(lang, 'rpt.customersCount')}</div>
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>{data.length}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>{t(lang, 'rpt.revenueLabel')}</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#2E7D32' }}>₹{totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Bar chart - top 10 */}
      <div style={{
        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem',
      }}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{t(lang, 'rpt.top10Customers')}</h2>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t(lang, 'common.loading')}</p>
        ) : chartData.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t(lang, 'rpt.noData')}</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} width={100} />
              <Tooltip
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '0.75rem' }}
              />
              <Bar dataKey="revenue" fill="#7B1FA2" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Customer table */}
      <div style={{
        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '8px', padding: '0.75rem', overflowX: 'auto',
      }}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{t(lang, 'rpt.allCustomers')}</h2>
        {data.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t(lang, 'rpt.noData')}</p>
        ) : (
        <div className="pkk-table-wrap" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>{t(lang, 'common.customer')}</th>
                <th style={thStyle}>{t(lang, 'common.category')}</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>{t(lang, 'rpt.days')}</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>{t(lang, 'rpt.revenueLabel')}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={d.customerId} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td data-label="#" style={{ ...tdStyle, color: 'var(--color-text-muted)' }}>{i + 1}</td>
                  <td data-label="Customer" style={{ ...tdStyle, fontWeight: 500 }}>{d.customerName}</td>
                  <td data-label="Category" style={tdStyle}>
                    <span style={{
                      padding: '0.15rem 0.375rem', borderRadius: '3px', fontSize: '0.6rem',
                      backgroundColor: 'var(--color-muted)', color: 'var(--color-text)',
                    }}>
                      {d.category || '-'}
                    </span>
                  </td>
                  <td data-label="Days" style={{ ...tdStyle, textAlign: 'right' }}>{d.totalSupplyDays}</td>
                  <td data-label="Revenue" style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#2E7D32' }}>₹{d.totalRevenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}

const thStyle = { padding: '0.5rem 0.625rem', color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 500 };
const tdStyle = { padding: '0.5rem 0.625rem', color: 'var(--color-text)', fontSize: '0.75rem' };
