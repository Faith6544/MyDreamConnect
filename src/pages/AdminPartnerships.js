import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPartnerships.css';

function AdminPartnerships() {
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
        .from('partnership_enquiries')
        .select('*')
        .order('created_at', { ascending: false });
        
      setItems(data || []);
      setLoading(false);
    };

    loadData();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    const { error } = await supabase.from('partnership_enquiries').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setItems(items.filter(i => i.id !== id));
  };

  const filtered = items.filter(i => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (i.org_name || '').toLowerCase().includes(q) ||
           (i.contact_person || '').toLowerCase().includes(q) ||
           (i.email || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Partnership Enquiries</h1>
        </div>
      </header>

      <div className="users-filters">
        <input
          type="text"
          placeholder="Search by organisation, contact, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="users-search"
        />
      </div>

      <div className="users-summary">
        <strong>{filtered.length}</strong> enquir{filtered.length !== 1 ? 'ies' : 'y'}
      </div>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="admin-list-empty">No enquiries yet.</p>
      ) : (
        <div className="messages-list">
          {filtered.map(i => (
            <div key={i.id} className={`message-card ${openId === i.id ? 'open' : ''}`}>
              <div className="message-head" onClick={() => setOpenId(openId === i.id ? null : i.id)}>
                <div className="message-head-left">
                  <strong>{i.org_name}</strong>
                  <span className="message-email">{i.contact_person} · {i.email}</span>
                </div>
                <div className="message-head-right">
                  {i.type && <span className="message-subject">{i.type}</span>}
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
                  <p>{i.message || '(no message)'}</p>
                  <div className="message-actions">
                    <a href={`mailto:${i.email}?subject=Re: Partnership Enquiry`} className="btn-edit">
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

export default AdminPartnerships;