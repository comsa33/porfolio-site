'use client';

import React, { useState } from 'react';
import styles from './ProjectCard.module.css';
import { Project } from '@/types';
import ProjectDetailModal from './ProjectDetailModal';
import ArchitectureModal from './ArchitectureModal';

interface ProjectCardProps {
  project: Project;
  lang: 'ko' | 'en';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, lang }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);

  return (
    <>
      <article className={styles.card}>
        <div className={styles.header}>
          {/* Company & Period */}
          {project.company && project.period && (
            <div className={styles.companyInfo}>
              <span className={styles.company}>{project.company[lang]}</span>
              <span className={styles.separator}>•</span>
              <span className={styles.period}>{project.period[lang]}</span>
            </div>
          )}

          <h3 className={styles.title}>
            {typeof project.title === 'string' ? project.title : project.title[lang]}
            {/* Platform Links */}
            {project.platformLinks && (
              <span className={styles.platformLinks}>
                {project.platformLinks.web && (
                  <a
                    href={project.platformLinks.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.platformLink}
                    title="Web App"
                    aria-label="Open web app"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
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
                    <svg viewBox="0 0 24 24" fill="currentColor">
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
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.99l-2.302 2.302-8.634-8.634z" />
                    </svg>
                  </a>
                )}
              </span>
            )}
          </h3>
          <p className={styles.shortDesc}>{project.shortDescription[lang]}</p>
        </div>

        <div className={styles.body}>
          <div className={styles.techStack}>
            {project.techStack.map((tech) => (
              <span key={tech} className={styles.techBadge}>
                {tech}
              </span>
            ))}
          </div>

          <div className={styles.fullDesc}>{project.fullDescription[lang]}</div>

          {project.keyAchievements && project.keyAchievements.length > 0 && (
            <div className={styles.achievements}>
              <h4 className={styles.achievementsTitle}>
                {lang === 'ko' ? '주요 성과' : 'Key Achievements'}
              </h4>
              <ul className={styles.achievementsList}>
                {project.keyAchievements.map((achievement, idx) => (
                  <li
                    key={idx}
                    className={styles.achievementItem}
                    dangerouslySetInnerHTML={{
                      __html: achievement[lang].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                    }}
                  />
                ))}
              </ul>
            </div>
          )}

          <div className={styles.features}>
            <h4 className={styles.featuresTitle}>{lang === 'ko' ? '주요 기능' : 'Features'}</h4>
            <ul className={styles.featuresList}>
              {project.features.map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  {typeof feature === 'string' ? feature : feature[lang]}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className={styles.buttonGroup}>
            {/* Problem-Solving Cases Button */}
            {project.detail && (
              <button className={styles.detailBtn} onClick={() => setShowDetail(true)}>
                <span>{lang === 'ko' ? '문제 해결 과정' : 'Key Solutions'}</span>
                <span className={styles.arrow}>→</span>
              </button>
            )}

            {/* Architecture Button */}
            {project.detail?.architecture && project.detail.architecture.length > 0 && (
              <button className={styles.architectureBtn} onClick={() => setShowArchitecture(true)}>
                <span>{lang === 'ko' ? '시스템 아키텍처' : 'System Architecture'}</span>
                <span className={styles.arrow}>→</span>
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Detail Modal */}
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
          projectTitle={typeof project.title === 'string' ? project.title : project.title[lang]}
          company={project.company}
          lang={lang}
        />
      )}
    </>
  );
};

export default ProjectCard;
