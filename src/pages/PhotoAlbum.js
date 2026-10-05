import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ImageWithFallback from '../components/ImageWithFallback';
import './PhotoAlbum.css';

function PhotoAlbum() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(-1); // -1 = closed

  useEffect(() => {
    const load = async () => {
      const { data: albumData } = await supabase.from('photos').select('*').eq('id', id).single();
      setAlbum(albumData);

      const { data: photoData } = await supabase
        .from('album_photos')
        .select('*')
        .eq('album_id', id)
        .order('order_index', { ascending: true });

      setPhotos(photoData || []);
      setLoading(false);
    };
    load();
  }, [id]);

  // Keyboard nav
  useEffect(() => {
    if (index < 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setIndex(-1);
      if (e.key === 'ArrowRight') setIndex(i => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft') setIndex(i => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, photos.length]);

  if (loading) return <h2 className="pa-status">Loading album...</h2>;
  if (!album) return <h2 className="pa-status">Album not found.</h2>;

  return (
    <div className="pa-page">
      <section className="pa-banner">
        <p className="pa-breadcrumb">
          <Link to="/">Home</Link> / <Link to="/media/photos">Photos</Link> / {album.title}
        </p>
        <h1>{album.title}</h1>
        {album.year && <p className="pa-year">{album.year}</p>}
      </section>

      <section className="pa-content">
        {photos.length === 0 ? (
          <p className="pa-empty">No photos in this album yet.</p>
        ) : (
          <div className="pa-grid">
            {photos.map((p, i) => (
              <div key={p.id} className="pa-thumb" onClick={() => setIndex(i)}>
                <ImageWithFallback src={p.image_url} alt={p.caption || ''} />
                {p.caption && <span className="pa-caption">{p.caption}</span>}
              </div>
            ))}
          </div>
        )}
      </section>

      {index >= 0 && photos[index] && (
        <div className="pa-lightbox" onClick={() => setIndex(-1)}>
          <button className="pa-close" onClick={() => setIndex(-1)}>×</button>

          {photos.length > 1 && (
            <button
              className="pa-nav pa-prev"
              onClick={(e) => { e.stopPropagation(); setIndex(i => (i - 1 + photos.length) % photos.length); }}
            >‹</button>
          )}

          <img
            src={photos[index].image_url}
            alt={photos[index].caption || ''}
            onClick={(e) => e.stopPropagation()}
          />

          {photos.length > 1 && (
            <button
              className="pa-nav pa-next"
              onClick={(e) => { e.stopPropagation(); setIndex(i => (i + 1) % photos.length); }}
            >›</button>
          )}

          <div className="pa-lightbox-info">
            {photos[index].caption && <p>{photos[index].caption}</p>}
            <span>{index + 1} / {photos.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoAlbum;