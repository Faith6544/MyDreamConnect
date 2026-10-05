import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPhotosList.css';

function AdminPhotosList() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setPhotos(data || []);
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this album?')) return;
    const { error } = await supabase.from('photos').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setPhotos(photos.filter(p => p.id !== id));
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
            <tr><th>Title</th><th>Created</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {photos.map(p => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td className="admin-actions">
                    <Link to={`/admin/photos/${p.id}/images`} className="btn-edit">Photos</Link>
                  <Link to={`/admin/photos/edit/${p.id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(p.id)} className="btn-delete">Delete</button>
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