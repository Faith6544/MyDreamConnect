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

  if (loading) return <p style={{ textAlign: 'center', padding: '100px', fontSize: '20px' }}>Loading profile...</p>;
  if (!member) return <p style={{ textAlign: 'center', padding: '100px', fontSize: '20px' }}>Team member not found.</p>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Header Section */}
        <div className="profile-header">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          
          <div className="profile-image-wrapper">
            <img src={member.image_url || 'https://via.placeholder.com/200'} alt={member.name} />
          </div>
          
          <h1>{member.name}</h1>
          <h3 className="profile-role">{member.role}</h3>
          <span className="profile-category">{member.category || 'Team Member'}</span>
        </div>

        {/* Bio Section */}
        <div className="profile-bio-section">
          <h2>About Me</h2>
          <p>{member.bio || 'Biography coming soon...'}</p>
        </div>

        {/* Direct Links Section (As requested in your design tips) */}
        <div className="profile-links-section">
          {member.linkedin_url && (
            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="profile-btn linkedin-btn">
              Connect on LinkedIn
            </a>
          )}
          {member.email && (
            <a href={`mailto:${member.email}`} className="profile-btn email-btn">
              Send an Email
            </a>
          )}
        </div>

      </div>
    </div>
  );
}