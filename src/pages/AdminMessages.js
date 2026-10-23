import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminMessages.css';

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      const { data } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      setMessages(data || []);
      setLoading(false);
    };

    loadData();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setMessages(messages.filter(m => m.id !== id));
  };

  const filtered = messages.filter(m => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (m.name || '').toLowerCase().includes(q) ||
           (m.email || '').toLowerCase().includes(q) ||
           (m.subject || '').toLowerCase().includes(q) ||
           (m.message || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Contact Messages</h1>
        </div>
      </header>

      <div className="users-filters">
        <input
          type="text"
          placeholder="Search by name, email, subject, or body..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="users-search"
        />
      </div>

      <div className="users-summary">
        <strong>{filtered.length}</strong> message{filtered.length !== 1 ? 's' : ''}
      </div>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="admin-list-empty">No messages yet.</p>
      ) : (
        <div className="messages-list">
          {filtered.map(m => (
            <div key={m.id} className={`message-card ${openId === m.id ? 'open' : ''}`}>
              <div className="message-head" onClick={() => setOpenId(openId === m.id ? null : m.id)}>
                <div className="message-head-left">
                  <strong>{m.name}</strong>
                  <span className="message-email">{m.email}</span>
                </div>
                <div className="message-head-right">
                  <span className="message-subject">{m.subject || '(no subject)'}</span>
                  <span className="message-date">
                    {new Date(m.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              {openId === m.id && (
                <div className="message-body">
                  <p>{m.message}</p>
                  <div className="message-actions">
                    <a href={`mailto:${m.email}?subject=Re: ${m.subject || 'Your message'}`} className="btn-edit">
                      Reply via email
                    </a>
                    <button onClick={() => handleDelete(m.id)} className="btn-delete">Delete</button>
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

export default AdminMessages;