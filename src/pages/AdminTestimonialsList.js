import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminTestimonialsList.css';

function AdminTestimonialsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate('/admin'); return; }

        const { data, error: loadError } = await supabase
          .from('testimonials')
          .select('*')
          .order('order_index', { ascending: true });

        if (loadError) setError('Load failed: ' + loadError.message);
        else setItems(data || []);
      } catch (err) {
        setError('Load failed: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    checkAuthAndLoad();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setItems((prev) => prev.filter(i => i.id !== id));
  };

  const preview = (quote) => {
    const text = (quote || '').trim();
    if (!text) return '—';
    return text.length > 80 ? `${text.substring(0, 80)}…` : text;
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Testimonials</h1>
        </div>
        <Link to="/admin/testimonials/new" className="btn-new">+ New Testimonial</Link>
      </header>

      {error && <div className="admin-error">❌ {error}</div>}

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : items.length === 0 ? (
        <p className="admin-list-empty">No testimonials yet.</p>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Quote preview</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {preview(t.quote)}
                </td>
                <td className="admin-actions">
                  <Link to={`/admin/testimonials/edit/${t.id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(t.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminTestimonialsList;