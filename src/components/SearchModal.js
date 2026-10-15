import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './SearchModal.css';

// bolds the part of the title the user has typed so far
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

    const onEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

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
      const { data, error } = await supabase.rpc('search_everything', {
        search_term: trimmed,
        max_results: 10,
      });

      if (cancelled) return;

      if (error) {
        console.error('Search error:', error);
        setSuggestions([]);
        setStatus('error');
      } else {
        cache.current[key] = data || [];
        setSuggestions(data || []);
        setStatus('done');
      }
      setActiveIndex(-1);
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
      navigate(suggestions[activeIndex].result_url);
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
            placeholder="Search courses, blog, jobs, opportunities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={suggestions.length > 0}
            aria-controls="sm-suggestion-list"
            aria-activedescendant={activeIndex >= 0 ? `sm-option-${activeIndex}` : undefined}
          />
        </form>

        {hasQuery && suggestions.length > 0 && (
          <ul
            id="sm-suggestion-list"
            role="listbox"
            className={`sm-suggestions ${status === 'loading' ? 'sm-dim' : ''}`}
          >
            {suggestions.map((item, i) => (
              <li
                id={`sm-option-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                key={`${item.result_type}-${item.result_id}`}
                className={i === activeIndex ? 'active' : ''}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onClose();
                  navigate(item.result_url);
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className="sm-suggestion-word">
                  {highlight(item.result_title, typed)}
                  {item.match_quality !== 'fallback' && item.result_subtitle && (
                    <span className="sm-suggestion-sub">
                      {' — '}{item.result_subtitle.substring(0, 60)}
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

        {hasQuery && status === 'error' && (
          <p className="sm-hint">Search is not working right now. Please try again.</p>
        )}

      </div>
    </div>
  );
}

export default SearchModal;