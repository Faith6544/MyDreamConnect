import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SearchModal.css';

function SearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Focus the input when the modal opens. Escape closes it.
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

  // Search only when the user has typed something
  useEffect(() => {
    const q = query.trim();

    // Empty query — do not fetch anything
    if (q.length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    Promise.all([
      fetch(`https://staging.mydreamconnect.org.ng/wp-json/wp/v2/posts?search=${encodeURIComponent(q)}&per_page=8`, { signal: controller.signal })
        .then(res => res.json())
        .catch(() => []),
      fetch(`https://staging.mydreamconnect.org.ng/wp-json/wp/v2/pages?search=${encodeURIComponent(q)}&per_page=8`, { signal: controller.signal })
        .then(res => res.json())
        .catch(() => []),
      fetch(`https://staging.mydreamconnect.org.ng/wp-json/learnpress/v1/courses`, { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
          if (!Array.isArray(data)) return [];
          return data
            .filter(c => c.name.toLowerCase().includes(q.toLowerCase()))
            .slice(0, 8);
        })
        .catch(() => []),
    ])
      .then(([posts, pages, courses]) => {
        const merged = [
          ...courses.map(c => ({
            type: 'Course',
            id: `course-${c.id}`,
            title: c.name,
            url: `/courses/${c.id}`,
          })),
          ...posts.map(p => ({
            type: 'Blog',
            id: `post-${p.id}`,
            title: p.title?.rendered?.replace(/<[^>]+>/g, '') || '',
            url: `/blog/${p.id}`,
          })),
          ...pages.map(p => ({
            type: 'Page',
            id: `page-${p.id}`,
            title: p.title?.rendered?.replace(/<[^>]+>/g, '') || '',
            url: `/${p.slug}`,
          })),
        ];
        setResults(merged);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => controller.abort();
  }, [query]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-box" onClick={(e) => e.stopPropagation()}>

        <button
          className="sm-close"
          onClick={onClose}
          aria-label="Close search"
        >
          ×
        </button>

        <div className="sm-search-bar">
          <span className="sm-search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search courses, blog posts, pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {hasQuery && (
          <div className="sm-results">

            {loading && <p className="sm-hint">Searching...</p>}

            {!loading && results.length > 0 && (
              <ul className="sm-list">
                {results.map(r => (
                  <li key={r.id}>
                    <Link to={r.url} onClick={onClose}>
                      <span className={`sm-type sm-type-${r.type.toLowerCase()}`}>
                        {r.type}
                      </span>
                      <span className="sm-title">{r.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {!loading && results.length === 0 && (
              <p className="sm-hint">No results for "{query}".</p>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default SearchModal;