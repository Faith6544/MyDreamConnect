import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ImageWithFallback from '../components/ImageWithFallback';
import './Team.css';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });
      setMembers(data || []);
      setLoading(false);
    };
    fetchTeam();
  }, []);

  // Group by category (Board of Directors, etc.)
  const grouped = members.reduce((acc, member) => {
    const cat = member.category || 'Our Team';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(member);
    return acc;
  }, {});

  return (
    <div className="team-page">
      <div className="team-container">
        <h1 className="team-title">Our Team</h1>
        <p className="team-subtitle">Meet the people driving our mission forward.</p>

        {loading ? (
          <p>Loading team...</p>
        ) : (
          Object.keys(grouped).map(category => (
            <div key={category} className="team-section">
              <h2 className="team-category-title">{category}</h2>
              <div className="team-grid">
                {grouped[category].map(member => (
                  <div key={member.id} className="team-card">
                    <div className="team-image">
                      <ImageWithFallback src={member.image_url} alt={member.name} type="human" />
                    </div>
                    <h3 className="team-name">{member.name}</h3>
                    <p className="team-role">{member.role}</p>
                    {member.bio && <p className="team-bio">{member.bio}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}