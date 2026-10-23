import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminVolunteers.css';

function AdminVolunteers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }
      const { data } = await supabase
        .from('volunteer_applications')
        .select('*')
        .order('created_at', { ascending: false });
      setItems(data || []);
      setLoading(false);
    };

    loadData();
  }, [navigate]); // Dependency array is clean now

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    const { error } = await supabase.from('volunteer_applications').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setItems(items.filter(i => i.id !== id));
  };

  const filtered = items.filter(i => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (i.name || '').toLowerCase().includes(q) ||
           (i.email || '').toLowerCase().includes(q) ||
           (i.skills || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Volunteer Applications</h1>
        </div>
      </header>

      <div className="users-filters">
        <input
          type="text"
          placeholder="Search by name, email, or skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="users-search"
        />
      </div>

      <div className="users-summary">
        <strong>{filtered.length}</strong> application{filtered.length !== 1 ? 's' : ''}
      </div>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="admin-list-empty">No applications yet.</p>
      ) : (
        <div className="messages-list">
          {filtered.map(i => (
            <div key={i.id} className={`message-card ${openId === i.id ? 'open' : ''}`}>
              <div className="message-head" onClick={() => setOpenId(openId === i.id ? null : i.id)}>
                <div className="message-head-left">
                  <strong>{i.name}</strong>
                  <span className="message-email">{i.email}</span>
                </div>
                <div className="message-head-right">
                  {i.availability && <span className="message-subject">{i.availability}</span>}
                  <span className="message-date">
                    {new Date(i.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              {openId === i.id && (
                <div className="message-body">
                  {i.phone && <p><strong>Phone:</strong> {i.phone}</p>}
                  {i.city && <p><strong>City:</strong> {i.city}</p>}
                  {i.skills && <p><strong>Skills:</strong> {i.skills}</p>}
                  {i.message && <p><strong>Why:</strong> {i.message}</p>}
                  <div className="message-actions">
                    <a href={`mailto:${i.email}?subject=Volunteer Application Follow-up`} className="btn-edit">
                      Reply via email
                    </a>
                    <button onClick={() => handleDelete(i.id)} className="btn-delete">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminVolunteers;