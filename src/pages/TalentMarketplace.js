import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TalentMarketplace.css';
import ImageWithFallback from '../components/ImageWithFallback';
import usePageTitle from '../lib/usePageTitle';
import { supabase } from '../lib/supabase';

const categories = ['All', 'Design', 'Tech', 'Writing', 'Marketing', 'Music', 'Acting & Dance', 'Business', 'Engineering', 'Consulting', 'Crafts', 'Sports', 'Teaching'];

// skills can come back as an array or as a messy string like '["React","Node"]'
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
  usePageTitle('All Talent'); // browser tab title

  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const fetchTalents = async () => {
      const { data, error } = await supabase.from('talent').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Talents fetch error:', error);
        setLoadError('We could not load the talents right now. Please refresh the page.');
      } else {
        setTalents(data || []);
      }
      setLoading(false);
    };
    fetchTalents();
  }, []);

  const query = searchQuery.toLowerCase().trim();
  const category = activeCategory.toLowerCase();

  const filteredTalents = talents
    .filter((talent) => {
      const skills = parseSkills(talent.skills);
      const role = String(talent.role || '').toLowerCase();

      const matchesSearch =
        String(talent.name || '').toLowerCase().includes(query) ||
        role.includes(query) ||
        skills.some((s) => s.toLowerCase().includes(query));

      const matchesCategory =
        activeCategory === 'All' ||
        role.includes(category) ||
        skills.some((s) => s.toLowerCase().includes(category));

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="tm-page">
      <div className="tm-container">
        <h1 className="tm-title">Discover Talents</h1>

        <div className="tm-controls">
          <div className="tm-search">
            <svg className="tm-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input
              type="text"
              className="tm-search-input"
              placeholder="Search talents, skills..."
              aria-label="Search talents"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="tm-sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            aria-label="Sort talents"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        <div className="tm-categories">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              className={`tm-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              aria-pressed={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <hr className="tm-divider" />

        {loading ? (
          <p className="tm-message">Loading...</p>
        ) : loadError ? (
          <p className="tm-message">{loadError}</p>
        ) : filteredTalents.length === 0 ? (
          <div className="tm-empty">
            <h3>No talents found</h3>
            <p>Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div className="tm-list">
            {filteredTalents.map((talent) => {
              const images = Array.isArray(talent.portfolio_images) ? talent.portfolio_images.filter(Boolean) : [];
              const skills = parseSkills(talent.skills);

              return (
                <div className="tm-card" key={talent.id}>
                  <div className="tm-card-header">
                    <div className="tm-profile">
                      <div className="tm-avatar">
                        <ImageWithFallback src={talent.avatar_url} alt={talent.name || 'Anonymous'} type="human" />
                      </div>
                      <div className="tm-names">
                        <h3 className="tm-name">{talent.name || 'Anonymous User'}</h3>
                        <span className="tm-role">{talent.role || 'Talent'}</span>
                      </div>
                    </div>
                    <Link to={`/talent/${talent.id}`} className="tm-view-btn">
                      View Profile
                    </Link>
                  </div>

                  {(talent.location || talent.availability) && (
                    <div className="tm-meta">
                      {talent.location && <span>📍 {talent.location}</span>}
                      {talent.availability && <span className="tm-availability">● {talent.availability}</span>}
                    </div>
                  )}

                  {images.length > 0 ? (
                    <div className="tm-portfolio">
                      {images.slice(0, 4).map((imgUrl, index) => (
                        <div className="tm-portfolio-item" key={index}>
                          <ImageWithFallback src={imgUrl} alt={`${talent.name || 'Talent'} portfolio work`} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    skills.length > 0 && ( // no portfolio yet, so show skills instead of empty grey boxes
                      <div className="tm-skills">
                        {skills.slice(0, 4).map((s) => (
                          <span className="tm-skill" key={s}>{s}</span>
                        ))}
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TalentMarketplace;