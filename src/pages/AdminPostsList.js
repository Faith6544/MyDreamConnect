import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPostsList.css';

function AdminPostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin');
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setPosts(data || []);
      setLoading(false);
    };

    checkAuthAndLoad();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;

    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      alert('Delete failed: ' + error.message);
    } else {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Blog Posts</h1>
        </div>
        <Link to="/admin/posts/new" className="btn-new">+ New Post</Link>
      </header>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="admin-list-empty">No posts yet. Click "+ New Post" to create one.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>{post.title || 'Untitled'}</td>
                <td>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </td>
                <td className="admin-actions">
                  <Link to={`/admin/posts/edit/${post.id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(post.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPostsList;