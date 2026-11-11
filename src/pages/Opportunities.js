import React, { useState, useEffect } from 'react';
import './Opportunities.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { fetchInOrder } from '../lib/fetchOrdered';

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      // Respects the admin drag-and-drop order (`display_order`). Until
      // the order-column migration runs, falls back to newest-first.
      const { data, error } = await fetchInOrder('opportunities');

      if (error) {
        console.error('Opportunities fetch error:', error);
      } else {
        setOpportunities(data || []);
      }
      setLoading(false);
    };

    fetchOpportunities();
  }, []);

  const renderCardContent = (opp) => (
    <>
      {opp.image_url && (
        <div className="opp-image">
          <ImageWithFallback src={opp.image_url} alt={opp.title || 'Opportunity'} />
        </div>
      )}

      <div className="opp-content">
        <h3 className="opp-card-title">{opp.title}</h3>
        {/* The table stores `excerpt`, not `description`. */}
        <p className="opp-excerpt">{opp.excerpt}</p>

        <div className="opp-apply-btn">
          {opp.url ? 'Read More →' : 'Details coming soon'}
        </div>
      </div>
    </>
  );

  return (
    <div className="opp-page">
      <div className="opp-container">

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
              opp.url ? (
                // The destination is stored on the row, so link straight to it.
                // (There is no /opportunities/:id route.)
                <a
                  href={opp.url}
                  className="opp-card"
                  key={opp.id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {renderCardContent(opp)}
                </a>
              ) : (
                <div className="opp-card" key={opp.id}>
                  {renderCardContent(opp)}
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Opportunities;
