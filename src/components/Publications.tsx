'use client';

import React, { useState } from 'react';
import { FileText, ExternalLink, Code2, CheckCircle2, Clock, Mic } from 'lucide-react';
import styles from './Publications.module.css';
import { Publication, PublicationStatus } from '@/types';

interface PublicationsProps {
  items: Publication[];
  lang: 'ko' | 'en';
}

const statusIcons: Record<PublicationStatus, React.ElementType> = {
  published: CheckCircle2,
  'under-review': Clock,
  presented: Mic,
};

const Publications: React.FC<PublicationsProps> = ({ items, lang }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {items.map((pub) => {
          const StatusIcon = statusIcons[pub.status];
          const isOpen = expandedId === pub.id;

          return (
            <article key={pub.id} className={styles.card} data-status={pub.status}>
              <div className={styles.badges}>
                <span className={styles.status}>
                  <StatusIcon size={13} strokeWidth={2.2} />
                  {pub.statusLabel[lang]}
                </span>
                {pub.indexing && <span className={styles.indexing}>{pub.indexing}</span>}
                <span className={styles.year}>{pub.year}</span>
              </div>

              <h3 className={styles.title}>{pub.title}</h3>
              <p className={styles.venue}>{pub.venue[lang]}</p>
              <p className={styles.role}>{pub.authorRole[lang]}</p>

              <p className={`${styles.summary} ${isOpen ? styles.summaryOpen : ''}`}>
                {pub.summary[lang]}
              </p>

              <button
                type="button"
                className={styles.moreBtn}
                onClick={() => setExpandedId(isOpen ? null : pub.id)}
                aria-expanded={isOpen}
              >
                {isOpen
                  ? lang === 'ko'
                    ? '접기'
                    : 'Show less'
                  : lang === 'ko'
                    ? '더 보기'
                    : 'Show more'}
              </button>

              {(pub.link || pub.codeLink || pub.doi) && (
                <div className={styles.links}>
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      <ExternalLink size={14} />
                      {lang === 'ko' ? '논문 보기' : 'View paper'}
                    </a>
                  )}
                  {pub.codeLink && (
                    <a
                      href={pub.codeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      <Code2 size={14} />
                      {lang === 'ko' ? '코드' : 'Code'}
                    </a>
                  )}
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      <FileText size={14} />
                      DOI
                    </a>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Publications;
