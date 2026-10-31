import React from 'react';

// admin form piece: add as many links as needed, each with a name and an address
export default function LinksEditor({ value = [], onChange, disabled, title = 'Links' }) {
  const rows = Array.isArray(value) ? value : [];

  const update = (index, field, text) => {
    const next = rows.map((row, i) => (i === index ? { ...row, [field]: text } : row));
    onChange(next);
  };
  const add = () => onChange([...rows, { label: '', url: '' }]);
  const remove = (index) => onChange(rows.filter((_, i) => i !== index));

  return (
    <div className="admin-field" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
      <label style={{ fontSize: '16px', marginBottom: '12px', display: 'block', color: '#0a4711' }}>{title}</label>

      {rows.length === 0 && <p style={{ color: '#888', margin: '0 0 12px' }}>No links yet.</p>}

      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Name, e.g. Behance"
            value={row.label || ''}
            onChange={(e) => update(i, 'label', e.target.value)}
            disabled={disabled}
            style={{ flex: '1 1 160px' }}
          />
          <input
            type="text"
            placeholder="Address, e.g. behance.net/yourname"
            value={row.url || ''}
            onChange={(e) => update(i, 'url', e.target.value)}
            disabled={disabled}
            style={{ flex: '2 1 260px' }}
          />
          <button type="button" onClick={() => remove(i)} disabled={disabled} style={{ padding: '0 14px', cursor: 'pointer' }} aria-label="Remove link">✕</button>
        </div>
      ))}

      <button type="button" onClick={add} disabled={disabled} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        + Add a link
      </button>
    </div>
  );
}
