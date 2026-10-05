import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminFlyersList.css';

function AdminFlyersList() {
  const [flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }
      const { data, error } = await supabase.from('flyers').select('*').order('created_at', { ascending: false });
      if (!error) setFlyers(data || []);
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flyer?')) return;
    const { error } = await supabase.from('flyers').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setFlyers(flyers.filter(f => f.id !== id));
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Flyers</h1>
        </div>
        <Link to="/admin/flyers/new" className="btn-new">+ New Flyer</Link>
      </header>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : flyers.length === 0 ? (
        <p className="admin-list-empty">No flyers yet.</p>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>Actions</th></tr></thead>
          <tbody>
            {flyers.map(f => (
              <tr key={f.id}>
                <td>{f.title}</td>
                <td>{f.category || '—'}</td>
                <td className="admin-actions">
                  <Link to={`/admin/flyers/edit/${f.id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(f.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminFlyersList;