'use client';

import React from 'react';
import {
  Code2,
  GraduationCap,
  Palette,
  Plane,
  Briefcase,
  FileText,
  Award,
  Laptop,
  ExternalLink,
} from 'lucide-react';
import styles from './Timeline.module.css';
import { TimelineItem } from '@/types';

interface TimelineProps {
  items: TimelineItem[];
  lang: 'ko' | 'en';
  onCertClick?: (imagePath: string) => void;
}

const categoryIcons = {
  Dev: Code2,
  Education: GraduationCap,
  Design: Palette,
  Travel: Plane,
  Career: Briefcase,
  Certification: Award,
};

// Bootcamp entries render with a laptop icon instead of the education cap
const bootcampIds = ['edu-kcci', 'edu-codestates'];

const isImageLink = (link: string) =>
  link.endsWith('.png') || link.endsWith('.jpg') || link.endsWith('.webp');

const Timeline: React.FC<TimelineProps> = ({ items, lang, onCertClick }) => {
  return (
    <ol className={styles.timeline}>
      {items.map((item) => {
        const IconComponent = bootcampIds.includes(item.id)
          ? Laptop
          : categoryIcons[item.type as keyof typeof categoryIcons];
        const title = typeof item.title === 'string' ? item.title : item.title[lang];
        const role = typeof item.role === 'string' ? item.role : item.role[lang];
        const isPatent =
          item.paperTitle?.['en']?.toLowerCase().includes('patent') ||
          item.paperTitle?.[lang]?.includes('특허');

        return (
          <li key={item.id} className={styles.item} data-type={item.type}>
            <span className={styles.marker}>
              {IconComponent && <IconComponent size={14} strokeWidth={2} />}
            </span>
            <div className={styles.body}>
              <span className={styles.date}>{item.date}</span>
              <h3 className={styles.title}>
                {title}
                <span className={styles.role}>{role}</span>
              </h3>
              <p className={styles.desc}>{item.description[lang]}</p>

              {item.paperLink && item.paperTitle && (
                <>
                  {onCertClick && isImageLink(item.paperLink) ? (
                    <button
                      onClick={() => onCertClick(item.paperLink!)}
                      className={styles.paperLink}
                    >
                      {isPatent ? <Award size={13} /> : <FileText size={13} />}
                      <span>{item.paperTitle[lang]}</span>
                    </button>
                  ) : (
                    <a
                      href={item.paperLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.paperLink}
                    >
                      {isPatent ? <Award size={13} /> : <FileText size={13} />}
                      <span>{item.paperTitle[lang]}</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Timeline;
