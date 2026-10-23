import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminAlbumPhotos.css';
import ImageUpload from '../components/ImageUpload';

// `album_photos.image_url` is a bigint in the live schema (see
// supabase/migrations/20261023000000_fix_album_photos_image_url.sql).
// Until that migration is applied, any value that is not a string must not be
// rendered as an <img src>, or the browser requests the number as a URL.
function safeImageSrc(value) {
  return typeof value === 'string' && value.trim() ? value : '';
}

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

    const { data: albumData, error: albumError } = await supabase
      .from('photos')
      .select('*')
      .eq('id', albumId)
      .single();

    if (albumError) {
      setError('Load failed: ' + albumError.message);
    } else {
      setAlbum(albumData);
    }

    const { data, error: photosError } = await supabase
      .from('album_photos')
      .select('*')
      .eq('album_id', albumId)
      .order('order_index', { ascending: true });

    if (photosError) setError('Load failed: ' + photosError.message);
    else setPhotos(data || []);

    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [albumId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPhoto.image_url.trim()) {
      setError('Please upload an image first.');
      return;
    }

    setSaving(true);

    try {
      const nextIndex = photos.length > 0
        ? Math.max(...photos.map(p => Number(p.order_index) || 0)) + 1
        : 1;

      const { error: insertError } = await supabase.from('album_photos').insert([{
        album_id: Number(albumId),
        image_url: newPhoto.image_url,
        caption: newPhoto.caption,
        order_index: nextIndex,
      }]);

      if (insertError) {
        // 22P02 = the column is still bigint upstream.
        if (insertError.code === '22P02') {
          setError(
            'The database column album_photos.image_url is still a number, not text. ' +
            'Apply supabase/migrations/20261023000000_fix_album_photos_image_url.sql first.'
          );
        } else if (insertError.code === '42501') {
          setError('You do not have permission to add photos to this album (RLS/GRANT).');
        } else {
          setError('Add failed: ' + insertError.message);
        }
        return;
      }

      setNewPhoto({ image_url: '', caption: '' });
      await load();
    } catch (err) {
      setError('Add failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;

    const { error: deleteError } = await supabase
      .from('album_photos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      alert('Delete failed: ' + deleteError.message);
    } else {
      setPhotos((prev) => prev.filter(p => p.id !== id));
    }
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/photos" className="back-link">← All Albums</Link>
          <h1>Photos — {album?.title || 'Album'}</h1>
        </div>
      </header>

      <div className="admin-editor-form">
        <h3 style={{ marginTop: 0 }}>Add a photo</h3>
        {error && <div className="admin-error">❌ {error}</div>}

        <form onSubmit={handleAdd}>
          <ImageUpload
            label="Photo *"
            value={newPhoto.image_url}
            onChange={(url) => setNewPhoto((prev) => ({ ...prev, image_url: url }))}
          />
          <div className="admin-field">
            <label>Caption (optional)</label>
            <input
              type="text"
              value={newPhoto.caption}
              onChange={e => setNewPhoto((prev) => ({ ...prev, caption: e.target.value }))}
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
            {photos.map(p => {
              const src = safeImageSrc(p.image_url);
              return (
                <div key={p.id} className="album-admin-item">
                  {src ? (
                    <img src={src} alt={p.caption || ''} />
                  ) : (
                    <div style={{ padding: 20, background: '#f4f4f4', textAlign: 'center', fontSize: 12, color: '#888' }}>
                      Invalid image value
                    </div>
                  )}
                  <div className="album-admin-meta">
                    <span>{p.caption || '—'}</span>
                    <button onClick={() => handleDelete(p.id)} className="btn-delete">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAlbumPhotos;
