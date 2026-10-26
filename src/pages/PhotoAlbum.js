import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ImageWithFallback from '../components/ImageWithFallback';
import './PhotoAlbum.css';

function PhotoAlbum() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbumData = async () => {
      // 1. Fetch album details
      const { data: albumData } = await supabase
        .from('photos')
        .select('*')
        .eq('id', id)
        .single();
      
      setAlbum(albumData);

      // 2. Fetch photos belonging to this album
      const { data: photosData } = await supabase
        .from('album_photos')
        .select('*')
        .eq('album_id', id)
        .order('created_at', { ascending: false });

      setPhotos(photosData || []);
      setLoading(false);
    };

    fetchAlbumData();
  }, [id]);

  if (loading) return <h2 className="pa-status">Loading album...</h2>;
  if (!album) return <h2 className="pa-status">Album not found.</h2>;

  return (
    <div className="pa-page">
      <div className="pa-container">
        
        {/* Clean Breadcrumb & Title (No Banner) */}
        <p className="pa-breadcrumb">
          <Link to="/">Home</Link> / <Link to="/media/photos">Photos</Link> / {album.title}
        </p>
        <h1 className="pa-title">{album.title}</h1>

        {/* Photo Grid */}
        {photos.length === 0 ? (
          <div className="pa-empty">
            <p>No photos in this album yet.</p>
          </div>
        ) : (
          <div className="pa-grid">
            {photos.map((photo) => (
              <div className="pa-photo-card" key={photo.id}>
                <a href={photo.image_url} target="_blank" rel="noopener noreferrer">
                  <ImageWithFallback src={photo.image_url} alt="Album photo" />
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="pa-back-wrapper">
          <Link to="/media/photos" className="pa-back-btn">
            ← Back to All Albums
          </Link>
        </div>

      </div>
    </div>
  );
}

export default PhotoAlbum;