'use client';

import { useEffect, useRef } from 'react';
import styles from './TravelingDot.module.css';

interface TravelingDotProps {
  /** id of the section currently in view; null while the hero is on screen. */
  active: string | null;
}

/** Below this scroll offset the reader is "at the top" and the dot is home. */
const HOME_THRESHOLD = 8;

/** A little over the transform transition, so a return home can settle. */
const FLIGHT_MS = 600;

/** A move shorter than this is a nudge, not a journey — no deformation. */
const JOURNEY_PX = 6;

type Spot = { x: number; y: number; size: number };

/**
 * One accent dot that marks where the reader is.
 *
 * Its home is the mark before the wordmark in the header — the one accent in
 * the chrome. While it is home it is not drawn at all; the header's own mark
 * stands in. When it leaves, it appears on that mark and flies, and the mark
 * becomes the ring it left behind. So the same dot that names the site is the
 * one walking down the page, and there is never more than one of it.
 *
 * Its last move is onto the seat at the end of the closing sentence, where it
 * is the full stop rather than a mark beside a heading.
 *
 * Headings opt in with data-dot="<section id>" (the hero uses "hero"); the
 * closing seat adds data-dot-end. Positioned via absolute coordinates inside
 * <main>, so a move is a plain CSS transition on transform. Measurements are
 * refreshed on scroll, resize, and whenever <main> changes height (a row
 * expanding shifts everything below it).
 */
export default function TravelingDot({ active }: TravelingDotProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const dot = ref.current;
    const main = dot?.parentElement;
    if (!dot || !main) return;
    const ball = dot.firstElementChild as HTMLElement | null;

    // The mark in the header. Flagged from the header markup so this file does
    // not have to know its class name.
    const home = document.querySelector<HTMLElement>('[data-dot-home]');

    let frame = 0;
    let ready = false;
    let atHome = true;
    let returning = 0;
    let flying = 0;
    let landing = 0;
    let currentHost: HTMLElement | null = null;
    let lastX = NaN;
    let lastY = NaN;

    const setTransform = (x: number, y: number) => {
      dot.style.transform = `translate(${x}px, ${y}px)`;
      lastX = x;
      lastY = y;
    };

    /**
     * The ball is a soft body. On a real journey it gathers itself, stretches
     * along the line of travel, lands with a squash and settles.
     */
    const moveTo = (x: number, y: number) => {
      const dx = x - lastX;
      const dy = y - lastY;
      setTransform(x, y);
      if (!ball || !(Math.hypot(dx, dy) >= JOURNEY_PX)) return;
      ball.style.setProperty('--angle', `${Math.atan2(dy, dx)}rad`);
      ball.removeAttribute('data-squish');
      void ball.offsetWidth; // restart the animation
      ball.setAttribute('data-squish', '');
    };

    /** Land without animating — a first placement, or the start of a flight. */
    const jumpTo = (x: number, y: number) => {
      dot.removeAttribute('data-ready');
      setTransform(x, y);
      void dot.offsetWidth;
      dot.setAttribute('data-ready', 'true');
    };

    const homeSpot = (): Spot | null => {
      if (!home) return null;
      const h = home.getBoundingClientRect();
      const p = main.getBoundingClientRect();
      return { x: h.left - p.left, y: h.top - p.top, size: h.width };
    };

    /** Where the dot sits on a host. */
    const spotFor = (host: HTMLElement): Spot => {
      const a = host.getBoundingClientRect();
      const p = main.getBoundingClientRect();
      const cs = getComputedStyle(host);

      // The closing mark is not a heading with a slot beside it — it is the
      // full stop of the last sentence, and the seat is already exactly where
      // the dot belongs. So it lands on the seat rather than in a margin next
      // to it.
      if (host.hasAttribute('data-dot-end')) {
        const s = parseFloat(cs.getPropertyValue('--indicator-size')) || 5;
        return {
          x: Math.round(a.left - p.left + (a.width - s) / 2),
          y: Math.round(a.top - p.top + (a.height - s) / 2),
          size: s,
        };
      }

      const fontSize = parseFloat(cs.fontSize);
      const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.4;
      const declared = parseFloat(cs.getPropertyValue('--indicator-size'));
      const size = Number.isFinite(declared) ? declared : Math.round(fontSize * 0.55);
      // The heading opens a slot of 1.45em (see [data-dot-active] in
      // globals.css) and the dot sits at the head of it.
      return {
        x: Math.round(a.left - p.left),
        y: Math.round(a.top - p.top + (lineHeight - size) / 2),
        size,
      };
    };

    /**
     * The dot rides above the sticky header only while it is travelling to or
     * from the home mark, which lives inside it.
     */
    const markHomeFlight = () => {
      dot.setAttribute('data-flying', '');
      if (flying) window.clearTimeout(flying);
      flying = window.setTimeout(() => {
        flying = 0;
        dot.removeAttribute('data-flying');
      }, FLIGHT_MS);
    };

    /**
     * The closing seat is the only host the dot arrives at for good, so it is
     * the only one worth landing on. The hop waits out the flight, then takes
     * the ball over from the travel deformation.
     */
    const scheduleLand = (host: HTMLElement) => {
      window.clearTimeout(landing);
      ball?.removeAttribute('data-land');
      if (!ball || !host.hasAttribute('data-dot-end')) return;
      landing = window.setTimeout(() => {
        ball.removeAttribute('data-squish');
        void ball.offsetWidth; // let the animation restart
        ball.setAttribute('data-land', '');
      }, FLIGHT_MS);
    };

    const settleHome = () => {
      returning = 0;
      atHome = true;
      dot.setAttribute('data-home', '');
      home?.removeAttribute('data-dot-state');
    };

    /** Fly back to the home mark, then hand over to it. */
    const goHome = () => {
      if (atHome || returning) return;
      currentHost?.removeAttribute('data-dot-active');
      currentHost = null;
      window.clearTimeout(landing);
      ball?.removeAttribute('data-land');
      const s = homeSpot();
      if (!s) {
        settleHome();
        return;
      }
      markHomeFlight();
      dot.style.setProperty('--size', `${s.size}px`);
      moveTo(s.x, s.y);
      returning = window.setTimeout(settleHome, FLIGHT_MS);
    };

    /** Go to a host — leaving the home mark first if that is where we are. */
    const goTo = (s: Spot) => {
      if (returning) {
        window.clearTimeout(returning);
        returning = 0;
      }
      if (atHome) {
        atHome = false;
        markHomeFlight();
        dot.removeAttribute('data-home');
        home?.setAttribute('data-dot-state', 'away');
        const h = homeSpot();
        if (!ready) {
          // First placement lands where it is; every later one glides.
          dot.style.setProperty('--size', `${s.size}px`);
          jumpTo(s.x, s.y);
          return;
        }
        if (h) {
          dot.style.setProperty('--size', `${h.size}px`);
          jumpTo(h.x, h.y);
        }
      }
      dot.style.setProperty('--size', `${s.size}px`);
      moveTo(s.x, s.y);
    };

    const place = () => {
      frame = 0;

      // At the very top the dot is home and no heading holds a slot open.
      if (window.scrollY < HOME_THRESHOLD) {
        goHome();
        ready = true;
        return;
      }

      const id = activeRef.current ?? 'hero';
      const host = main.querySelector<HTMLElement>(`[data-dot="${id}"]`);
      if (!host) return;

      if (host !== currentHost) {
        currentHost?.removeAttribute('data-dot-active');
        host.setAttribute('data-dot-active', '');
        currentHost = host;
        scheduleLand(host);
      }
      goTo(spotFor(host));
      ready = true;
    };

    // Scroll events arrive faster than frames, so they are coalesced onto one.
    // The observers below are already batched by the browser, and waiting a
    // frame would only delay the flight, so they place at once.
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };
    const placeNow = () => {
      if (frame) cancelAnimationFrame(frame);
      place();
    };

    place();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // Anything resizing inside main shifts what is below it.
    const ro = new ResizeObserver(placeNow);
    ro.observe(main);
    document.fonts?.ready.then(schedule);

    // The page tells us where to be by moving the attribute around.
    const mo = new MutationObserver(placeNow);
    mo.observe(main, { attributes: true, attributeFilter: ['data-dot-target'] });

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
      mo.disconnect();
      if (frame) cancelAnimationFrame(frame);
      if (returning) window.clearTimeout(returning);
      if (flying) window.clearTimeout(flying);
      window.clearTimeout(landing);
      home?.removeAttribute('data-dot-state');
      currentHost?.removeAttribute('data-dot-active');
    };
  }, []);

  // A section change is announced on <main>, which the observer above is
  // watching; that keeps placement in one place rather than splitting it
  // between two effects that would race on first paint.
  useEffect(() => {
    const main = ref.current?.parentElement;
    if (!main) return;
    main.setAttribute('data-dot-target', active ?? 'hero');
  }, [active]);

  return (
    <span ref={ref} className={styles.dot} data-home="" aria-hidden="true">
      <span className={styles.ball} />
    </span>
  );
}
