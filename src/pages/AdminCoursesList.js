import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import { saveOrder } from '../lib/fetchOrdered';
import './AdminCoursesList.css';

function AdminCoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase.from('courses').select('*').order('display_order', { ascending: true });
    if (error) setError('Load failed: ' + error.message);
    setCourses(data || []);
    setLoading(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const reordered = Array.from(courses);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Optimistic update — feels instant.
    setCourses(reordered);

    // Persist only the rows whose position actually changed.
    const results = (await saveOrder('courses', reordered)) || [];
    const failed = results.find((r) => r.error);
    if (failed) setError('Could not save the new order: ' + failed.error.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    await supabase.from('courses').delete().eq('id', id);
    fetchCourses();
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Courses</h1>
          <p className="admin-list-subtitle">Drag the ⠿ handle to reorder — saves automatically.</p>
        </div>
        <Link to="/admin/courses/new" className="btn-new">+ Add Course</Link>
      </header>

      {error && <div className="admin-error">❌ {error}</div>}

      {loading ? <p className="admin-list-loading">Loading...</p> : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="courses-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr>
                    <th className="td-sort">Sort</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <Draggable key={course.id} draggableId={String(course.id)} index={index}>
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
                          <td>{course.name}</td>
                          <td>{course.price ? `₦${Number(course.price).toLocaleString()}` : 'Free'}</td>
                          <td className="admin-actions">
                            <Link to={`/admin/courses/edit/${course.id}`} className="btn-edit">Edit</Link>
                            <Link to={`/admin/courses/${course.id}/lessons`} className="btn-edit">Lessons</Link>
                            <button onClick={() => handleDelete(course.id)} className="btn-delete">Delete</button>
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
export default AdminCoursesList;
