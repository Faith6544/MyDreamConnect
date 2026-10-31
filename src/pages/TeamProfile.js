// src/pages/TeamProfile.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './TeamProfile.css';

export default function TeamProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      const { data } = await supabase.from('team_members').select('*').eq('id', id).single();
      setMember(data);
    };
    fetchMember();
  }, [id]);

  if (!member) return <p style={{ textAlign: 'center', padding: '50px' }}>Loading...</p>;

  return (
    <div className="team-profile-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back to Team</button>
      <div className="profile-header">
        <img src={member.image_url} alt={member.name} className="profile-img" />
        <h1>{member.name}</h1>
        <h3 style={{ color: '#d4a017' }}>{member.role}</h3>
        <p className="profile-category">{member.category}</p>
      </div>
      <div className="profile-bio-section">
        <h2>About {member.name.split(' ')[0]}</h2>
        <p>{member.bio || 'No biography provided yet.'}</p>
      </div>
    </div>
  );
}