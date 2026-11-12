import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import { fetchInOrder, saveOrder } from '../lib/fetchOrdered';
import './AdminFlyersList.css';

function AdminFlyersList() {
  const [flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      // Needs the `display_order` column — see
      // supabase/migrations/20261111000000_add_display_order_columns.sql.
      // Falls back to newest-first until that migration runs.
      const { data, error: loadError } = await fetchInOrder('flyers');
      if (loadError) setError('Load failed: ' + loadError.message);
      setFlyers(data || []);
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [navigate]);

  const handleDragEnd = async (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const reordered = Array.from(flyers);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Optimistic update — feels instant.
    setFlyers(reordered);

    const results = (await saveOrder('flyers', reordered)) || [];
    const failed = results.find((r) => r.error);
    if (failed) {
      setError(
        'Could not save the new order. Make sure the `display_order` migration ' +
        '(supabase/migrations/20261111000000_add_display_order_columns.sql) has been run.'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flyer?')) return;
    const { error } = await supabase.from('flyers').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setFlyers(flyers.filter(f => f.id !== id));
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Flyers</h1>
          <p className="admin-list-subtitle">Drag the ⠿ handle to reorder — saves automatically.</p>
        </div>
        <Link to="/admin/flyers/new" className="btn-new">+ New Flyer</Link>
      </header>

      {error && <div className="admin-error">❌ {error}</div>}

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : flyers.length === 0 ? (
        <p className="admin-list-empty">No flyers yet.</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="flyers-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr>
                    <th className="td-sort">Sort</th>
                    <th>Flyer</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flyers.map((f, index) => (
                    <Draggable key={f.id} draggableId={String(f.id)} index={index}>
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
                          <td>
                            {f.image_url && (
                              <img src={f.image_url} alt="" className="flyer-row-thumb" loading="lazy" />
                            )}
                          </td>
                          <td>{f.title}</td>
                          <td>{f.category || '—'}</td>
                          <td className="admin-actions">
                            <Link to={`/admin/flyers/edit/${f.id}`} className="btn-edit">Edit</Link>
                            <button onClick={() => handleDelete(f.id)} className="btn-delete">Delete</button>
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
