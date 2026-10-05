import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPhotoEditor.css';
import ImageUpload from '../components/ImageUpload';
function AdminPhotoEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '', cover_url: '' });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      if (isEdit) {
        const { data, error } = await supabase.from('photos').select('*').eq('id', id).single();
        if (error) setError('Could not load album: ' + error.message);
        else if (data) setFormData({ title: data.title || '', cover_url: data.cover_url || '' });
        setLoading(false);
      }
    };
    checkAuthAndLoad();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const op = isEdit
      ? supabase.from('photos').update(formData).eq('id', id)
      : supabase.from('photos').insert([formData]);

    const { error } = await op;
    if (error) { setError('Save failed: ' + error.message); setSaving(false); }
    else navigate('/admin/photos');
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/photos" className="back-link">← All Albums</Link>
          <h1>{isEdit ? 'Edit Album' : 'New Album'}</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="admin-editor-form">
        {error && <div className="admin-error">❌ {error}</div>}

        <div className="admin-field">
          <label>Album Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required disabled={saving} />
        </div>

       <ImageUpload
  label="Album Cover"
  value={formData.cover_url}
  onChange={(url) => setFormData({ ...formData, cover_url: url })}
/>

        <div className="admin-editor-actions">
          <Link to="/admin/photos" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Album' : 'Create Album'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminPhotoEditor;