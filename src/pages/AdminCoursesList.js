import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminCoursesList.css';
import AdminYearGroup from '../components/AdminYearGroup';

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
    if (!window.confirm('Delete this course? This will also remove its lessons, enrollments, certificates and progress.')) return;

    const { data: lessonRows } = await supabase.from('lessons').select('id').eq('course_id', id);
    const lessonIds = (lessonRows || []).map(l => l.id);

    if (lessonIds.length > 0) {
      await supabase.from('lesson_progress').delete().in('lesson_id', lessonIds);
    }

    await supabase.from('lesson_progress').delete().eq('course_id', id);
    await supabase.from('lessons').delete().eq('course_id', id);
    await supabase.from('enrollments').delete().eq('course_id', id);
    await supabase.from('certificates').delete().eq('course_id', id);

    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setCourses((prev) => prev.filter(c => c.id !== id));
  };

  const renderCourse = (course) => (
    <div key={course.id} className="admin-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', marginBottom: '10px' }}>
      <div>
        <strong style={{ display: 'block', color: '#333', fontSize: '16px' }}>{course.name}</strong>
        <span style={{ fontSize: '12px', color: '#888' }}>
          {course.price === 0 || !course.price ? 'Free' : `₦${course.price.toLocaleString()}`} · {new Date(course.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to={`/admin/courses/${course.id}/lessons`} className="btn-edit" style={{ background: '#e0f2fe', color: '#0369a1' }}>Lessons</Link>
        <Link to={`/admin/courses/edit/${course.id}`} className="btn-edit">Edit</Link>
        <button onClick={() => handleDelete(course.id)} className="btn-delete">Delete</button>
      </div>
    </div>
  );

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
        <AdminYearGroup 
          items={courses} 
          dateField="created_at"
          renderItem={renderCourse} 
        />
      )}
    </div>
  );
}

export default AdminCoursesList;