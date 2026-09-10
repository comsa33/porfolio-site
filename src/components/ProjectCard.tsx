'use client';

import React, { useRef, useState } from 'react';
import { ChevronDown, Wrench, Network } from 'lucide-react';
import BrandIcon, { brandName } from './BrandIcon';
import styles from './ProjectCard.module.css';
import { Project } from '@/types';
import ProjectDetailModal from './ProjectDetailModal';
import ArchitectureModal from './ArchitectureModal';
import { useEdgeReveal, useRowActive, useSameHeight } from './useEdgeReveal';

/** The achievements carry <strong> for emphasis; the peek is one plain line. */
const plain = (html: string) => html.replace(/<[^>]*>/g, '');

interface ProjectCardProps {
  project: Project;
  lang: 'ko' | 'en';
  /** Position in the visible list; drives the entrance stagger. */
  index: number;
}

/**
 * One project as a list row: period in a narrow mono column, content beside
 * it. Details are always rendered and revealed with a height transition so
 * expanding feels like the row growing rather than content popping in.
 */
const ProjectCard: React.FC<ProjectCardProps> = ({ project, lang, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);

  const title = typeof project.title === 'string' ? project.title : project.title[lang];
  const detailsId = `project-details-${project.id}`;

  // The row's headline achievement, shown in place of the summary while the
  // reader is on the row. Expanding the row lists all of them, so the peek
  // stands down rather than competing with the list it introduces.
  const peek = project.keyAchievements?.[0] ? plain(project.keyAchievements[0][lang]) : undefined;
  const rowRef = useRef<HTMLLIElement>(null);
  const row = useRowActive(rowRef);
  const open = row.active && !expanded && Boolean(peek);
  const slotRef = useEdgeReveal(open, rowRef);
  const descRef = useSameHeight(slotRef);

  return (
    <>
      <li
        ref={rowRef}
        data-project-row=""
        className={styles.row}
        style={{ '--i': index } as React.CSSProperties}
        onPointerEnter={row.onPointerEnter}
        onPointerLeave={row.onPointerLeave}
      >
        <div className={styles.period}>
          {project.period?.[lang]}
          {project.company && <span className={styles.company}>{project.company[lang]}</span>}
        </div>

        <div className={styles.main}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{title}</h3>
            {project.platformLinks && (
              <span className={styles.platformLinks}>
                {project.platformLinks.web && (
                  <a
                    href={project.platformLinks.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.platformLink}
                    title={brandName(project.platformLinks.web)}
                    aria-label={`Open on ${brandName(project.platformLinks.web)}`}
                  >
                    <BrandIcon url={project.platformLinks.web} size={14} />
                  </a>
                )}
                {project.platformLinks.github && (
                  <a
                    href={project.platformLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.platformLink}
                    title="GitHub"
                    aria-label="Open on GitHub"
                  >
                    <BrandIcon url={project.platformLinks.github} size={14} />
                  </a>
                )}
                {project.platformLinks.ios && (
                  <a
                    href={project.platformLinks.ios}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.platformLink}
                    title="App Store"
                    aria-label="Open in App Store"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </a>
                )}
                {project.platformLinks.android && (
                  <a
                    href={project.platformLinks.android}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.platformLink}
                    title="Google Play"
                    aria-label="Open in Google Play"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.99l-2.302 2.302-8.634-8.634z" />
                    </svg>
                  </a>
                )}
              </span>
            )}
          </div>

          {/* The summary and what the project achieved share one slot: an edge
              crosses the box and the two trade places. The box is measured to
              the taller of them, so nothing below it ever moves. */}
          <div ref={slotRef} className={styles.slot}>
            <p ref={descRef} className={styles.oneLiner}>
              {project.shortDescription[lang]}
            </p>
            {peek && (
              <>
                <p className={styles.peek} aria-hidden>
                  {peek}
                </p>
                <span className={styles.blurBand} aria-hidden>
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
                <span className={styles.edge} aria-hidden />
              </>
            )}
          </div>
          <p className={styles.techLine}>{project.techStack.join(' · ')}</p>

          <div
            id={detailsId}
            className={`${styles.details} ${expanded ? styles.detailsOpen : ''}`}
            aria-hidden={!expanded}
          >
            <div className={styles.detailsInner}>
              <div className={styles.detailsBody}>
                <p className={styles.fullDesc}>{project.fullDescription[lang]}</p>
                {project.keyAchievements && project.keyAchievements.length > 0 && (
                  <>
                    <p className={styles.expandedLabel}>
                      {lang === 'ko' ? '주요 성과' : 'Key achievements'}
                    </p>
                    <ul className={styles.achievementsList}>
                      {project.keyAchievements.map((achievement, idx) => (
                        <li
                          key={idx}
                          dangerouslySetInnerHTML={{
                            __html: achievement[lang].replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong>$1</strong>',
                            ),
                          }}
                        />
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-controls={detailsId}
            >
              {expanded ? (lang === 'ko' ? '접기' : 'Less') : lang === 'ko' ? '더 보기' : 'More'}
              <ChevronDown
                size={13}
                strokeWidth={1.75}
                className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
              />
            </button>
            {project.detail?.problemSolving && project.detail.problemSolving.length > 0 && (
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => setShowDetail(true)}
              >
                <Wrench size={13} strokeWidth={1.75} />
                {lang === 'ko' ? '문제 해결 과정' : 'Key solutions'}
              </button>
            )}
            {project.detail?.architecture && project.detail.architecture.length > 0 && (
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => setShowArchitecture(true)}
              >
                <Network size={13} strokeWidth={1.75} />
                {lang === 'ko' ? '아키텍처' : 'Architecture'}
              </button>
            )}
          </div>
        </div>
      </li>

      {showDetail && (
        <ProjectDetailModal
          project={project}
          lang={lang}
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
        />
      )}

      {showArchitecture && project.detail?.architecture && project.company && (
        <ArchitectureModal
          onClose={() => setShowArchitecture(false)}
          diagrams={project.detail.architecture}
          projectTitle={title}
          company={project.company}
          lang={lang}
        />
      )}
    </>
  );
};

export default ProjectCard;
