import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminCourseEditor.css';
import ImageUpload from '../components/ImageUpload';
function AdminCourseEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    excerpt: '',
    content: '',
    image_url: '',
    price: 0,
    duration: '',
    level: '',
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      if (isEdit) {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (error) setError('Could not load course: ' + error.message);
        else if (data) {
          setFormData({
            name: data.name || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            image_url: data.image_url || '',
            price: data.price || 0,
            duration: data.duration || '',
            level: data.level || '',
          });
        }
        setLoading(false);
      }
    };
    checkAuthAndLoad();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const value = e.target.name === 'price' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (isEdit) {
      const { error } = await supabase.from('courses').update(formData).eq('id', id);
      if (error) { setError('Save failed: ' + error.message); setSaving(false); }
      else navigate('/admin/courses');
    } else {
      const { error } = await supabase.from('courses').insert([formData]);
      if (error) { setError('Save failed: ' + error.message); setSaving(false); }
      else navigate('/admin/courses');
    }
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/courses" className="back-link">← All Courses</Link>
          <h1>{isEdit ? 'Edit Course' : 'New Course'}</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="admin-editor-form">
        {error && <div className="admin-error">❌ {error}</div>}

        <ImageUpload
  label="Course Image"
  value={formData.image_url}
  onChange={(url) => setFormData({ ...formData, image_url: url })}
/>

        <div className="admin-field">
          <label>Excerpt (short summary)</label>
          <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows="3" disabled={saving} />
        </div>

        <div className="admin-field">
          <label>Full Content</label>
          <textarea name="content" value={formData.content} onChange={handleChange} rows="8" disabled={saving} />
        </div>

        <div className="admin-field">
          <label>Image URL</label>
          <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." disabled={saving} />
        </div>

        <div className="admin-field">
          <label>Price (₦) — use 0 for Free</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" disabled={saving} />
        </div>

        <div className="admin-field">
          <label>Duration (e.g. "10 Weeks")</label>
          <input type="text" name="duration" value={formData.duration} onChange={handleChange} disabled={saving} />
        </div>

        <div className="admin-field">
          <label>Level (e.g. "Beginner", "All Levels")</label>
          <input type="text" name="level" value={formData.level} onChange={handleChange} disabled={saving} />
        </div>

        <div className="admin-editor-actions">
          <Link to="/admin/courses" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCourseEditor;