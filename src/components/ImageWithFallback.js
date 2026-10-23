import React, { useState, useEffect } from 'react';

function ImageWithFallback({ src, alt = '', className = '', type = 'default', ...rest }) {
  const [failed, setFailed] = useState(false);

  // Reset the failure flag when the source changes, otherwise one bad URL
  // permanently pins this component to the placeholder.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const fallback = type === 'human' ? '/placeholder1.webp' : '/placeholder.webp';
  const finalSrc = failed || !src ? fallback : src;

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (!failed) setFailed(true);
      }}
      {...rest}
    />
  );
}

export default ImageWithFallback;
