import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPostTagsList.css';

function AdminPostTagsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate('/admin'); return; }

        const { data, error: loadError } = await supabase
          .from('post_tags')
          .select('*')
          .order('name', { ascending: true });

        if (loadError) setError('Load failed: ' + loadError.message);
        else setItems(data || []);
      } catch (err) {
        setError('Load failed: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tag? It will be removed from all posts.')) return;

    // post_tag_links has no FK to post_tags, so clear the links first.
    const { error: linkError } = await supabase
      .from('post_tag_links')
      .delete()
      .eq('tag_id', id);

    if (linkError) {
      alert('Could not remove this tag from posts: ' + linkError.message);
      return;
    }

    const { error } = await supabase.from('post_tags').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setItems((prev) => prev.filter(i => i.id !== id));
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

      {error && <div className="admin-error">❌ {error}</div>}

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