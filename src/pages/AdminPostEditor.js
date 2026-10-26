import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPostEditor.css';
import ImageUpload from '../components/ImageUpload';

function AdminPostEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    category_id: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin');
        return;
      }

      // Load categories (always). `post_categories.order_index` is TEXT, so a
      // database ORDER BY is lexicographic ("10" before "2"); sort here instead.
      const { data: catData } = await supabase
        .from('post_categories')
        .select('*').order('created_at', { ascending: false });
      setCategories(
        [...(catData || [])].sort(
          (a, b) => (Number(a.order_index) || 0) - (Number(b.order_index) || 0)
        )
      );

      // Load post if editing
      if (isEdit) {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          setError('Could not load post: ' + error.message);
        } else if (!data) {
          setError('This post no longer exists.');
        } else {
          setFormData({
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            image_url: data.image_url || '',
            category_id: data.category_id ?? null,
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
    let value = e.target.value;
    if (e.target.name === 'category_id') {
      value = value === '' ? null : Number(value);
    }
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (isEdit) {
      const { error } = await supabase
        .from('posts')
        .update(formData)
        .eq('id', id);

      if (error) {
        setError('Save failed: ' + error.message);
        setSaving(false);
      } else {
        navigate('/admin/posts');
      }
    } else {
      const { error } = await supabase.from('posts').insert([formData]);

      if (error) {
        setError('Save failed: ' + error.message);
        setSaving(false);
      } else {
        navigate('/admin/posts');
      }
    }
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/posts" className="back-link">← All Posts</Link>
          <h1>{isEdit ? 'Edit Post' : 'New Post'}</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="admin-editor-form">
        {error && <div className="admin-error">❌ {error}</div>}

        <div className="admin-field">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
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
          label="Featured Image"
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
          <label>Content *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="14"
            required
            disabled={saving}
          />
        </div>

        <div className="admin-editor-actions">
          <Link to="/admin/posts" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminPostEditor;