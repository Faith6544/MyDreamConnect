import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './TeamProfile.css';

export default function TeamProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      const { data, error } = await supabase.from('team_members').select('*').eq('id', id).single();
      if (error) console.error(error);
      else setMember(data);
      setLoading(false);
    };
    fetchMember();
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Loading profile...</p>;
  if (!member) return <p style={{ textAlign: 'center', padding: '50px' }}>Team member not found.</p>;

  return (
    <div className="team-profile-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      
      <div className="profile-header">
        <img src={member.image_url || 'https://via.placeholder.com/200'} alt={member.name} className="profile-img" />
        <h1>{member.name}</h1>
        <h3 className="profile-role">{member.role}</h3>
        <span className="profile-category">{member.category || 'Team'}</span>
      </div>

      <div className="profile-bio-section">
<h2>About Me</h2>        <p>{member.bio || 'No biography has been added for this team member yet. Please check back later!'}</p>
      </div>
    </div>
  );
}