import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminJobsList.css';

function AdminJobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }
      const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (!error) setJobs(data || []);
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setJobs(jobs.filter(j => j.id !== id));
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Jobs</h1>
        </div>
        <Link to="/admin/jobs/new" className="btn-new">+ New Job</Link>
      </header>
      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="admin-list-empty">No jobs yet.</p>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Actions</th></tr></thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id}>
                <td>{j.title}</td>
                <td className="admin-actions">
                  <Link to={`/admin/jobs/edit/${j.id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(j.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminJobsList;