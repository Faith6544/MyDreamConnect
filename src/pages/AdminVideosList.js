import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import './AdminVideosList.css';

function AdminVideosList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchVideos(); }, []);

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('display_order', { ascending: true });
    setVideos(data || []);
    setLoading(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(videos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setVideos(items);
    for (let i = 0; i < items.length; i++) {
      await supabase.from('videos').update({ display_order: i + 1 }).eq('id', items[i].id);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    await supabase.from('videos').delete().eq('id', id);
    fetchVideos();
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Videos</h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Drag to reorder videos.</p>
        </div>
        <Link to="/admin/videos/new" className="btn-new">+ Add Video</Link>
      </header>
      {loading ? <p>Loading...</p> : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="videos-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead><tr><th style={{ width: '60px' }}>Sort</th><th>Title</th><th>URL</th><th>Actions</th></tr></thead>
                <tbody>
                  {videos.map((video, index) => (
                    <Draggable key={video.id} draggableId={String(video.id)} index={index}>
                      {(provided, snapshot) => (
                        <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style, background: snapshot.isDragging ? '#f0fdf4' : '#fff', display: snapshot.isDragging ? 'table' : 'table-row' }}>
                          <td style={{ fontSize: '20px', color: '#aaa', cursor: 'grab' }}>⠿</td>
                          <td>{video.title}</td>
                          <td>{video.video_url?.substring(0, 30)}...</td>
                          <td className="admin-actions">
                            <Link to={`/admin/videos/edit/${video.id}`} className="btn-edit">Edit</Link>
                            <button onClick={() => handleDelete(video.id)} className="btn-delete">Delete</button>
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
export default AdminVideosList;