import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { supabase } from '../lib/supabase';

const ACCESS_KEY = '7ccbf4db-5413-4d7f-8537-2ee111f3832f';

function SearchForm() {
  const [term, setTerm] = useState('');
  const [allWords, setAllWords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWords = async () => {
      const { data, error } = await supabase.from('posts').select('title');
      if (error) {
        console.error('Search dictionary error:', error);
        return;
      }
      const words = new Set();
      const collect = (text) => {
        if (!text) return;
        text
          .toLowerCase()
          .split(/[\s\-_,.;:!?()[\]{}"'/\\|]+/)
          .forEach(w => {
            const clean = w.replace(/[^a-z0-9]/g, '');
            if (clean.length >= 3) words.add(clean);
          });
      };
      (data || []).forEach(p => collect(p.title));
      setAllWords(Array.from(words).sort());
    };
    loadWords();
  }, []);

  useEffect(() => {
    const trimmed = term.trim().toLowerCase();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setActiveIndex(-1);
      return;
    }

    const matches = allWords
      .filter(w => w.startsWith(trimmed) || w.includes(trimmed))
      .sort((a, b) => {
        const aStarts = a.startsWith(trimmed) ? 0 : 1;
        const bStarts = b.startsWith(trimmed) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return a.localeCompare(b);
      })
      .slice(0, 8);

    setSuggestions(matches);
    setShowDropdown(matches.length > 0);
    setActiveIndex(-1);
  }, [term, allWords]);

  const commitSearch = (value) => {
    if (!value.trim()) return;
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTerm = activeIndex >= 0 && suggestions[activeIndex]
      ? suggestions[activeIndex]
      : term;
    commitSearch(finalTerm);
  };

  const handleSuggestionClick = (word) => {
    setTerm(word);
    setShowDropdown(false);
    commitSearch(word);
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  const handleFocus = () => {
    if (term.trim().length >= 2 && suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="sidebar-search-wrap">
      <form className="sidebar-search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder=""
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>

      {showDropdown && (
        <div className="sidebar-suggestions">
          {suggestions.map((word, i) => {
            const idx = word.indexOf(term.trim().toLowerCase());
            const before = word.slice(0, idx);
            const match = word.slice(idx, idx + term.trim().length);
            const after = word.slice(idx + term.trim().length);

            return (
              <div
                key={word}
                className={`suggestion-item ${i === activeIndex ? 'active' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(word);
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className="suggestion-icon">🔍</span>
                <span className="suggestion-word">
                  {before}
                  <strong>{match}</strong>
                  {after}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Sidebar({ showComments = false, showSubscribe = true }) {
  const [posts, setPosts] = useState([]);
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subscribeData, setSubscribeData] = useState({ name: '', email: '' });
  const [subscribeStatus, setSubscribeStatus] = useState('idle');

  useEffect(() => {
    const fetchSidebarData = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Sidebar fetch error:', error);
        setLoading(false);
        return;
      }

      const safePosts = data || [];
      setPosts(safePosts.slice(0, 5));

      const monthNames = [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
      ];
      const archiveMap = {};
      safePosts.forEach(p => {
        const d = new Date(p.created_at);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        archiveMap[key] = (archiveMap[key] || 0) + 1;
      });
      const archiveList = Object.keys(archiveMap).map(k => ({
        label: k,
        count: archiveMap[k],
      }));
      setArchives(archiveList);

      setLoading(false);
    };

    fetchSidebarData();
  }, []);

  const handleSubscribeChange = (e) => {
    setSubscribeData({ ...subscribeData, [e.target.name]: e.target.value });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribeStatus('sending');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: 'New Newsletter Subscriber - MyDreamConnect',
          from_name: 'MyDreamConnect Website',
          name: subscribeData.name,
          email: subscribeData.email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubscribeStatus('success');
        setSubscribeData({ name: '', email: '' });
        setTimeout(() => setSubscribeStatus('idle'), 6000);
      } else {
        setSubscribeStatus('error');
        setTimeout(() => setSubscribeStatus('idle'), 6000);
      }
    } catch (err) {
      console.error('Subscribe error:', err);
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus('idle'), 6000);
    }
  };

  return (
    <aside className="sidebar">

      <div className="widget">
        <h3>Search</h3>
        <SearchForm />
      </div>

      <div className="widget">
        <h3>Recent Posts</h3>
        {loading ? (
          <p className="widget-loading">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="widget-loading">No posts yet.</p>
        ) : (
          <ul className="widget-list">
            {posts.map(p => (
              <li key={p.id}>
                <Link to={`/blog/${p.id}`}>{p.title || 'Untitled'}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showComments && (
        <div className="widget">
          <h3>Recent Comments</h3>
          <p className="widget-loading">Comments coming soon.</p>
        </div>
      )}

      <div className="widget">
        <h3>Archives</h3>
        {loading ? (
          <p className="widget-loading">Loading...</p>
        ) : archives.length === 0 ? (
          <p className="widget-loading">No archives yet.</p>
        ) : (
          <ul className="widget-list">
            {archives.map((a, i) => (
              <li key={i}>
                <Link to="/blog">{a.label} ({a.count})</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showSubscribe && (
        <div className="widget">
          <h3>Subscribe</h3>

          {subscribeStatus === 'success' && (
            <div className="sidebar-msg success">
              ✅ Subscribed! Check your inbox.
            </div>
          )}

          {subscribeStatus === 'error' && (
            <div className="sidebar-msg error">
              ❌ Something went wrong. Try again.
            </div>
          )}

          <form className="sidebar-subscribe" onSubmit={handleSubscribe}>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={subscribeData.name}
              onChange={handleSubscribeChange}
              required
              disabled={subscribeStatus === 'sending'}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={subscribeData.email}
              onChange={handleSubscribeChange}
              required
              disabled={subscribeStatus === 'sending'}
            />
            <button type="submit" disabled={subscribeStatus === 'sending'}>
              {subscribeStatus === 'sending' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      )}

    </aside>
  );
}

export default Sidebar;