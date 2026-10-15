import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPostTagEditor.css';

function AdminPostTagEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }
      if (isEdit) {
        const { data, error } = await supabase.from('post_tags').select('*').eq('id', id).single();
        if (error) setError('Load failed: ' + error.message);
        else if (data) setFormData({ name: data.name || '', slug: data.slug || '' });
      }
      setLoading(false);
    };
    load();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData(prev => {
      if (e.target.name === 'name' && !isEdit) {
        return {
          name: value,
          slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        };
      }
      return { ...prev, [e.target.name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const op = isEdit
      ? supabase.from('post_tags').update(formData).eq('id', id)
      : supabase.from('post_tags').insert([formData]);
    const { error } = await op;
    if (error) { setError('Save failed: ' + error.message); setSaving(false); }
    else navigate('/admin/post-tags');
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/post-tags" className="back-link">← All Tags</Link>
          <h1>{isEdit ? 'Edit Tag' : 'New Tag'}</h1>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="admin-editor-form">
        {error && <div className="admin-error">❌ {error}</div>}
        <div className="admin-field">
          <label>Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={saving} />
        </div>
        <div className="admin-field">
          <label>Slug *</label>
          <input type="text" name="slug" value={formData.slug} onChange={handleChange} required disabled={saving} />
        </div>
        <div className="admin-editor-actions">
          <Link to="/admin/post-tags" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminPostTagEditor;