'use client';

import React, { useState } from 'react';
import { createExpense, EXPENSE_CATEGORIES } from '../../app/expenses/actions';

interface ExpenseFormProps {
  onClose: () => void;
}

export default function ExpenseForm({ onClose }: ExpenseFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createExpense(formData);

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
        maxWidth: '450px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 1.5rem', color: 'var(--color-text)' }}>
          Record Expense
        </h2>

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Category *</label>
            <select name="category" required style={inputStyle}>
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Amount (₹) *</label>
            <input name="amount" type="number" step="0.01" min="0.01" required style={inputStyle} placeholder="0.00" />
          </div>

          <div>
            <label style={labelStyle}>Date *</label>
            <input name="expense_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea name="description" rows={3} style={inputStyle} placeholder="What was this expense for?" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={btnStyle('var(--color-muted)', 'var(--color-text)')}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={btnStyle('var(--color-primary)', '#fff')}>
              {loading ? 'Saving...' : 'Save Expense'}
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
