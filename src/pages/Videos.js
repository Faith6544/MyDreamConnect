import React, { useState, useEffect } from 'react';
import './Videos.css';
import { fetchInOrder } from '../lib/fetchOrdered';

function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      // Respects the admin drag-and-drop order (`display_order`). Until the
      // order-column migration runs, falls back to newest-first.
      const { data, error } = await fetchInOrder('videos');

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