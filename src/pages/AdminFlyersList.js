import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import './AdminFlyersList.css';

function AdminFlyersList() {
  const [Flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlyers();
  }, []);

  const fetchFlyers = async () => {
    const { data, error } = await supabase
      .from('Flyers')
      .select('*')
      .order('display_order', { ascending: true }); // Sort by our custom order

    if (error) console.error(error);
    else setFlyers(data || []);
    setLoading(false);
  };

  // Handle the Drag & Drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return; // Dropped outside the list
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // 1. Instantly reorder the UI (so it feels fast)
    const reorderedItems = Array.from(Flyers);
    const [movedItem] = reorderedItems.splice(sourceIndex, 1);
    reorderedItems.splice(destinationIndex, 0, movedItem);
    
    setFlyers(reorderedItems);

    // 2. Save the new order to Supabase in the background
    const updates = reorderedItems.map((item, index) => ({
      id: item.id,
      display_order: index + 1,
    }));

    // We loop through and update each row's display_order
    for (const update of updates) {
      await supabase
        .from('Flyers')
        .update({ display_order: update.display_order })
        .eq('id', update.id);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    const { error } = await supabase.from('Flyers').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else fetchFlyers();
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Flyers</h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
            Click and hold the <strong>⠿</strong> icon to drag and reorder Flyers. Changes save automatically.
          </p>
        </div>
        <Link to="/admin/Flyers/new" className="btn-new">+ Add Course</Link>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : Flyers.length === 0 ? (
        <p>No Flyers found.</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="Flyers-list">
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
                  {Flyers.map((course, index) => (
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
                            <Link to={`/admin/Flyers/edit/${course.id}`} className="btn-edit">Edit</Link>
                            <Link to={`/admin/Flyers/${course.id}/lessons`} className="btn-edit" style={{ color: '#0a4711' }}>Lessons</Link>
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

export default AdminFlyersList;