import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminEnrollments.css';

function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/admin'); return; }

    const { data: enrollData } = await supabase
      .from('enrollments')
      .select('*, courses:courses(id, name)')
      .order('enrolled_at', { ascending: false });

    const { data: courseData } = await supabase
      .from('courses')
      .select('id, name')
      .order('name', { ascending: true });

    const userIds = [...new Set((enrollData || []).map(e => e.user_id))];

    let profileMap = {};
    if (userIds.length > 0) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);

      (profileData || []).forEach(p => { profileMap[p.id] = p; });
    }

    setEnrollments(enrollData || []);
    setCourses(courseData || []);
    setProfiles(profileMap);
    setLoading(false);
  };

  useEffect(() => { loadData(); /* eslint-disable-next-line */ }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this enrollment?')) return;
    const { error } = await supabase.from('enrollments').delete().eq('id', id);
    if (error) {
      alert('Delete failed: ' + error.message);
    } else {
      setEnrollments(enrollments.filter(e => e.id !== id));
    }
  };

  const filtered = enrollments.filter(e => {
    if (filterCourse !== 'all' && String(e.course_id) !== String(filterCourse)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const profile = profiles[e.user_id];
      const name = (profile?.full_name || '').toLowerCase();
      const email = (profile?.email || '').toLowerCase();
      const courseName = (e.courses?.name || '').toLowerCase();
      if (!name.includes(q) && !email.includes(q) && !courseName.includes(q)) return false;
    }
    return true;
  });

  const uniqueStudents = new Set(filtered.map(e => e.user_id)).size;

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Enrollments</h1>
        </div>
      </header>

      <div className="enroll-filters">
        <input
          type="text"
          placeholder="Search by student name, email, or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="enroll-search"
        />

        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="enroll-select"
        >
          <option value="all">All Courses</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="enroll-summary">
        <strong>{filtered.length}</strong> enrollment{filtered.length !== 1 ? 's' : ''} ·
        <strong> {uniqueStudents}</strong> unique student{uniqueStudents !== 1 ? 's' : ''}
      </div>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="admin-list-empty">No enrollments match your filters.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Enrolled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => {
              const profile = profiles[e.user_id];
              const displayName = profile?.full_name || 'Unknown';
              const displayEmail = profile?.email || '';
              return (
                <tr key={e.id}>
                  <td>
                    <strong>{displayName}</strong>
                    {displayEmail && (
                      <>
                        <br />
                        <small style={{ color: '#888' }}>{displayEmail}</small>
                      </>
                    )}
                  </td>
                  <td>{e.courses?.name || 'Deleted course'}</td>
                  <td>
                    {new Date(e.enrolled_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </td>
                  <td className="admin-actions">
                    <button onClick={() => handleDelete(e.id)} className="btn-delete">
                      Remove
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

export default AdminEnrollments;