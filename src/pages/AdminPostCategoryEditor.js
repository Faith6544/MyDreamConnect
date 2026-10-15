import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPostCategoryEditor.css';

function AdminPostCategoryEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', slug: '', order_index: 0 });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }
      if (isEdit) {
        const { data, error } = await supabase.from('post_categories').select('*').eq('id', id).single();
        if (error) setError('Load failed: ' + error.message);
        else if (data) setFormData({
          name: data.name || '',
          slug: data.slug || '',
          order_index: data.order_index || 0,
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    checkAuthAndLoad();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const value = e.target.name === 'order_index' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });

    if (e.target.name === 'name' && !isEdit) {
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const op = isEdit
      ? supabase.from('post_categories').update(formData).eq('id', id)
      : supabase.from('post_categories').insert([formData]);
    const { error } = await op;
    if (error) { setError('Save failed: ' + error.message); setSaving(false); }
    else navigate('/admin/post-categories');
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/post-categories" className="back-link">← All Categories</Link>
          <h1>{isEdit ? 'Edit Category' : 'New Category'}</h1>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="admin-editor-form">
        {error && <div className="admin-error">❌ {error}</div>}
        <div className="admin-field">
          <label>Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={saving} />
        </div>
        <div className="admin-field">
          <label>Slug * (URL-friendly, auto-generated)</label>
          <input type="text" name="slug" value={formData.slug} onChange={handleChange} required disabled={saving} />
        </div>
        <div className="admin-field">
          <label>Order (lower = shown first)</label>
          <input type="number" name="order_index" value={formData.order_index} onChange={handleChange} disabled={saving} />
        </div>
        <div className="admin-editor-actions">
          <Link to="/admin/post-categories" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminPostCategoryEditor;