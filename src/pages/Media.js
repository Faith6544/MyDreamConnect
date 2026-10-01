import React, { useState } from 'react';
import './Media.css';

function Media() {
  const [activeTab, setActiveTab] = useState('photos');

  // Photo albums — matching the original Photos page
  const albums = [
    {
      id: 1,
      title: '2023 Summer Holiday Empowerment Programme Graduation, Ota',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/2023_Summer_Holiday_Empowerment_Programme_Graduation_Ota/thumb/IMG_20230909_130321_064.jpg?bwg=1707501756',
    },
    {
      id: 2,
      title: "KC Smart Leaders' Club Engagement on February 3, 2024",
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/KC_Smart_Leaders_Club_Engagement_on_February_3_2024/Photos/thumb/IMG_20240203_131445_056.jpg?bwg=1707389582',
    },
    {
      id: 3,
      title: '2023 End of the Year Event @Egbeda Office',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/2023_End_of_the_Year_Event_@Egbeda_Office/thumb/IMG_20231230_132600_413.jpg?bwg=1707391077',
    },
    {
      id: 4,
      title: 'Social Tuesday Clinic on 21 November, 2023',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/Social_Tuesday_Clinic_on_21_November_2023/thumb/IMG_20231121_163109_178.jpg?bwg=1707501118',
    },
    {
      id: 5,
      title: '2023 BACK TO SCHOOL Preparation',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/2023_BACK_TO_SCHOOL_Preparation/thumb/IMG_20230905_100936_978.jpg?bwg=1707502106',
    },
    {
      id: 6,
      title: '2023 Summer Code Camp Graduation, Egbeda',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/2023_Summer_Code_Camp_Graduation_Egbeda/thumb/IMG_20230902_115825_200.jpg?bwg=1707502375',
    },
    {
      id: 7,
      title: 'During The 2023 Code Camp Programme',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/During_The_2023_Code_Camp_Programme/thumb/IMG_20230804_095306_947.jpg?bwg=1707503009',
    },
    {
      id: 8,
      title: '2023 Summer Holiday Empowerment Programme, Ota',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/2023_Summer_Holiday_Empowerment_Programme_Ota/thumb/IMG_20230822_130703_058.jpg?bwg=1707503468',
    },
    {
      id: 9,
      title: 'Classroom Test',
      cover: 'https://mydreamconnect.org.ng/wp-content/uploads/photo-gallery/thumb/umbrella.jpg?bwg=1716397771',
    },
  ];

  // Videos — with the real YouTube IDs from the original page
  const videos = [
    { id: 1, videoId: 'veNoD_5rvvw', title: '2023 Summer Holiday Empowerment Programme (SHEP) Graduation, Ota.', duration: '03:02' },
    { id: 2, videoId: '0ARpJF5TcHg', title: 'MyDreamConnect CodeCamp2023: Students review.', duration: '03:46' },
    { id: 3, videoId: 'x0jjWG_u89I', title: 'MyDreamConnect CodeCamp2023: Life skills Session 3', duration: '01:44' },
    { id: 4, videoId: 'tP4DY03TZ_0', title: 'MyDreamConnect CodeCamp2023: Life skills session2', duration: '01:30' },
    { id: 5, videoId: '9u40RI9rO9c', title: 'MyDreamConnect CodeCamp2023: Life skills session1', duration: '' },
  ];

  // Sidebar data — matching the original
  const recentPosts = [
    'Call for Proposals: Global Youth Action Fund 2026',
    'FORTIFIED 2025: TECH Powered, FORTIFIED for Success Impact Report',
    'Register',
    "I Want to Learn Tech, But I Don't Know Where to Start",
    "Why Learning to Code This Holiday Could Be the Smartest Decision for Your Child's Future",
  ];

  const recentComments = [
    { author: 'MyDreamConnect', post: 'Hello June!' },
    { author: 'Tinuola Ameh', post: 'Hello June!' },
    { author: 'MyDreamConnect', post: 'Emotional Intelligence Has 12 Elements' },
    { author: 'Elvis Boateng', post: 'Emotional Intelligence Has 12 Elements' },
    { author: 'Yetunde Macaulay', post: 'PIXELS & PROGRAMS' },
  ];

  const archives = [
    'January 2026', 'December 2025', 'October 2025', 'August 2025', 'July 2025',
    'June 2025', 'May 2025', 'April 2025', 'March 2025', 'February 2025',
    'May 2024', 'March 2024', 'February 2024', 'January 2024', 'December 2023',
    'October 2023', 'July 2023', 'October 2022', 'September 2022', 'August 2022',
    'July 2022', 'June 2022',
  ];

  const categories = [
    'Blogs', 'Digital Information', 'Health & Wellness', 'News & Events',
    'OPPORTUNITIES FOR DEVELOPMENT', 'Personal Development', 'Wellness',
  ];

  return (
    <div className="media-page">

      {/* Banner */}
      <section className="media-banner">
        <h1>{activeTab === 'photos' ? 'Photos' : 'Videos'}</h1>
        <p>Home / Media / {activeTab === 'photos' ? 'Photos' : 'Videos'}</p>
      </section>

      <div className="media-layout">

        {/* === MAIN CONTENT === */}
        <div className="media-content">

          {/* Tabs */}
          <div className="media-tabs">
            <button
              className={activeTab === 'photos' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('photos')}
            >
              Photos
            </button>
            <button
              className={activeTab === 'videos' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </button>
          </div>

          {/* PHOTOS TAB — Album Grid */}
          {activeTab === 'photos' && (
            <div className="media-section">
              <h3 className="media-section-title">
                My Dream Connect Event Albums
              </h3>
              <div className="albums-grid">
                {albums.map(album => (
                  <div className="album-card" key={album.id}>
                    <div className="album-image">
                      <img src={album.cover} alt={album.title} />
                      <div className="album-overlay">
                        <span>View Album</span>
                      </div>
                    </div>
                    <h4 className="album-title">{album.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIDEOS TAB — Video Grid */}
          {activeTab === 'videos' && (
            <div className="media-section">
              <h3 className="media-section-title">
                My Dream Connect Event Videos
              </h3>
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
            </div>
          )}
        </div>

        {/* === SIDEBAR === */}
        <aside className="media-sidebar">

          <div className="widget">
            <h3>Search</h3>
            <form className="sidebar-search" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="" />
              <button type="submit">Search</button>
            </form>
          </div>

          <div className="widget">
            <h3>Recent Posts</h3>
            <ul className="widget-list">
              {recentPosts.map((post, i) => (
                <li key={i}><a href="/blog">{post}</a></li>
              ))}
            </ul>
          </div>

          <div className="widget">
            <h3>Recent Comments</h3>
            <ul className="widget-list comments-list">
              {recentComments.map((c, i) => (
                <li key={i}>
                  <strong>{c.author}</strong> on <a href="/blog">{c.post}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="widget">
            <h3>Archives</h3>
            <ul className="widget-list">
              {archives.map((a, i) => (
                <li key={i}><a href="/blog">{a}</a></li>
              ))}
            </ul>
          </div>

          <div className="widget">
            <h3>Categories</h3>
            <ul className="widget-list">
              {categories.map((c, i) => (
                <li key={i}><a href="/blog">{c}</a></li>
              ))}
            </ul>
          </div>

          <div className="widget">
            <h3>Subscribe</h3>
            <form className="sidebar-subscribe" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Enter your name" />
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>

        </aside>

      </div>
    </div>
  );
}

export default Media;