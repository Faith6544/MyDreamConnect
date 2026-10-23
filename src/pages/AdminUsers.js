import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminUsers.css';

function normalizeRole(role) {
  return String(role || '').replace(/^'+|'+$/g, '').toLowerCase();
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [enrollCounts, setEnrollCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const navigate = useNavigate();

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/admin'); return; }

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // Get enrollment counts per user
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('user_id');

    const counts = {};
    (enrollments || []).forEach(e => {
      counts[e.user_id] = (counts[e.user_id] || 0) + 1;
    });

    setUsers(profiles || []);
    setEnrollCounts(counts);
    setLoading(false);
  };

  useEffect(() => { loadData(); /* eslint-disable-next-line */ }, [navigate]);

  const handleRoleToggle = async (id, currentRole) => {
    const normalized = normalizeRole(currentRole);
    const newRole = normalized === 'admin' ? 'student' : 'admin';

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser && currentUser.id === id && newRole === 'student') {
      if (!window.confirm('You are about to remove your own admin privileges. You will lose access to admin pages. Continue?')) return;
    } else {
      if (!window.confirm(`Change this user's role to "${newRole}"?`)) return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', id);

    if (error) {
      alert('Update failed: ' + error.message);
    } else {
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
      if (currentUser && currentUser.id === id && newRole === 'student') {
        window.location.href = '/';
      }
    }
  };

  const filtered = users.filter(u => {
    const matchesSearch =
      !search.trim() ||
      (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase());

    const role = normalizeRole(u.role);
    const matchesRole =
      roleFilter === 'all' ||
      (roleFilter === 'admin' && role === 'admin') ||
      (roleFilter === 'student' && role !== 'admin');

    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Users</h1>
        </div>
      </header>

      <div className="users-filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="users-search"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="users-select"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="users-summary">
        <strong>{filtered.length}</strong> user{filtered.length !== 1 ? 's' : ''} shown ·
        <strong> {users.length}</strong> total
      </div>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="admin-list-empty">No users match your filters.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Courses</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const isAdmin = normalizeRole(u.role) === 'admin';
              const count = enrollCounts[u.id] || 0;
              return (
                <tr key={u.id}>
                  <td><strong>{u.full_name || '—'}</strong></td>
                  <td>{u.email || '—'}</td>
                  <td>
                    <span className={`role-pill ${isAdmin ? 'role-admin' : 'role-student'}`}>
                      {isAdmin ? 'Admin' : 'Student'}
                    </span>
                  </td>
                  <td>{count}</td>
                  <td>
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })
                      : '—'}
                  </td>
                  <td className="admin-actions">
                    <button
                      onClick={() => handleRoleToggle(u.id, u.role)}
                      className="btn-edit"
                    >
                      {isAdmin ? 'Demote' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminUsers;
