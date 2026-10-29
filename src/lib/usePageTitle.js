import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | MyDreamConnect`;
    } else {
      document.title = 'MyDreamConnect | Life skills and tech training for young people';
    }
  }, [title]);
}