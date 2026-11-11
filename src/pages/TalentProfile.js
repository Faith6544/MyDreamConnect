import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { parseSkills } from '../lib/talentUtils';
import ImageWithFallback from '../components/ImageWithFallback';
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

  if (loading) return <p className="tp-status">Loading profile...</p>;
  if (!talent) return <p className="tp-status">Talent not found.</p>;

  const skills = parseSkills(talent.skills);

  // Portfolio links are stored as a JSON array: [{"title": "GitHub", "url": "https://..."}]
  // If they arrive as a string, safely try to parse it first.
  let portfolioLinks = [];
  try {
    const raw = typeof talent.portfolio_links === 'string'
      ? JSON.parse(talent.portfolio_links)
      : (talent.portfolio_links || []);
    portfolioLinks = Array.isArray(raw) ? raw : [];
  } catch (e) {
    console.log('No valid portfolio links found');
  }

  return (
    <div className="tp-page">
      <div className="tp-container">
        <button onClick={() => navigate(-1)} className="tp-back">← Back to Marketplace</button>

        <div className="tp-header">
          {/* the photo column is avatar_url — missing photos fall back to the person's initials */}
          <ImageWithFallback src={talent.avatar_url} alt={talent.name} type="human" className="tp-avatar" />
          <div>
            <h1>{talent.name}</h1>
            <p className="tp-role">{talent.role}</p>
            {(talent.location || talent.availability) && (
              <p className="tp-meta">
                {talent.location && <span>📍 {talent.location}</span>}
                {talent.availability && <span className="tp-availability">● {talent.availability}</span>}
              </p>
            )}
          </div>
        </div>

        {talent.bio && (
          <section className="tp-section">
            <h2>About</h2>
            <p>{talent.bio}</p>
          </section>
        )}

        <section className="tp-section">
          <h2>Skills</h2>
          {skills.length > 0 ? (
            <div className="tp-skills">
              {skills.map((skill, i) => (
                <span key={i} className="tp-skill">{skill}</span>
              ))}
            </div>
          ) : (
            <p>No skills listed yet.</p>
          )}
        </section>

        <section className="tp-section">
          <h2>Portfolio & Links</h2>
          {portfolioLinks.length > 0 ? (
            <div className="tp-skills">
              {portfolioLinks.map((link, index) => (
                <a
                  key={index}
                  href={/^https?:\/\//i.test(link.url || '') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tp-contact-btn"
                >
                  🔗 {link.title || link.url}
                </a>
              ))}
            </div>
          ) : (
            <p>No portfolio links provided.</p>
          )}
        </section>
      </div>
    </div>
  );
}
