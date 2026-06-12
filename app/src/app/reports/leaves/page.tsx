"use client"
import React, { useCallback, useEffect, useState } from "react"
import { useLangStore } from '../../../stores/langStore';
import { t } from '../../../lib/i18n';

type Report = {
  month: string
  total: number
  breakdown: Record<string, number>
  rows: any[]
}

export default function LeavesReportPage() {
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  })
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(false)
  const { lang } = useLangStore();

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await fetch(`/api/shop_leaves/report?month=${month}`)
      let json: any = null
      const txt = await resp.text()
      try {
        json = txt ? JSON.parse(txt) : null
      } catch {
        throw new Error(txt || "Failed to parse report response")
      }
      if (!resp.ok) throw new Error(json?.error || `Failed to load report (${resp.status})`)
      setReport(json)
    } catch {
      setReport(null)
    } finally {
      setLoading(false)
    }
  }, [month])

  useEffect(() => {
    load()
  }, [month, load])

  return (
    <div>
      <div style={{ marginBottom: '0.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>{t(lang, 'rpt.monthlyLeaveReport')}</h1>
      </div>

      <div style={{
        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '8px', padding: '0.625rem 0.75rem', marginBottom: '0.75rem',
      }}>
        <label style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{t(lang, 'common.monthLabel')}</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{
            display: 'block', width: '100%', marginTop: '0.25rem',
            padding: '0.375rem 0.5rem', borderRadius: '6px',
            border: '1px solid var(--color-border)', fontSize: '0.8rem',
            backgroundColor: 'var(--color-background)', color: 'var(--color-text)',
          }}
        />
      </div>

      <div style={{
        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '8px', padding: '0.75rem',
      }}>
        {loading && <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t(lang, 'common.loading')}</p>}
        {report && (
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Total Leaves: <span style={{ color: 'var(--color-primary)' }}>{report.total}</span>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-text-muted)' }}>{t(lang, 'rpt.breakdown')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {Object.entries(report.breakdown).map(([k, v]) => (
                  <span key={k} style={{
                    padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem',
                    backgroundColor: 'var(--color-muted)', color: 'var(--color-text)',
                  }}>
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>

            <div className="pkk-table-wrap" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                    <th style={thStyle}>{t(lang, 'common.date')}</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Reason</th>
                    <th style={thStyle}>{t(lang, 'cal.notes')}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.map((r: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td data-label="Date" style={tdStyle}>{r.leave_date}</td>
                      <td data-label="Type" style={tdStyle}>{r.leave_type}</td>
                      <td data-label="Reason" style={tdStyle}>{r.reason}</td>
                      <td data-label="Notes" style={tdStyle}>{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!loading && !report && (
          <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t(lang, 'rpt.noData')}</p>
        )}
      </div>
    </div>
  )
}

const thStyle = { padding: '0.5rem 0.625rem', color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 500 };
const tdStyle = { padding: '0.5rem 0.625rem', color: 'var(--color-text)', fontSize: '0.75rem' };
