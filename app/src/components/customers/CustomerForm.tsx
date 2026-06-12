'use client';

import React, { useState } from 'react';
import { createCustomer, updateCustomer } from '../../app/customers/actions';

interface CustomerFormProps {
  customer?: any; // If provided, we are editing
  onClose: () => void;
}

const CATEGORIES = ['Hotel', 'Household', 'Temple', 'Shop', 'Function Hall'];

export default function CustomerForm({ customer, onClose }: CustomerFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    let result;
    if (customer) {
      result = await updateCustomer(customer.id, formData);
    } else {
      result = await createCustomer(formData);
    }

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
        overflowY: 'auto'
      }}>
        <h2 style={{ margin: '0 0 1.5rem', color: 'var(--color-text)' }}>
          {customer ? 'Edit Customer' : 'Add New Customer'}
        </h2>

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Name *</label>
            <input name="name" defaultValue={customer?.name} required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Phone Number</label>
            <input name="phone_number" defaultValue={customer?.phone_number} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Address</label>
            <textarea name="address" defaultValue={customer?.address} rows={2} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Category *</label>
            <select name="category" defaultValue={customer?.category || CATEGORIES[0]} required style={inputStyle}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Daily Requirement</label>
            <input name="daily_requirement" defaultValue={customer?.daily_requirement} placeholder="e.g. 2kg Jasmine" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Flower Preferences</label>
            <input name="flower_preferences" defaultValue={customer?.flower_preferences} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea name="notes" defaultValue={customer?.notes} rows={2} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={btnStyle('var(--color-muted)', 'var(--color-text)')}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={btnStyle('var(--color-primary)', '#fff')}>
              {loading ? 'Saving...' : 'Save Customer'}
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
  color: 'var(--color-text)'
};
const btnStyle = (bg: string, color: string) => ({
  padding: '0.5rem 1rem', borderRadius: '6px', border: 'none',
  backgroundColor: bg, color: color, cursor: 'pointer', fontWeight: 500
});
