import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminLessonsList.css';

function AdminLessonsList() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      const { data: courseData } = await supabase.from('courses').select('*').eq('id', courseId).single();
      setCourse(courseData);

      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (!error) setLessons(data || []);
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [courseId, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lesson?')) return;
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setLessons(lessons.filter(l => l.id !== id));
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/courses" className="back-link">← All Courses</Link>
          <h1>Lessons — {course?.name || 'Loading...'}</h1>
        </div>
        <Link to={`/admin/courses/${courseId}/lessons/new`} className="btn-new">+ New Lesson</Link>
      </header>

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : lessons.length === 0 ? (
        <p className="admin-list-empty">No lessons yet. Add one to get started.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Title</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {lessons.map(l => (
              <tr key={l.id}>
                <td>{l.order_index}</td>
                <td>{l.title}</td>
                <td className="admin-actions">
                  <Link to={`/admin/courses/${courseId}/lessons/edit/${l.id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(l.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminLessonsList;