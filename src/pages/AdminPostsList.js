import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import { saveOrder } from '../lib/fetchOrdered';
import './AdminPostsList.css';

function AdminPostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*').order('display_order', { ascending: true });
    if (error) setError('Load failed: ' + error.message);
    setPosts(data || []);
    setLoading(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const reordered = Array.from(posts);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Optimistic update — feels instant.
    setPosts(reordered);

    const results = (await saveOrder('posts', reordered)) || [];
    const failed = results.find((r) => r.error);
    if (failed) setError('Could not save the new order: ' + failed.error.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Blog Posts</h1>
          <p className="admin-list-subtitle">Drag the ⠿ handle to reorder — saves automatically.</p>
        </div>
        <Link to="/admin/posts/new" className="btn-new">+ New Post</Link>
      </header>

      {error && <div className="admin-error">❌ {error}</div>}

      {loading ? <p className="admin-list-loading">Loading...</p> : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="posts-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr>
                    <th className="td-sort">Sort</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, index) => (
                    <Draggable key={post.id} draggableId={String(post.id)} index={index}>
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
                          <td>{post.title}</td>
                          <td>{new Date(post.created_at).toLocaleDateString()}</td>
                          <td className="admin-actions">
                            <Link to={`/admin/posts/edit/${post.id}`} className="btn-edit">Edit</Link>
                            <button onClick={() => handleDelete(post.id)} className="btn-delete">Delete</button>
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
export default AdminPostsList;
