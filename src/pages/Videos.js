import React from 'react';
import './Videos.css';

function Videos() {
  const videos = [
    { id: 1, videoId: 'veNoD_5rvvw', title: '2023 Summer Holiday Empowerment Programme (SHEP) Graduation, Ota.', duration: '03:02' },
    { id: 2, videoId: '0ARpJF5TcHg', title: 'MyDreamConnect CodeCamp2023: Students review.', duration: '03:46' },
    { id: 3, videoId: 'x0jjWG_u89I', title: 'MyDreamConnect CodeCamp2023: Life skills Session 3', duration: '01:44' },
    { id: 4, videoId: 'tP4DY03TZ_0', title: 'MyDreamConnect CodeCamp2023: Life skills session2', duration: '01:30' },
    { id: 5, videoId: '9u40RI9rO9c', title: 'MyDreamConnect CodeCamp2023: Life skills session1', duration: '' },
  ];

  return (
    <div className="videos-page">

      {/* Banner */}
      <section className="videos-banner">
        <h1>Videos</h1>
        <p>Home / Media / Videos</p>
      </section>

      {/* Videos */}
      <section className="videos-section">
        <h2 className="videos-section-title">My Dream Connect Event Videos</h2>
        <p className="video-count">{videos.length} videos found</p>
        <div className="videos-grid">
          {videos.map(video => (
            <div className="video-item" key={video.id}>
              <div className="video-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}`}
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
      </section>

    </div>
  );
}

export default Videos;