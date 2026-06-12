'use client';

import React, { useState } from 'react';
import { createFlower, updateFlower } from '../../app/flowers/actions';

interface FlowerFormProps {
  flower?: any;
  onClose: () => void;
}

const UNITS = ['muzham', 'kg', 'bunch', 'piece', 'string'];
const STATUSES = ['Active', 'Inactive'];

export default function FlowerForm({ flower, onClose }: FlowerFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    let result;
    if (flower) {
      result = await updateFlower(flower.id, formData);
    } else {
      result = await createFlower(formData);
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
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 1.5rem', color: 'var(--color-text)' }}>
          {flower ? 'Edit Flower' : 'Add New Flower'}
        </h2>

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Flower Name *</label>
            <input name="name" defaultValue={flower?.name} required style={inputStyle} placeholder="e.g. Jasmine" />
          </div>

          <div>
            <label style={labelStyle}>Unit *</label>
            <select name="unit" defaultValue={flower?.unit || UNITS[0]} required style={inputStyle}>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <small style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
              Note: 1 muzham ~ 1 length (cubit). Default rate is typically ₹30.
            </small>
          </div>

          <div>
            <label style={labelStyle}>Default Rate (₹) *</label>
            <input name="default_rate" type="number" step="0.01" defaultValue={flower?.default_rate || 30} required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Status *</label>
            <select name="status" defaultValue={flower?.status || STATUSES[0]} required style={inputStyle}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={btnStyle('var(--color-muted)', 'var(--color-text)')}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={btnStyle('var(--color-primary)', '#fff')}>
              {loading ? 'Saving...' : 'Save Flower'}
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
