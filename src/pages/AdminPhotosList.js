import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import { saveOrder } from '../lib/fetchOrdered';
import './AdminPhotosList.css';

function AdminPhotosList() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchPhotos(); }, []);

  const fetchPhotos = async () => {
    const { data, error } = await supabase.from('photos').select('*').order('display_order', { ascending: true });
    if (error) setError('Load failed: ' + error.message);
    setPhotos(data || []);
    setLoading(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const reordered = Array.from(photos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Optimistic update — feels instant.
    setPhotos(reordered);

    const results = (await saveOrder('photos', reordered)) || [];
    const failed = results.find((r) => r.error);
    if (failed) setError('Could not save the new order: ' + failed.error.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    await supabase.from('photos').delete().eq('id', id);
    fetchPhotos();
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Manage Photos</h1>
          <p className="admin-list-subtitle">Drag the ⠿ handle to reorder — saves automatically.</p>
        </div>
        <Link to="/admin/photos/new" className="btn-new">+ Add Photo</Link>
      </header>

      {error && <div className="admin-error">❌ {error}</div>}

      {loading ? <p className="admin-list-loading">Loading...</p> : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="photos-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr>
                    <th className="td-sort">Sort</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {photos.map((photo, index) => (
                    <Draggable key={photo.id} draggableId={String(photo.id)} index={index}>
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
                          <td><img src={photo.image_url} alt="" className="photo-row-thumb" loading="lazy" /></td>
                          <td>{photo.title || 'Untitled'}</td>
                          <td className="admin-actions">
                            <Link to={`/admin/photos/edit/${photo.id}`} className="btn-edit">Edit</Link>
                            <button onClick={() => handleDelete(photo.id)} className="btn-delete">Delete</button>
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
export default AdminPhotosList;
