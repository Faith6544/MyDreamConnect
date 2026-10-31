import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminSubscribers.css';

function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/admin'); return; }

    const { data } = await supabase
      .from('subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    setSubscribers(data || []);
    setLoading(false);
  };

  // Runs once per navigation target; loadData is recreated on every render on purpose.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return;
    const { error } = await supabase.from('subscribers').delete().eq('id', id);
    if (error) {
      alert('Delete failed: ' + error.message);
    } else {
      setSubscribers(subscribers.filter(s => s.id !== id));
    }
  };

  const exportCSV = () => {
    const rows = [['Name', 'Email', 'Subscribed']];
    subscribers.forEach(s => {
      rows.push([
        s.name || '',
        s.email || '',
        new Date(s.subscribed_at).toLocaleDateString(),
      ]);
    });
    const csv = rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter(s => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (s.email || '').toLowerCase().includes(q) ||
           (s.name || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Newsletter Subscribers</h1>
        </div>
        {subscribers.length > 0 && (
          <button onClick={exportCSV} className="btn-new" style={{ border: 'none', cursor: 'pointer' }}>
            ⬇ Export CSV
          </button>
        )}
      </header>

      <div className="users-filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="users-search"
        />
      </div>

      <div className="users-summary">
        <strong>{filtered.length}</strong> subscriber{filtered.length !== 1 ? 's' : ''} shown ·
        <strong> {subscribers.length}</strong> total
      </div>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="admin-list-empty">No subscribers yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subscribed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>{s.name || '—'}</td>
                <td>{s.email}</td>
                <td>
                  {new Date(s.subscribed_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </td>
                <td className="admin-actions">
                  <button onClick={() => handleDelete(s.id)} className="btn-delete">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminSubscribers;