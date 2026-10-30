import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TalentHome.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

function parseSkills(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string' && raw.trim()) {
    return raw.replace(/[[\]"]/g, '').split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function TalentHome() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTalents = async () => {
      const { data, error } = await supabase.from('talent').select('*').order('created_at', { ascending: false });
      if (error) console.error('Talent fetch error:', error);
      else setTalents(data || []);
      setLoading(false);
    };
    fetchTalents();
  }, []);

  const filtered = talents.filter(t => {
    const q = searchQuery.toLowerCase();
    return (
      String(t.name || '').toLowerCase().includes(q) ||
      String(t.role || '').toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: '#fff', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <h1 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '40px', color: '#111' }}>Discover Talents</h1>

        <div style={{ marginBottom: '30px' }}>
          <input 
            type="text" 
            placeholder="Search talents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '50px', border: '1px solid #ddd', outline: 'none' }}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No talents found.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
            {filtered.map(talent => (
              <Link 
                to={`/talent/${talent.id}`} 
                key={talent.id} 
                style={{ display: 'flex', textDecoration: 'none', color: 'inherit', padding: '20px', border: '1px solid #eee', borderRadius: '12px', background: '#fff' }}
              >
                <div style={{ width: '80px', height: '80px', minWidth: '80px', borderRadius: '50%', overflow: 'hidden', marginRight: '20px' }}>
                  <ImageWithFallback 
                    src={talent.avatar_url} 
                    alt={talent.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', margin: '0 0 5px 0', color: '#111' }}>{talent.name}</h3>
                  <p style={{ fontSize: '15px', color: '#d4a017', margin: '0 0 10px 0' }}>{talent.role}</p>
                  <p style={{ fontSize: '14px', color: '#777', margin: 0 }}>📍 {talent.location || 'Remote'}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TalentHome;