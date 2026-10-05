import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminInstructorEditor.css';
import ImageUpload from '../components/ImageUpload';
function AdminInstructorEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', role: '', image_url: '', bio: '', order_index: 0,
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }
      if (isEdit) {
        const { data, error } = await supabase.from('instructors').select('*').eq('id', id).single();
        if (error) setError('Load failed: ' + error.message);
        else if (data) setFormData({
          name: data.name || '',
          role: data.role || '',
          image_url: data.image_url || '',
          bio: data.bio || '',
          order_index: data.order_index || 0,
        });
        setLoading(false);
      }
    };
    checkAuthAndLoad();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const value = e.target.name === 'order_index' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const op = isEdit
      ? supabase.from('instructors').update(formData).eq('id', id)
      : supabase.from('instructors').insert([formData]);
    const { error } = await op;
    if (error) { setError('Save failed: ' + error.message); setSaving(false); }
    else navigate('/admin/instructors');
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/instructors" className="back-link">← All Instructors</Link>
          <h1>{isEdit ? 'Edit Instructor' : 'New Instructor'}</h1>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="admin-editor-form">
        {error && <div className="admin-error">❌ {error}</div>}
        <div className="admin-field">
          <label>Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={saving} />
        </div>
        <div className="admin-field">
          <label>Role / Title</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Digital Media Marketing Instructor" disabled={saving} />
        </div>
        <ImageUpload
  label="Instructor Photo"
  value={formData.image_url}
  onChange={(url) => setFormData({ ...formData, image_url: url })}
/>
        <div className="admin-field">
          <label>Bio (optional)</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" disabled={saving} />
        </div>
        <div className="admin-field">
          <label>Order (lower = shown first)</label>
          <input type="number" name="order_index" value={formData.order_index} onChange={handleChange} disabled={saving} />
        </div>
        <div className="admin-editor-actions">
          <Link to="/admin/instructors" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminInstructorEditor;