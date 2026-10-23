import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './TalentProfile.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

function parseSkills(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string' && raw.trim()) {
    return raw
      .replace(/[[\]"]/g, '') // <-- FIXED REGEX
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function TalentProfile() {
  const { id } = useParams();
  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchTalent = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('talent')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (cancelled) return;

      if (fetchError) {
        setError('Could not load this profile.');
      } else {
        setTalent(data);
      }
      setLoading(false);
    };

    fetchTalent();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <p className="tp-status">Loading profile...</p>;
  if (error) return <p className="tp-status">{error}</p>;
  if (!talent) return <p className="tp-status">This talent profile could not be found.</p>;

  const skills = parseSkills(talent.skills);

  return (
    <div className="tp-page">
      <div className="tp-container">
        <Link to="/talent/all" className="tp-back">← All talents</Link>

        <header className="tp-header">
          <ImageWithFallback
            src={talent.avatar_url}
            alt={talent.name || 'Talent'}
            className="tp-avatar"
            type="human"
          />
          <div>
            <h1>{talent.name || 'Anonymous User'}</h1>
            <p className="tp-role">{talent.role || 'Talent'}</p>
            <p className="tp-meta">
              {talent.location && <span>📍 {talent.location}</span>}
              {talent.availability && <span className="tp-availability">● {talent.availability}</span>}
            </p>
          </div>
        </header>

        {skills.length > 0 && (
          <section className="tp-section">
            <h2>Skills</h2>
            <div className="tp-skills">
              {skills.map((skill) => (
                <span className="tp-skill" key={skill}>{skill}</span>
              ))}
            </div>
          </section>
        )}

        <section className="tp-section">
          <h2>Get in touch</h2>
          <p>
            Interested in working with {talent.name || 'this talent'}? Reach out to the
            MyDreamConnect team and we will connect you.
          </p>
          <Link to="/contact" className="tp-contact-btn">Contact us</Link>
        </section>
      </div>
    </div>
  );
}

export default TalentProfile;