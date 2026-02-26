import { route } from 'preact-router';

export function useBack(fallback = '/') {
  return () => {
    if (history.length > 1) {
      history.back();      // Browser history back
    } else {
      route(fallback, true); // Fallback if no history
    }
  };
}