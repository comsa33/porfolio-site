'use client';

import { useEffect, useRef } from 'react';
import styles from './SectionDot.module.css';

interface SectionDotProps {
  /** id of the section currently in view; null while the hero is on screen. */
  active: string | null;
}

/**
 * One accent dot that travels down the left gutter to sit beside the heading
 * of whatever section the reader is in. Size follows the heading's type size.
 * Headings opt in with data-dot="<section id>" (the hero uses "hero").
 *
 * Positioned via FLIP-free absolute coordinates inside <main>, so a move is
 * a plain CSS transition on top/left/size. Measurements are refreshed on
 * scroll, resize, and whenever <main> changes height (a row expanding
 * shifts everything below it).
 */
export default function SectionDot({ active }: SectionDotProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const dot = ref.current;
    const main = dot?.parentElement;
    if (!dot || !main) return;

    let frame = 0;
    let ready = false;

    const place = () => {
      frame = 0;
      const id = activeRef.current ?? 'hero';
      const anchor = main.querySelector<HTMLElement>(`[data-dot="${id}"]`);
      if (!anchor) return;

      const a = anchor.getBoundingClientRect();
      const m = main.getBoundingClientRect();
      const cs = getComputedStyle(anchor);
      const fontSize = parseFloat(cs.fontSize);
      const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.4;
      const size = Math.round(fontSize * 0.55);
      const gap = Math.round(fontSize * 0.9);
      // Wide: sit in the gutter left of the heading. Narrow: headings reserve
      // an inline slot (see CSS) and the dot sits inside it, DD-style.
      const inline = window.matchMedia('(max-width: 720px)').matches;
      const x = inline ? a.left - m.left : a.left - m.left - gap - size;

      dot.style.setProperty('--size', `${size}px`);
      dot.style.transform = `translate(${Math.round(x)}px, ${Math.round(
        a.top - m.top + (lineHeight - size) / 2,
      )}px)`;

      if (!ready) {
        // First placement lands without animating; every later one glides.
        ready = true;
        requestAnimationFrame(() => dot.setAttribute('data-ready', 'true'));
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };

    place();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(main);
    document.fonts?.ready.then(schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // When the active section changes: mark the new host heading (on phones
  // its text slides right to make room, see [data-dot-active] in globals.css)
  // and re-place the dot. Nudging a scroll event reuses the throttled placer.
  useEffect(() => {
    const main = ref.current?.parentElement;
    if (!main) return;
    const id = active ?? 'hero';
    main.querySelectorAll<HTMLElement>('[data-dot]').forEach((el) => {
      el.toggleAttribute('data-dot-active', el.dataset.dot === id);
    });
    window.dispatchEvent(new Event('scroll'));
  }, [active]);

  return <span ref={ref} className={styles.dot} aria-hidden="true" />;
}
