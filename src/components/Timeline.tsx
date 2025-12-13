"use client";

import React from 'react';
import styles from './Timeline.module.css';
import { TimelineItem } from '@/types';

interface TimelineProps {
  items: TimelineItem[];
  lang: 'ko' | 'en';
}

const Timeline: React.FC<TimelineProps> = ({ items, lang }) => {
  return (
    <div className={styles.container}>
      <div className={styles.line} />
      <div className={styles.scrollContainer}>
        {items.map((item) => (
          <div key={item.id} className={styles.item} data-type={item.type}>
            <div className={`${styles.categoryIcon} ${styles[`icon${item.type}`]}`} />
            <div className={styles.connector} />
            <div className={styles.itemContent}>
              <h3 className={styles.title}>{typeof item.title === 'string' ? item.title : item.title[lang]}</h3>
              <p className={styles.role}>{typeof item.role === 'string' ? item.role : item.role[lang]}</p>
              <p className={styles.description}>
                {item.description[lang]}
              </p>
            </div>
            <div className={styles.typeIndicator}>
              <div className={styles.indicatorDot} />
              <span className={styles.dateLabel}>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
