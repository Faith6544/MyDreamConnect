import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TalentHome.css';

function TalentHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All', 'Design', 'Tech', 'Writing', 'Marketing', 'Music',
    'Acting & Dance', 'Business', 'Engineering', 'Consulting',
    'Crafts', 'Sports', 'Teaching', 'Entrepreneurship',
  ];

const talents = [
  {
    id: 1,
    name: 'Adaeze Nwosu',
    role: 'Product Designer',
    location: 'Surulere, Lagos',
    availability: 'Full Time, Part Time',
    avatar: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/IMG_20170628_162654.jpg',
    skills: ['Figma', 'UI Design', 'UX Design'],
  },
  {
    id: 2,
    name: 'Tunde Bakare',
    role: 'Animator, Graphics Artist',
    location: 'Alimosho, Lagos',
    availability: 'Remote, Contract',
    avatar: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/IMG_20170628_151333-1.jpg',
    skills: ['Photoshop', 'Illustrator', 'After Effects', 'Animation', 'Motion Graphics'],
  },
  {
    id: 3,
    name: 'Chinedu Eze',
    role: 'Solar and Tiling Technician',
    location: 'Ikeja, Lagos',
    availability: 'Full Time',
    avatar: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/FB_IMG_1623781752620.jpg',
    skills: ['Solar Installation', 'Tiling', 'Maintenance'],
  },
  {
    id: 4,
    name: 'Folasade Adeyemi',
    role: 'Graphics Designer',
    location: 'Yaba, Lagos',
    availability: 'Contract',
    avatar: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/cropped-mdc-logo-1.png',
    skills: ['Branding', 'Illustrator', 'Logo Design'],
  },
  {
    id: 5,
    name: 'Ibrahim Yusuf',
    role: 'Frontend Developer',
    location: 'Abuja, FCT',
    availability: 'Remote, Full Time',
    avatar: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/IMG_20170628_162654.jpg',
    skills: ['React', 'JavaScript', 'Tailwind', 'HTML'],
  },
  {
    id: 6,
    name: 'Blessing Okafor',
    role: 'Content Writer',
    location: 'Port Harcourt, Rivers',
    availability: 'Remote, Part Time',
    avatar: 'https://mydreamconnect.org.ng/wp-content/uploads/2022/10/IMG_20170628_151333-1.jpg',
    skills: ['Copywriting', 'SEO', 'Blogging', 'Editing'],
  },
];

  const filteredTalents = talents.filter(talent => {
    const matchesSearch =
      talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      activeCategory === 'All' ||
      talent.role.toLowerCase().includes(activeCategory.toLowerCase()) ||
      talent.skills.some(s => s.toLowerCase().includes(activeCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="talent-page">

      {/* ============ DISCOVER SECTION ============ */}
      <section className="discover-section">

        <h1 className="discover-title">Discover Talents</h1>

        {/* Search bar */}
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
            <button className="sort-btn">
              Newest <span className="chev">▾</span>
            </button>
          </div>
        </div>

        {/* Category pills */}
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

      {/* ============ TALENT GRID ============ */}
      <section className="talents-section">
        {filteredTalents.length === 0 ? (
          <p className="no-results">No talents match your search.</p>
        ) : (
          <div className="talents-grid">
            {filteredTalents.map(talent => (
              <div className="talent-card" key={talent.id}>

                {/* Header: avatar, name, view button */}
                <div className="talent-header">
                  <div className="talent-info">
                    <img src={talent.avatar} alt={talent.name} className="talent-avatar" />
                    <div>
                      <h3>{talent.name}</h3>
                      <p className="talent-role">{talent.role}</p>
                    </div>
                  </div>
                  <button className="view-profile-btn">View Profile</button>
                </div>

                {/* Location + availability */}
                <div className="talent-meta">
                  <span>📍 {talent.location}</span>
                  <span className="availability">● {talent.availability}</span>
                </div>

                {/* Portfolio placeholders */}
                <div className="portfolio-grid">
                  {[1, 2, 3, 4].map(n => (
                    <div className="portfolio-placeholder" key={n}>
                      <span>🖼</span>
                    </div>
                  ))}
                </div>

                {/* Skill tags */}
                <div className="skill-tags">
                  {talent.skills.slice(0, 4).map((s, i) => (
                    <span className="skill-tag" key={i}>{s}</span>
                  ))}
                  {talent.skills.length > 4 && (
                    <span className="skill-tag-more">+{talent.skills.length - 4}</span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============ BOTTOM CTA ============ */}
      <section className="talent-cta">
        <img
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