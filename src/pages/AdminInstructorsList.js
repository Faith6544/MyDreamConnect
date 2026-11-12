import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import { saveOrder } from '../lib/fetchOrdered';
import './AdminInstructorsList.css';

function AdminInstructorsList() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchInstructors(); }, []);

  const fetchInstructors = async () => {
    // NOTE: the `instructors` table sorts on `order_index` (that is also
    // what the Home page reads). Using `display_order` here silently
    // broke this page before.
    const { data, error } = await supabase.from('instructors').select('*').order('order_index', { ascending: true });
    if (error) setError('Load failed: ' + error.message);
    setInstructors(data || []);
    setLoading(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const reordered = Array.from(instructors);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Optimistic update — feels instant.
    setInstructors(reordered);

    const results = (await saveOrder('instructors', reordered, 'order_index')) || [];
    const failed = results.find((r) => r.error);
    if (failed) setError('Could not save the new order: ' + failed.error.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this instructor?')) return;
    await supabase.from('instructors').delete().eq('id', id);
    fetchInstructors();
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Instructors</h1>
          <p className="admin-list-subtitle">Drag the ⠿ handle to reorder — saves automatically.</p>
        </div>
        <Link to="/admin/instructors/new" className="btn-new">+ Add Instructor</Link>
      </header>

      {error && <div className="admin-error">❌ {error}</div>}

      {loading ? <p className="admin-list-loading">Loading...</p> : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="instructors-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr>
                    <th className="td-sort">Sort</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map((inst, index) => (
                    <Draggable key={inst.id} draggableId={String(inst.id)} index={index}>
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
                          <td><img src={inst.image_url} alt="" className="instructor-row-photo" loading="lazy" /></td>
                          <td>{inst.name}</td>
                          <td>{inst.role}</td>
                          <td className="admin-actions">
                            <Link to={`/admin/instructors/edit/${inst.id}`} className="btn-edit">Edit</Link>
                            <button onClick={() => handleDelete(inst.id)} className="btn-delete">Delete</button>
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
export default AdminInstructorsList;
