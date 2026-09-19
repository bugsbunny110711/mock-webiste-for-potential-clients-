'use client';

import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

/**
 * True only after hydration. Used to gate portals — reading `document` during
 * render would break SSR, and setting state in an effect causes a cascading
 * render that React 19 rightly complains about.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Subscribes to a media query without setState-in-effect. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', callback);
      return () => list.removeEventListener('change', callback);
    },
    () => window.matchMedia(query).matches,
    // The server cannot know the pointer type; assume coarse so the static
    // fallback is what gets rendered first.
    () => false,
  );
}
