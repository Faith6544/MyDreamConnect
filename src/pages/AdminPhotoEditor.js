import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPhotoEditor.css';
import ImageUpload from '../components/ImageUpload';

function AdminPhotoEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  // Added event_year to the initial state
  const [formData, setFormData] = useState({ title: '', cover_url: '', event_year: '' });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      if (isEdit) {
        const { data, error } = await supabase.from('photos').select('*').eq('id', id).single();
        if (error) {
          setError('Could not load album: ' + error.message);
        } else if (data) {
          // Added event_year to the load logic
          setFormData({ 
            title: data.title || '', 
            cover_url: data.cover_url || '',
            event_year: data.event_year || '' 
          });
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    checkAuthAndLoad();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Convert event_year to a number before saving (or null if empty)
    const payload = {
      ...formData,
      event_year: formData.event_year ? Number(formData.event_year) : null,
    };

    const op = isEdit
      ? supabase.from('photos').update(payload).eq('id', id)
      : supabase.from('photos').insert([payload]);

    const { error } = await op;
    if (error) { 
      setError('Save failed: ' + error.message); 
      setSaving(false); 
    } else {
      navigate('/admin/photos');
    }
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
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            disabled={saving} 
          />
        </div>

        {/* NEW FIELD ADDED HERE */}
        <div className="admin-field">
          <label>Event Year (e.g., 2023)</label>
          <input 
            type="number" 
            name="event_year" 
            value={formData.event_year} 
            onChange={handleChange} 
            placeholder="Enter year (e.g., 2024)" 
            disabled={saving} 
          />
        </div>

        <ImageUpload
          label="Album Cover"
          value={formData.cover_url}
          onChange={(url) => setFormData((prev) => ({ ...prev, cover_url: url }))}
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