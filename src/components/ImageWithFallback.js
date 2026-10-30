import React, { useState, useEffect } from 'react';
import './ImageWithFallback.css';

// first letters of a name, used when a person has no photo
function initialsOf(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function ImageWithFallback({ src, alt, type, style, className = '', loading = 'lazy', ...rest }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false); // a new src gets a fresh try, otherwise one bad link keeps the placeholder forever
  }, [src]);

  if (!src || error) {
    const letters = type === 'human' ? initialsOf(alt) : '';
    return (
      <div className={`mdc-img-fallback ${className}`.trim()} style={style} role="img" aria-label={alt || 'No image'}>
        {letters ? (
          // svg text scales with the box, so the same fallback works at 48px and at 600px
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <rect width="100" height="100" fill="#0a4711" />
            <text x="50" y="50" fill="#fff" fontSize="38" fontWeight="600" textAnchor="middle" dominantBaseline="central" fontFamily="Poppins, sans-serif">
              {letters}
            </text>
          </svg>
        ) : (
          <span style={{ fontSize: '20px', opacity: 0.3 }}>🖼️</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      loading={loading} // pass loading="eager" for images at the very top of a page
      decoding="async"
      onError={() => setError(true)}
      className={`mdc-img ${className}`.trim()}
      style={style}
      {...rest}
    />
  );
}