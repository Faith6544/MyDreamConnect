import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminFlyerEditor.css';
import ImageUpload from '../components/ImageUpload';
function AdminFlyerEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '', category: '', description: '', image_url: '', pdf_url: '',
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }
      if (isEdit) {
        const { data, error } = await supabase.from('flyers').select('*').eq('id', id).single();
        if (error) setError('Load failed: ' + error.message);
        else if (data) setFormData({
          title: data.title || '',
          category: data.category || '',
          description: data.description || '',
          image_url: data.image_url || '',
          pdf_url: data.pdf_url || '',
        });
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
      ? supabase.from('flyers').update(formData).eq('id', id)
      : supabase.from('flyers').insert([formData]);
    const { error } = await op;
    if (error) { setError('Save failed: ' + error.message); setSaving(false); }
    else navigate('/admin/flyers');
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/flyers" className="back-link">← All Flyers</Link>
          <h1>{isEdit ? 'Edit Flyer' : 'New Flyer'}</h1>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="admin-editor-form">
        {error && <div className="admin-error">❌ {error}</div>}
        <div className="admin-field">
          <label>Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required disabled={saving} />
        </div>
        <div className="admin-field">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange} disabled={saving}>
            <option value="">— Choose —</option>
            <option value="Programs">Programs</option>
            <option value="Courses">Courses</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Donation">Donation</option>
            <option value="General">General</option>
          </select>
        </div>
        <div className="admin-field">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" disabled={saving} />
        </div>
        <ImageUpload
  label="Flyer Image"
  value={formData.image_url}
  onChange={(url) => setFormData({ ...formData, image_url: url })}
/>
        <div className="admin-field">
          <label>PDF URL</label>
          <input type="text" name="pdf_url" value={formData.pdf_url} onChange={handleChange} placeholder="https://..." disabled={saving} />
        </div>
        <div className="admin-editor-actions">
          <Link to="/admin/flyers" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Flyer' : 'Create Flyer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminFlyerEditor;