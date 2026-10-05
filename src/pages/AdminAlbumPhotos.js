import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminAlbumPhotos.css';
import ImageUpload from '../components/ImageUpload';
function AdminAlbumPhotos() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState({ image_url: '', caption: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/admin'); return; }

    const { data: albumData } = await supabase.from('photos').select('*').eq('id', albumId).single();
    setAlbum(albumData);

    const { data, error } = await supabase
      .from('album_photos')
      .select('*')
      .eq('album_id', albumId)
      .order('order_index', { ascending: true });

    if (!error) setPhotos(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [albumId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newPhoto.image_url.trim()) {
  setError('Please upload an image first.');
  return;
}

    const nextIndex = photos.length > 0 ? Math.max(...photos.map(p => p.order_index || 0)) + 1 : 1;

    const { error } = await supabase.from('album_photos').insert([{
      album_id: Number(albumId),
      image_url: newPhoto.image_url,
      caption: newPhoto.caption,
      order_index: nextIndex,
    }]);

    if (error) {
      setError('Add failed: ' + error.message);
    } else {
      setNewPhoto({ image_url: '', caption: '' });
      await load();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    const { error } = await supabase.from('album_photos').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setPhotos(photos.filter(p => p.id !== id));
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/photos" className="back-link">← All Albums</Link>
          <h1>Photos — {album?.title}</h1>
        </div>
      </header>

      <div className="admin-editor-form">
        <h3 style={{ marginTop: 0 }}>Add a photo</h3>
        {error && <div className="admin-error">❌ {error}</div>}

        <form onSubmit={handleAdd}>
          <ImageUpload
  label="Photo *"
  value={newPhoto.image_url}
  onChange={(url) => setNewPhoto({ ...newPhoto, image_url: url })}
/>
          <div className="admin-field">
            <label>Caption (optional)</label>
            <input
              type="text"
              value={newPhoto.caption}
              onChange={e => setNewPhoto({ ...newPhoto, caption: e.target.value })}
              disabled={saving}
            />
          </div>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Adding...' : '+ Add Photo'}
          </button>
        </form>
      </div>

      <div className="admin-editor-form" style={{ marginTop: 25 }}>
        <h3 style={{ marginTop: 0 }}>Photos in this album ({photos.length})</h3>

        {photos.length === 0 ? (
          <p style={{ color: '#888', fontSize: 14 }}>No photos yet.</p>
        ) : (
          <div className="album-admin-grid">
            {photos.map(p => (
              <div key={p.id} className="album-admin-item">
                <img src={p.image_url} alt={p.caption || ''} />
                <div className="album-admin-meta">
                  <span>{p.caption || '—'}</span>
                  <button onClick={() => handleDelete(p.id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAlbumPhotos;