import React, { useState, useEffect } from 'react';
import './Opportunities.css';
import Sidebar from '../components/Sidebar';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpps = async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Opportunities fetch error:', error);
      } else {
        setOpportunities(data || []);
      }
      setLoading(false);
    };

    fetchOpps();
  }, []);

  return (
    <div className="opps-page">
      <section className="opps-banner">
        <h1>Opportunities for Development</h1>
        <p>Home / Talent Marketplace / Opportunities</p>
      </section>

      <div className="opps-layout">
        <article className="opps-content">
          <figure className="opps-featured">
            <ImageWithFallback
              src="https://mydreamconnect.org.ng/wp-content/uploads/2023/10/images-13.jpeg"
              alt="Opportunities for Development"
            />
          </figure>

          <div className="opps-socials">
            <a href="https://www.facebook.com/MyDreamConnect?mibextid=ZbWKwL" target="_blank" rel="noreferrer" className="opps-social-btn fb">f</a>
            <a href="https://instagram.com/mydreamconnect" target="_blank" rel="noreferrer" className="opps-social-btn ig">📷</a>
            <a href="https://www.linkedin.com/company/mydreamconnect-learning-centre/" target="_blank" rel="noreferrer" className="opps-social-btn li">in</a>
          </div>

          <p className="opps-intro-text">
            <em>Want to move from zero to hero? JOIN US to explore <strong>SOME GREAT OPPORTUNITIES FOR YOUR DEVELOPMENT!</strong></em>
          </p>

          <h2 className="opps-join-heading">JOIN US ON WHATSAPP 👇</h2>
          <a
            href="https://chat.whatsapp.com/Dn1ant6kEgZ7md5fhNDSzp"
            target="_blank"
            rel="noreferrer"
            className="opps-whatsapp"
          >
            💬 Join WhatsApp Group
          </a>

          <h2 className="opps-join-heading">MAIL US 👇</h2>
          <a href="mailto:mydreamconnectlc@gmail.com" className="opps-mail">
            ✉️ mydreamconnectlc@gmail.com
          </a>

          <h2 className="opps-list-heading">Latest Opportunities</h2>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Loading...</p>
          ) : opportunities.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>No opportunities yet.</p>
          ) : (
            <div className="opps-grid">
              {opportunities.map(opp => (
                <a
                  href={opp.url || '#'}
                  key={opp.id}
                  className="opp-card"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="opp-image">
                    <ImageWithFallback src={opp.image_url} alt={opp.title} />
                  </div>
                  <div className="opp-content">
                    <h3>{opp.title}</h3>
                    <p>{opp.excerpt}</p>
                  </div>
                </a>
              ))}
            </div>
          )}

          <p className="opps-thanks"><strong>Thanks for reading.</strong></p>
        </article>

        <Sidebar />
      </div>
    </div>
  );
}

export default Opportunities;