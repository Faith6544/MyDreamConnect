import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Search.css';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

// Some indexed/seeded rows still carry the old URL shapes. Map them onto the
// routes that actually exist so a result never lands on the 404 page.
const ROUTE_ALIASES = {
  '/jobs': '/talent/jobs',
  '/talent-marketplace': '/talent/all',
  '/flyers': '/media/flyers',
  '/videos': '/media/videos',
  '/photos': '/media/photos',
  '/opportunities': '/talent/opportunities',
};

function resolveUrl(url) {
  if (!url) return '/';
  const path = url.split('?')[0].replace(/\/+$/, '') || '/';
  if (ROUTE_ALIASES[path]) return ROUTE_ALIASES[path];
  if (/^\/jobs\/\d+$/.test(path)) return '/talent/jobs';
  if (/^\/photos\/\d+$/.test(path)) return '/media/photos';
  if (/^\/opportunities\/\d+$/.test(path)) return '/talent/opportunities';
  return url;
}

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setErrorMsg('');
      return;
    }

    // Guards against a slow earlier request overwriting newer results.
    let cancelled = false;

    const searchIndexFallback = async () => {
      const term = `%${trimmed}%`;
      const { data, error } = await supabase
        .from('search_index')
        .select('result_title, result_subtitle, result_url')
        .or(`result_title.ilike.${term},result_subtitle.ilike.${term}`)
        .limit(20);

      if (error) throw error;

      return (data || []).map((row) => ({
        title: row.result_title,
        content: row.result_subtitle || '',
        url: row.result_url,
      }));
    };

    const runAISearch = async () => {
      setLoading(true);
      setErrorMsg('');
      setUsedFallback(false);

      try {
        if (!SUPABASE_URL || !SUPABASE_KEY) {
          throw new Error('Search is not configured.');
        }

        const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-embedding`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
          body: JSON.stringify({ text: trimmed }),
        });

        if (!response.ok) {
          throw new Error(`Search service returned ${response.status}`);
        }

        const data = await response.json();
        if (!data.embedding) throw new Error('Search service returned no embedding');

        const { data: dbResults, error: dbError } = await supabase.rpc('match_documents', {
          query_embedding: data.embedding,
          match_threshold: 0.5,
          match_count: 20,
        });

        if (dbError) throw dbError;

        if (cancelled) return;

        if (dbResults && dbResults.length > 0) {
          setResults(dbResults);
          return;
        }

        // No vector matches (or the documents table is not readable) - fall
        // back to the plain-text index instead of showing "no results".
        const fallback = await searchIndexFallback();
        if (cancelled) return;
        setResults(fallback);
        setUsedFallback(true);
      } catch (err) {
        if (cancelled) return;
        console.error('AI Search failed:', err);

        // Still try to give the visitor something useful.
        try {
          const fallback = await searchIndexFallback();
          if (cancelled) return;
          setResults(fallback);
          setUsedFallback(true);
        } catch (fallbackErr) {
          if (cancelled) return;
          console.error('Fallback search failed:', fallbackErr);
          setErrorMsg('Search is temporarily unavailable. Please try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    runAISearch();

    return () => { cancelled = true; };
  }, [query]);

  return (
    <div className="search-page">
      <div className="search-container">
        <h1 className="search-title">Search Results</h1>
        {query && <p className="search-subtitle">Showing results for: <strong>"{query}"</strong></p>}

        <section className="search-content">
          {loading && <p className="search-status">Searching...</p>}
          {errorMsg && <p className="search-status" style={{ color: 'red' }}>Error: {errorMsg}</p>}

          {!loading && !errorMsg && query && results.length === 0 && (
            <p className="search-status">No results found for "{query}".</p>
          )}

          {!loading && !errorMsg && query && results.length > 0 && (
            <div className="search-list">
              {usedFallback && (
                <p className="search-status" style={{ fontSize: '13px', color: '#888' }}>
                  Showing text matches.
                </p>
              )}
              {results.map((item, index) => (
                <Link to={resolveUrl(item.url)} className="search-result" key={`${item.url}-${index}`}>
                  <div className="search-result-body">
                    <h3>{item.title || 'Untitled'}</h3>
                    <p>...{(item.content || '').substring(0, 120)}...</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Search;
