import React, { useState, useEffect } from 'react';
import './Videos.css';
import { supabase } from '../lib/supabase';

function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      // Change the .order() part to sort by year, then created_at
const { data, error } = await supabase
  .from('photos')
  .select('*')
  .order('year', { ascending: false }) // Newest year first
  .order('created_at', { ascending: false }); // If same year, newest upload first

      if (error) {
        console.error('Videos fetch error:', error);
      } else {
        setVideos(data || []);
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);

  return (
    <div className="videos-page">
      <div className="videos-container">
        
        {/* Clean Underlined Title */}
        <h1 className="videos-title">Videos</h1>
        <p className="videos-subtitle">My Dream Connect Event Videos</p>

        <section className="videos-section">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
          ) : videos.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px' }}>No videos yet.</p>
          ) : (
            <>
              <p className="video-count">{videos.length} videos found</p>
              <div className="videos-grid">
                {videos.map(video => (
                  <div className="video-item" key={video.id}>
                    <div className="video-wrapper">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.youtube_id}`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      {video.duration && (
                        <span className="video-duration">{video.duration}</span>
                      )}
                    </div>
                    <h4 className="video-title">{video.title}</h4>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Videos;