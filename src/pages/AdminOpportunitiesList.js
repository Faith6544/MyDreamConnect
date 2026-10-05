import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminOpportunitiesList.css';

function AdminOpportunitiesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }
      const { data, error } = await supabase.from('opportunities').select('*').order('created_at', { ascending: false });
      if (!error) setItems(data || []);
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this opportunity?')) return;
    const { error } = await supabase.from('opportunities').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setItems(items.filter(o => o.id !== id));
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Opportunities</h1>
        </div>
        <Link to="/admin/opportunities/new" className="btn-new">+ New Opportunity</Link>
      </header>
      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : items.length === 0 ? (
        <p className="admin-list-empty">No opportunities yet.</p>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(o => (
              <tr key={o.id}>
                <td>{o.title}</td>
                <td className="admin-actions">
                  <Link to={`/admin/opportunities/edit/${o.id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(o.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminOpportunitiesList;