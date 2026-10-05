import React, { useState, useEffect } from 'react';
import './Flyers.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

function Flyers() {
  const [flyers, setFlyers] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlyers = async () => {
      const { data, error } = await supabase
        .from('flyers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Flyers fetch error:', error);
      } else {
        setFlyers(data || []);
      }
      setLoading(false);
    };

    fetchFlyers();
  }, []);

  const categories = ['All', 'Programs', 'Courses', 'Volunteer', 'Donation', 'General'];

  const filtered = activeCategory === 'All'
    ? flyers
    : flyers.filter(f => f.category === activeCategory);

  return (
    <div className="fl-page">
      <section className="fl-banner">
        <h1>Flyers &amp; Media Resources</h1>
        <p>Home / Media / Flyers</p>
      </section>

      <section className="fl-intro">
        <h2>Download Our Flyers</h2>
        <p>
          Browse and download our official flyers to share our programs,
          courses, and events with your network, school, or community.
        </p>
      </section>

      <div className="fl-pills">
        {categories.map(cat => (
          <button
            key={cat}
            className={activeCategory === cat ? 'fl-pill active' : 'fl-pill'}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
      ) : (
        <section className="fl-grid">
          {filtered.map(flyer => (
            <div className="fl-card" key={flyer.id}>
              <div className="fl-image">
                <ImageWithFallback src={flyer.image_url} alt={flyer.title} />
              </div>
              <div className="fl-body">
                {flyer.category && <span className="fl-cat">{flyer.category}</span>}
                <h3>{flyer.title}</h3>
                <p>{flyer.description}</p>
                {flyer.pdf_url && (
                  <a
                    href={flyer.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="fl-btn"
                  >
                    ⬇ Download Flyer
                  </a>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {!loading && filtered.length === 0 && (
        <p className="fl-empty">No flyers in this category yet.</p>
      )}

      <section className="fl-cta">
        <h2>Need a Custom Flyer?</h2>
        <p>Want a flyer for a specific event or program? Contact our media team.</p>
        <a href="mailto:info@mydreamconnect.org.ng" className="fl-cta-btn">
          Request a Flyer
        </a>
      </section>
    </div>
  );
}

export default Flyers;