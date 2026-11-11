import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import { fetchInOrder, saveOrder } from '../lib/fetchOrdered';
import './AdminVideosList.css';

function AdminVideosList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchVideos(); }, []);

  const fetchVideos = async () => {
    // The `videos` table needs the `display_order` column (see
    // supabase/migrations/20261111000000_add_display_order_columns.sql).
    // Until that migration runs, this gracefully falls back to
    // newest-first instead of showing an empty page.
    const { data, error } = await fetchInOrder('videos');
    if (error) setError('Load failed: ' + error.message);
    setVideos(data || []);
    setLoading(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const reordered = Array.from(videos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Optimistic update — feels instant.
    setVideos(reordered);

    const results = (await saveOrder('videos', reordered)) || [];
    const failed = results.find((r) => r.error);
    if (failed) {
      setError(
        'Could not save the new order. Make sure the `display_order` migration ' +
        '(supabase/migrations/20261111000000_add_display_order_columns.sql) has been run.'
      );
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
          <p className="admin-list-subtitle">Drag the ⠿ handle to reorder — saves automatically.</p>
        </div>
        <Link to="/admin/videos/new" className="btn-new">+ Add Video</Link>
      </header>

      {error && <div className="admin-error">❌ {error}</div>}

      {loading ? <p className="admin-list-loading">Loading...</p> : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="videos-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr>
                    <th className="td-sort">Sort</th>
                    <th>Title</th>
                    <th>URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video, index) => (
                    <Draggable key={video.id} draggableId={String(video.id)} index={index}>
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
                          <td>{video.title}</td>
                          <td>{video.video_url?.substring(0, 30) || video.youtube_id}...</td>
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
