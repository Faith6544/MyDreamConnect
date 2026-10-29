import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TalentMarketplace.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

function parseSkills(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string' && raw.trim()) {
    return raw
      .replace(/[[\]"]/g, '') 
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function TalentMarketplace() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = ['All', 'Design', 'Tech', 'Writing', 'Marketing', 'Music', 'Acting & Dance', 'Business', 'Engineering', 'Consulting', 'Crafts', 'Sports', 'Teaching'];

  useEffect(() => {
    const fetchTalents = async () => {
      const { data, error } = await supabase.from('talent').select('*').order('created_at', { ascending: false });
      if (error) console.error('Talents fetch error:', error);
      else setTalents(data || []);
      setLoading(false);
    };
    fetchTalents();
  }, []);

  let filteredTalents = talents.filter((talent) => {
    const query = searchQuery.toLowerCase().trim();
    const skills = parseSkills(talent.skills);

    const matchesSearch =
      String(talent.name || '').toLowerCase().includes(query) ||
      String(talent.role || '').toLowerCase().includes(query) ||
      skills.some((s) => s.toLowerCase().includes(query));

    const matchesCategory =
      activeCategory === 'All' ||
      String(talent.role || '').toLowerCase().includes(activeCategory.toLowerCase()) ||
      skills.some((s) => s.toLowerCase().includes(activeCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  filteredTalents = [...filteredTalents].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

    if (sortOrder === 'newest') {
      return dateB - dateA;
    }
    return dateA - dateB;
  });

  return (
    <div className="talent-page">
      <div className="talent-container">
        <h1 className="talent-main-title">Discover Talents</h1>

        <div className="talent-controls">
          <div className="talent-search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="talent-search-input"
              placeholder="Search talents, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="talent-sort-btn"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {sortOrder === 'newest' ? 'Newest ▼' : 'Oldest ▲'}
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: '150px',
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 9999,
                padding: '5px 0'
              }}>
                <button
                  type="button"
                  style={{ display: 'block', width: '100%', padding: '12px 15px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => {
                    setSortOrder('newest');
                    setDropdownOpen(false);
                  }}
                >
                  Newest First
                </button>
                <button
                  type="button"
                  style={{ display: 'block', width: '100%', padding: '12px 15px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => {
                    setSortOrder('oldest');
                    setDropdownOpen(false);
                  }}
                >
                  Oldest First
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="talent-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`talent-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <hr className="talent-divider" />

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
        ) : filteredTalents.length === 0 ? (
          <div className="talent-empty">
            <h3>No talents found</h3>
            <p>Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div className="talent-list">
            {filteredTalents.map(talent => (
              <div className="talent-card" key={talent.id}>
                <div className="talent-card-header">
                  <div className="talent-profile-info">
                    <div className="talent-avatar">
                      {/* The CSS forces the image inside this to stay 60x60 */}
                      <ImageWithFallback src={talent.avatar_url} alt={talent.name || 'Talent'} type="human" />
                    </div>
                    <div>
                      <h3 className="talent-name">{talent.name || 'Anonymous User'}</h3>
                      <span className="talent-role">{talent.role || 'Talent'}</span>
                    </div>
                  </div>
                  <Link to={`/talent/${talent.id}`} className="talent-view-btn">
                    View Profile
                  </Link>
                </div>

                <div className="talent-portfolio-grid">
                  {talent.portfolio_images && talent.portfolio_images.length > 0 ? (
                    talent.portfolio_images.slice(0, 4).map((imgUrl, index) => (
                      <div className="talent-portfolio-item" key={index}>
                        <ImageWithFallback src={imgUrl} alt="Portfolio Work" />
                      </div>
                    ))
                  ) : (
                    [1, 2, 3, 4].map((item) => (
                      <div className="talent-portfolio-item" key={item}>
                        <span className="placeholder-icon">🖼️</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TalentMarketplace;