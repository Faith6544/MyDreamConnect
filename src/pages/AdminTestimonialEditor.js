import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminTestimonialEditor.css';
import ImageUpload from '../components/ImageUpload';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
function AdminTestimonialEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', quote: '', role: '', image_url: '', order_index: 0,
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { toast, showToast } = useToast();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }
      if (isEdit) {
        const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).single();
        if (error) setError('Load failed: ' + error.message);
        else if (data) setFormData({
          name: data.name || '',
          quote: data.quote || '',
          role: data.role || '',
          image_url: data.image_url || '',
          order_index: data.order_index || 0,
        });
        setLoading(false);
      }
    };
    checkAuthAndLoad();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const value = e.target.name === 'order_index' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const op = isEdit
      ? supabase.from('testimonials').update(formData).eq('id', id)
      : supabase.from('testimonials').insert([formData]);
    const { error } = await op;
    if (error) {
      setError('Save failed: ' + error.message);
      showToast('Save failed: ' + error.message, 'error');
      setSaving(false);
    } else {
      // Friendly confirmation, then back to the list.
      showToast(isEdit ? 'Testimonial updated ✓' : 'Testimonial created ✓');
      setTimeout(() => navigate('/admin/testimonials'), 900);
    }
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/testimonials" className="back-link">← All Testimonials</Link>
          <h1>{isEdit ? 'Edit Testimonial' : 'New Testimonial'}</h1>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="admin-editor-form">
        {error && <div className="admin-error">❌ {error}</div>}
        <div className="admin-field">
          <label>Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={saving} />
        </div>
        <div className="admin-field">
          <label>Quote *</label>
          <textarea name="quote" value={formData.quote} onChange={handleChange} rows="5" required disabled={saving} />
        </div>
        <div className="admin-field">
          <label>Role / Where they're from</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Principal, FRICOM College" disabled={saving} />
        </div>
        <ImageUpload
  label="Testimonial Photo"
  value={formData.image_url}
  onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
/>
        <div className="admin-field">
          <label>Order (lower = shown first)</label>
          <input type="number" name="order_index" value={formData.order_index} onChange={handleChange} disabled={saving} />
        </div>
        <div className="admin-editor-actions is-sticky">
          <Link to="/admin/testimonials" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
      <Toast toast={toast} onClose={() => showToast(null)} />
    </div>
  );
}

export default AdminTestimonialEditor;