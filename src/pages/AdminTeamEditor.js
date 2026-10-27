import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminTeamEditor.css';
import ImageUpload from '../components/ImageUpload';

function AdminTeamEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image_url: '',
    category: 'Board of Directors',
    order_index: 0
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      if (isEdit) {
        const { data, error } = await supabase.from('team_members').select('*').eq('id', id).single();
        if (error) setError('Load failed: ' + error.message);
        else if (data) setFormData({
          name: data.name || '',
          role: data.role || '',
          bio: data.bio || '',
          image_url: data.image_url || '',
          category: data.category || 'Board of Directors',
          order_index: data.order_index || 0
        });
      }
      setLoading(false);
    };
    loadData();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'order_index' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const op = isEdit
      ? supabase.from('team_members').update(formData).eq('id', id)
      : supabase.from('team_members').insert([formData]);

    const { error } = await op;
    if (error) { 
      setError('Save failed: ' + error.message); 
      setSaving(false); 
    } else {
      navigate('/admin/team');
    }
  };

  if (loading) return <div className="admin-editor-loading">Loading...</div>;

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link to="/admin/team" className="back-link">← All Team Members</Link>
          <h1>{isEdit ? 'Edit Team Member' : 'New Team Member'}</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="admin-editor-form">
        {error && <div className="admin-error">❌ {error}</div>}

        <div className="admin-field">
          <label>Full Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={saving} />
        </div>

        <div className="admin-field">
          <label>Role / Title *</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Executive Director" required disabled={saving} />
        </div>

        <div className="admin-field">
          <label>Category *</label>
          <select name="category" value={formData.category} onChange={handleChange} disabled={saving}>
            <option value="Board of Directors">Board of Directors</option>
            <option value="Executive Team">Executive Team</option>
            <option value="Staff">Staff</option>
            <option value="Volunteers">Volunteers</option>
            <option value="Advisors">Advisors</option>
          </select>
        </div>

        <div className="admin-field">
          <label>Order / Display Priority (0 shows first)</label>
          <input type="number" name="order_index" value={formData.order_index} onChange={handleChange} disabled={saving} />
        </div>

        <ImageUpload
          label="Profile Photo"
          value={formData.image_url}
          onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
        />

        <div className="admin-field">
          <label>Short Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" disabled={saving} placeholder="Brief background or statement..." />
        </div>

        <div className="admin-editor-actions">
          <Link to="/admin/team" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Member' : 'Create Member'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminTeamEditor;