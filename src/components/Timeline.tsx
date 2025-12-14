'use client';

import React, { useEffect } from 'react';
import { Code2, GraduationCap, Palette, Plane, Briefcase, FileText, Award } from 'lucide-react';
import styles from './Timeline.module.css';
import { TimelineItem } from '@/types';

interface TimelineProps {
  items: TimelineItem[];
  lang: 'ko' | 'en';
}

const categoryIcons = {
  Dev: Code2,
  Education: GraduationCap,
  Design: Palette,
  Travel: Plane,
  Career: Briefcase,
};

const Timeline: React.FC<TimelineProps> = ({ items, lang }) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' },
    );

    const timelineItems = document.querySelectorAll(`.${styles.timelineItem}`);
    timelineItems.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <div className={styles.container}>
      <div className={styles.timelineLine} />

      {items.map((item, index) => {
        const IconComponent = categoryIcons[item.type as keyof typeof categoryIcons];

        return (
          <div
            key={item.id}
            className={styles.timelineItem}
            data-type={item.type}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Left: Simple Dot + Date */}
            <div className={styles.timelineDot}>
              <div className={styles.dot} />
              <span className={styles.dateLabel}>{item.date}</span>
            </div>

            {/* Right: Card with Icon in Title */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.titleRow}>
                  {IconComponent && (
                    <IconComponent className={styles.titleIcon} size={20} strokeWidth={2} />
                  )}
                  <h3>{typeof item.title === 'string' ? item.title : item.title[lang]}</h3>
                </div>
                <span className={styles.role}>
                  {typeof item.role === 'string' ? item.role : item.role[lang]}
                </span>
              </div>
              <p className={styles.description}>{item.description[lang]}</p>

              {/* Paper Link (if exists) */}
              {item.paperLink && item.paperTitle && (
                <a
                  href={item.paperLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.paperLink}
                >
                  {item.paperTitle['en']?.toLowerCase().includes('patent') ||
                  item.paperTitle[lang]?.includes('특허') ? (
                    <Award size={16} className={styles.paperIcon} />
                  ) : (
                    <FileText size={16} className={styles.paperIcon} />
                  )}
                  <span className={styles.paperTitle}>{item.paperTitle[lang]}</span>
                  <span className={styles.externalIcon}>↗</span>
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
