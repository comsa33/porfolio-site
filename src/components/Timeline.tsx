'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import styles from './Timeline.module.css';
import { TimelineItem, TimelineType } from '@/types';

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

const isImageLink = (link: string) =>
  link.endsWith('.png') || link.endsWith('.jpg') || link.endsWith('.webp');

/**
 * Journey as list rows: date range in the mono column, organisation and role
 * beside it. No rail or icons; the category is a word under the date.
 */
const Timeline: React.FC<TimelineProps> = ({ items, lang, onCertClick }) => {
  return (
    <ol className={styles.list}>
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
              <span className={styles.date}>{item.date}</span>
              <span className={styles.kind}>{kind}</span>
            </div>

            <div className={styles.main}>
              <h3 className={styles.title}>
                {title}
                <span className={styles.role}>{role}</span>
              </h3>
              <p className={styles.desc}>{item.description[lang]}</p>

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
          </li>
        );
      })}
    </ol>
  );
};

export default Timeline;
