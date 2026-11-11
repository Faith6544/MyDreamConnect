import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import { fetchInOrder, saveOrder } from '../lib/fetchOrdered';
import './AdminOpportunitiesList.css';

function AdminOpportunitiesList() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchOpportunities(); }, []);

  const fetchOpportunities = async () => {
    // The `opportunities` table needs the `display_order` column (see
    // supabase/migrations/20261111000000_add_display_order_columns.sql).
    // Until that migration runs, this gracefully falls back to
    // newest-first instead of showing an empty page.
    const { data, error } = await fetchInOrder('opportunities');
    if (error) setError('Load failed: ' + error.message);
    setOpportunities(data || []);
    setLoading(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const reordered = Array.from(opportunities);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Optimistic update — feels instant.
    setOpportunities(reordered);

    const results = (await saveOrder('opportunities', reordered)) || [];
    const failed = results.find((r) => r.error);
    if (failed) {
      setError(
        'Could not save the new order. Make sure the `display_order` migration ' +
        '(supabase/migrations/20261111000000_add_display_order_columns.sql) has been run.'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this opportunity?')) return;
    const { error } = await supabase.from('opportunities').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else fetchOpportunities();
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Opportunities</h1>
          <p className="admin-list-subtitle">Drag the ⠿ handle to reorder — saves automatically.</p>
        </div>
        <Link to="/admin/opportunities/new" className="btn-new">+ Add Opportunity</Link>
      </header>

      {error && <div className="admin-error">❌ {error}</div>}

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : opportunities.length === 0 ? (
        <p className="admin-list-empty">No opportunities found.</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="opportunities-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr>
                    <th className="td-sort">Sort</th>
                    <th>Title</th>
                    <th>Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((opp, index) => (
                    <Draggable key={opp.id} draggableId={String(opp.id)} index={index}>
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
                          <td>{opp.title}</td>
                          <td>
                            {opp.url ? (
                              <a href={opp.url} target="_blank" rel="noreferrer" className="table-link">
                                {opp.url.substring(0, 34)}…
                              </a>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="admin-actions">
                            <Link to={`/admin/opportunities/edit/${opp.id}`} className="btn-edit">Edit</Link>
                            <button onClick={() => handleDelete(opp.id)} className="btn-delete">Delete</button>
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

export default AdminOpportunitiesList;
