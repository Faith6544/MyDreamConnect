import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPostsList.css';
import { useSortableList } from '../hooks/useSortableList';

function AdminPostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    // Note: We use display_order here. If you haven't run the SQL to add 'display_order' to the 'posts' table, 
    // go to Supabase SQL Editor and run: ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS display_order INTEGER;
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) console.error(error);
    else setPosts(data || []);
    setLoading(false);
  };

  // CONNECT THE HOOK HERE
  const { moveUp, moveDown } = useSortableList('posts', posts, setPosts);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else fetchPosts();
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
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Order</th>
              <th>Title</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post.id}>
                
                {/* UP/DOWN BUTTONS */}
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button 
                      onClick={() => moveUp(index)} 
                      disabled={index === 0}
                      style={{ padding: '5px 10px', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => moveDown(index)} 
                      disabled={index === posts.length - 1}
                      style={{ padding: '5px 10px', cursor: index === posts.length - 1 ? 'not-allowed' : 'pointer', opacity: index === posts.length - 1 ? 0.3 : 1 }}
                    >
                      ↓
                    </button>
                  </div>
                </td>

                <td>{post.title}</td>
                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                
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