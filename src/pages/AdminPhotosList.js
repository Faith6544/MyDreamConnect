import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPhotosList.css';

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
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {photos.map(photo => (
              <tr key={photo.id}>
                <td>{photo.title}</td>
                <td>
                  {new Date(photo.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </td>
                <td className="admin-actions">
                  <Link to={`/admin/photos/${photo.id}/images`} className="btn-edit" style={{ background: '#f1f1f1', color: '#333' }}>Manage Images</Link>
                  <Link to={`/admin/photos/edit/${photo.id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(photo.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPhotosList;