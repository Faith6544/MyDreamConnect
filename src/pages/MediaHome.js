import React from 'react';
import { Link } from 'react-router-dom';
import './MediaHome.css';

function MediaHome() {
  return (
    <div className="mh-page">

      {/* Banner */}
      <section className="mh-banner">
        <h1>Media</h1>
        <p>Home / Media</p>
      </section>

      {/* Intro */}
      <section className="mh-intro">
        <h2>Explore Our Media</h2>
        <p>
          Catch up on the moments that define us. Browse through photos and videos
          from our programs, events, and community impact.
        </p>
      </section>

      {/* Two Cards */}
      <section className="mh-cards">
        <Link to="/media/photos" className="mh-card">
          <div className="mh-card-icon">📷</div>
          <h3>Photos</h3>
          <p>Browse albums from our events, graduations, and training sessions.</p>
          <span className="mh-card-btn">View Photos →</span>
        </Link>

        <Link to="/media/videos" className="mh-card">
          <div className="mh-card-icon">🎥</div>
          <h3>Videos</h3>
          <p>Watch highlights, testimonials, and program recaps from our YouTube channel.</p>
          <span className="mh-card-btn">View Videos →</span>
        </Link>
      </section>

    </div>
  );
}

export default MediaHome;