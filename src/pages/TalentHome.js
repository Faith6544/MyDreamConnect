import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './TalentProfile.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

function parseSkills(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string' && raw.trim()) {
    return raw.replace(/[[\]"]/g, '').split(',').map((s) => s.trim()).filter(Boolean);
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
      const { data, error: fetchError } = await supabase.from('talent').select('*').eq('id', id).maybeSingle();
      if (cancelled) return;
      if (fetchError) setError('Could not load this profile.');
      else setTalent(data);
      setLoading(false);
    };
    fetchTalent();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center', padding: '100px' }}>Loading profile...</p>;
  if (error) return <p style={{ textAlign: 'center', padding: '100px' }}>{error}</p>;
  if (!talent) return <p style={{ textAlign: 'center', padding: '100px' }}>Profile not found.</p>;

  const skills = parseSkills(talent.skills);

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: '#fff', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <Link to="/talent/all" style={{ color: '#0a4711', textDecoration: 'none', fontWeight: 600, display: 'inline-block', marginBottom: '30px' }}>
          ← All talents
        </Link>

        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
          
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', background: '#f0f0f0' }}>
            <ImageWithFallback 
              src={talent.avatar_url} 
              alt={talent.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          <div>
            <h1 style={{ fontSize: '32px', margin: '0 0 10px 0', color: '#111' }}>{talent.name}</h1>
            <p style={{ fontSize: '18px', color: '#d4a017', margin: '0 0 10px 0', fontWeight: 600 }}>{talent.role}</p>
            <p style={{ fontSize: '15px', color: '#555', margin: 0 }}>📍 {talent.location || 'Remote'} &nbsp; | &nbsp; 🟢 {talent.availability || 'Available'}</p>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '22px', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Skills</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {skills.map(skill => (
              <span key={skill} style={{ background: '#eaf3eb', color: '#0a4711', padding: '6px 15px', borderRadius: '50px', fontSize: '14px', fontWeight: 600 }}>{skill}</span>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '22px', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Portfolio</h2>
          {talent.portfolio_images && talent.portfolio_images.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {talent.portfolio_images.map((imgUrl, index) => (
                <div key={index} style={{ aspectRatio: '4/3', borderRadius: '10px', overflow: 'hidden', border: '1px solid #eee' }}>
                  <ImageWithFallback src={imgUrl} alt="Work" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888' }}>No portfolio images uploaded yet.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default TalentProfile;