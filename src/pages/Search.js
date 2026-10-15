import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
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

    const runSearch = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('search_everything', {
        search_term: query.trim(),
        max_results: 50,
      });

      if (error) {
        console.error('Search error:', error);
        setError('Could not run search. Please try again.');
      } else {
        setResults(data || []);
      }
      setLoading(false);
    };

    runSearch();
  }, [query]);

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

        {!loading && !error && !query && (
          <p className="search-status">
            Type something in the search box to get started.
          </p>
        )}

        {!loading && !error && query && results.length > 0 && (
          <>
            <p className="search-count">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
            <div className="search-list">
              {results.map(item => (
                <Link
                  to={item.result_url}
                  className="search-result"
                  key={`${item.result_type}-${item.result_id}`}
                >
                  <span className={`search-result-type type-${item.result_type}`}>
                    {item.result_type}
                  </span>
                  <div className="search-result-body">
                    <h3>{item.result_title || 'Untitled'}</h3>
                    {item.match_quality !== 'fallback' && item.result_subtitle && (
                      <p>{item.result_subtitle.substring(0, 140)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

      </section>
    </div>
  );
}

export default Search;