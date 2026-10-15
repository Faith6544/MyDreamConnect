import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './SearchModal.css';

function SearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);
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
      return;
    }

    setSearching(true);

    const timeoutId = setTimeout(async () => {
      const { data, error } = await supabase.rpc('search_everything', {
        search_term: trimmed,
        max_results: 10,
      });

      if (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } else {
        setSuggestions(data || []);
      }
      setSearching(false);
      setActiveIndex(-1);
    }, 150);

    return () => clearTimeout(timeoutId);
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

  const hasQuery = query.trim().length >= 2;

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
          />
        </form>

        {hasQuery && searching && suggestions.length === 0 && (
          <p className="sm-hint">Searching...</p>
        )}

        {hasQuery && !searching && suggestions.length > 0 && (
          <ul className="sm-suggestions">
            {suggestions.map((item, i) => (
              <li
                key={`${item.result_type}-${item.result_id}`}
                className={i === activeIndex ? 'active' : ''}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onClose();
                  navigate(item.result_url);
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className={`sm-type sm-type-${item.result_type}`}>
                  {item.result_type}
                </span>
                <span className="sm-suggestion-word">
                  {item.result_title}
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

      </div>
    </div>
  );
}

export default SearchModal;