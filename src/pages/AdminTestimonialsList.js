import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import { fetchInOrder, saveOrder } from '../lib/fetchOrdered';
import './AdminTestimonialsList.css';

function AdminTestimonialsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate('/admin'); return; }

        const { data, error: loadError } = await fetchInOrder('testimonials', 'order_index');
        if (loadError) setError('Load failed: ' + loadError.message);
        else setItems(data || []);
      } catch (err) {
        setError('Load failed: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    checkAuthAndLoad();
  }, [navigate]);

  const handleDragEnd = async (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Optimistic update — feels instant.
    setItems(reordered);

    const results = (await saveOrder('testimonials', reordered, 'order_index')) || [];
    const failed = results.find((r) => r.error);
    if (failed) setError('Could not save the new order: ' + failed.error.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setItems((prev) => prev.filter(i => i.id !== id));
  };

  const preview = (quote) => {
    const text = (quote || '').trim();
    if (!text) return '—';
    return text.length > 80 ? `${text.substring(0, 80)}…` : text;
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Testimonials</h1>
          <p className="admin-list-subtitle">Drag the ⠿ handle to reorder — saves automatically.</p>
        </div>
        <Link to="/admin/testimonials/new" className="btn-new">+ New Testimonial</Link>
      </header>

      {error && <div className="admin-error">❌ {error}</div>}

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : items.length === 0 ? (
        <p className="admin-list-empty">No testimonials yet.</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="testimonials-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr>
                    <th className="td-sort">Sort</th>
                    <th>Name</th>
                    <th>Quote preview</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t, index) => (
                    <Draggable key={t.id} draggableId={String(t.id)} index={index}>
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
                          <td>{t.name}</td>
                          <td style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {preview(t.quote)}
                          </td>
                          <td className="admin-actions">
                            <Link to={`/admin/testimonials/edit/${t.id}`} className="btn-edit">Edit</Link>
                            <button onClick={() => handleDelete(t.id)} className="btn-delete">Delete</button>
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

export default AdminTestimonialsList;
