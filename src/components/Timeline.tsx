'use client';

import React, { useEffect, useRef, useState } from 'react';
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

const Timeline: React.FC<TimelineProps> = ({ items, lang, onCertClick }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Cleanup stale refs from previous renders (filtering)
    itemRefs.current = itemRefs.current.slice(0, items.length);

    const updateTransforms = () => {
      const scrollerRect = scroller.getBoundingClientRect();
      const scrollerCenter = scrollerRect.top + scrollerRect.height / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;

        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;
        const distanceFromCenter = itemCenter - scrollerCenter;

        // Track closest item to center
        const absDistance = Math.abs(distanceFromCenter);
        if (absDistance < closestDistance) {
          closestDistance = absDistance;
          closestIndex = index;
        }

        // Adjust transform intensity based on screen size
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;

        const rotationMultiplier = isSmallMobile ? 0.03 : isMobile ? 0.04 : 0.035; // Increased mobile rotation
        const scaleMultiplier = isSmallMobile ? 0.0005 : isMobile ? 0.0007 : 0.0006; // Increased mobile scale
        const opacityMultiplier = isSmallMobile ? 0.001 : isMobile ? 0.0012 : 0.001;

        // Calculate transforms based on distance from center
        const rotation = distanceFromCenter * rotationMultiplier;
        const scale = Math.max(0.75, 1 - Math.abs(distanceFromCenter) * scaleMultiplier);
        // Smoother opacity drop-off for higher density
        const opacity = Math.max(0.2, 1 - Math.abs(distanceFromCenter) * opacityMultiplier);

        // Apply transforms
        item.style.transform = `rotateX(${rotation}deg) scale(${scale})`;
        item.style.opacity = opacity.toString();
      });

      setActiveIndex(closestIndex);
    };

    // Initial update
    updateTransforms();

    // Optimized scroll handler using requestAnimationFrame
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateTransforms();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Update on scroll
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  const scrollToItem = (index: number) => {
    const item = itemRefs.current[index];
    if (!item || !scrollerRef.current) return;

    const scroller = scrollerRef.current;

    // Calculate absolute position to center the item
    const scrollerHeight = scroller.clientHeight;
    const itemOffsetTop = item.offsetTop;
    const itemHeight = item.clientHeight;

    // Center the item in the viewport
    const scrollPosition = itemOffsetTop - scrollerHeight / 2 + itemHeight / 2;

    scroller.scrollTo({
      top: scrollPosition,
      behavior: 'smooth',
    });
  };

  // Check if this is a certification item (for image modal)
  const isCertificationImage = (link: string) => {
    return link.endsWith('.png') || link.endsWith('.jpg') || link.endsWith('.webp');
  };

  return (
    <div className={styles.timelineWrapper}>
      <div className={styles.scrollerContainer} ref={scrollerRef}>
        <div className={styles.timelineTrack}>
          {items.map((item, index) => {
            // Custom Icon Logic for IT Training (Bootcamps)
            let IconComponent = categoryIcons[item.type as keyof typeof categoryIcons];

            // Override for specific IT education items
            if (['edu-kcci', 'edu-codestates'].includes(item.id)) {
              IconComponent = Laptop;
            }

            return (
              <div
                key={item.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={`${styles.timelineItem} ${index === activeIndex ? styles.activeItem : ''}`}
                data-type={item.type}
                data-id={item.id} // Add data-id for specific styling override
              >
                {/* Date badge - outside card, top-left */}
                <div className={styles.dateBadge}>{item.date}</div>

                {/* Card */}
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

                  <div className={styles.cardBody}>
                    <p className={styles.description}>{item.description[lang]}</p>

                    {/* Paper Link (if exists) */}
                    {item.paperLink && item.paperTitle && (
                      <>
                        {onCertClick && isCertificationImage(item.paperLink) ? (
                          <button
                            onClick={() => onCertClick(item.paperLink!)}
                            className={styles.paperLink}
                          >
                            {item.paperTitle['en']?.toLowerCase().includes('patent') ||
                            item.paperTitle[lang]?.includes('특허') ? (
                              <Award size={16} className={styles.paperIcon} />
                            ) : (
                              <FileText size={16} className={styles.paperIcon} />
                            )}
                            <span className={styles.paperTitle}>{item.paperTitle[lang]}</span>
                            <ExternalLink size={14} className={styles.externalIcon} />
                          </button>
                        ) : (
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
                            <ExternalLink size={14} className={styles.externalIcon} />
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Minimap Navigator with Dates */}
      <div className={styles.minimap}>
        <div className={styles.minimapLine} />
        <div className={styles.minimapAnchor}>
          <div
            className={styles.minimapTrack}
            style={{ transform: `translateY(calc(-1 * (${activeIndex * 64}px + 12px)))` }}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className={styles.minimapItem}
                onClick={() => scrollToItem(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    scrollToItem(index);
                  }
                }}
                aria-label={`Go to ${typeof item.title === 'string' ? item.title : item.title[lang]}`}
              >
                <div
                  className={`${styles.minimapDot} ${index === activeIndex ? styles.minimapDotActive : ''}`}
                  data-type={item.type}
                />
                <span
                  className={`${styles.minimapDate} ${index === activeIndex ? styles.minimapDateActive : ''}`}
                >
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
