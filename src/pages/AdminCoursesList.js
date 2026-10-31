import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import './AdminCoursesList.css';

function AdminCoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('display_order', { ascending: true });
    setCourses(data || []);
    setLoading(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(courses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCourses(items);

    // Save to Supabase
    for (let i = 0; i < items.length; i++) {
      await supabase.from('courses').update({ display_order: i + 1 }).eq('id', items[i].id);
    }
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
          <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Click and hold the <strong>⠿</strong> icon to drag and reorder.</p>
        </div>
        <Link to="/admin/courses/new" className="btn-new">+ Add Course</Link>
      </header>

      {loading ? <p>Loading...</p> : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="courses-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr><th style={{ width: '60px' }}>Sort</th><th>Name</th><th>Price</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <Draggable key={course.id} draggableId={String(course.id)} index={index}>
                      {(provided, snapshot) => (
                        <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style, background: snapshot.isDragging ? '#f0fdf4' : '#fff', display: snapshot.isDragging ? 'table' : 'table-row' }}>
                          <td style={{ fontSize: '20px', color: '#aaa', cursor: 'grab' }}>⠿</td>
                          <td>{course.name}</td>
                          <td>{course.price ? `₦${Number(course.price).toLocaleString()}` : 'Free'}</td>
                          <td className="admin-actions">
                            <Link to={`/admin/courses/edit/${course.id}`} className="btn-edit">Edit</Link>
                            <Link to={`/admin/courses/${course.id}/lessons`} className="btn-edit" style={{ color: '#0a4711' }}>Lessons</Link>
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