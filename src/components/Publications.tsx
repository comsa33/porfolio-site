'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import BrandIcon from './BrandIcon';
import styles from './Publications.module.css';
import { Publication } from '@/types';

interface PublicationsProps {
  items: Publication[];
  lang: 'ko' | 'en';
}

/**
 * Research as list rows: year / status / indexing in the mono column, title
 * and venue beside it, summary behind an animated disclosure.
 */
const Publications: React.FC<PublicationsProps> = ({ items, lang }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <ol className={styles.list}>
      {items.map((pub, i) => {
        const isOpen = expandedId === pub.id;
        const detailsId = `pub-details-${pub.id}`;

        return (
          <li
            key={pub.id}
            className={styles.row}
            data-status={pub.status}
            style={{ '--i': i } as React.CSSProperties}
          >
            <div className={styles.meta}>
              <span className={styles.year}>{pub.year}</span>
              <span className={styles.status}>{pub.statusLabel[lang]}</span>
              {pub.indexing && <span>{pub.indexing}</span>}
            </div>

            <div className={styles.main}>
              <h3 className={styles.title}>{pub.title}</h3>
              <p className={styles.venue}>
                {pub.venue[lang]} · {pub.authorRole[lang]}
              </p>

              <div
                id={detailsId}
                className={`${styles.details} ${isOpen ? styles.detailsOpen : ''}`}
                aria-hidden={!isOpen}
              >
                <div className={styles.detailsInner}>
                  <p className={styles.summary}>{pub.summary[lang]}</p>
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => setExpandedId(isOpen ? null : pub.id)}
                  aria-expanded={isOpen}
                  aria-controls={detailsId}
                >
                  {isOpen ? (lang === 'ko' ? '접기' : 'Less') : lang === 'ko' ? '요약' : 'Summary'}
                  <ChevronDown
                    size={13}
                    strokeWidth={1.75}
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                  />
                </button>

                {pub.link && (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionBtn}
                  >
                    {pub.category === 'patent'
                      ? lang === 'ko'
                        ? '특허'
                        : 'Patent'
                      : lang === 'ko'
                        ? '논문'
                        : 'Paper'}
                    <ArrowUpRight size={13} strokeWidth={1.75} />
                  </a>
                )}
                {pub.codeLink && (
                  <a
                    href={pub.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionBtn}
                  >
                    <BrandIcon url={pub.codeLink} size={13} />
                    {lang === 'ko' ? '코드' : 'Code'}
                  </a>
                )}
                {pub.doi && (
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionBtn}
                  >
                    DOI
                    <ArrowUpRight size={13} strokeWidth={1.75} />
                  </a>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Publications;
