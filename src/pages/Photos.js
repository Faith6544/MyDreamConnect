import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Photos.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

function Photos() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('year', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error) setAlbums(data || []);
      setLoading(false);
    };
    fetchAlbums();
  }, []);

  // Group albums by year
  const grouped = albums.reduce((acc, album) => {
    const y = album.year || 'Undated';
    if (!acc[y]) acc[y] = [];
    acc[y].push(album);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => {
    if (a === 'Undated') return 1;
    if (b === 'Undated') return -1;
    return Number(b) - Number(a);
  });

  return (
    <div className="photos-page">
      <section className="photos-banner">
        <h1>Photos</h1>
        <p>Home / Media / Photos</p>
      </section>

      <section className="photos-section">
        <h2 className="photos-section-title">My Dream Connect Event Albums</h2>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
        ) : years.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>No albums yet.</p>
        ) : (
          years.map(year => (
            <div key={year} className="year-group">
              <h3 className="year-heading">{year}</h3>
              <div className="albums-grid">
                {grouped[year].map(album => (
                  <Link to={`/media/photos/${album.id}`} className="album-card" key={album.id}>
                    <div className="album-image">
                      <ImageWithFallback src={album.cover_url} alt={album.title} />
                      <div className="album-overlay">
                        <span>View Album</span>
                      </div>
                    </div>
                    <h4 className="album-title">{album.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Photos;