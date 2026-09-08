'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';
import mermaid from 'mermaid';
import type { ArchitectureDiagram, LocalizedString } from '@/types';
import sheet from './Sheet.module.css';
import styles from './ArchitectureModal.module.css';
import { useModalClose } from './useModalClose';

interface ArchitectureModalProps {
  diagrams: ArchitectureDiagram[];
  projectTitle: string;
  company: LocalizedString;
  lang: 'ko' | 'en';
  onClose: () => void;
}

type Theme = 'light' | 'dark';

const PALETTE: Record<Theme, Record<string, string>> = {
  light: {
    background: 'transparent',
    primaryColor: '#fcfcfc',
    primaryTextColor: '#0f0f0f',
    primaryBorderColor: '#cfcfcf',
    secondaryColor: '#f3f3f3',
    tertiaryColor: '#f3f3f3',
    lineColor: '#6b6b6b',
    textColor: '#0f0f0f',
    noteBkgColor: '#f3f3f3',
    noteBorderColor: '#e8e8e8',
    actorBkg: '#fcfcfc',
    actorBorder: '#cfcfcf',
    signalColor: '#6b6b6b',
    signalTextColor: '#0f0f0f',
    labelBoxBkgColor: '#fcfcfc',
    labelBoxBorderColor: '#cfcfcf',
    sequenceNumberColor: '#fcfcfc',
  },
  dark: {
    background: 'transparent',
    primaryColor: '#0d0d0d',
    primaryTextColor: '#f2f2f2',
    primaryBorderColor: '#3a3a3a',
    secondaryColor: '#161616',
    tertiaryColor: '#161616',
    lineColor: '#9a9a9a',
    textColor: '#f2f2f2',
    noteBkgColor: '#161616',
    noteBorderColor: '#222222',
    actorBkg: '#0d0d0d',
    actorBorder: '#3a3a3a',
    signalColor: '#9a9a9a',
    signalTextColor: '#f2f2f2',
    labelBoxBkgColor: '#0d0d0d',
    labelBoxBorderColor: '#3a3a3a',
    sequenceNumberColor: '#0d0d0d',
  },
};

/**
 * Strip authoring-time colour from the source so every diagram shares the
 * page palette. Only presentation lines are removed; nodes, edges, and
 * labels are untouched.
 */
function neutralize(code: string): string {
  return code
    .split('\n')
    .filter((line) => !/^\s*(style|classDef|linkStyle|class)\s/.test(line))
    .map((line) => line.replace(/^(\s*rect)\s+rgba?\([^)]*\)/, '$1 rgb(0,0,0)'))
    .join('\n');
}

/**
 * "Simple" view: drop the explanatory second line of every label (the part
 * after <br/>) so the structure reads first. The full text is one toggle
 * away; nothing is rewritten.
 */
function simplify(code: string): string {
  const isSequence = /^\s*sequenceDiagram/m.test(code);
  if (isSequence) {
    return code.replace(/<br\s*\/?>.*$/gm, '');
  }
  return code.replace(/<br\s*\/?>[^\]\)\}|]*?(?=[\]\)\}])/g, '');
}

function readTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/**
 * Hover focus for flowcharts. Mermaid ids nodes as `flowchart-<key>-<n>` and
 * edges as `L_<from>_<to>_<n>` (older builds use `LS-<from> LE-<to>` classes),
 * which is enough to find a node's neighbourhood without parsing the source.
 */
function wireHoverFocus(root: HTMLElement) {
  const svg = root.querySelector('svg');
  if (!svg) return () => {};
  const nodes = Array.from(svg.querySelectorAll<SVGGElement>('g.node'));
  const edges = Array.from(svg.querySelectorAll<SVGElement>('path.flowchart-link, g.edgePath'));
  const edgeLabels = Array.from(svg.querySelectorAll<SVGElement>('g.edgeLabel'));
  if (nodes.length === 0) return () => {};

  const keyOf = (node: SVGGElement) => {
    const m = node.id.match(/^flowchart-(.+)-\d+$/);
    return m ? m[1] : null;
  };
  // Edges may also target subgraphs (clusters), whose id is the bare key.
  const clusterKeys = Array.from(svg.querySelectorAll<SVGGElement>('g.cluster')).map((c) => c.id);
  const nodeKeys = new Set([...(nodes.map(keyOf).filter(Boolean) as string[]), ...clusterKeys]);
  const endpoints = (edge: SVGElement) => {
    const path = edge.tagName === 'path' ? edge : edge.querySelector('path');
    const cls = (path?.getAttribute('class') ?? '') + ' ' + (edge.getAttribute('class') ?? '');
    let from = cls.match(/\bLS-(\S+)/)?.[1] ?? null;
    let to = cls.match(/\bLE-(\S+)/)?.[1] ?? null;
    if (!from || !to) {
      // `L_<from>_<to>_<n>`; keys may themselves contain underscores, so try
      // every split against the known node keys.
      const id = edge.id || path?.id || '';
      const m = id.match(/^L_(.+)_\d+$/);
      if (m) {
        const parts = m[1].split('_');
        for (let i = 1; i < parts.length; i++) {
          const a = parts.slice(0, i).join('_');
          const b = parts.slice(i).join('_');
          if (nodeKeys.has(a) && nodeKeys.has(b)) {
            from = a;
            to = b;
            break;
          }
        }
      }
    }
    return { from, to };
  };

  const clear = () => {
    nodes.forEach((n) => n.classList.remove('dim', 'focus'));
    edges.forEach((e) => e.classList.remove('dim', 'lit'));
    edgeLabels.forEach((l) => l.classList.remove('dim'));
  };

  const focus = (node: SVGGElement) => {
    const key = keyOf(node);
    if (!key) return;
    const keep = new Set<string>([key]);
    const litEdges = new Set<SVGElement>();
    edges.forEach((edge) => {
      const { from, to } = endpoints(edge);
      if (from === key || to === key) {
        litEdges.add(edge);
        if (from) keep.add(from);
        if (to) keep.add(to);
      }
    });
    nodes.forEach((n) => {
      const k = keyOf(n);
      n.classList.toggle('dim', !(k && keep.has(k)));
      n.classList.toggle('focus', n === node);
    });
    edges.forEach((e) => {
      e.classList.toggle('lit', litEdges.has(e));
      e.classList.toggle('dim', !litEdges.has(e));
    });
    const litIds = new Set(Array.from(litEdges).map((e) => e.id || e.querySelector('path')?.id));
    edgeLabels.forEach((l, i) => {
      // Labels carry the edge id in Mermaid 11; fall back to order otherwise.
      const id = l.querySelector('[data-id]')?.getAttribute('data-id');
      const lit = id ? litIds.has(id) : !!edges[i] && litEdges.has(edges[i]);
      l.classList.toggle('dim', !lit);
    });
  };

  const onOver = (e: Event) => {
    const node = (e.target as Element).closest('g.node') as SVGGElement | null;
    if (node) focus(node);
  };
  const onOut = (e: Event) => {
    const to = (e as MouseEvent).relatedTarget as Element | null;
    if (!to || !to.closest('g.node')) clear();
  };
  svg.addEventListener('mouseover', onOver);
  svg.addEventListener('mouseout', onOut);
  return () => {
    svg.removeEventListener('mouseover', onOver);
    svg.removeEventListener('mouseout', onOut);
  };
}

/**
 * Current flowing through a sequence diagram. A short accent dash travels
 * along each message arrow in order, and the message text brightens as it
 * passes. One shared period keeps every element's animation in lockstep so
 * the loop is seamless. Returns the animations for play/pause control.
 */
function wireSequenceFlow(root: HTMLElement): Animation[] {
  const svg = root.querySelector('svg');
  if (!svg) return [];
  const lines = Array.from(
    svg.querySelectorAll<SVGGeometryElement>(
      'line.messageLine0, line.messageLine1, path.messageLine0, path.messageLine1',
    ),
  );
  const texts = Array.from(svg.querySelectorAll<SVGTextElement>('text.messageText'));
  if (lines.length === 0) return [];

  const lengthOf = (el: SVGGeometryElement) => {
    if (el.tagName === 'line') {
      const x1 = +el.getAttribute('x1')!;
      const y1 = +el.getAttribute('y1')!;
      const x2 = +el.getAttribute('x2')!;
      const y2 = +el.getAttribute('y2')!;
      return Math.hypot(x2 - x1, y2 - y1);
    }
    return el.getTotalLength();
  };

  // Timeline: each message travels for a duration scaled to its length,
  // then a short gap; the whole cycle pauses before repeating.
  const GAP = 140;
  const REST = 1400;
  const steps = lines.map((el) => {
    const L = lengthOf(el);
    return { el, L, dur: Math.max(380, Math.min(900, L * 1.6)) };
  });
  const total = steps.reduce((t, s) => t + s.dur + GAP, 0) + REST;

  const animations: Animation[] = [];
  let t = 0;
  steps.forEach((s, i) => {
    const start = t / total;
    const end = (t + s.dur) / total;
    t += s.dur + GAP;

    // The travelling dash: a clone of the arrow with no marker.
    const pulse = s.el.cloneNode(false) as SVGGeometryElement;
    pulse.removeAttribute('marker-end');
    pulse.removeAttribute('marker-start');
    pulse.removeAttribute('class');
    pulse.setAttribute('class', 'flowPulse');
    const dash = Math.min(26, s.L * 0.6);
    pulse.style.strokeDasharray = `${dash} ${s.L + dash}`;
    pulse.style.strokeDashoffset = `${dash}`;
    s.el.parentNode?.insertBefore(pulse, s.el.nextSibling);

    animations.push(
      pulse.animate(
        [
          { strokeDashoffset: dash, offset: 0 },
          { strokeDashoffset: dash, offset: start },
          { strokeDashoffset: -s.L, offset: end },
          { strokeDashoffset: -s.L, offset: 1 },
        ],
        { duration: total, iterations: Infinity, easing: 'linear' },
      ),
    );

    // Base arrow and its label brighten as the pulse arrives, then dim again
    // just before the loop restarts so the cycle reads as a fresh pass.
    const fadeFrames = [
      { opacity: 0.32, offset: 0 },
      { opacity: 0.32, offset: start },
      { opacity: 1, offset: end },
      { opacity: 1, offset: 0.985 },
      { opacity: 0.32, offset: 1 },
    ];
    const opts = { duration: total, iterations: Infinity, easing: 'linear' } as const;
    animations.push(s.el.animate(fadeFrames, opts));
    if (texts[i]) animations.push(texts[i].animate(fadeFrames, opts));
  });

  return animations;
}

export default function ArchitectureModal({
  diagrams,
  projectTitle,
  company,
  lang,
  onClose,
}: ArchitectureModalProps) {
  const [active, setActive] = useState(0);
  const [codes, setCodes] = useState<string[] | null>(null);
  const [detailed, setDetailed] = useState(false);
  const [flowing, setFlowing] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<Animation[]>([]);
  const { closing, requestClose } = useModalClose(onClose);

  useEffect(() => {
    setMounted(true);
    setTheme(readTheme());
    const obs = new MutationObserver(() => setTheme(readTheme()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  // Fetch sources once per language.
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      diagrams.map(async (d) => {
        const res = await fetch(d.mermaidFilePath[lang]);
        if (!res.ok) throw new Error(`Failed to load ${d.mermaidFilePath[lang]}`);
        return res.text();
      }),
    )
      .then((list) => {
        if (!cancelled) setCodes(list);
      })
      .catch((err) => {
        console.error('Failed to load diagrams:', err);
        if (!cancelled) setCodes([]);
      });
    return () => {
      cancelled = true;
    };
  }, [diagrams, lang]);

  // Render whenever the active diagram, density, or theme changes.
  useEffect(() => {
    const host = canvasRef.current;
    const raw = codes?.[active];
    if (!host || !raw) return;

    let cancelled = false;
    let unwire: (() => void) | undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        ...PALETTE[theme],
        fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif',
        fontSize: '13px',
      },
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        nodeSpacing: 36,
        rankSpacing: 48,
        padding: 12,
      },
      sequence: {
        actorMargin: 40,
        messageMargin: 28,
        mirrorActors: false,
        boxMargin: 8,
        noteMargin: 8,
        useMaxWidth: true,
      },
    });

    const code = neutralize(detailed ? raw : simplify(raw));
    const id = `arch-${active}-${theme}-${detailed ? 'd' : 's'}-${Date.now()}`;

    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (cancelled) return;
        host.innerHTML = svg;
        unwire = wireHoverFocus(host);
        flowRef.current = reduced ? [] : wireSequenceFlow(host);
        if (!flowing) flowRef.current.forEach((a) => a.pause());
      })
      .catch((err) => {
        console.error('Mermaid render error:', err);
        if (!cancelled)
          host.innerHTML = `<p>${lang === 'ko' ? '다이어그램을 그리지 못했습니다.' : 'Could not render diagram.'}</p>`;
      });

    return () => {
      cancelled = true;
      unwire?.();
      flowRef.current.forEach((a) => a.cancel());
      flowRef.current = [];
    };
    // `flowing` is applied via play/pause below, not by re-rendering.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codes, active, detailed, theme, lang]);

  useEffect(() => {
    flowRef.current.forEach((a) => (flowing ? a.play() : a.pause()));
  }, [flowing]);

  if (!mounted) return null;

  const current = diagrams[active];
  const raw = codes?.[active];
  const isSequence = raw ? /^\s*sequenceDiagram/m.test(raw) : false;
  const isFlow = raw ? !isSequence : false;
  // Only offer the toggle when it would actually change something.
  const hasDetail = raw ? simplify(raw) !== raw : false;

  return createPortal(
    <div
      className={`${sheet.overlay} ${closing ? sheet.closing : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${projectTitle} ${lang === 'ko' ? '아키텍처' : 'architecture'}`}
    >
      <div className={sheet.panel}>
        <div className={sheet.header}>
          <div>
            <p className={sheet.eyebrow}>
              {company[lang]} · {projectTitle}
            </p>
            <h2 className={sheet.title}>{lang === 'ko' ? '아키텍처' : 'Architecture'}</h2>
          </div>
          <button onClick={requestClose} className={sheet.close} aria-label="Close">
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className={sheet.body}>
          <nav className={sheet.rail} aria-label="Diagrams">
            {diagrams.map((d, i) => (
              <button
                key={i}
                type="button"
                className={`${sheet.railItem} ${i === active ? sheet.railItemActive : ''}`}
                onClick={() => setActive(i)}
                aria-current={i === active}
              >
                <span className={sheet.railIndex}>{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className={sheet.railTitle}>{d.title[lang]}</span>
                  {d.description && <span className={sheet.railSub}>{d.description[lang]}</span>}
                </span>
              </button>
            ))}
          </nav>

          <div className={sheet.content}>
            <div key={active} className={sheet.swap}>
              <div className={styles.toolbar}>
                <div className={styles.controls}>
                  {hasDetail && (
                    <div className={sheet.segment} role="group" aria-label="Detail level">
                      <button
                        type="button"
                        className={`${sheet.segmentBtn} ${!detailed ? sheet.segmentActive : ''}`}
                        onClick={() => setDetailed(false)}
                      >
                        {lang === 'ko' ? '간략' : 'Simple'}
                      </button>
                      <button
                        type="button"
                        className={`${sheet.segmentBtn} ${detailed ? sheet.segmentActive : ''}`}
                        onClick={() => setDetailed(true)}
                      >
                        {lang === 'ko' ? '상세' : 'Detailed'}
                      </button>
                    </div>
                  )}
                  {isSequence && (
                    <button
                      type="button"
                      className={styles.flowBtn}
                      onClick={() => setFlowing((v) => !v)}
                      aria-pressed={flowing}
                    >
                      {flowing ? (
                        <Pause size={12} strokeWidth={2} />
                      ) : (
                        <Play size={12} strokeWidth={2} />
                      )}
                      {lang === 'ko' ? '흐름' : 'Flow'}
                    </button>
                  )}
                </div>
                <span className={styles.hint}>
                  {isFlow
                    ? lang === 'ko'
                      ? '노드에 마우스를 올리면 연결된 요소만 남습니다'
                      : 'Hover a node to isolate its connections'
                    : isSequence
                      ? lang === 'ko'
                        ? '메시지가 순서대로 흐릅니다'
                        : 'Messages play in order'
                      : ''}
                </span>
              </div>

              <div className={styles.canvas}>
                {codes === null ? (
                  <div className={styles.loading}>{lang === 'ko' ? '불러오는 중' : 'Loading'}</div>
                ) : (
                  <div ref={canvasRef} className={styles.mermaid} />
                )}
              </div>

              {current?.description && (
                <p className={styles.caption}>{current.description[lang]}</p>
              )}
            </div>
          </div>
        </div>

        <div className={sheet.footer}>
          <span className={sheet.footerNote}>
            {lang === 'ko'
              ? '소스코드는 회사 자산으로 비공개. 구조와 문제 해결 과정만 공유합니다.'
              : 'Source is proprietary; only structure and problem-solving are shared.'}
          </span>
          <div className={sheet.pager}>
            <button
              type="button"
              className={sheet.pagerBtn}
              onClick={() => setActive((i) => Math.max(0, i - 1))}
              disabled={active === 0}
              aria-label={lang === 'ko' ? '이전' : 'Previous'}
            >
              <ChevronLeft size={16} strokeWidth={1.75} />
            </button>
            <span className={sheet.pagerCount}>
              {String(active + 1).padStart(2, '0')} / {String(diagrams.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              className={sheet.pagerBtn}
              onClick={() => setActive((i) => Math.min(diagrams.length - 1, i + 1))}
              disabled={active === diagrams.length - 1}
              aria-label={lang === 'ko' ? '다음' : 'Next'}
            >
              <ChevronRight size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
