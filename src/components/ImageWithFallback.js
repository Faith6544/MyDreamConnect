import React, { useState } from 'react';

export default function ImageWithFallback({ src, alt, type = 'default', ...props }) {
  const [error, setError] = useState(false);

  // If no src or error, show placeholder
  if (!src || error) {
    return (
      <div style={{ width: '100%', height: '100%', background: '#f1f1f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '24px', opacity: 0.3 }}>🖼️</span>
      </div>
    );
  }

  // Only transform Supabase URLs
  let finalSrc = src;
  if (src.includes('supabase.co/storage/v1/object/public/')) {
    // Replace the "object" route with the "render" route for transformations
    finalSrc = src.replace('/object/public/', '/render/image/public/');
    
    // Add query parameters for size and format
    // Width 600 is good for cards. Format webp is very small.
    const separator = finalSrc.includes('?') ? '&' : '?';
    finalSrc = `${finalSrc}${separator}width=600&quality=75&format=webp`;
  }

  return (
    <img
      src={finalSrc}
      alt={alt || ''}
      loading="lazy" // This is CRUCIAL for smooth scrolling
      onError={() => setError(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      {...props}
    />
  );
}