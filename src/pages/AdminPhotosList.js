import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import './AdminPhotosList.css';

function AdminPhotosList() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPhotos(); }, []);

  const fetchPhotos = async () => {
    const { data } = await supabase.from('photos').select('*').order('display_order', { ascending: true });
    setPhotos(data || []);
    setLoading(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPhotos(items);
    for (let i = 0; i < items.length; i++) {
      await supabase.from('photos').update({ display_order: i + 1 }).eq('id', items[i].id);
    }
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
          <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Drag to reorder photos.</p>
        </div>
        <Link to="/admin/photos/new" className="btn-new">+ Add Photo</Link>
      </header>
      {loading ? <p>Loading...</p> : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="photos-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead><tr><th style={{ width: '60px' }}>Sort</th><th>Image</th><th>Title</th><th>Actions</th></tr></thead>
                <tbody>
                  {photos.map((photo, index) => (
                    <Draggable key={photo.id} draggableId={String(photo.id)} index={index}>
                      {(provided, snapshot) => (
                        <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style, background: snapshot.isDragging ? '#f0fdf4' : '#fff', display: snapshot.isDragging ? 'table' : 'table-row' }}>
                          <td style={{ fontSize: '20px', color: '#aaa', cursor: 'grab' }}>⠿</td>
                          <td><img src={photo.image_url} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /></td>
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