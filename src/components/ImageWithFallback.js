import React, { useState } from 'react';

export default function ImageWithFallback({ src, alt, type = 'default', style, className }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div 
        className={className} 
        style={{ 
          width: '100%', 
          height: '100%', 
          background: '#f1f1f1', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          ...style 
        }}
      >
        <span style={{ fontSize: '24px', opacity: 0.3 }}>🖼️</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      onError={() => setError(true)}
      className={className}
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover', 
        display: 'block', 
        ...style 
      }}
    />
  );
}