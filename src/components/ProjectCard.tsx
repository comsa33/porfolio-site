"use client";

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
            {project.title}
          </h3>
          <p className={styles.shortDesc}>{project.shortDescription[lang]}</p>
        </div>

        <div className={styles.body}>
          <div className={styles.techStack}>
            {project.techStack.map((tech) => (
              <span key={tech} className={styles.techTag}>
                {tech}
              </span>
            ))}
          </div>

          <div className={styles.fullDesc}>
            {project.fullDescription[lang]}
          </div>

          {project.keyAchievements && project.keyAchievements.length > 0 && (
            <div className={styles.achievements}>
              <h4 className={styles.achievementsTitle}>
                {lang === 'ko' ? '핵심 성과' : 'Key Achievements'}
              </h4>
              <ul className={styles.achievementsList}>
                {project.keyAchievements.map((achievement, idx) => (
                  <li 
                    key={idx} 
                    className={styles.achievementItem}
                    dangerouslySetInnerHTML={{ 
                      __html: achievement[lang].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }}
                  />
                ))}
              </ul>
            </div>
          )}
          
          <div className={styles.features}>
            <h4 className={styles.featuresTitle}>
              {lang === 'ko' ? '주요 기능' : 'Features'}
            </h4>
            <ul className={styles.featuresList}>
              {project.features.map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className={styles.buttonGroup}>
            {/* Problem-Solving Cases Button */}
            {project.detail && (
              <button 
                className={styles.detailBtn}
                onClick={() => setShowDetail(true)}
              >
                <span>{lang === 'ko' ? '문제 해결 사례 보기' : 'View Problem-Solving Cases'}</span>
                <span className={styles.arrow}>→</span>
              </button>
            )}
            
            {/* Architecture Button */}
            {project.detail?.architecture && project.detail.architecture.length > 0 && (
              <button 
                className={styles.architectureBtn}
                onClick={() => setShowArchitecture(true)}
              >
                <span>{lang === 'ko' ? '아키텍처 보기' : 'View Architecture'}</span>
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
      
      {/* Architecture Modal */}
      {showArchitecture && project.detail?.architecture && project.company && (
        <ArchitectureModal
          diagrams={project.detail.architecture}
          projectTitle={project.title}
          company={project.company}
          lang={lang}
          onClose={() => setShowArchitecture(false)}
        />
      )}
    </>
  );
};

export default ProjectCard;
