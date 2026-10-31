import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import './AdminPostsList.css';

function AdminPostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('display_order', { ascending: true });
    setPosts(data || []);
    setLoading(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(posts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPosts(items);
    for (let i = 0; i < items.length; i++) {
      await supabase.from('posts').update({ display_order: i + 1 }).eq('id', items[i].id);
    }
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
          <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Drag to reorder posts.</p>
        </div>
        <Link to="/admin/posts/new" className="btn-new">+ New Post</Link>
      </header>
      {loading ? <p>Loading...</p> : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="posts-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead><tr><th style={{ width: '60px' }}>Sort</th><th>Title</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {posts.map((post, index) => (
                    <Draggable key={post.id} draggableId={String(post.id)} index={index}>
                      {(provided, snapshot) => (
                        <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style, background: snapshot.isDragging ? '#f0fdf4' : '#fff', display: snapshot.isDragging ? 'table' : 'table-row' }}>
                          <td style={{ fontSize: '20px', color: '#aaa', cursor: 'grab' }}>⠿</td>
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