import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminLessonEditor.css';

function AdminLessonEditor() {
  const { courseId, id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  // We use an array of 5 slots for videos
  const [formData, setFormData] = useState({
    title: '', 
    content: '', 
    video_urls: ['', '', '', '', ''], 
    order_index: 1,
  });
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      if (isEdit) {
        // Scope by course_id as well, so an id from another course cannot be
        // opened (and re-parented) through this editor.
        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', id)
          .eq('course_id', courseId)
          .maybeSingle();

        if (error) setError('Load failed: ' + error.message);
        else if (!data) setError('This lesson does not belong to this course.');
        else {
          // Safely handle existing videos (fill up to 5 slots)
          const existingVideos = Array.isArray(data.video_urls) ? data.video_urls : [];
          if (existingVideos.length > 5) {
            setError('Note: this lesson has more than 5 videos; only the first 5 are shown.');
          }
          const paddedVideos = [...existingVideos.slice(0, 5), '', '', '', '', ''].slice(0, 5);

          setFormData({
            title: data.title || '',
            content: data.content || '',
            video_urls: paddedVideos,
            order_index: data.order_index ?? 1,
          });
        }
        setLoading(false);
      } else {
        // Auto-suggest next order_index (sorted numerically, in case the
        // column ever comes back as text).
        const { data } = await supabase
          .from('lessons')
          .select('order_index')
          .eq('course_id', courseId);

        const maxIndex = (data || []).reduce((max, row) => {
          const value = Number(row.order_index);
          return Number.isFinite(value) && value > max ? value : max;
        }, 0);

        setFormData(prev => ({ ...prev, order_index: maxIndex + 1 }));
        setLoading(false);
      }
    };
    checkAuthAndLoad();
  }, [id, isEdit, courseId, navigate]);

  const handleChange = (e) => {
    const { name } = e.target;
    const value = name === 'order_index' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Special handler for the video array
  const handleVideoChange = (index, value) => {
    setFormData((prev) => {
      const newVideos = [...prev.video_urls];
      newVideos[index] = value;
      return { ...prev, video_urls: newVideos };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Clean up empty video URLs before saving
    const cleanedVideos = formData.video_urls
      .map(url => (url || '').trim())
      .filter(url => url !== '');

    const payload = {
      title: formData.title,
      content: formData.content,
      video_urls: cleanedVideos,
      order_index: Number(formData.order_index) || 1,
    };

    // Only set course_id on create. On update, never re-parent the lesson.
    const op = isEdit
      ? supabase.from('lessons').update(payload).eq('id', id).eq('course_id', courseId)
      : supabase.from('lessons').insert([{ ...payload, course_id: Number(courseId) }]);

    const { error } = await op;
    if (error) { setError('Save failed: ' + error.message); setSaving(false); }
    else navigate(`/admin/courses/${courseId}/lessons`);
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to={`/admin/courses/${courseId}/lessons`} className="back-link">← All Lessons</Link>
          <h1>{isEdit ? 'Edit Lesson' : 'New Lesson'}</h1>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="admin-editor-form">
        {error && <div className="admin-error">❌ {error}</div>}

        <div className="admin-field">
          <label>Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required disabled={saving} />
        </div>

        <div className="admin-field">
          <label>Order (1, 2, 3...)</label>
          <input type="number" name="order_index" value={formData.order_index} onChange={handleChange} min="1" disabled={saving} />
        </div>

        {/* YOUTUBE VIDEOS SECTION (Up to 5) */}
        <div className="admin-field" style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
          <label style={{ marginBottom: '10px', display: 'block' }}>YouTube Video URLs (Up to 5)</label>
          
          {formData.video_urls.map((url, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <input
                type="url"
                value={url}
                onChange={(e) => handleVideoChange(index, e.target.value)}
                placeholder={`Video ${index + 1} URL (e.g. https://youtube.com/watch?v=...)`}
                disabled={saving}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
              />
            </div>
          ))}
        </div>

        <div className="admin-field">
          <label>Content</label>
          <textarea name="content" value={formData.content} onChange={handleChange} rows="10" disabled={saving} />
        </div>

        <div className="admin-editor-actions">
          <Link to={`/admin/courses/${courseId}/lessons`} className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Lesson' : 'Create Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminLessonEditor;