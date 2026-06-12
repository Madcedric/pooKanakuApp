'use client';

import React, { useState, useEffect } from 'react';
import { createPayment, getCustomersForDropdown, getOutstandingInvoices } from '../../app/payments/actions';
import { PAYMENT_METHODS } from '../../lib/constants';

interface PaymentFormProps {
  onClose: () => void;
}

export default function PaymentForm({ onClose }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customers, setCustomers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  useEffect(() => {
    async function load() {
      const c = await getCustomersForDropdown();
      setCustomers(c);
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedCustomer) {
      setInvoices([]);
      return;
    }
    async function load() {
      const inv = await getOutstandingInvoices(selectedCustomer);
      setInvoices(inv);
    }
    load();
  }, [selectedCustomer]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createPayment(formData);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '12px',
        padding: '2rem',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 1.5rem', color: 'var(--color-text)' }}>
          Record Payment
        </h2>

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Customer *</label>
            <select
              name="customer_id"
              required
              value={selectedCustomer}
              onChange={e => setSelectedCustomer(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select customer...</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Amount (₹) *</label>
            <input name="amount" type="number" step="0.01" min="0.01" required style={inputStyle} placeholder="0.00" />
          </div>

          <div>
            <label style={labelStyle}>Date *</label>
            <input name="payment_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Payment Method</label>
            <select name="payment_method" style={inputStyle}>
              <option value="">Select method...</option>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {invoices.length > 0 && (
            <div>
              <label style={labelStyle}>Link to Invoice (optional)</label>
              <select name="invoice_id" style={inputStyle}>
                <option value="">No invoice linked</option>
                {invoices.map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {new Date(inv.billing_month).toLocaleDateString('default', { month: 'long', year: 'numeric' })} — ₹{inv.outstanding_amount} outstanding
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label style={labelStyle}>Reference Number</label>
            <input name="reference_number" style={inputStyle} placeholder="Transaction ID, cheque number..." />
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea name="notes" rows={2} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={btnStyle('var(--color-muted)', 'var(--color-text)')}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={btnStyle('var(--color-primary)', '#fff')}>
              {loading ? 'Saving...' : 'Save Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 };
const inputStyle = {
  width: '100%', padding: '0.5rem', borderRadius: '6px',
  border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)',
  color: 'var(--color-text)', boxSizing: 'border-box' as const,
};
const btnStyle = (bg: string, color: string) => ({
  padding: '0.5rem 1rem', borderRadius: '6px', border: 'none',
  backgroundColor: bg, color: color, cursor: 'pointer', fontWeight: 500,
});
