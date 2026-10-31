import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TeamGrid from './TeamGrid';
import { supabase } from '../lib/supabase';
import './BoardMembers.css';

// the board strip for Home and Blog, same round photos as the Team section
export default function BoardMembers({ category = 'Board of Directors', limit = 10, title = 'Meet Our Board' }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('id, name, role, image_url, order_index') // only what the circles show
        .eq('category', category)
        .order('order_index', { ascending: true })
        .limit(limit);

      if (error) console.error('Board fetch error:', error);
      if (!cancelled) setMembers(data || []);
    };

    load();
    return () => { cancelled = true; };
  }, [category, limit]);

  if (members.length === 0) return null; // nothing yet, so the section stays out of the way

  return (
    <section className="bm-section">
      <div className="bm-inner">
        <h2 className="bm-title">{title}</h2>
        <TeamGrid members={members} />
        <div className="bm-more">
          <Link to="/about#team" className="bm-link">Meet the Full Team →</Link>
        </div>
      </div>
    </section>
  );
}
