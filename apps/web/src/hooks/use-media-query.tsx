import { useEffect, useState } from 'react';

export const MOBILE_MEDIA_QUERY = '(max-width: 768px)';

type MediaQueryCallback = (isMatching: boolean) => void;

function useMediaQuery(query: string, onMatch?: MediaQueryCallback): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const updateMatch = () => {
      const isMatching = mediaQueryList.matches;
      setMatches(isMatching);
    };
    updateMatch();
    mediaQueryList.addEventListener('change', updateMatch);
    return () => {
      mediaQueryList.removeEventListener('change', updateMatch);
    };
  }, [query]);

  useEffect(() => {
    if (onMatch) {
      onMatch(matches);
    }
  }, [matches]);

  return matches;
}

export default useMediaQuery;
