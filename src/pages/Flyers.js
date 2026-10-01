import React, { useState } from 'react';
import './Flyers.css';

function Flyers() {
  const [activeCategory, setActiveCategory] = useState('All');

  // Flyers — add more here as you upload them to WordPress
  const flyers = [
    {
      id: 1,
      title: 'SHAPE Program Flyer',
      category: 'Programs',
      description: 'Promotional flyer for the SHAPE Life Skills program for teenagers.',
      image: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/2022-MyDreamConnect-MIX%20Proposal.pdf',
      pdf: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/2022-MyDreamConnect-MIX%20Proposal.pdf',
    },
    {
      id: 2,
      title: 'STAR Tech Training Flyer',
      category: 'Programs',
      description: 'Tech, digital, and leadership training flyer.',
      image: '',
      pdf: '#',
    },
    {
      id: 3,
      title: 'MIX Women Empowerment Flyer',
      category: 'Programs',
      description: 'Women empowerment and digital skills flyer.',
      image: '',
      pdf: '#',
    },
    {
      id: 4,
      title: 'BACK TO SCHOOL Support Flyer',
      category: 'Programs',
      description: 'Back to School Support Initiative flyer.',
      image: '',
      pdf: '#',
    },
    {
      id: 5,
      title: 'TECH Bootcamp Cohort Flyer',
      category: 'Courses',
      description: 'Recruitment flyer for the TECH Bootcamp cohort.',
      image: '',
      pdf: '#',
    },
    {
      id: 6,
      title: 'Volunteer Recruitment Flyer',
      category: 'Volunteer',
      description: 'Flyer for recruiting volunteers.',
      image: '',
      pdf: '#',
    },
    {
      id: 7,
      title: 'Donate to Support Flyer',
      category: 'Donation',
      description: 'Flyer for collecting donations.',
      image: '',
      pdf: '#',
    },
    {
      id: 8,
      title: 'General MyDreamConnect Flyer',
      category: 'General',
      description: 'General information flyer about MyDreamConnect.',
      image: '',
      pdf: '#',
    },
  ];

  const categories = ['All', 'Programs', 'Courses', 'Volunteer', 'Donation', 'General'];

  const filtered = activeCategory === 'All'
    ? flyers
    : flyers.filter(f => f.category === activeCategory);

  return (
    <div className="fl-page">

      {/* Banner */}
      <section className="fl-banner">
        <h1>Flyers &amp; Media Resources</h1>
        <p>Home / Media / Flyers</p>
      </section>

      {/* Intro */}
      <section className="fl-intro">
        <h2>Download Our Flyers</h2>
        <p>
          Browse and download our official flyers to share our programs,
          courses, and events with your network, school, or community.
        </p>
      </section>

      {/* Category pills */}
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

      {/* Flyer grid */}
      <section className="fl-grid">
        {filtered.map(flyer => (
          <div className="fl-card" key={flyer.id}>
            <div className="fl-image">
              {flyer.image ? (
                <img src={flyer.image} alt="" />
              ) : (
                <div className="fl-placeholder">
                  <span>📄</span>
                  <p>{flyer.title}</p>
                </div>
              )}
            </div>
            <div className="fl-body">
              <span className="fl-cat">{flyer.category}</span>
              <h3>{flyer.title}</h3>
              <p>{flyer.description}</p>
              <a
                href={flyer.pdf}
                target="_blank"
                rel="noreferrer"
                download
                className="fl-btn"
              >
                ⬇ Download Flyer
              </a>
            </div>
          </div>
        ))}
      </section>

      {filtered.length === 0 && (
        <p className="fl-empty">No flyers in this category yet.</p>
      )}

      {/* CTA */}
      <section className="fl-cta">
        <h2>Need a Custom Flyer?</h2>
        <p>
          Want a flyer for a specific event or program? Contact our media team.
        </p>
        <a href="mailto:info@mydreamconnect.org.ng" className="fl-cta-btn">
          Request a Flyer
        </a>
      </section>

    </div>
  );
}

export default Flyers;