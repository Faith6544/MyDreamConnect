import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminCategoryEditor.css';

function AdminCategoryEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', slug: '', order_index: 0 });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const checkAuthAndLoad = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate('/admin'); return; }

        if (isEdit) {
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .maybeSingle();

          if (cancelled) return;

          if (error) setError('Load failed: ' + error.message);
          else if (!data) setError('This category no longer exists.');
          else setFormData({
            name: data.name || '',
            slug: data.slug || '',
            order_index: data.order_index ?? 0,
          });
        }
      } catch (err) {
        if (!cancelled) setError('Load failed: ' + err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkAuthAndLoad();
    return () => { cancelled = true; };
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      // Auto-generate the slug from the name when creating.
      if (name === 'name' && !isEdit) {
        return {
          ...prev,
          name: value,
          slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        };
      }
      return { ...prev, [name]: name === 'order_index' ? Number(value) : value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const op = isEdit
      ? supabase.from('categories').update(formData).eq('id', id)
      : supabase.from('categories').insert([formData]);
    const { error } = await op;
    if (error) { setError('Save failed: ' + error.message); setSaving(false); }
    else navigate('/admin/categories');
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/categories" className="back-link">← All Categories</Link>
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
          <label>Slug * <small>(URL-friendly, auto-generated)</small></label>
          <input type="text" name="slug" value={formData.slug} onChange={handleChange} required disabled={saving} />
        </div>
        <div className="admin-field">
          <label>Order (lower = shown first)</label>
          <input type="number" name="order_index" value={formData.order_index} onChange={handleChange} disabled={saving} />
        </div>
        <div className="admin-editor-actions">
          <Link to="/admin/categories" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCategoryEditor;