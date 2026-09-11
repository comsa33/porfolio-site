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

/* ---- The opening, which happens once and only from the top of the page ----
 * Scroll inside the guard and it never starts at all; scroll after that and it
 * finishes the line instead of unwriting it. */
const WRITE_GUARD_MS = 100;
const TYPE_MS = 45;
const TYPE_JITTER = 25;
/** A space is a beat, not a character. */
const TYPE_WORD_PAUSE = 1.6;
const RISE_MS = 380;
const CRAWL_MS = 560;
const CRAWL_HOLD_MS = 160;
const GATHER_MS = 460;
const BLINK_MS = 2120;
const DROP_MS = 640;
/** The stroke any thinner than this stops reading as a line. */
const MIN_STROKE = 0.9;

/* The opening runs once per load. A module-level flag rather than a ref, so a
   development double-mount does not write the line twice. */
let written = false;

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
  const snakeRef = useRef<SVGSVGElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const dot = ref.current;
    const main = dot?.parentElement;
    if (!dot || !main) return;
    const ball = dot.firstElementChild as HTMLElement | null;
    const snake = snakeRef.current;
    const snakePath = snake?.firstElementChild as SVGPathElement | null;
    /* The line the dot writes on its way in. */
    const scribe = main.querySelector<HTMLElement>('[data-dot-write]');

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
    /* While the opening runs, the scroll position does not place the dot. */
    let writing = false;
    let writeTimer = 0;
    let snakeFrame = 0;

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
     * The caret the mark stands up into, as scale factors on the ball.
     *
     * It has to be as tall as the type it is ending, and the type is set in a
     * clamp — 20px on a phone, 25.6px on a desktop — while the mark itself is a
     * fixed 6px. A ratio written into the keyframes would therefore be right at
     * exactly one viewport width. Measuring the seat's own font size and
     * dividing gives a caret that is the height of the line at every width.
     */
    const sizeCaret = (host: HTMLElement, size: number) => {
      if (!ball) return;
      const cs = getComputedStyle(host);
      const fontSize = parseFloat(cs.fontSize) || 16;
      const ratio = parseFloat(cs.getPropertyValue('--caret-height')) || 0.92;
      const width = parseFloat(cs.getPropertyValue('--caret-width')) || 1.6;
      const h = (fontSize * ratio) / size;
      const w = width / size;
      ball.style.setProperty('--caret-y', String(h));
      ball.style.setProperty('--caret-x', String(w));
      // The jump goes well past the caret and recoils back through it before
      // settling — overshoot, undershoot, rest. That three-beat is what makes
      // it read as a spring rather than as a shape growing. At a tenth over
      // the caret it was four pixels of difference and invisible; half again
      // as tall is a jump you can see.
      ball.style.setProperty('--caret-y-over', String(h * 1.5));
      ball.style.setProperty('--caret-x-over', String(w * 0.62));
      // Coming back through it, squat and a little wider — the give of
      // something that overshot and is settling.
      ball.style.setProperty('--caret-y-under', String(h * 0.93));
      ball.style.setProperty('--caret-x-under', String(w * 1.14));
      // A period fills its seat and so is centred in it; a caret is a sliver of
      // the same width and, centred, leaves most of the seat as a gap between
      // itself and the last letter. It is hung on the seat's left edge instead,
      // which is where the text actually ends.
      ball.style.setProperty('--caret-shift', `${((-(size - width) / 2) * 100) / size}%`);
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
      sizeCaret(host, spotFor(host).size);
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
      if (writing) return;

      // At the very top the dot is home and no heading holds a slot open —
      // unless it has written the line, in which case the head of that line is
      // where it belongs and going home would unwrite it.
      if (window.scrollY < HOME_THRESHOLD && !written) {
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

    /* ==================== The opening ====================
     *
     * The mark comes off the header, stands up as a caret and writes the line
     * under it; having written it, it runs the length of the line as a stroke —
     * down, along underneath, up again at the front — and sits down there as a
     * dot, which is where it would have been anyway. The page is written rather
     * than merely displayed, and the mark that writes it is the mark that
     * names the site.
     *
     * Everything here is once per load, never on the way back up, and any
     * scroll finishes it rather than reversing it.
     */

    /** Where each character's ink ends, and how much of the box to uncover. */
    let inkStops: number[] = [];
    let revealStops: number[] = [];

    const measureLine = () => {
      const node = scribe?.firstChild;
      if (!scribe || !node || node.nodeType !== Node.TEXT_NODE) return false;
      const n = (node.textContent ?? '').length;
      if (!n) return false;
      const r = document.createRange();
      const left = scribe.getBoundingClientRect().left;
      // Letter-spacing is added after every character, the last one included, so
      // a prefix's right edge sits that far past the ink. The clip wants the
      // whole advance; the caret wants the ink. Using one number for both is
      // what makes a caret run ahead of the text it is writing.
      const ls = parseFloat(getComputedStyle(scribe).letterSpacing) || 0;
      inkStops = [0];
      revealStops = [0];
      for (let k = 1; k <= n; k++) {
        r.setStart(node, 0);
        r.setEnd(node, k);
        const right = r.getBoundingClientRect().right - left;
        revealStops.push(right);
        inkStops.push(right - ls);
      }
      return true;
    };

    /** The line's geometry in the parent's coordinates. */
    const lineBox = () => {
      const a = scribe!.getBoundingClientRect();
      const p = main.getBoundingClientRect();
      const cs = getComputedStyle(scribe!);
      const fontSize = parseFloat(cs.fontSize);
      const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.4;
      const caretW = parseFloat(cs.getPropertyValue('--caret-width')) || 1.5;
      const caretRatio = parseFloat(cs.getPropertyValue('--caret-height')) || 0.92;
      return {
        left: a.left - p.left,
        // half-leading, then the ascent: where the letters actually stand
        baseline: a.top - p.top + (lineHeight - fontSize) / 2 + fontSize * 0.8,
        fontSize,
        caretW,
        caretH: fontSize * caretRatio,
      };
    };

    const caretSpot = (n: number) => {
      const g = lineBox();
      return {
        x: Math.round(g.left + inkStops[n] - (6 - g.caretW) / 2),
        y: Math.round(g.baseline + g.fontSize * 0.1 - 6),
      };
    };

    /** Paints the ball as a caret standing on the line at a given x. */
    const asCaret = (n: number) => {
      const g = lineBox();
      const s = caretSpot(n);
      dot.style.setProperty('--size', '6px');
      dot.style.transform = `translate(${s.x}px, ${s.y}px)`;
      if (!ball) return;
      ball.style.transformOrigin = '50% 100%';
      ball.style.transform = `scale(${g.caretW / 6}, ${g.caretH / 6})`;
      ball.style.borderRadius = '0.5px';
    };

    const sizeCaretVars = () => {
      if (!ball) return;
      const g = lineBox();
      const h = g.caretH / 6;
      const w = g.caretW / 6;
      ball.style.setProperty('--cx', String(w));
      ball.style.setProperty('--cy', String(h));
      ball.style.setProperty('--cx-over', String(w * 0.62));
      ball.style.setProperty('--cy-over', String(h * 1.5));
      ball.style.setProperty('--cx-under', String(w * 1.14));
      ball.style.setProperty('--cy-under', String(h * 0.93));
    };

    /* ---- the stroke that runs the line ---- */

    let route: { T: number; A: number; B: number; caretLen: number } | null = null;
    let strokeState = { tail: 0, head: 0 };

    const layoutRoute = () => {
      if (!snakePath) return null;
      const g = lineBox();
      const half = g.caretW / 2;
      const x1 = g.left + half;
      const x2 = g.left + inkStops[inkStops.length - 1] + half;
      const caretBottom = g.baseline + g.fontSize * 0.1;
      const yTop = caretBottom - g.caretH;
      const yBot = g.baseline + g.fontSize * 0.34;
      const r = 3.5;

      snakePath.setAttribute(
        'd',
        `M${x2} ${yTop}L${x2} ${yBot - r}Q${x2} ${yBot} ${x2 - r} ${yBot}` +
          `L${x1 + r} ${yBot}Q${x1} ${yBot} ${x1} ${yBot - r}L${x1} ${yTop}`,
      );

      const T = snakePath.getTotalLength();
      // Where the corners fall, found by walking the path rather than by algebra.
      let A = 0;
      let B = 0;
      for (let k = 0; k <= 260; k++) {
        const L = (T * k) / 260;
        const pt = snakePath.getPointAtLength(L);
        if (!A && pt.y >= yBot - 0.6) A = L;
        if (!B && A && pt.x <= x1 + 0.6) B = L;
      }
      route = { T, A, B, caretLen: g.caretH };
      return route;
    };

    /*
     * The thickness is not animated. It is read off the length every frame, the
     * way a band's is: stretch it and it thins, let it gather and it thickens,
     * and the two can never fall out of step because there is only one number.
     * Square-rooted, so most of the thinning happens early in the stretch.
     */
    const drawRoute = (tail: number, head: number) => {
      if (!snakePath || !route) return;
      const g = lineBox();
      const len = Math.max(0, head - tail);
      const k = Math.sqrt(Math.min(1, route.caretLen / Math.max(len, 0.001)));
      snakePath.style.strokeWidth = `${MIN_STROKE + (g.caretW - MIN_STROKE) * k}px`;
      snakePath.style.strokeDasharray = `${len} ${route.T * 2 + 40}`;
      snakePath.style.strokeDashoffset = String(-tail);
      strokeState = { tail, head };
    };

    const runRoute = (
      to: { tail: number; head: number },
      dur: number,
      curve: (k: number) => number,
      done: () => void,
    ) => {
      cancelAnimationFrame(snakeFrame);
      const from = { ...strokeState };
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        const e = curve(k);
        drawRoute(from.tail + (to.tail - from.tail) * e, from.head + (to.head - from.head) * e);
        if (k < 1) snakeFrame = requestAnimationFrame(tick);
        else done();
      };
      tick(t0);
    };

    const easeOutCubic = (k: number) => 1 - Math.pow(1 - k, 3);
    const easeInOutCubic = (k: number) =>
      k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

    /* ---- the sequence ---- */

    const wait = (ms: number, fn: () => void) => {
      writeTimer = window.setTimeout(fn, ms);
    };

    /** Hands the mark back to the ordinary machinery, wherever it has got to. */
    const handOver = () => {
      writing = false;
      cancelAnimationFrame(snakeFrame);
      window.clearTimeout(writeTimer);
      snake?.removeAttribute('data-on');
      dot.removeAttribute('data-writing');
      ball?.removeAttribute('data-drop');
      ball?.removeAttribute('data-blink');
      if (ball) {
        ball.style.transition = '';
        ball.style.transform = '';
        ball.style.transformOrigin = '';
        ball.style.borderRadius = '';
      }
      dot.style.transition = '';
      scribe?.style.removeProperty('--hide');
      ready = true;
      placeNow();
    };

    /** The reader moved on. Finish the line, never unwrite it, and hand back. */
    const abandonWriting = () => {
      if (!writing) return;
      window.clearTimeout(writeTimer);
      cancelAnimationFrame(snakeFrame);
      if (scribe) {
        scribe.style.transition = 'clip-path 120ms ease-out';
        scribe.style.setProperty('--hide', '0px');
        window.setTimeout(() => scribe.style.removeProperty('transition'), 200);
      }
      // Mid-crawl: run the rest of the route rather than drop it, then hand back.
      if (snake?.hasAttribute('data-on') && route) {
        runRoute({ tail: route.T - route.caretLen, head: route.T }, 180, easeOutCubic, handOver);
        return;
      }
      handOver();
    };

    /** The mark sits down at the head of the line it wrote, and the line makes
     *  room for it as it lands. */
    const sitDown = () => {
      if (!ball) return handOver();
      sizeCaretVars();
      ball.removeAttribute('data-blink');
      ball.style.transition = '';
      ball.style.transform = '';
      ball.style.borderRadius = '';
      ball.setAttribute('data-drop', '');
      scribe?.setAttribute('data-dot-active', '');
      currentHost = scribe;
      atHome = false;
      const a = scribe!.getBoundingClientRect();
      const p = main.getBoundingClientRect();
      const cs = getComputedStyle(scribe!);
      const fs = parseFloat(cs.fontSize);
      const lh = parseFloat(cs.lineHeight) || fs * 1.4;
      dot.style.transition = `transform ${DROP_MS}ms var(--ease-out)`;
      dot.style.transform = `translate(${Math.round(a.left - p.left)}px, ${Math.round(
        a.top - p.top + (lh - 6) / 2,
      )}px)`;
      wait(DROP_MS + 20, handOver);
    };

    const crawl = () => {
      const g = layoutRoute();
      if (!g || !snakePath) return sitDown();
      ball?.removeAttribute('data-caret');
      dot.setAttribute('data-writing', '');
      // Draw first, show second: a path shown first wears whatever dash it was
      // left with, which reads as a stray caret blinking at the end of the line.
      drawRoute(0, g.caretLen);
      snake?.setAttribute('data-on', '');

      runRoute({ tail: g.A, head: g.B }, CRAWL_MS, easeInOutCubic, () => {
        wait(CRAWL_HOLD_MS, () => {
          runRoute({ tail: g.T - g.caretLen, head: g.T }, GATHER_MS, easeOutCubic, () => {
            asCaret(0);
            void dot.offsetWidth; // in place before it is seen
            snake?.removeAttribute('data-on');
            dot.removeAttribute('data-writing');
            ball?.setAttribute('data-blink', '');
            wait(BLINK_MS, sitDown);
          });
        });
      });
    };

    let typed = 0;
    const typeStep = () => {
      if (!scribe) return crawl();
      if (typed >= revealStops.length - 1) return crawl();
      typed++;
      scribe.style.setProperty(
        '--hide',
        `${revealStops[revealStops.length - 1] - revealStops[typed]}px`,
      );
      asCaret(typed);
      const ch = (scribe.firstChild?.textContent ?? '')[typed - 1];
      const gap =
        TYPE_MS +
        (Math.random() * 2 - 1) * TYPE_JITTER +
        (ch === ' ' ? TYPE_MS * TYPE_WORD_PAUSE : 0);
      wait(Math.max(8, gap), typeStep);
    };

    const startWriting = () => {
      // No mark to come from, or no line to write: the page is simply there.
      if (!scribe || !ball || !home) return handOver();
      writing = true;
      written = true;
      atHome = false;
      home.setAttribute('data-dot-state', 'away');
      dot.removeAttribute('data-home');

      // from the mark, to the head of the line
      const h = homeSpot();
      if (h) {
        dot.removeAttribute('data-ready');
        dot.style.setProperty('--size', `${h.size}px`);
        dot.style.transform = `translate(${h.x}px, ${h.y}px)`;
        void dot.offsetWidth;
        dot.setAttribute('data-ready', 'true');
      }
      const s = caretSpot(0);
      dot.style.setProperty('--size', '6px');
      dot.style.transform = `translate(${s.x}px, ${s.y}px)`;

      wait(FLIGHT_MS, () => {
        sizeCaretVars();
        ball.style.transformOrigin = '50% 100%';
        ball.setAttribute('data-caret-in', '');
        wait(RISE_MS, () => {
          ball.removeAttribute('data-caret-in');
          ball.setAttribute('data-caret', '');
          dot.removeAttribute('data-ready'); // a caret snaps between letters
          typeStep();
        });
      });
    };

    /* Written once, from the top, with a moment's grace for a reader who is
       already on their way down. */
    const openingIsOn =
      !written &&
      scribe !== null &&
      ball !== null &&
      window.scrollY < HOME_THRESHOLD &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (openingIsOn && measureLine()) {
      writing = true;
      scribe!.style.setProperty('--hide', `${revealStops[revealStops.length - 1]}px`);
      writeTimer = window.setTimeout(() => {
        if (window.scrollY >= HOME_THRESHOLD) {
          // Gone already: the line is simply there, and nothing was written.
          writing = false;
          scribe!.style.removeProperty('--hide');
          placeNow();
          return;
        }
        startWriting();
      }, WRITE_GUARD_MS);
    } else if (scribe) {
      scribe.style.removeProperty('--hide');
    }

    // Scroll events arrive faster than frames, so they are coalesced onto one.
    // The observers below are already batched by the browser, and waiting a
    // frame would only delay the flight, so they place at once.
    const schedule = () => {
      if (writing) {
        if (window.scrollY >= HOME_THRESHOLD) abandonWriting();
        return;
      }
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
      window.clearTimeout(writeTimer);
      cancelAnimationFrame(snakeFrame);
      scribe?.style.removeProperty('--hide');
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
    <>
      <span ref={ref} className={styles.dot} data-home="" aria-hidden="true">
        <span className={styles.ball} />
      </span>
      {/* The route the mark runs once it has written the line. Empty until then,
          and drawn in the parent's own pixel coordinates — no viewBox, so one
          user unit is one CSS pixel. */}
      <svg ref={snakeRef} className={styles.snake} aria-hidden="true">
        <path />
      </svg>
    </>
  );
}
