import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminVideoEditor.css';

function AdminVideoEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '', youtube_id: '', duration: '' });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      if (isEdit) {
        const { data, error } = await supabase.from('videos').select('*').eq('id', id).single();
        if (error) setError('Could not load video: ' + error.message);
        else if (data) setFormData({ title: data.title || '', youtube_id: data.youtube_id || '', duration: data.duration || '' });
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
      ? supabase.from('videos').update(formData).eq('id', id)
      : supabase.from('videos').insert([formData]);

    const { error } = await op;
    if (error) { setError('Save failed: ' + error.message); setSaving(false); }
    else navigate('/admin/videos');
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/videos" className="back-link">← All Videos</Link>
          <h1>{isEdit ? 'Edit Video' : 'New Video'}</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="admin-editor-form">
        {error && <div className="admin-error">❌ {error}</div>}

        <div className="admin-field">
          <label>Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required disabled={saving} />
        </div>

        <div className="admin-field">
          <label>YouTube Video ID * <small>(the part after watch?v= in the URL)</small></label>
          <input type="text" name="youtube_id" value={formData.youtube_id} onChange={handleChange} placeholder="e.g. dQw4w9WgXcQ" required disabled={saving} />
        </div>

        <div className="admin-field">
          <label>Duration (optional, e.g. "03:45")</label>
          <input type="text" name="duration" value={formData.duration} onChange={handleChange} disabled={saving} />
        </div>

        <div className="admin-editor-actions">
          <Link to="/admin/videos" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Video' : 'Create Video'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminVideoEditor;