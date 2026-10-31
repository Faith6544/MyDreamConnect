import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TalentMarketplace.css';
import { parseSkills } from '../lib/talentUtils';
import { supabase } from '../lib/supabase';

function TalentMarketplace() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

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
              <div style={{ position: 'absolute', top: '110%', right: 0, width: '150px', background: '#fff', border: '1px solid #ccc', borderRadius: '8px', zIndex: 9999, padding: '5px 0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <button type="button" style={{ display: 'block', width: '100%', padding: '12px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => { setSortOrder('newest'); setDropdownOpen(false); }}>Newest</button>
                <button type="button" style={{ display: 'block', width: '100%', padding: '12px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => { setSortOrder('oldest'); setDropdownOpen(false); }}>Oldest</button>
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
            {/* TalentCard built directly into the page since the file doesn't exist */}
            {filteredTalents.map(talent => (
              <div 
                key={talent.id} 
                className="talent-card-custom"
                onClick={() => navigate(`/talent/${talent.id}`)}
              >
                <div className="talent-card-img-wrapper">
                  <img 
                    src={talent.image_url || 'https://via.placeholder.com/150'} 
                    alt={talent.name} 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                  />
                </div>
                <h3 className="talent-card-name">{talent.name}</h3>
                <p className="talent-card-role">{talent.role}</p>
                <p className="talent-card-skills">{parseSkills(talent.skills).slice(0, 3).join(', ')}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TalentMarketplace;