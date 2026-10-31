import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminCoursesList.css';
import { useSortableList } from '../hooks/useSortableList';

function AdminCoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    // Fetch ordered by the new display_order column
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) console.error(error);
    else setCourses(data || []);
    setLoading(false);
  };

  // USE THE REUSABLE HOOK HERE (This replaces all the manual code)
  const { moveUp, moveDown } = useSortableList('courses', courses, setCourses);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else fetchCourses(); // Refresh list after delete to fix order
  };

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Courses</h1>
        </div>
        <Link to="/admin/courses/new" className="btn-new">+ Add Course</Link>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Order</th>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course.id}>
                
                {/* UP/DOWN BUTTONS */}
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button 
                      onClick={() => moveUp(index)} 
                      disabled={index === 0}
                      style={{ padding: '5px 10px', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => moveDown(index)} 
                      disabled={index === courses.length - 1}
                      style={{ padding: '5px 10px', cursor: index === courses.length - 1 ? 'not-allowed' : 'pointer', opacity: index === courses.length - 1 ? 0.3 : 1 }}
                    >
                      ↓
                    </button>
                  </div>
                </td>

                <td>{course.name}</td>
                <td>{course.price ? `₦${Number(course.price).toLocaleString()}` : 'Free'}</td>
                
                <td className="admin-actions">
                  <Link to={`/admin/courses/edit/${course.id}`} className="btn-edit">Edit</Link>
                  <Link to={`/admin/courses/${course.id}/lessons`} className="btn-edit" style={{ color: '#0a4711' }}>Lessons</Link>
                  <button onClick={() => handleDelete(course.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminCoursesList;