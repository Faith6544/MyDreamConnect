import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';
import { supabase } from '../lib/supabase';
import './BoardMembers.css';

// the board strip, reads the same team_members table the admin Team editor saves to
export default function BoardMembers({ category = 'Board of Directors', limit = 8, title = 'Board Members' }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('id, name, role, image_url, order_index') // only what the cards show, no long bios
        .eq('category', category)
        .order('order_index', { ascending: true })
        .limit(limit);

      if (error) console.error('Board fetch error:', error);
      if (!cancelled) setMembers(data || []);
    };

    load();
    return () => { cancelled = true; };
  }, [category, limit]);

  if (members.length === 0) return null; // nothing to show yet, so the section stays out of the way

  return (
    <section className="bm-section">
      <div className="bm-inner">
        <div className="bm-heading-row">
          <h2 className="bm-title">
            <span className="bm-lead">Meet Our</span> <span className="bm-main">{title}</span>
          </h2>
          <Link to="/about/team" className="bm-link">Meet the Full Team →</Link>
        </div>

        <div className="bm-grid">
          {members.map((m) => (
            <div className="bm-card" key={m.id}>
              <div className="bm-photo">
                <ImageWithFallback src={m.image_url} alt={m.name} type="human" />
              </div>
              <h3 className="bm-name">{m.name}</h3>
              <p className="bm-role">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
