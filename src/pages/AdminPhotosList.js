import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminPhotosList.css'; // Keep your existing css
import { useSortableList } from '../hooks/useSortableList';
function AdminPhotosList() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      // Fetch all photos, we will group them by year below
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('year', { ascending: false }); // Latest year first

      if (error) console.error(error);
      else setPhotos(data || []);
      setLoading(false);
    };
    fetchPhotos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    const { error } = await supabase.from('photos').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else setPhotos(photos.filter(p => p.id !== id));
  };

  // Group the photos by Year
  const groupedByYear = photos.reduce((acc, photo) => {
    const year = photo.year || new Date(photo.created_at).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(photo);
    return acc;
  }, {});

  // Sort the years from latest to oldest
  const sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a);

  return (
    <div className="admin-list-page">
      <header className="admin-list-header">
        <div>
          <Link to="/admin/dashboard" className="back-link">← Dashboard</Link>
          <h1>Manage Photos</h1>
        </div>
        <Link to="/admin/photos/new" className="btn-new">+ Add Photo</Link>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : sortedYears.length === 0 ? (
        <p>No photos uploaded yet.</p>
      ) : (
        sortedYears.map(year => (
          <div key={year} className="admin-year-section">
            {/* This uses the CSS classes from your global CSS */}
            <h2 className="admin-year-header">{year}</h2>
            
            <div className="admin-month-section">
              <div className="admin-items-list">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Album</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedByYear[year].map(photo => (
                      <tr key={photo.id}>
                        <td>
                          <img src={photo.image_url} alt="preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                        </td>
                        <td>{photo.title}</td>
                        <td>{photo.album_name || 'N/A'}</td>
                        <td className="admin-actions">
                          <Link to={`/admin/photos/edit/${photo.id}`} className="btn-edit">Edit</Link>
                          <button onClick={() => handleDelete(photo.id)} className="btn-delete">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminPhotosList;