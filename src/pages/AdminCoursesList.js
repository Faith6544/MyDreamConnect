import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import './AdminCoursesList.css';

function AdminCoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('display_order', { ascending: true }); // Sort by our custom order

    if (error) console.error(error);
    else setCourses(data || []);
    setLoading(false);
  };

  // Handle the Drag & Drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return; // Dropped outside the list
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // 1. Instantly reorder the UI (so it feels fast)
    const reorderedItems = Array.from(courses);
    const [movedItem] = reorderedItems.splice(sourceIndex, 1);
    reorderedItems.splice(destinationIndex, 0, movedItem);
    
    setCourses(reorderedItems);

    // 2. Save the new order to Supabase in the background
    const updates = reorderedItems.map((item, index) => ({
      id: item.id,
      display_order: index + 1,
    }));

    // We loop through and update each row's display_order
    for (const update of updates) {
      await supabase
        .from('courses')
        .update({ display_order: update.display_order })
        .eq('id', update.id);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else fetchCourses();
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Courses</h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
            Click and hold the <strong>⠿</strong> icon to drag and reorder courses. Changes save automatically.
          </p>
        </div>
        <Link to="/admin/courses/new" className="btn-new">+ Add Course</Link>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="courses-list">
            {(provided) => (
              <table 
                className="admin-table" 
                {...provided.droppableProps} 
                ref={provided.innerRef}
              >
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Sort</th>
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
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            background: snapshot.isDragging ? '#f0fdf4' : '#fff', // Highlight when dragging
                            boxShadow: snapshot.isDragging ? '0 5px 15px rgba(0,0,0,0.1)' : 'none',
                            display: snapshot.isDragging ? 'table' : 'table-row', // Fixes table row dragging
                          }}
                        >
                          <td style={{ fontSize: '20px', color: '#aaa', cursor: 'grab' }}>
                            ⠿ {/* This is the drag handle icon */}
                          </td>
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