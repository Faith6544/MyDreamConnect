import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminTeamList.css';
import { useSortableList } from '../hooks/useSortableList';
function AdminTeamList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      const { data } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });

      setMembers(data || []);
      setLoading(false);
    };
    loadData();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setMembers(members.filter(m => m.id !== id));
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Team Members</h1>
        </div>
        <Link to="/admin/team/new" className="btn-new">+ New Member</Link>
      </header>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : members.length === 0 ? (
        <p className="admin-list-empty">No team members yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.role}</td>
                <td>{member.category}</td>
                <td className="admin-actions">
                  <Link to={`/admin/team/edit/${member.id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(member.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminTeamList;