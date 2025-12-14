'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import Timeline from '@/components/Timeline';
import ProjectCard from '@/components/ProjectCard';
import NeuralBackground from '@/components/NeuralBackground';
import TimelineBackground from '@/components/TimelineBackground';
import FooterBackground from '@/components/FooterBackground';
import portfolioData from '@/data/portfolio.json';
import { PortfolioData, TimelineType } from '@/types';

const data = portfolioData as PortfolioData;

// Section Title Constants
const SECTION_TITLES = {
  featured: { ko: '주요 프로젝트', en: 'Featured Project' },
  timeline: { ko: '여정', en: 'Journey' },
  otherProjects: { ko: '기타 프로젝트', en: 'Other Projects' },
  contact: { ko: 'Contact', en: 'Contact' },
} as const;

// Helper: Get career experience text with years
function getCareerIntro(lang: 'ko' | 'en', introText: string): string {
  const startYear = 2022;
  const currentYear = new Date().getFullYear();
  const years = currentYear - startYear;

  if (lang === 'ko') {
    return introText.replace('AI 에이전트 플랫폼 개발자', `${years}년차 AI 에이전트 플랫폼 개발자`);
  } else {
    const yearSuffix =
      years === 1
        ? '1st-year'
        : years === 2
          ? '2nd-year'
          : years === 3
            ? '3rd-year'
            : `${years}th-year`;
    return introText.replace(
      'An AI Agent Platform Developer',
      `A ${yearSuffix} AI Agent Platform Developer`,
    );
  }
}

export default function Home() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  /* Timeline Filter State (Default: Career) */
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'education' | 'career' | 'other'>(
    'career',
  );
  const [showHeader, setShowHeader] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);
  const mainRef = useRef<HTMLDivElement>(null);

  const toggleLang = () => {
    setLang((prev) => (prev === 'ko' ? 'en' : 'ko'));
  };

  useEffect(() => {
    const mainElement = mainRef.current;

    const handleScroll = () => {
      if (!mainElement) return;

      const currentScrollY = mainElement.scrollTop;
      const totalHeight = mainElement.scrollHeight - mainElement.clientHeight;
      const progress = totalHeight > 0 ? (currentScrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down & passed threshold -> Hide Header
        setShowHeader(false);
      } else {
        // Scrolling up -> Show Header
        setShowHeader(true);
      }

      lastScrollY.current = currentScrollY;
    };

    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Sort timeline: Reverse chronological (Newest first)
  const sortedTimeline = [...data.timeline].reverse();

  // Bootcamp IDs to be moved to "Other"
  const bootcampIds = ['edu-kcci', 'edu-codestates'];

  const filteredTimeline = sortedTimeline.filter((item) => {
    if (timelineFilter === 'all') return true;

    if (timelineFilter === 'education') {
      // Education: Type is Education AND NOT a bootcamp
      return item.type === 'Education' && !bootcampIds.includes(item.id);
    }

    if (timelineFilter === 'career') {
      // Career: Dev or Career types
      return ['Dev', 'Career'].includes(item.type);
    }

    if (timelineFilter === 'other') {
      // Other: Design, Travel OR Bootcamps
      return ['Design', 'Travel'].includes(item.type) || bootcampIds.includes(item.id);
    }

    return false;
  });

  // PyRunner as featured project
  const featuredProject = data.projects.find((p) => p.id === 'py-runner');
  const otherProjects = data.projects.filter((p) => p.id !== 'py-runner');

  return (
    <main ref={mainRef} className={styles.main}>
      <nav className={`${styles.nav} ${!showHeader ? styles.navHidden : ''}`}>
        <div className={styles.logo}>RUO.AI</div>
        <button onClick={toggleLang} className={styles.langBtn}>
          {lang.toUpperCase()}
        </button>
      </nav>

      {/* Scroll Progress Bar */}
      <div
        className={`${styles.progressBar} ${!showHeader ? styles.progressBarHidden : ''}`}
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Hero with Story */}
      <section id="hero" className={styles.hero}>
        <NeuralBackground />
        <div className={styles.heroContent}>
          <p className={styles.subtitle}>{data.profile.title}</p>
          <h1 className={styles.title}>{data.profile.name[lang]}</h1>
          <p className={styles.description}>{getCareerIntro(lang, data.profile.intro[lang])}</p>

          {/* Core Skills */}
          <div className={styles.skillsSection}>
            <h4 className={styles.skillsTitle}>Core Skills</h4>
            <div className={styles.skillsGrid}>
              {/* Backend */}
              <div className={styles.skillCategory}>
                <div className={styles.categoryHeader}>
                  <svg
                    className={styles.categoryIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  <span className={styles.categoryTitle}>
                    {data.profile.coreSkills.backend.title[lang]}
                  </span>
                </div>
                <div className={styles.skillList}>
                  {data.profile.coreSkills.backend.skills.map((skill) => (
                    <span key={skill} className={styles.skillBadge}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI & LLM */}
              <div className={styles.skillCategory}>
                <div className={styles.categoryHeader}>
                  <svg
                    className={styles.categoryIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  <span className={styles.categoryTitle}>
                    {data.profile.coreSkills.ai.title[lang]}
                  </span>
                </div>
                <div className={styles.skillList}>
                  {data.profile.coreSkills.ai.skills.map((skill) => (
                    <span key={skill} className={styles.skillBadge}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* System Design */}
              <div className={styles.skillCategory}>
                <div className={styles.categoryHeader}>
                  <svg
                    className={styles.categoryIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  <span className={styles.categoryTitle}>
                    {data.profile.coreSkills.system.title[lang]}
                  </span>
                </div>
                <div className={styles.skillList}>
                  {data.profile.coreSkills.system.skills.map((skill) => (
                    <span key={skill} className={styles.skillBadge}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.mouse}>
            <div className={styles.wheel} />
          </div>
          <span className={styles.scrollText}>SCROLL TO EXPLORE</span>
        </div>
      </section>

      {/* Featured Project */}
      {featuredProject && (
        <section id="featured" className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>{SECTION_TITLES.featured[lang]}</h2>
          <div className={styles.featuredProject}>
            <ProjectCard project={featuredProject} lang={lang} />
          </div>
        </section>
      )}

      {/* Other Projects */}
      <section id="other-projects" className={styles.section}>
        <h2 className={styles.sectionTitle}>{SECTION_TITLES.otherProjects[lang]}</h2>
        <div className={styles.projectsGrid}>
          {otherProjects.map((project) => (
            <ProjectCard key={project.id} project={project} lang={lang} />
          ))}
        </div>
      </section>

      {/* Timeline with Filter */}
      <section id="timeline" className={styles.section}>
        <TimelineBackground />
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{SECTION_TITLES.timeline[lang]}</h2>
          <div className={`${styles.filterButtons} ${styles[timelineFilter]}`}>
            <div className={styles.glider} />
            <button
              className={`${styles.filterBtn} ${timelineFilter === 'all' ? styles.active : ''}`}
              onClick={() => setTimelineFilter('all')}
            >
              {lang === 'ko' ? '전체' : 'All'}
            </button>
            <button
              className={`${styles.filterBtn} ${timelineFilter === 'education' ? styles.active : ''}`}
              onClick={() => setTimelineFilter('education')}
            >
              {lang === 'ko' ? '학력' : 'Education'}
            </button>
            <button
              className={`${styles.filterBtn} ${timelineFilter === 'career' ? styles.active : ''}`}
              onClick={() => setTimelineFilter('career')}
            >
              {lang === 'ko' ? '경력' : 'Career'}
            </button>
            <button
              className={`${styles.filterBtn} ${timelineFilter === 'other' ? styles.active : ''}`}
              onClick={() => setTimelineFilter('other')}
            >
              {lang === 'ko' ? '기타' : 'Other'}
            </button>
          </div>
        </div>
        <Timeline items={filteredTimeline} lang={lang} />
      </section>

      {/* Contact Footer */}
      <footer id="contact" className={styles.footer}>
        <FooterBackground />
        <div className={styles.footerContent}>
          <h3 className={styles.footerTitle}>{SECTION_TITLES.contact[lang]}</h3>
          <p className={styles.footerText}>
            {lang === 'ko'
              ? 'AI 관련 다양한 기회에 열려있습니다. 함께 문제를 해결하고 성장하고 싶습니다.'
              : 'Open to diverse AI opportunities. I want to solve problems and grow together.'}
          </p>
          <div className={styles.contactLinks}>
            <a
              href={data.profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
              aria-label="GitHub"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            {data.profile.linkedin && (
              <a
                href={data.profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
                aria-label="LinkedIn"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            )}
          </div>
          <p className={styles.emailText}>{data.profile.email}</p>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2025 {data.profile.name[lang]}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
