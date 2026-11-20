import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { useMotionValue } from 'framer-motion';

// Framer's useReducedMotion reads the preference once per mount, so a change made while the
// page is open would not stop a running effect.
function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    // The server cannot know the preference, so an effect starts only after hydration.
    () => false,
  );
}

export const useAllowsMotion = () =>
  useMediaQuery('(prefers-reduced-motion: no-preference)');

/**
 * Props for a child that rises `distance` px while its parent's "hover" variant is active.
 * Framer 10 fires whileHover on touch taps too, so the lift also needs a hover-capable pointer.
 */
export function useHoverLift(distance) {
  const allowed = useMediaQuery(
    '(hover: hover) and (prefers-reduced-motion: no-preference)',
  );
  const y = useMotionValue(0);
  // A hovered child ignores its new variant target until hover ends, so drop it to rest now.
  useEffect(() => {
    if (!allowed) y.jump(0);
  }, [allowed, y]);
  return { style: { y }, variants: { hover: { y: allowed ? -distance : 0 } } };
}
