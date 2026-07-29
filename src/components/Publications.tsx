'use client';

import React, { useState } from 'react';
import { FileText, ExternalLink, CheckCircle2, Clock, Mic, Award } from 'lucide-react';
import BrandIcon from './BrandIcon';
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
  patent: Award,
};

const Publications: React.FC<PublicationsProps> = ({ items, lang }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <ol className={styles.list}>
      {items.map((pub) => {
        const StatusIcon = statusIcons[pub.status];
        const isOpen = expandedId === pub.id;

        return (
          <li key={pub.id} className={styles.item} data-status={pub.status}>
            <div className={styles.metaRow}>
              <span className={styles.status}>
                <StatusIcon size={13} strokeWidth={2.2} />
                {pub.statusLabel[lang]}
              </span>
              {pub.indexing && <span className={styles.indexing}>{pub.indexing}</span>}
              <span className={styles.year}>{pub.year}</span>
            </div>

            <h3 className={styles.title}>{pub.title}</h3>
            <p className={styles.venue}>
              {pub.venue[lang]} · {pub.authorRole[lang]}
            </p>

            <p className={`${styles.summary} ${isOpen ? styles.summaryOpen : ''}`}>
              {pub.summary[lang]}
            </p>

            <div className={styles.footerRow}>
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

              {pub.link && (
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <ExternalLink size={13} />
                  {lang === 'ko' ? '논문' : 'Paper'}
                </a>
              )}
              {pub.codeLink && (
                <a
                  href={pub.codeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
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
                  className={styles.link}
                >
                  <FileText size={13} />
                  DOI
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Publications;
