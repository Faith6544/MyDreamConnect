import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Search.css';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!query.trim()) return;

    const runAISearch = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        // 1. Use raw fetch exactly like the working Node script
        const response = await fetch('https://kzdqbqnyytgovlngfvwr.supabase.co/functions/v1/generate-embedding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // We pass your Anon Key here for browser security
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6ZHFicW55eXRnb3ZsbmdmdndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NTM5MDYsImV4cCI6MjEwNjUyOTkwNn0.mZRkjzbwW8eBAWWJs6O23AxjiskF2m3iH9LjZy1zreM',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6ZHFicW55eXRnb3ZsbmdmdndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NTM5MDYsImV4cCI6MjEwNjUyOTkwNn0.mZRkjzbwW8eBAWWJs6O23AxjiskF2m3iH9LjZy1zreM'
          },
          body: JSON.stringify({ text: query })
        });

        if (!response.ok) {
          throw new Error(`Edge Function failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.embedding) throw new Error("No embedding returned");

        // 2. Search the database
        const { data: dbResults, error: dbError } = await supabase.rpc('match_documents', {
          query_embedding: data.embedding,
          match_threshold: 0.5, 
          match_count: 20
        });

        if (dbError) throw dbError;

        setResults(dbResults || []);
      } catch (err) {
        console.error("AI Search failed:", err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    runAISearch();
  }, [query]);

  return (
    <div className="search-page">
      <div className="search-container">
        <h1 className="search-title">AI Search Results</h1>
        {query && <p className="search-subtitle">Showing results for: <strong>"{query}"</strong></p>}

        <section className="search-content">
          {loading && <p className="search-status">Asking the AI...</p>}
          {errorMsg && <p className="search-status" style={{ color: 'red' }}>Error: {errorMsg}</p>}
          
          {!loading && !errorMsg && query && results.length === 0 && (
            <p className="search-status">No results found for "{query}".</p>
          )}

          {!loading && !errorMsg && query && results.length > 0 && (
            <div className="search-list">
              {results.map((item, index) => (
                <Link to={item.url} className="search-result" key={index}>
                  <div className="search-result-body">
                    <h3>{item.title}</h3>
                    <p>...{item.content.substring(0, 120)}...</p>
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