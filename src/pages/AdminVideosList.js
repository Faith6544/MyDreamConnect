import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminVideosList.css';
import AdminYearGroup from '../components/AdminYearGroup';

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

  const renderVideo = (video) => (
    <div key={video.id} className="admin-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', marginBottom: '10px' }}>
      <div>
        <strong style={{ display: 'block', color: '#333', fontSize: '16px' }}>{video.title}</strong>
        <span style={{ fontSize: '12px', color: '#888' }}>
          ID: {video.youtube_id} · {new Date(video.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to={`/admin/videos/edit/${video.id}`} className="btn-edit">Edit</Link>
        <button onClick={() => handleDelete(video.id)} className="btn-delete">Delete</button>
      </div>
    </div>
  );

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
        <AdminYearGroup 
          items={videos} 
          dateField="created_at"
          renderItem={renderVideo} 
        />
      )}
    </div>
  );
}

export default AdminVideosList;