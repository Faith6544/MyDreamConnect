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
        const { data, error } = await supabase.from('lessons').select('*').eq('id', id).single();
        if (error) setError('Load failed: ' + error.message);
        else if (data) {
          // Safely handle existing videos (fill up to 5 slots)
          const existingVideos = data.video_urls || [];
          const paddedVideos = [...existingVideos, '', '', '', '', ''].slice(0, 5);

          setFormData({
            title: data.title || '',
            content: data.content || '',
            video_urls: paddedVideos,
            order_index: data.order_index || 1,
          });
        }
        setLoading(false);
      } else {
        // Auto-suggest next order_index
        const { data } = await supabase
          .from('lessons')
          .select('order_index')
          .eq('course_id', courseId)
          .order('order_index', { ascending: false })
          .limit(1);

        const nextIndex = data && data.length > 0 ? (data[0].order_index || 0) + 1 : 1;
        setFormData(prev => ({ ...prev, order_index: nextIndex }));
        setLoading(false);
      }
    };
    checkAuthAndLoad();
  }, [id, isEdit, courseId, navigate]);

  const handleChange = (e) => {
    const value = e.target.name === 'order_index' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Special handler for the video array
  const handleVideoChange = (index, value) => {
    const newVideos = [...formData.video_urls];
    newVideos[index] = value;
    setFormData({ ...formData, video_urls: newVideos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Clean up empty video URLs before saving
    const cleanedVideos = formData.video_urls.filter(url => url.trim() !== '');
    
    const payload = { 
      ...formData, 
      video_urls: cleanedVideos,
      course_id: Number(courseId) 
    };

    const op = isEdit
      ? supabase.from('lessons').update(payload).eq('id', id)
      : supabase.from('lessons').insert([payload]);

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