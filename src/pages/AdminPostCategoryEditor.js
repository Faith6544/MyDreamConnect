import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPostCategoryEditor.css';

function AdminPostCategoryEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', slug: '', order_index: '' });
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
            .from('post_categories')
            .select('*')
            .eq('id', id)
            .maybeSingle();

          if (cancelled) return;

          if (error) setError('Load failed: ' + error.message);
          else if (!data) setError('This category no longer exists.');
          else setFormData({
            name: data.name || '',
            slug: data.slug || '',
            // `post_categories.order_index` is TEXT — keep it a string.
            order_index: data.order_index == null ? '' : String(data.order_index),
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
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: formData.name,
      slug: formData.slug,
      // Store a string: the column is TEXT.
      order_index: formData.order_index === '' ? null : String(formData.order_index).trim(),
    };

    try {
      const op = isEdit
        ? supabase.from('post_categories').update(payload).eq('id', id)
        : supabase.from('post_categories').insert([payload]);

      const { error } = await op;
      if (error) {
        setError('Save failed: ' + error.message);
        setSaving(false);
      } else {
        navigate('/admin/post-categories');
      }
    } catch (err) {
      setError('Save failed: ' + err.message);
      setSaving(false);
    }
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
          <input
            type="number"
            name="order_index"
            value={formData.order_index}
            onChange={handleChange}
            placeholder="e.g. 1"
            disabled={saving}
          />
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