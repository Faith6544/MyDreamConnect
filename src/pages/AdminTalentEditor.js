import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminTalentEditor.css';
import ImageUpload from '../components/ImageUpload';

function AdminTalentEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', role: '', location: '', availability: '', avatar_url: '', skillsInput: '',
    portfolio_images: ['', '', '', ''] // 4 slots
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }
      if (isEdit) {
        const { data, error } = await supabase.from('talent').select('*').eq('id', id).single();
        if (error) setError('Load failed: ' + error.message);
        else if (data) {
          const existingImages = data.portfolio_images || [];
          // Ensure we always have exactly 4 slots
          const paddedImages = [...existingImages, '', '', '', ''].slice(0, 4);

          setFormData({
            name: data.name || '',
            role: data.role || '',
            location: data.location || '',
            availability: data.availability || '',
            avatar_url: data.avatar_url || '',
            skillsInput: Array.isArray(data.skills) ? data.skills.join(', ') : String(data.skills || ''),
            portfolio_images: paddedImages,
          });
        }
      }
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update a specific image slot
  const handleImageChange = (index, url) => {
    const newImages = [...formData.portfolio_images];
    newImages[index] = url;
    setFormData({ ...formData, portfolio_images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const skillsText = formData.skillsInput
      .split(',').map(s => s.trim()).filter(s => s.length > 0).join(', ');

    // Remove empty slots so you don't save blank strings
    const cleanImages = formData.portfolio_images.filter(url => url && url.trim() !== '');

    const payload = {
      name: formData.name,
      role: formData.role,
      location: formData.location,
      availability: formData.availability,
      avatar_url: formData.avatar_url,
      skills: skillsText || null,
      portfolio_images: cleanImages, // Save the array of images
    };

    const op = isEdit
      ? supabase.from('talent').update(payload).eq('id', id)
      : supabase.from('talent').insert([payload]);

    const { error } = await op;
    if (error) { setError('Save failed: ' + error.message); setSaving(false); }
    else navigate('/admin/talent');
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/talent" className="back-link">← All Talent</Link>
          <h1>{isEdit ? 'Edit Talent' : 'New Talent'}</h1>
        </div>
      </header>
      
      <form onSubmit={handleSubmit} className="admin-editor-form">
        {error && <div className="admin-error">❌ {error}</div>}
        
        <div className="admin-field">
          <label>Full Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={saving} />
        </div>
        
        <div className="admin-field">
          <label>Role / Title</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Product Designer" disabled={saving} />
        </div>
        
        <div className="admin-field">
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Lagos, Nigeria" disabled={saving} />
        </div>
        
        <div className="admin-field">
          <label>Availability</label>
          <input type="text" name="availability" value={formData.availability} onChange={handleChange} placeholder="e.g. Full Time, Remote" disabled={saving} />
        </div>

        <ImageUpload
          label="Avatar Photo"
          value={formData.avatar_url}
          onChange={(url) => setFormData((prev) => ({ ...prev, avatar_url: url }))}
        />

        <div className="admin-field">
          <label>Skills (comma-separated)</label>
          <input type="text" name="skillsInput" value={formData.skillsInput} onChange={handleChange} placeholder="e.g. React, JavaScript, CSS" disabled={saving} />
        </div>

        {/* --- CLEAN PORTFOLIO IMAGES SECTION --- */}
        <div className="admin-field" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
          <label style={{ fontSize: '16px', marginBottom: '15px', display: 'block', color: '#0a4711' }}>
            Portfolio Images (Optional - Max 4)
          </label>
          
          {formData.portfolio_images.map((url, index) => (
            <div key={index} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: index !== 3 ? '1px solid #eaeaea' : 'none' }}>
              <label style={{ fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' }}>
                Image {index + 1}
              </label>
              <ImageUpload
                label="" // Hide the default label to save space
                value={url}
                onChange={(newUrl) => handleImageChange(index, newUrl)}
              />
            </div>
          ))}
        </div>

        <div className="admin-editor-actions">
          <Link to="/admin/talent" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Talent' : 'Create Talent'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminTalentEditor;