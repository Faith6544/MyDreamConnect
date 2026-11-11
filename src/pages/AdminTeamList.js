import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import './AdminTeamList.css';

function AdminTeamList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin'); return; }

      // `team_members` uses `order_index` — drag-and-drop writes it and
      // the public Team page reads it, so the order always matches.
      const { data, error: loadError } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (loadError) setError('Load failed: ' + loadError.message);
      setMembers(data || []);
      setLoading(false);
    };
    loadData();
  }, [navigate]);

  const handleDragEnd = async (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const reordered = Array.from(members);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Optimistic update — the list reacts instantly.
    setMembers(reordered);

    // Persist only the rows whose position actually changed.
    const updates = reordered
      .map((member, index) => ({ id: member.id, order_index: index + 1 }))
      .filter((update, index) => reordered[index].order_index !== update.order_index);

    const results = await Promise.all(
      updates.map((update) =>
        supabase.from('team_members').update({ order_index: update.order_index }).eq('id', update.id)
      )
    );

    const failed = results.find((r) => r.error);
    if (failed) setError('Could not save the new order: ' + failed.error.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setMembers(members.filter(m => m.id !== id));
  };

  // Quick toggle right from the list view
  const toggleHomepage = async (id, currentStatus) => {
    const { error } = await supabase
      .from('team_members')
      .update({ show_on_home: !currentStatus })
      .eq('id', id);

    if (!error) {
      setMembers(members.map(m => m.id === id ? { ...m, show_on_home: !currentStatus } : m));
    }
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Team Members</h1>
          <p className="admin-list-subtitle">Drag the ⠿ handle to reorder — saves automatically.</p>
        </div>
        <Link to="/admin/team/new" className="btn-new">+ New Member</Link>
      </header>

      {error && <div className="admin-error">❌ {error}</div>}

      {loading ? (
        <p className="admin-list-loading">Loading...</p>
      ) : members.length === 0 ? (
        <p className="admin-list-empty">No team members yet.</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="team-list">
            {(provided) => (
              <table className="admin-table" {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr>
                    <th className="td-sort">Sort</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Category</th>
                    <th>Homepage</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <Draggable key={member.id} draggableId={String(member.id)} index={index}>
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
                            <img
                              src={member.image_url}
                              alt=""
                              className="team-row-photo"
                            />
                          </td>
                          <td><strong>{member.name}</strong></td>
                          <td>{member.role}</td>
                          <td>{member.category}</td>
                          <td>
                            <button
                              onClick={() => toggleHomepage(member.id, member.show_on_home)}
                              className={`home-toggle ${member.show_on_home ? 'on' : 'off'}`}
                              title={member.show_on_home ? "Showing on Homepage" : "Hidden from Homepage"}
                            >
                              {member.show_on_home ? '✅ On homepage' : '➕ Add to homepage'}
                            </button>
                          </td>
                          <td className="admin-actions">
                            <Link to={`/admin/team/edit/${member.id}`} className="btn-edit">Edit</Link>
                            <button onClick={() => handleDelete(member.id)} className="btn-delete">Delete</button>
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

export default AdminTeamList;
