'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const EXIT_MS = 200;

/**
 * Gives a modal an exit animation. `requestClose` flips `closing` (the CSS
 * plays the reverse animation) and calls `onClose` once it has finished.
 * Also wires Escape and body scroll-lock, since every modal wants both.
 */
export function useModalClose(onClose: () => void) {
  const [closing, setClosing] = useState(false);
  const timer = useRef<number | null>(null);

  const requestClose = useCallback(() => {
    if (timer.current !== null) return;
    setClosing(true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = window.setTimeout(onClose, reduced ? 0 : EXIT_MS);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [requestClose]);

  return { closing, requestClose };
}
