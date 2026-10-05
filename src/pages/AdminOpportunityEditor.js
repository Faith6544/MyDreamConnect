import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminOpportunityEditor.css';
import ImageUpload from '../components/ImageUpload';
function AdminOpportunityEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '', image_url: '', excerpt: '', url: '' });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }
      if (isEdit) {
        const { data, error } = await supabase.from('opportunities').select('*').eq('id', id).single();
        if (error) setError('Load failed: ' + error.message);
        else if (data) setFormData({
          title: data.title || '',
          image_url: data.image_url || '',
          excerpt: data.excerpt || '',
          url: data.url || '',
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
      ? supabase.from('opportunities').update(formData).eq('id', id)
      : supabase.from('opportunities').insert([formData]);
    const { error } = await op;
    if (error) { setError('Save failed: ' + error.message); setSaving(false); }
    else navigate('/admin/opportunities');
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/opportunities" className="back-link">← All Opportunities</Link>
          <h1>{isEdit ? 'Edit Opportunity' : 'New Opportunity'}</h1>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="admin-editor-form">
        {error && <div className="admin-error">❌ {error}</div>}
        <div className="admin-field">
          <label>Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required disabled={saving} />
        </div>
        <ImageUpload
  label="Opportunity Image"
  value={formData.image_url}
  onChange={(url) => setFormData({ ...formData, image_url: url })}
/>
        <div className="admin-field">
          <label>Excerpt</label>
          <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows="4" disabled={saving} />
        </div>
        <div className="admin-field">
          <label>External URL (where "Read More" goes)</label>
          <input type="text" name="url" value={formData.url} onChange={handleChange} placeholder="https://..." disabled={saving} />
        </div>
        <div className="admin-editor-actions">
          <Link to="/admin/opportunities" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminOpportunityEditor;