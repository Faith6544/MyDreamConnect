import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminLessonsList.css';
import { useSortableList } from '../hooks/useSortableList';
function AdminLessonsList() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();

      if (courseError) setError('Load failed: ' + courseError.message);
      else setCourse(courseData);

      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) {
        setError('Load failed: ' + error.message);
        setLessons([]);
      } else {
        setLessons(data || []);
      }
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [courseId, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lesson?')) return;

    // lesson_progress has no FK to lessons, so remove its rows first.
    await supabase.from('lesson_progress').delete().eq('lesson_id', id);

    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setLessons((prev) => prev.filter(l => l.id !== id));
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

      {error && <div className="admin-error">❌ {error}</div>}

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