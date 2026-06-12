import React from 'react';
import { getCalendarEntries, upsertCalendarEntry } from '../actions';
import { getCustomers } from '../../customers/actions';

type Params = { params: Promise<{ customerId: string }> };

function monthDays(year: number, month: number) {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

const STATUS_COLORS: Record<string, string> = {
  Delivered: '#16a34a',
  'Half Supply': '#f59e0b',
  'No Supply': '#ef4444',
  Holiday: '#6b7280',
};

export default async function CustomerCalendar({ params }: Params) {
  const { customerId } = await params;
  const customers = await getCustomers();
  const customer = customers.find((c: any) => c.id === customerId);
  if (!customer) return <div style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Customer not found</div>;

  const entries = await getCalendarEntries(customerId);
  const map = new Map(entries.map((e: any) => [e.entry_date, e]));

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const days = monthDays(year, month);

  return (
    <div>
      <div style={{ marginBottom: '0.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
          Calendar — {customer.name}
        </h1>
        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
          {today.toLocaleString('default', { month: 'long' })} {year}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {days.map(d => {
          const dayStr = d.toISOString().slice(0, 10);
          const entry = map.get(dayStr);
          const status = entry?.status || 'Delivered';
          const isToday = dayStr === today.toISOString().slice(0, 10);
          const statusColor = STATUS_COLORS[status] || '#6b7280';

          return (
            <div key={dayStr} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.5rem 0.625rem', borderRadius: '8px',
              border: `1px solid ${isToday ? 'var(--color-primary)' : 'var(--color-border)'}`,
              backgroundColor: isToday ? 'var(--color-primary)08' : 'var(--color-surface)',
              gap: '0.5rem', flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: statusColor, flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text)' }}>
                    {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>
                    {status}{entry?.notes ? ` — ${entry.notes}` : ''}
                  </div>
                </div>
              </div>

              <form action={async (formData: FormData) => {
                'use server';
                const s = formData.get('status') as string;
                const notes = formData.get('notes') as string;
                await upsertCalendarEntry(customerId, dayStr, s, notes);
              }} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                <input type="hidden" name="_date" value={dayStr} />
                <select
                  name="status"
                  defaultValue={status}
                  style={{
                    padding: '0.25rem 0.375rem', borderRadius: '4px',
                    border: '1px solid var(--color-border)', fontSize: '0.7rem',
                    backgroundColor: 'var(--color-background)', color: 'var(--color-text)',
                  }}
                >
                  <option>Delivered</option>
                  <option>Half Supply</option>
                  <option>No Supply</option>
                  <option>Holiday</option>
                </select>
                <input
                  name="notes"
                  placeholder="Notes"
                  style={{
                    padding: '0.25rem 0.375rem', borderRadius: '4px',
                    border: '1px solid var(--color-border)', fontSize: '0.7rem',
                    backgroundColor: 'var(--color-background)', color: 'var(--color-text)',
                    width: '80px',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px', border: 'none',
                    backgroundColor: 'var(--color-primary)', color: '#fff',
                    fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Save
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
