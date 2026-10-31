import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPostCategoriesList.css';
import { useSortableList } from '../hooks/useSortableList';
function AdminPostCategoriesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }
      const { data, error } = await supabase
        .from('post_categories')
        .select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Failed to load categories:', error);
      } else {
        // `post_categories.order_index` is TEXT, so ordering in the database is
        // lexicographic ("10" before "2"). Sort numerically on the client.
        const sorted = [...(data || [])].sort(
          (a, b) => (Number(a.order_index) || 0) - (Number(b.order_index) || 0)
        );
        setItems(sorted);
      }
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Posts in it will become uncategorized.')) return;

    // posts.category_id has a real FK, so clear it before deleting.
    const { error: clearError } = await supabase
      .from('posts')
      .update({ category_id: null })
      .eq('category_id', id);

    if (clearError) {
      alert('Could not uncategorize posts: ' + clearError.message);
      return;
    }

    const { error } = await supabase.from('post_categories').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setItems((prev) => prev.filter(i => i.id !== id));
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Blog Categories</h1>
        </div>
        <Link to="/admin/post-categories/new" className="btn-new">+ New Category</Link>
      </header>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : items.length === 0 ? (
        <p className="admin-list-empty">No categories yet.</p>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Slug</th><th>Order</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td><code>{c.slug}</code></td>
                <td>{c.order_index}</td>
                <td className="admin-actions">
                  <Link to={`/admin/post-categories/edit/${c.id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(c.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPostCategoriesList;