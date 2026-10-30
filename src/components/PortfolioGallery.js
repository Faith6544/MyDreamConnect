import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ImageWithFallback from './ImageWithFallback';
import './PortfolioGallery.css';

// thumbnails you can click, and a full size viewer with next / previous
// variant "card" shows the first few, "profile" shows all of them bigger
export default function PortfolioGallery({ images = [], name = '', max = 4, variant = 'card' }) {
  const [openAt, setOpenAt] = useState(null); // index of the open picture, null means closed

  const total = images.length;
  const shown = variant === 'profile' ? images : images.slice(0, max);
  const hidden = total - shown.length; // pictures that did not fit in the thumbnails

  useEffect(() => {
    if (openAt === null) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') setOpenAt(null);
      if (e.key === 'ArrowRight') setOpenAt((i) => (i + 1) % total);
      if (e.key === 'ArrowLeft') setOpenAt((i) => (i - 1 + total) % total);
    };
    window.addEventListener('keydown', onKey);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // page behind does not scroll while viewing

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = oldOverflow;
    };
  }, [openAt, total]);

  if (total === 0) return null;

  const step = (e, dir) => {
    e.stopPropagation(); // do not let the backdrop click close it
    setOpenAt((i) => (i + dir + total) % total);
  };

  return (
    <>
      <div className={variant === 'profile' ? 'pg-grid pg-grid-profile' : 'pg-grid'}>
        {shown.map((url, i) => (
          <button
            type="button"
            key={`${url}-${i}`}
            className="pg-thumb"
            onClick={() => setOpenAt(i)}
            aria-label={`View ${name ? name + "'s " : ''}portfolio picture ${i + 1} of ${total}`}
          >
            <ImageWithFallback src={url} alt={`${name || 'Talent'} portfolio work`} />
            {hidden > 0 && i === shown.length - 1 && <span className="pg-more">+{hidden}</span>}
          </button>
        ))}
      </div>

      {openAt !== null &&
        createPortal(
          <div className="pg-overlay" role="dialog" aria-modal="true" aria-label="Portfolio picture" onClick={() => setOpenAt(null)}>
            <button type="button" className="pg-close" onClick={() => setOpenAt(null)} aria-label="Close">×</button>

            {total > 1 && (
              <button type="button" className="pg-nav pg-prev" onClick={(e) => step(e, -1)} aria-label="Previous picture">‹</button>
            )}

            <img className="pg-full" src={images[openAt]} alt={`${name || 'Talent'} portfolio work`} onClick={(e) => e.stopPropagation()} />

            {total > 1 && (
              <button type="button" className="pg-nav pg-next" onClick={(e) => step(e, 1)} aria-label="Next picture">›</button>
            )}

            <div className="pg-count">{openAt + 1} / {total}</div>
          </div>,
          document.body
        )}
    </>
  );
}
