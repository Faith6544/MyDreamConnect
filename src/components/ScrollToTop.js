import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  // Include `search` so /search?q=... and ?page=2 style links still scroll up.
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Hash links (e.g. /about#team) should jump to the section, not the top.
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, search, hash]);

  return null;
}
