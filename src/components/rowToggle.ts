import type React from 'react';

/**
 * Whether a click on a list row should toggle it. Clicks that land on a link
 * or button inside the row belong to that control, and a click that ends a
 * text selection is the reader copying something, not asking to fold the row.
 */
export function isRowToggleClick(e: React.MouseEvent<HTMLElement>): boolean {
  const target = e.target as HTMLElement;
  if (target.closest('a, button, input, select, textarea, [role="button"]')) return false;
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) return false;
  return true;
}

/** Reads a duration token such as --dur-slow, in milliseconds. */
function tokenMs(name: string, fallback: number): number {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseFloat(v);
  return Number.isFinite(n) ? (v.endsWith('s') && !v.endsWith('ms') ? n * 1000 : n) : fallback;
}

/** cubic-bezier(0.16, 1, 0.3, 1) — the --ease-out token, evaluated in JS. */
function easeOut(t: number): number {
  const [x1, y1, x2, y2] = [0.16, 1, 0.3, 1];
  const bez = (a: number, b: number, s: number) =>
    3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (bez(x1, x2, mid) < t) lo = mid;
    else hi = mid;
  }
  return bez(y1, y2, (lo + hi) / 2);
}

/**
 * Makes sure an opened row's top is on screen, not under the header.
 *
 * Opening a row closes whichever was open, and when that one sits above, its
 * collapse pulls the new row up until its top goes under the header. So the
 * row is steered every frame of the fold: it stays where it was tapped, and
 * if its top was already under the header it glides down to just below it.
 * The glide uses the site's ease-out and the fold's own duration.
 *
 * Any wheel, touch or key from the reader ends it at once: the page follows
 * the reader, it never holds on to the scroll against them.
 */
export function settleRow(row: HTMLElement): void {
  const header = document.querySelector('header');
  const floor = (header?.getBoundingClientRect().bottom ?? 0) + 12;
  const start = row.getBoundingClientRect().top;
  const target = Math.max(start, floor);

  const duration = tokenMs('--dur-slow', 640) + 60;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let stopped = false;
  const stop = () => {
    stopped = true;
  };
  const inputs = ['wheel', 'touchstart', 'keydown'] as const;
  inputs.forEach((t) => window.addEventListener(t, stop, { passive: true, once: true }));
  const cleanup = () => inputs.forEach((t) => window.removeEventListener(t, stop));

  const t0 = performance.now();
  const tick = (now: number) => {
    if (stopped) return cleanup();
    const k = Math.min(1, (now - t0) / duration);
    const want = start + (target - start) * (reduce ? 1 : easeOut(k));
    const drift = row.getBoundingClientRect().top - want;
    // 'instant', because the page sets scroll-behavior: smooth and a smooth
    // correction would trail the fold by a frame and read as a wobble.
    if (Math.abs(drift) >= 0.5) {
      window.scrollTo({ top: window.scrollY + drift, behavior: 'instant' });
    }
    if (k < 1) requestAnimationFrame(tick);
    else cleanup();
  };
  requestAnimationFrame(tick);
}
