import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TalentMarketplace.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

function parseSkills(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string' && raw.trim()) {
    return raw.replace(/[[\]"]/g, '').split(',').map((s) => s.trim()).filter(Boolean);
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
    if (sortOrder === 'newest') return dateB - dateA;
    return dateA - dateB;
  });

  return (
    <div className="talent-page">
      <div className="talent-container">
        <h1 className="talent-main-title">Discover Talents</h1>

        <div className="talent-controls">
          <div className="talent-search-wrapper">
            <span className="search-icon">🔍</span>
            <input type="text" className="talent-search-input" placeholder="Search talents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div style={{ position: 'relative' }}>
            <button type="button" className="talent-sort-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {sortOrder === 'newest' ? 'Newest ▼' : 'Oldest ▲'}
            </button>
            {dropdownOpen && (
              <div style={{ position: 'absolute', top: '110%', right: 0, width: '150px', background: '#fff', border: '1px solid #ccc', borderRadius: '8px', zIndex: 9999, padding: '5px 0' }}>
                <button type="button" style={{ display: 'block', width: '100%', padding: '12px', textAlign: 'left', background: 'none', border: 'none' }} onClick={() => { setSortOrder('newest'); setDropdownOpen(false); }}>Newest</button>
                <button type="button" style={{ display: 'block', width: '100%', padding: '12px', textAlign: 'left', background: 'none', border: 'none' }} onClick={() => { setSortOrder('oldest'); setDropdownOpen(false); }}>Oldest</button>
              </div>
            )}
          </div>
        </div>

        <div className="talent-categories">
          {categories.map(cat => (
            <button key={cat} className={`talent-cat-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
          ))}
        </div>

        <hr className="talent-divider" />

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
        ) : filteredTalents.length === 0 ? (
          <div className="talent-empty"><h3>No talents found</h3></div>
        ) : (
          <div className="talent-list">
            {filteredTalents.map(talent => (
              <div className="talent-card" key={talent.id} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '10px' }}>
                
                <div className="talent-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div className="talent-profile-info" style={{ display: 'flex', gap: '15px' }}>
                    
                    {/* FORCED 60x60 CIRCLE */}
                    <div style={{ width: '60px', height: '60px', minWidth: '60px', borderRadius: '50%', overflow: 'hidden', background: '#f0f0f0' }}>
                      <ImageWithFallback 
                        src={talent.avatar_url} 
                        alt={talent.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div>
                      <h3 className="talent-name" style={{ fontSize: '18px', margin: '0 0 5px 0' }}>{talent.name}</h3>
                      <span className="talent-role" style={{ fontSize: '14px', color: '#777' }}>{talent.role}</span>
                    </div>
                  </div>
                  <Link to={`/talent/${talent.id}`} className="talent-view-btn" style={{ padding: '8px 16px', borderRadius: '50px', background: '#0a4711', color: '#fff', textDecoration: 'none', fontSize: '14px', whiteSpace: 'nowrap' }}>View Profile</Link>
                </div>

                {/* FORCED 4 SMALL SQUARE BOXES */}
                <div className="talent-portfolio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {talent.portfolio_images && talent.portfolio_images.length > 0 ? (
                    talent.portfolio_images.slice(0, 4).map((imgUrl, index) => (
                      <div key={index} style={{ aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', background: '#eee', width: '100%' }}>
                        <ImageWithFallback src={imgUrl} alt="Work" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))
                  ) : (
                    [1, 2, 3, 4].map((item) => (
                      <div key={item} style={{ aspectRatio: '1/1', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee', width: '100%' }}>
                        <span style={{ fontSize: '20px', opacity: 0.3 }}>🖼️</span>
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