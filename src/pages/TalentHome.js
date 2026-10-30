import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TalentHome.css';
import ImageWithFallback from '../components/ImageWithFallback';
import TalentCard from '../components/TalentCard';
import { parseSkills } from '../lib/talentUtils';
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

  const filteredTalents = talents.filter((talent) => {
    const skills = parseSkills(talent.skills);
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (talent.name || '').toLowerCase().includes(term) ||
      (talent.role || '').toLowerCase().includes(term) ||
      skills.some((s) => s.toLowerCase().includes(term));

    const matchesCategory =
      activeCategory === 'All' ||
      (talent.role || '').toLowerCase().includes(activeCategory.toLowerCase()) ||
      skills.some((s) => s.toLowerCase().includes(activeCategory.toLowerCase()));

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
              <TalentCard talent={talent} key={talent.id} />
            ))}
          </div>
        )}
      </section>

      <section className="talent-cta">
        <ImageWithFallback
          src="https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/logo-transparent.png"
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