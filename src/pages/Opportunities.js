import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Opportunities.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      const { data, error } = await supabase
        .from('opportunities') // Change this if your table name is different
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Opportunities fetch error:', error);
      } else {
        setOpportunities(data || []);
      }
      setLoading(false);
    };

    fetchOpportunities();
  }, []);

  return (
    <div className="opp-page">
      <div className="opp-container">
        
        {/* Clean Underlined Title */}
        <h1 className="opp-title">Opportunities</h1>
        
        <p className="opp-intro-text">
          Discover scholarships, fellowships, grants, and programs to help you grow.
        </p>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
        ) : opportunities.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>No opportunities available right now.</p>
        ) : (
          <div className="opp-grid">
            {opportunities.map(opp => (
              <Link to={`/opportunities/${opp.id}`} className="opp-card" key={opp.id}>
                {/* Optional: Only show image if your database has an image_url */}
                {opp.image_url && (
                  <div className="opp-image">
                    <ImageWithFallback src={opp.image_url} alt={opp.title} />
                  </div>
                )}
                
                <div className="opp-content">
                  {/* Optional: Show category or deadline if you have them */}
                  {opp.category && <span className="opp-tag">{opp.category}</span>}
                  
                  <h3 className="opp-card-title">{opp.title}</h3>
                  <p className="opp-excerpt">{opp.description}</p>
                  
                  {/* The Action Button */}
                  <div className="opp-apply-btn">
                    View Details →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Opportunities;