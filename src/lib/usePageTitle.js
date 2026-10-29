import { useEffect } from 'react';

// sets the browser tab title for a page, and puts the old one back when you leave
export default function usePageTitle(title) {
  useEffect(() => {
    const before = document.title;
    if (title) document.title = `${title} | MyDreamConnect`;
    return () => {
      document.title = before;
    };
  }, [title]);
}