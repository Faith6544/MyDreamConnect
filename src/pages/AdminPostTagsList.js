import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPostTagsList.css';

function AdminPostTagsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }
      const { data } = await supabase.from('post_tags').select('*').order('name', { ascending: true });
      setItems(data || []);
      setLoading(false);
    };
    load();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tag? It will be removed from all posts.')) return;
    await supabase.from('post_tag_links').delete().eq('tag_id', id);
    const { error } = await supabase.from('post_tags').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Blog Tags</h1>
        </div>
        <Link to="/admin/post-tags/new" className="btn-new">+ New Tag</Link>
      </header>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : items.length === 0 ? (
        <p className="admin-list-empty">No tags yet.</p>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td><code>{t.slug}</code></td>
                <td className="admin-actions">
                  <Link to={`/admin/post-tags/edit/${t.id}`} className="btn-edit">Edit</Link>
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

export default AdminPostTagsList;