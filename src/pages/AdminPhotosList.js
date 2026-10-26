import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPhotosList.css';
import AdminYearGroup from '../components/AdminYearGroup';

function AdminPhotosList() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      const { data } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      setPhotos(data || []);
      setLoading(false);
    };
    load();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this album? All photos inside will be removed.')) return;
    const { error } = await supabase.from('photos').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const renderPhoto = (photo) => (
    <div key={photo.id} className="admin-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', marginBottom: '10px' }}>
      <div>
        <strong style={{ display: 'block', color: '#333', fontSize: '16px' }}>{photo.title}</strong>
        <span style={{ fontSize: '12px', color: '#888' }}>
          {new Date(photo.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to={`/admin/photos/${photo.id}/images`} className="btn-edit">Manage Images</Link>
        <Link to={`/admin/photos/edit/${photo.id}`} className="btn-edit">Edit</Link>
        <button onClick={() => handleDelete(photo.id)} className="btn-delete">Delete</button>
      </div>
    </div>
  );

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Photo Albums</h1>
        </div>
        <Link to="/admin/photos/new" className="btn-new">+ New Album</Link>
      </header>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : photos.length === 0 ? (
        <p className="admin-list-empty">No albums yet.</p>
      ) : (
        <AdminYearGroup 
          items={photos} 
          dateField="created_at"
          renderItem={renderPhoto} 
        />
      )}
    </div>
  );
}

export default AdminPhotosList;