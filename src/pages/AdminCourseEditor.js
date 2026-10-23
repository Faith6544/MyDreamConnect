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
    category_id: null,
    
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      // Load categories (always)
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });
      setCategories(catData || []);

      // Load course if editing
      if (isEdit) {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          setError('Could not load course: ' + error.message);
        } else if (data) {
          setFormData({
            name: data.name || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            image_url: data.image_url || '',
            price: data.price || 0,
            duration: data.duration || '',
            level: data.level || '',
            category_id: data.category_id || null,
          });
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    checkAuthAndLoad();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category_id') {
      setFormData((prev) => ({ ...prev, category_id: value === '' ? null : Number(value) }));
      return;
    }

    if (name === 'price') {
      // Keep the raw string while typing so the controlled input never jumps
      // to "0" and the field can be temporarily empty. It is normalised on save.
      setFormData((prev) => ({ ...prev, price: value }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // An empty price means "Free" (0), never NULL.
    const priceNumber = Number(formData.price);
    const payload = {
      ...formData,
      price: Number.isFinite(priceNumber) ? priceNumber : 0,
    };

    const op = isEdit
      ? supabase.from('courses').update(payload).eq('id', id)
      : supabase.from('courses').insert([payload]);

    const { error } = await op;
    if (error) { setError('Save failed: ' + error.message); setSaving(false); }
    else navigate('/admin/courses');
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

        <div className="admin-field">
          <label>Course Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={saving}
          />
        </div>

        <div className="admin-field">
          <label>Category</label>
          <select
            name="category_id"
            value={formData.category_id || ''}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="">— Uncategorized —</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <ImageUpload
          label="Course Image"
          value={formData.image_url}
          onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
        />

        <div className="admin-field">
          <label>Excerpt (short summary)</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="3"
            disabled={saving}
          />
        </div>

        <div className="admin-field">
          <label>Full Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="8"
            disabled={saving}
          />
        </div>

        <div className="admin-field">
          <label>Price (₦) — use 0 for Free</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            disabled={saving}
          />
        </div>

        <div className="admin-field">
          <label>Duration (e.g. "10 Weeks")</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            disabled={saving}
          />
        </div>

        <div className="admin-field">
          <label>Level (e.g. "Beginner", "All Levels")</label>
          <input
            type="text"
            name="level"
            value={formData.level}
            onChange={handleChange}
            disabled={saving}
          />
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