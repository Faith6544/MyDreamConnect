import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TalentHome.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

function TalentHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All', 'Design', 'Tech', 'Writing', 'Marketing', 'Music',
    'Acting & Dance', 'Business', 'Engineering', 'Consulting',
    'Crafts', 'Sports', 'Teaching', 'Entrepreneurship',
  ];

  useEffect(() => {
    const fetchTalents = async () => {
      const { data, error } = await supabase
        .from('talent')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Talent fetch error:', error);
      } else {
        setTalents(data || []);
      }
      setLoading(false);
    };

    fetchTalents();
  }, []);

  const filteredTalents = talents.filter(talent => {
    const skills = talent.skills || [];
    const matchesSearch =
      (talent.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (talent.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      activeCategory === 'All' ||
      (talent.role || '').toLowerCase().includes(activeCategory.toLowerCase()) ||
      skills.some(s => s.toLowerCase().includes(activeCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="talent-page">
      <section className="discover-section">
        <h1 className="discover-title">Discover Talents</h1>

        <div className="search-row">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search talents, skills, or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="filter-btn" title="Filter">⚙</button>
          <div className="sort-dropdown">
            <button className="sort-btn">Newest <span className="chev">▾</span></button>
          </div>
        </div>

        <div className="category-pills">
          {categories.map(cat => (
            <button
              key={cat}
              className={activeCategory === cat ? 'pill active' : 'pill'}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="talents-section">
        {loading ? (
          <p className="no-results">Loading...</p>
        ) : filteredTalents.length === 0 ? (
          <p className="no-results">No talents match your search.</p>
        ) : (
          <div className="talents-grid">
            {filteredTalents.map(talent => (
              <div className="talent-card" key={talent.id}>
                <div className="talent-header">
                  <div className="talent-info">
                    <ImageWithFallback
                      src={talent.avatar_url}
                      alt={talent.name}
                      className="talent-avatar"
                      type="human"
                    />
                    <div>
                      <h3>{talent.name}</h3>
                      <p className="talent-role">{talent.role}</p>
                    </div>
                  </div>
                  <button className="view-profile-btn">View Profile</button>
                </div>

                <div className="talent-meta">
                  <span>📍 {talent.location}</span>
                  <span className="availability">● {talent.availability}</span>
                </div>

                <div className="portfolio-grid">
                  {[1, 2, 3, 4].map(n => (
                    <div className="portfolio-placeholder" key={n}>
                      <span>🖼</span>
                    </div>
                  ))}
                </div>

                <div className="skill-tags">
                  {(talent.skills || []).slice(0, 4).map((s, i) => (
                    <span className="skill-tag" key={i}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="talent-cta">
        <ImageWithFallback
          src="https://mydreamconnect.org.ng/wp-content/uploads/2022/10/cropped-mdc-logo.png"
          alt="MyDreamConnect"
          className="cta-logo"
        />
        <h2>Try MyDreamConnect Today</h2>
        <p>Manage your freelance projects, connect with mentors, and grow your career.</p>
        <Link to="/get-started" className="cta-btn">Get Started for Free</Link>
      </section>
    </div>
  );
}

export default TalentHome;