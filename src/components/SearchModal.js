import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchModal.css';
import { supabase } from '../lib/supabase';

function SearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [allWords, setAllWords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
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

  // Load word dictionary — posts only for now
  useEffect(() => {
    const loadWords = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('title');

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
    const trimmed = query.trim().toLowerCase();

    if (trimmed.length < 2) {
      setSuggestions([]);
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
      .slice(0, 10);

    setSuggestions(matches);
    setActiveIndex(-1);
  }, [query, allWords]);

  const commitSearch = (value) => {
    if (!value.trim()) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTerm = activeIndex >= 0 && suggestions[activeIndex]
      ? suggestions[activeIndex]
      : query;
    commitSearch(finalTerm);
  };

  const handleSuggestionClick = (word) => {
    commitSearch(word);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + suggestions.length) % suggestions.length);
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
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
        </form>

        {hasQuery && suggestions.length > 0 && (
          <ul className="sm-suggestions">
            {suggestions.map((word, i) => {
              const idx = word.indexOf(query.trim().toLowerCase());
              const before = word.slice(0, idx);
              const match = word.slice(idx, idx + query.trim().length);
              const after = word.slice(idx + query.trim().length);

              return (
                <li
                  key={word}
                  className={i === activeIndex ? 'active' : ''}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(word);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <span className="sm-suggestion-icon">🔍</span>
                  <span className="sm-suggestion-word">
                    {before}
                    <strong>{match}</strong>
                    {after}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {hasQuery && suggestions.length === 0 && (
          <p className="sm-hint">No suggestions for "{query}"</p>
        )}

      </div>
    </div>
  );
}

export default SearchModal;