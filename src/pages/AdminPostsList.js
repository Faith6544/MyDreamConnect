import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPostsList.css';
import AdminYearGroup from '../components/AdminYearGroup';
import { useSortableList } from '../hooks/useSortableList';
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

    await supabase.from('post_tag_links').delete().eq('post_id', id);

    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      alert('Delete failed: ' + error.message);
    } else {
      setPosts((prev) => prev.filter(p => p.id !== id));
    }
  };

  const renderPost = (post) => (
    <div key={post.id} className="admin-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', marginBottom: '10px' }}>
      <div>
        <strong style={{ display: 'block', color: '#333', fontSize: '16px' }}>{post.title || 'Untitled'}</strong>
        <span style={{ fontSize: '12px', color: '#888' }}>
          {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to={`/admin/posts/edit/${post.id}`} className="btn-edit">Edit</Link>
        <button onClick={() => handleDelete(post.id)} className="btn-delete">Delete</button>
      </div>
    </div>
  );

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
        <AdminYearGroup 
          items={posts} 
          dateField="created_at"
          renderItem={renderPost} 
        />
      )}
    </div>
  );
}

export default AdminPostsList;