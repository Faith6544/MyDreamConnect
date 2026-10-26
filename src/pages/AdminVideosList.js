import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminVideosList.css';

function AdminVideosList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setVideos(data || []);
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setVideos(videos.filter(v => v.id !== id));
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Videos</h1>
        </div>
        <Link to="/admin/videos/new" className="btn-new">+ New Video</Link>
      </header>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : videos.length === 0 ? (
        <p className="admin-list-empty">No videos yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>YouTube ID</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {videos.map(v => (
              <tr key={v.id}>
                <td>{v.title}</td>
                <td><code>{v.youtube_id}</code></td>
                <td className="admin-actions">
                  <Link to={`/admin/videos/edit/${v.id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(v.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminVideosList;