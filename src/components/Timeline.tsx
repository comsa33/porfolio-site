'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import styles from './Timeline.module.css';
import { TimelineItem, TimelineType } from '@/types';
import { formatPeriod } from '@/lib/period';

interface TimelineProps {
  items: TimelineItem[];
  lang: 'ko' | 'en';
  onCertClick?: (imagePath: string) => void;
}

const KIND_LABELS: Record<TimelineType, { ko: string; en: string }> = {
  Dev: { ko: '경력', en: 'Work' },
  Career: { ko: '경력', en: 'Work' },
  Education: { ko: '학력', en: 'Education' },
  Certification: { ko: '자격', en: 'Certification' },
  Design: { ko: '디자인', en: 'Design' },
  Travel: { ko: '여행', en: 'Travel' },
};

// Bootcamp entries are filed as "other" in the filter, and read as such here.
const bootcampIds = ['edu-kcci', 'edu-codestates'];

/** A description is a list when every line is a bullet; otherwise it is one line. */
const toLines = (text: string) => {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.every((l) => l.startsWith('•')) ? lines.map((l) => l.replace(/^•\s*/, '')) : [text];
};

const isImageLink = (link: string) =>
  link.endsWith('.png') || link.endsWith('.jpg') || link.endsWith('.webp');

/** Where on the screen the rail has filled to, as a share of its height. */
const FILL_LINE = 0.55;

/**
 * Journey as list rows: date range in the mono column, organisation and role
 * beside it. Each entry's details hang off a hairline rail that runs on to the
 * next entry, every line on a short branch — a one-sentence entry is a list of
 * one, so the rail looks the same all the way down. As the reader scrolls, the
 * rail fills down to a line across the screen, and each line of text comes up
 * from dim to its own colour as the fill reaches its branch. It follows the
 * scroll and never takes it.
 */
const Timeline: React.FC<TimelineProps> = ({ items, lang, onCertClick }) => {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rails = Array.from(list.querySelectorAll<HTMLElement>('[data-rail]'));
    const lines = Array.from(list.querySelectorAll<HTMLElement>('[data-line]'));
    let frame = 0;

    const paint = () => {
      frame = 0;
      // The journey sits near the foot of the page, where the last entries can
      // never scroll up to the fill line. So over the last stretch of scroll
      // the line slides down with it, and at the very bottom it is the bottom
      // of the screen: everything on screen has been reached.
      const vh = window.innerHeight;
      const stretch = vh * (1 - FILL_LINE);
      const left = document.documentElement.scrollHeight - vh - window.scrollY;
      const k = 1 - Math.min(1, Math.max(0, left / stretch));
      const y = vh * FILL_LINE + stretch * k;
      for (const rail of rails) {
        const box = rail.getBoundingClientRect();
        const k = Math.min(1, Math.max(0, (y - box.top) / Math.max(1, box.height)));
        (rail.firstElementChild as HTMLElement).style.transform = `scaleY(${k})`;
      }
      // A line is reached when the fill passes its branch, which sits a little
      // below the top of its first line.
      for (const line of lines) {
        const reached = line.getBoundingClientRect().top + 12 < y;
        line.toggleAttribute('data-on', reached);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [items, lang]);

  return (
    <ol ref={listRef} className={styles.list}>
      {items.map((item, i) => {
        const title = typeof item.title === 'string' ? item.title : item.title[lang];
        const role = typeof item.role === 'string' ? item.role : item.role[lang];
        const kind = bootcampIds.includes(item.id)
          ? lang === 'ko'
            ? '부트캠프'
            : 'Bootcamp'
          : KIND_LABELS[item.type][lang];

        return (
          <li
            key={item.id}
            className={styles.row}
            data-type={item.type}
            style={{ '--i': i } as React.CSSProperties}
          >
            <div className={styles.meta}>
              <span className={styles.date}>{formatPeriod(item.date, lang)}</span>
              <span className={styles.kind}>{kind}</span>
            </div>

            <div className={styles.main}>
              <h3 className={styles.title}>
                {title}
                <span className={styles.role}>{role}</span>
              </h3>
              <div className={styles.body}>
                <span className={styles.rail} data-rail="" aria-hidden>
                  <span className={styles.fill} />
                </span>
                <ul className={styles.desc}>
                  {toLines(item.description[lang]).map((line, j) => (
                    <li key={j} className={styles.line} data-line="">
                      {line}
                    </li>
                  ))}
                </ul>

                {item.paperLink && item.paperTitle && (
                  <div className={styles.actions}>
                    {onCertClick && isImageLink(item.paperLink) ? (
                      <button
                        type="button"
                        onClick={() => onCertClick(item.paperLink!)}
                        className={styles.actionBtn}
                      >
                        {item.paperTitle[lang]}
                        <ArrowUpRight size={13} strokeWidth={1.75} />
                      </button>
                    ) : (
                      <a
                        href={item.paperLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionBtn}
                      >
                        {item.paperTitle[lang]}
                        <ArrowUpRight size={13} strokeWidth={1.75} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Timeline;
