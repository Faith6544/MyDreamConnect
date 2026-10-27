import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './SearchModal.css';

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

    let cancelled = false;
    setStatus('loading');

    const timeoutId = setTimeout(async () => {
      // Standard Search instead of AI
      try {
        const { data: courses } = await supabase.from('courses').select('*').ilike('name', `%${trimmed}%`).limit(5);
        const { data: posts } = await supabase.from('posts').select('*').ilike('title', `%${trimmed}%`).limit(5);

        if (cancelled) return;

        const results = [
          ...(courses || []).map(c => ({ type: 'Course', id: c.id, title: c.name, subtitle: c.excerpt, url: `/courses/${c.id}` })),
          ...(posts || []).map(p => ({ type: 'Post', id: p.id, title: p.title, subtitle: p.excerpt, url: `/blog/${p.id}` }))
        ];

        setSuggestions(results);
        setStatus('done');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
      setActiveIndex(-1);
    }, 300);

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
            placeholder="Search courses, blog, jobs..."
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
                </span>
              </li>
            ))}
          </ul>
        )}

        {hasQuery && status === 'loading' && suggestions.length === 0 && (
          <p className="sm-hint">Searching...</p>
        )}
        {hasQuery && status === 'done' && suggestions.length === 0 && (
          <p className="sm-hint">Nothing found for "{typed}".</p>
        )}
      </div>
    </div>
  );
}

export default SearchModal;