import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Search.css';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${process.env.REACT_APP_WP_API}/wp/v2/search?search=${encodeURIComponent(query)}&per_page=20&_embed`)
      .then(res => res.json())
      .then(data => {
        setResults(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Search error:', err);
        setError('Could not run search. Please try again.');
        setLoading(false);
      });
  }, [query]);

  const stripHtml = (html = '') => html.replace(/<[^>]+>/g, '');

  // Map WP search types to frontend routes
  const getResultLink = (item) => {
    if (item.subtype === 'post') return `/blog/${item.id}`;
    if (item.subtype === 'page') return `/${item.slug}`;
    if (item.subtype === 'lp_course') return `/courses/${item.id}`;
    return '#';
  };

  return (
    <div className="search-page">

      <section className="search-banner">
        <h1>Search Results</h1>
        <p>Home / Search</p>
      </section>

      <section className="search-content">

        {query && (
          <p className="search-query-line">
            Search results for: <strong>"{query}"</strong>
          </p>
        )}

        {loading && <p className="search-status">Searching...</p>}

        {error && <p className="search-status error">{error}</p>}

        {!loading && !error && query && results.length === 0 && (
          <p className="search-status">
            No results found for "{query}". Try a different keyword.
          </p>
        )}

        {!loading && !error && !query && (
          <p className="search-status">
            Type something in the search box to get started.
          </p>
        )}

        {!loading && results.length > 0 && (
          <div className="search-list">
            {results.map(item => {
              const title = stripHtml(item.title || 'Untitled');
              const type = item.subtype || item.type || 'content';
              return (
                <Link
                  to={getResultLink(item)}
                  className="search-result"
                  key={`${item.id}-${item.subtype}`}
                >
                  <span className="search-result-type">{type}</span>
                  <h3>{title}</h3>
                  <span className="search-result-url">{item.url}</span>
                </Link>
              );
            })}
          </div>
        )}

      </section>
    </div>
  );
}

export default Search;