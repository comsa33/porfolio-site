import { flushSync } from 'react-dom';
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

/**
 * Opens or closes a row in a one-open-at-a-time list, without the page
 * shifting under the reader.
 *
 * Opening a row closes the one that was open. When that one sits above and
 * its fold would pull the tapped row's top out of sight — because it is off
 * screen already, or tall enough — it is closed at once, without the
 * animation, and the page is scrolled by exactly the height it lost in the
 * same frame: the tapped row does not move and opens where it was tapped.
 * (Chrome does this on its own as scroll anchoring; Safari does not.) When
 * the fold leaves the tapped row in view, it runs as usual — the cause of the
 * movement is on screen, so nothing is corrected.
 *
 * And if the tapped row's top was already under the header, the page scrolls
 * once, smoothly, to bring it out.
 */
export function toggleInPlace(row: HTMLElement, commit: () => void): void {
  const header = document.querySelector('header');
  // The header can scroll away on narrow screens, so the floor is whichever
  // is lower: the header's bottom edge or the top of the screen.
  const floor = Math.max(0, header?.getBoundingClientRect().bottom ?? 0) + 12;
  const opening = !row.hasAttribute('data-open');
  const prev = row.parentElement?.querySelector<HTMLElement>(':scope > [data-open]');
  // How far the row would be pulled up if the open one folded away with its
  // animation: the height of that one's details panel, when it sits above.
  const rowTop = row.getBoundingClientRect().top;
  const above = Boolean(prev && prev !== row && prev.getBoundingClientRect().top < rowTop);
  const shrink = above
    ? (prev!.querySelector<HTMLElement>('[data-details]')?.getBoundingClientRect().height ?? 0)
    : 0;
  const snap =
    opening && above && (prev!.getBoundingClientRect().bottom <= floor || rowTop - shrink < floor);

  const before = snap ? prev!.getBoundingClientRect().height : 0;
  if (snap) prev!.setAttribute('data-snap', '');

  flushSync(commit);

  if (snap) {
    const lost = before - prev!.getBoundingClientRect().height;
    if (lost > 0) window.scrollTo({ top: window.scrollY - lost, behavior: 'instant' });
    requestAnimationFrame(() => prev!.removeAttribute('data-snap'));
  }

  if (opening) {
    const top = row.getBoundingClientRect().top;
    if (top < floor) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: window.scrollY - (floor - top),
        behavior: reduce ? 'instant' : 'smooth',
      });
    }
  }
}
