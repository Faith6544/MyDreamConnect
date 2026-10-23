import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './SearchModal.css';

// ADD STATIC PAGES TO MODAL TOO
const staticPages = [
  { title: 'Home', subtitle: 'Welcome to MyDreamConnect', url: '/', keywords: 'home start dream connect' },
  { title: 'About Us', subtitle: 'Learn about our mission and vision', url: '/about', keywords: 'about mission vision dream connect' },
  { title: 'Contact Us', subtitle: 'Get in touch with our team', url: '/contact', keywords: 'contact email phone message' },
  { title: 'Donate', subtitle: 'Support our mission', url: '/donate', keywords: 'donate give money support' },
  { title: 'Partnership', subtitle: 'Partner with us', url: '/partnership', keywords: 'partner sponsor collaborate' },
  { title: 'Talent Marketplace', subtitle: 'Discover talented individuals', url: '/talent/all', keywords: 'talent hire freelancer marketplace' },
  { title: 'Blogs', subtitle: 'Read our latest articles', url: '/blog', keywords: 'blog post article news' },
  { title: 'Courses', subtitle: 'Browse our courses', url: '/courses', keywords: 'course learn academy training' },
  { title: 'Jobs', subtitle: 'View job openings', url: '/talent/jobs', keywords: 'job work career opening' },
  { title: 'Flyers', subtitle: 'Download media resources', url: '/media/flyers', keywords: 'flyer media download resource' },
];

function highlight(text, typed) {
  if (!text) return '';
  const start = text.toLowerCase().indexOf(typed.toLowerCase());
  if (start === -1) return text;
  const end = start + typed.length;
  return (
    <>
      {text.slice(0, start)}
      <strong>{text.slice(start, end)}</strong>
      {text.slice(end)}
    </>
  );
}

function SearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [status, setStatus] = useState('idle');
  const inputRef = useRef(null);
  const cache = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setActiveIndex(-1);
      setStatus('idle');
      return;
    }

    const key = trimmed.toLowerCase();
    if (cache.current[key]) {
      setSuggestions(cache.current[key]);
      setActiveIndex(-1);
      setStatus('done');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    const timeoutId = setTimeout(async () => {
      const term = trimmed.toLowerCase();

      try {
        let allResults = [];

        // 1. SEARCH STATIC PAGES
        const matchedPages = staticPages.filter(page => 
          page.title.toLowerCase().includes(term) || 
          page.subtitle.toLowerCase().includes(term) ||
          page.keywords.includes(term)
        ).map(page => ({
          type: 'Page', id: page.url, title: page.title, subtitle: page.subtitle, url: page.url
        }));
        allResults = [...allResults, ...matchedPages];

        // 2. SEARCH DATABASE
        // Only the columns needed for matching/preview are fetched, and the
        // result set is capped - a full `select('*')` of every table on each
        // keystroke is megabytes of payload.
        const [postsRes, coursesRes, jobsRes] = await Promise.allSettled([
          supabase.from('posts').select('id, title, excerpt').limit(200),
          supabase.from('courses').select('id, name, excerpt').limit(200),
          supabase.from('jobs').select('id, title, description').limit(200),
        ]);

        // Every word typed must appear somewhere, so "digital marketing"
        // matches even when the phrase is not stored verbatim.
        const tokens = term.split(/\s+/).filter(Boolean);
        const matchesAllTokens = (row) => {
          if (!row) return false;
          const haystack = Object.values(row)
            .filter((value) => typeof value === 'string')
            .join(' ')
            .toLowerCase();
          return tokens.every((token) => haystack.includes(token));
        };

        if (postsRes.status === 'fulfilled' && postsRes.value.data) {
          postsRes.value.data.filter(matchesAllTokens).forEach(p => {
            allResults.push({ type: 'Post', id: p.id, title: p.title, subtitle: p.excerpt, url: `/blog/${p.id}` });
          });
        }

        if (coursesRes.status === 'fulfilled' && coursesRes.value.data) {
          coursesRes.value.data.filter(matchesAllTokens).forEach(c => {
            allResults.push({ type: 'Course', id: c.id, title: c.name, subtitle: c.excerpt, url: `/courses/${c.id}` });
          });
        }

        if (jobsRes.status === 'fulfilled' && jobsRes.value.data) {
          jobsRes.value.data.filter(matchesAllTokens).forEach(j => {
            // There is no /jobs/:id route.
            allResults.push({ type: 'Job', id: j.id, title: j.title, subtitle: j.description, url: '/talent/jobs' });
          });
        }

        if (cancelled) return;

        const finalResults = allResults.slice(0, 10); // Limit to 10
        cache.current[key] = finalResults;
        setSuggestions(finalResults);
        setStatus('done');
      } catch (err) {
        console.error("Search error:", err);
        if (!cancelled) {
          setSuggestions([]);
          setStatus('error');
        }
      } finally {
        if (!cancelled) setActiveIndex(-1);
      }
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [query]);

  const commitSearch = (value) => {
    if (!value.trim()) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    commitSearch(query);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      onClose();
      navigate(suggestions[activeIndex].url);
    }
  };

  const typed = query.trim();
  const hasQuery = typed.length >= 2;

  return (
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-box" onClick={(e) => e.stopPropagation()}>
        <button className="sm-close" onClick={onClose} aria-label="Close search">×</button>

        <form className="sm-search-bar" onSubmit={handleSubmit}>
          <span className="sm-search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search courses, pages, blog..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
        </form>

        {hasQuery && suggestions.length > 0 && (
          <ul className={`sm-suggestions ${status === 'loading' ? 'sm-dim' : ''}`}>
            {suggestions.map((item, i) => (
              <li
                key={`${item.type}-${item.id}`}
                className={i === activeIndex ? 'active' : ''}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onClose();
                  navigate(item.url);
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className={`sm-type sm-type-${item.type.toLowerCase()}`}>
                  {item.type}
                </span>
                <span className="sm-suggestion-word">
                  {highlight(item.title, typed)}
                  {item.subtitle && (
                    <span className="sm-suggestion-sub">
                      {' — '}{item.subtitle.substring(0, 60)}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}

        {hasQuery && status === 'loading' && suggestions.length === 0 && (
          <p className="sm-hint">Searching...</p>
        )}
        {hasQuery && status === 'done' && suggestions.length === 0 && (
          <p className="sm-hint">Nothing found for "{typed}". Try another word.</p>
        )}
      </div>
    </div>
  );
}

export default SearchModal;