import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import { fetchInOrder, saveOrder } from '../lib/fetchOrdered';
import './AdminLessonsList.css';

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

      const { data, error: loadError } = await fetchInOrder('lessons', 'order_index');
      // Keep only this course's lessons (fetchInOrder can't filter + keep
      // per-course numbering, so filter client-side).
      const forCourse = (data || []).filter((l) => l.course_id === courseId);
      if (loadError) {
        setError('Load failed: ' + loadError.message);
        setLessons([]);
      } else {
        setLessons(forCourse);
      }
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [courseId, navigate]);

  const handleDragEnd = async (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const reordered = Array.from(lessons);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Optimistic update — feels instant.
    setLessons(reordered);

    const results = (await saveOrder('lessons', reordered, 'order_index')) || [];
    const failed = results.find((r) => r.error);
    if (failed) setError('Could not save the new order: ' + failed.error.message);
  };

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
          <p className="admin-list-subtitle">Drag the ⠿ handle to reorder — saves automatically.</p>
        </div>
        <Link to={`/admin/courses/${courseId}/lessons/new`} className="btn-new">+ New Lesson</Link>
      </header>

      {error && <div className="admin-error">❌ {error}</div>}

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : lessons.length === 0 ? (
        <p className="admin-list-empty">No lessons yet. Add one to get started.</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="lessons-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr>
                    <th className="td-sort">Sort</th>
                    <th>#</th>
                    <th>Title</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((l, index) => (
                    <Draggable key={l.id} draggableId={String(l.id)} index={index}>
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={snapshot.isDragging ? 'is-dragging' : ''}
                          style={{
                            ...provided.draggableProps.style,
                            display: snapshot.isDragging ? 'table' : 'table-row',
                          }}
                        >
                          <td className="td-sort">
                            <span className="drag-handle" {...provided.dragHandleProps} title="Drag to reorder">⠿</span>
                          </td>
                          <td>{index + 1}</td>
                          <td>{l.title}</td>
                          <td className="admin-actions">
                            <Link to={`/admin/courses/${courseId}/lessons/edit/${l.id}`} className="btn-edit">Edit</Link>
                            <button onClick={() => handleDelete(l.id)} className="btn-delete">Delete</button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}

export default AdminLessonsList;
