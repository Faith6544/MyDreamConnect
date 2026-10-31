import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import './AdminInstructorsList.css';

function AdminInstructorsList() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchInstructors(); }, []);

  const fetchInstructors = async () => {
    const { data } = await supabase.from('instructors').select('*').order('display_order', { ascending: true });
    setInstructors(data || []);
    setLoading(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(instructors);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setInstructors(items);
    for (let i = 0; i < items.length; i++) {
      await supabase.from('instructors').update({ display_order: i + 1 }).eq('id', items[i].id);
    }
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
          <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Drag to reorder instructors.</p>
        </div>
        <Link to="/admin/instructors/new" className="btn-new">+ Add Instructor</Link>
      </header>
      {loading ? <p>Loading...</p> : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="instructors-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead><tr><th style={{ width: '60px' }}>Sort</th><th>Image</th><th>Name</th><th>Role</th><th>Actions</th></tr></thead>
                <tbody>
                  {instructors.map((inst, index) => (
                    <Draggable key={inst.id} draggableId={String(inst.id)} index={index}>
                      {(provided, snapshot) => (
                        <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style, background: snapshot.isDragging ? '#f0fdf4' : '#fff', display: snapshot.isDragging ? 'table' : 'table-row' }}>
                          <td style={{ fontSize: '20px', color: '#aaa', cursor: 'grab' }}>⠿</td>
                          <td><img src={inst.image_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} /></td>
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