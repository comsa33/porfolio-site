"use client";

import { useState } from 'react';
import styles from './page.module.css';
import Timeline from '@/components/Timeline';
import ProjectCard from '@/components/ProjectCard';
import NeuralBackground from '@/components/NeuralBackground';
import portfolioData from '@/data/portfolio.json';
import { PortfolioData, TimelineType } from '@/types';

const data = portfolioData as PortfolioData;

export default function Home() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [timelineFilter, setTimelineFilter] = useState<TimelineType | 'all'>('Dev'); // Default to Dev only

  const toggleLang = () => {
    setLang(prev => prev === 'ko' ? 'en' : 'ko');
  };

  // Dev-related education IDs (AI 관련 학력)
  const devRelatedEducation = ['edu-kcyber', 'edu-aSST'];

  const filteredTimeline = timelineFilter === 'all' 
    ? data.timeline 
    : data.timeline.filter(item => 
        item.type === timelineFilter || 
        (timelineFilter === 'Dev' && devRelatedEducation.includes(item.id))
      );

  // PyRunner as featured project
  const featuredProject = data.projects.find(p => p.id === 'py-runner');
  const otherProjects = data.projects.filter(p => p.id !== 'py-runner');

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <div className={styles.logo}>RUO.AI</div>
        <button onClick={toggleLang} className={styles.langBtn}>
          {lang.toUpperCase()}
        </button>
      </nav>

      {/* Hero with Story */}
      <div className={styles.hero}>
        <NeuralBackground />
        <div className={styles.heroContent}>
          <p className={styles.story}>{data.profile.story[lang]}</p>
          <h1 className={styles.title}>
            {data.profile.name[lang]}
          </h1>
          <p className={styles.subtitle}>
            {data.profile.title}
          </p>
          <p className={styles.description}>
            {data.profile.intro[lang]}
          </p>
        </div>
      </div>

      {/* Featured Project */}
      {featuredProject && (
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>
            {lang === 'ko' ? '주요 프로젝트' : 'Featured Project'}
          </h2>
          <div className={styles.featuredProject}>
            <ProjectCard project={featuredProject} lang={lang} />
          </div>
        </section>
      )}

      {/* Timeline with Filter */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {lang === 'ko' ? '경력' : 'Timeline'}
          </h2>
          <div className={styles.filterButtons}>
            <button 
              className={`${styles.filterBtn} ${timelineFilter === 'all' ? styles.active : ''}`}
              onClick={() => setTimelineFilter('all')}
            >
              {lang === 'ko' ? '전체' : 'All'}
            </button>
            <button 
              className={`${styles.filterBtn} ${timelineFilter === 'Dev' ? styles.active : ''}`}
              onClick={() => setTimelineFilter('Dev')}
            >
              {lang === 'ko' ? '개발' : 'Dev'}
            </button>
          </div>
        </div>
        <Timeline items={filteredTimeline} lang={lang} />
      </section>

      {/* Other Projects */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {lang === 'ko' ? '기타 프로젝트' : 'Other Projects'}
        </h2>
        <div className={styles.projectsGrid}>
          {otherProjects.map((project) => (
            <ProjectCard key={project.id} project={project} lang={lang} />
          ))}
        </div>
      </section>

      {/* Contact Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <h3 className={styles.footerTitle}>
            {lang === 'ko' ? '연락하기' : 'Get In Touch'}
          </h3>
          <p className={styles.footerText}>
            {lang === 'ko' 
              ? '함께 혁신적인 프로젝트를 만들어가실 분을 찾고 있습니다'
              : 'Looking forward to building innovative projects together'}
          </p>
          <div className={styles.contactLinks}>
            <a href={data.profile.github} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
              GitHub
            </a>
            {data.profile.linkedin && (
              <a href={data.profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                LinkedIn
              </a>
            )}
            <a href={`mailto:${data.profile.email}`} className={styles.contactLink}>
              Email
            </a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2025 {data.profile.name[lang]}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
