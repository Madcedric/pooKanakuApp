'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOutstandingReport, type OutstandingInvoice } from '../actions';
import { useLangStore } from '../../../stores/langStore';
import { t } from '../../../lib/i18n';

export default function OutstandingReportPage() {
  const [data, setData] = useState<OutstandingInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLangStore();

  useEffect(() => {
    async function load() {
      const result = await getOutstandingReport();
      setData(result);
      setLoading(false);
    }
    load();
  }, []);

  const totalOutstanding = data.reduce((sum, d) => sum + d.outstandingAmount, 0);

  // Aging buckets
  const aging = {
    current: data.filter(d => d.daysOverdue <= 30).reduce((sum, d) => sum + d.outstandingAmount, 0),
    days31to60: data.filter(d => d.daysOverdue > 30 && d.daysOverdue <= 60).reduce((sum, d) => sum + d.outstandingAmount, 0),
    days61to90: data.filter(d => d.daysOverdue > 60 && d.daysOverdue <= 90).reduce((sum, d) => sum + d.outstandingAmount, 0),
    over90: data.filter(d => d.daysOverdue > 90).reduce((sum, d) => sum + d.outstandingAmount, 0),
  };

  return (
    <div>
      <div style={{ marginBottom: '0.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>{t(lang, 'rpt.outstanding')}</h1>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{
          backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: '8px', padding: '0.5rem 0.75rem', flex: 1,
        }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>Total Outstanding</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#E53935' }}>₹{totalOutstanding.toLocaleString()}</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>{data.length} {t(lang, 'rpt.unpaid')}</div>
        </div>
      </div>

      {/* Aging buckets */}
      <div className="grid-4" style={{ marginBottom: '0.75rem' }}>
        {[
          { label: t(lang, 'rpt.current'), amount: aging.current, color: '#2E7D32' },
          { label: t(lang, 'rpt.days31to60'), amount: aging.days31to60, color: '#F57C00' },
          { label: t(lang, 'rpt.days61to90'), amount: aging.days61to90, color: '#E53935' },
          { label: t(lang, 'rpt.over90'), amount: aging.over90, color: '#B71C1C' },
        ].map(b => (
          <div key={b.label} style={{
            backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: '8px', padding: '0.5rem 0.625rem',
          }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>{b.label}</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: b.color, lineHeight: 1.3 }}>₹{b.amount.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Invoice table */}
      <div style={{
        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '8px', padding: '0.75rem', overflowX: 'auto',
      }}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{t(lang, 'rpt.unpaidInvoices')}</h2>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t(lang, 'common.loading')}</p>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🎉</div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t(lang, 'rpt.allPaid')}</p>
          </div>
        ) : (
          <div className="pkk-table-wrap" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={thStyle}>{t(lang, 'common.customer')}</th>
                  <th style={thStyle}>{t(lang, 'common.month')}</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>{t(lang, 'common.total')}</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>{t(lang, 'common.paid')}</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>{t(lang, 'bill.owed')}</th>
                  <th style={thStyle}>{t(lang, 'common.status')}</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>{t(lang, 'rpt.days')}</th>
                  <th style={thStyle}>{t(lang, 'common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {data.map(d => {
                  const daysColor = d.daysOverdue > 90 ? '#B71C1C' : d.daysOverdue > 60 ? '#E53935' : d.daysOverdue > 30 ? '#F57C00' : '#2E7D32';
                  return (
                    <tr key={d.invoiceId} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td data-label="Customer" style={{ ...tdStyle, fontWeight: 500 }}>{d.customerName}</td>
                      <td data-label="Month" style={tdStyle}>{d.billingMonth}</td>
                      <td data-label="Total" style={{ ...tdStyle, textAlign: 'right' }}>₹{d.totalAmount.toLocaleString()}</td>
                      <td data-label="Paid" style={{ ...tdStyle, textAlign: 'right', color: '#2E7D32' }}>₹{d.paidAmount.toLocaleString()}</td>
                      <td data-label="Owed" style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#E53935' }}>₹{d.outstandingAmount.toLocaleString()}</td>
                      <td data-label="Status" style={tdStyle}>
                        <span style={{
                          padding: '0.15rem 0.375rem', borderRadius: '3px', fontSize: '0.6rem',
                          backgroundColor: d.status === 'Partially Paid' ? '#fef3c7' : '#fee2e2',
                          color: d.status === 'Partially Paid' ? '#92400e' : '#991b1b',
                        }}>
                          {d.status}
                        </span>
                      </td>
                      <td data-label="Days" style={{ ...tdStyle, textAlign: 'right', color: daysColor, fontWeight: 500 }}>
                        {d.daysOverdue}d
                      </td>
                      <td data-label="" className="pkk-mobile-actions" style={tdStyle}>
                        <Link href={`/billing/${d.invoiceId}`} style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.75rem' }}>
                          {t(lang, 'common.view')}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
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
