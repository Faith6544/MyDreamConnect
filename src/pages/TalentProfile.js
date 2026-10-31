import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { parseSkills } from '../lib/talentUtils';
import './TalentProfile.css';

export default function TalentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTalent = async () => {
      const { data, error } = await supabase.from('talent').select('*').eq('id', id).single();
      if (error) console.error(error);
      else setTalent(data);
      setLoading(false);
    };
    fetchTalent();
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Loading profile...</p>;
  if (!talent) return <p style={{ textAlign: 'center', padding: '50px' }}>Talent not found.</p>;

  const skills = parseSkills(talent.skills);
  
  // Assuming you save portfolio links as a JSON array in Supabase: [{"title": "GitHub", "url": "https://..."}]
  // If it's stored as a string, we safely try to parse it.
  let portfolioLinks = [];
  try {
    portfolioLinks = typeof talent.portfolio_links === 'string' 
      ? JSON.parse(talent.portfolio_links) 
      : (talent.portfolio_links || []);
  } catch (e) {
    console.log("No valid portfolio links found");
  }

  return (
    <div className="talent-profile-page">
      <button onClick={() => navigate(-1)} className="back-btn">← Back to Marketplace</button>
      
      <div className="profile-header">
        <img src={talent.image_url} alt={talent.name} className="profile-avatar" />
        <h1>{talent.name}</h1>
        <h3>{talent.role}</h3>
        <p className="profile-bio">{talent.bio}</p>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Skills</h2>
          <div className="skills-grid">
            {skills.map((skill, i) => (
              <span key={i} className="skill-pill">{skill}</span>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h2>Portfolio & Links</h2>
          {portfolioLinks.length > 0 ? (
            <div className="portfolio-links">
              {portfolioLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="portfolio-link-btn"
                >
                  🔗 {link.title || link.url}
                </a>
              ))}
            </div>
          ) : (
            <p>No portfolio links provided.</p>
          )}
        </div>
      </div>
    </div>
  );
}