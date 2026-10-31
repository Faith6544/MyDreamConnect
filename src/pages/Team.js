import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ImageWithFallback from '../components/ImageWithFallback';
import './Team.css';

export default function Team({ embedded = false }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const grouped = members.reduce((acc, member) => {
    const cat = member.category || 'Our Team';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(member);
    return acc;
  }, {});

  const order = ['Board of Directors', 'Executive Team', 'Advisors', 'Staff', 'Volunteers'];
  const categoryList = Object.keys(grouped).sort((a, b) => {
    const ia = order.indexOf(a) === -1 ? order.length : order.indexOf(a);
    const ib = order.indexOf(b) === -1 ? order.length : order.indexOf(b);
    return ia - ib;
  });

  return (
    <div className={embedded ? 'team-page team-embedded' : 'team-page'}>
      <div className="team-container">
        {/* Change the title if embedded on Home page */}
        {embedded ? <h2 className="team-title" style={{ textAlign: 'left' }}>Meet Our <span style={{ color: '#d4a017' }}>Leadership Team</span></h2> : <h1 className="team-title">Our Team</h1>}
        {!embedded && <p className="team-subtitle">Meet the people driving our mission forward.</p>}

        {loading ? (
          <p>Loading team...</p>
        ) : (
          categoryList.map(category => (
            <div key={category} className="team-section">
              {!embedded && <h2 className="team-category-title">{category}</h2>}
              <div className="team-grid">
                {grouped[category].map(member => (
                  // Inside Team.js map function:
<div 
  key={member.id} 
  className="team-card" 
  onClick={() => navigate(`/team/${member.id}`)} // Goes to the new profile page
>
                    <div className="team-image">
                      <ImageWithFallback src={member.image_url} alt={member.name} type="human" />
                    </div>
                    <h3 className="team-name">{member.name}</h3>
                    <p className="team-role">{member.role}</p>
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