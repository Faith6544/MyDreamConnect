import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminCoursesList.css';

function AdminCoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setCourses(data || []);
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setCourses(courses.filter(c => c.id !== id));
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Courses</h1>
        </div>
        <Link to="/admin/courses/new" className="btn-new">+ New Course</Link>
        
      </header>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="admin-list-empty">No courses yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.price === 0 || !c.price ? 'Free' : `₦${c.price.toLocaleString()}`}</td>
                <td>{new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td className="admin-actions">
                  <Link to={`/admin/courses/edit/${c.id}`} className="btn-edit">Edit</Link>
                  <Link to={`/admin/courses/${c.id}/lessons`} className="btn-edit">Lessons</Link>
                  <button onClick={() => handleDelete(c.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminCoursesList;