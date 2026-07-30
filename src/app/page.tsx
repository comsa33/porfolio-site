'use client';

import { useState } from 'react';
import { Github, Linkedin, Mail, ShieldCheck, X } from 'lucide-react';
import styles from './page.module.css';
import Timeline from '@/components/Timeline';
import Publications from '@/components/Publications';
import ProjectCard from '@/components/ProjectCard';
import portfolioData from '@/data/portfolio.json';
import { PortfolioData } from '@/types';

const data = portfolioData as PortfolioData;

const SECTION_TITLES = {
  projects: { ko: '프로젝트', en: 'Projects' },
  research: { ko: '연구', en: 'Research' },
  journey: { ko: '여정', en: 'Journey' },
  contact: { ko: '연락처', en: 'Contact' },
} as const;

const NAV_ITEMS = [
  { id: 'projects', label: SECTION_TITLES.projects },
  { id: 'research', label: SECTION_TITLES.research },
  { id: 'journey', label: SECTION_TITLES.journey },
  { id: 'contact', label: SECTION_TITLES.contact },
] as const;

/**
 * Career length is anchored to the measured figure (46 months of employment as of
 * 2026-07, which excludes the 2023.06–2023.11 gap) and accrues from there, so it
 * stays accurate instead of gaining a year every January.
 */
const CAREER_ANCHOR = { year: 2026, month: 7, months: 46 };

function getCareerYears(): number {
  const now = new Date();
  const elapsedMonths =
    (now.getFullYear() - CAREER_ANCHOR.year) * 12 + (now.getMonth() + 1 - CAREER_ANCHOR.month);
  const totalMonths = CAREER_ANCHOR.months + Math.max(0, elapsedMonths);
  // Korean "N년차" counts the year in progress, hence the +1.
  return Math.floor(totalMonths / 12) + 1;
}

/**
 * Fills the `{years}` placeholder in the intro copy. The placeholder is explicit
 * so the copy can be rewritten freely — matching on a prose fragment used to make
 * the year silently vanish whenever the sentence changed.
 */
function getCareerIntro(lang: 'ko' | 'en', introText: string): string {
  const years = getCareerYears();
  const token =
    lang === 'ko'
      ? String(years)
      : years === 1
        ? '1st-year'
        : years === 2
          ? '2nd-year'
          : years === 3
            ? '3rd-year'
            : `${years}th-year`;

  return introText.replace('{years}', token);
}

export default function Home() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [timelineFilter, setTimelineFilter] = useState<
    'all' | 'education' | 'career' | 'certification' | 'other'
  >('career');
  // Defaults to the four pillars so the section opens at ~1 screen on a phone
  // instead of three; the other six stay one chip away.
  const [projectFilter, setProjectFilter] = useState<'featured' | 'all' | 'company' | 'personal'>(
    'featured',
  );
  const [certModalImage, setCertModalImage] = useState<string | null>(null);

  const toggleLang = () => setLang((prev) => (prev === 'ko' ? 'en' : 'ko'));

  // Timeline: newest first by START date. Sorting by parsed date (not reversed
  // array order) keeps entries correct no matter where they sit in the JSON —
  // the ISO certs were appended last and used to surface above newer entries.
  const parseStart = (date: string): number => {
    const m = date.match(/(\d{4})\.(\d{2})/);
    return m ? parseInt(m[1], 10) * 100 + parseInt(m[2], 10) : 0;
  };
  const sortedTimeline = [...data.timeline].sort((a, b) => parseStart(b.date) - parseStart(a.date));

  // Bootcamps live under "Other" rather than "Education"
  const bootcampIds = ['edu-kcci', 'edu-codestates'];

  const filteredTimeline = sortedTimeline.filter((item) => {
    if (timelineFilter === 'all') return true;
    if (timelineFilter === 'education')
      return item.type === 'Education' && !bootcampIds.includes(item.id);
    if (timelineFilter === 'career') return ['Dev', 'Career'].includes(item.type);
    if (timelineFilter === 'certification') return item.type === 'Certification';
    if (timelineFilter === 'other')
      return ['Design', 'Travel'].includes(item.type) || bootcampIds.includes(item.id);
    return false;
  });

  const timelineFilters = [
    { key: 'all', label: { ko: '전체', en: 'All' } },
    { key: 'education', label: { ko: '학력', en: 'Education' } },
    { key: 'career', label: { ko: '경력', en: 'Career' } },
    { key: 'certification', label: { ko: '자격', en: 'Certs' } },
    { key: 'other', label: { ko: '기타', en: 'Other' } },
  ] as const;

  const sortByOrder = (a: (typeof data.projects)[0], b: (typeof data.projects)[0]) =>
    (a.order ?? 999) - (b.order ?? 999);

  const projectFilters = [
    { key: 'featured', label: { ko: '주요', en: 'Featured' } },
    { key: 'all', label: { ko: '전체', en: 'All' } },
    { key: 'company', label: { ko: '회사', en: 'Work' } },
    { key: 'personal', label: { ko: '개인', en: 'Personal' } },
  ] as const;

  const visibleProjects = data.projects
    .filter((p) => {
      if (projectFilter === 'all') return true;
      if (projectFilter === 'featured') return p.featured === true;
      return p.scope === projectFilter;
    })
    .sort(sortByOrder);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="#top" className={styles.wordmark}>
            Ruo Lee
          </a>
          <nav className={styles.nav} aria-label="Sections">
            {NAV_ITEMS.map((item) => (
              <a key={item.id} href={`#${item.id}`} className={styles.navLink}>
                {item.label[lang]}
              </a>
            ))}
          </nav>
          <button onClick={toggleLang} className={styles.langBtn} aria-label="Toggle language">
            {lang === 'ko' ? 'EN' : 'KO'}
          </button>
        </div>
      </header>

      <main id="top" className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <p className={styles.kicker}>{data.profile.title}</p>
          <h1 className={styles.name}>{data.profile.name[lang]}</h1>
          <p className={styles.lede}>{getCareerIntro(lang, data.profile.intro[lang])}</p>

          <div className={styles.heroMeta}>
            <a href={`mailto:${data.profile.email}`} className={styles.metaLink}>
              <Mail size={15} strokeWidth={2} />
              <span>{data.profile.email}</span>
            </a>
            <a
              href={data.profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.metaLink}
            >
              <Github size={15} strokeWidth={2} />
              <span>GitHub</span>
            </a>
            {data.profile.linkedin && (
              <a
                href={data.profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.metaLink}
              >
                <Linkedin size={15} strokeWidth={2} />
                <span>LinkedIn</span>
              </a>
            )}
            <span className={styles.isoBadge}>
              <ShieldCheck size={15} strokeWidth={2} />
              <span>
                {lang === 'ko'
                  ? 'ISO/IEC 42001 AI 경영시스템 심사원'
                  : 'ISO/IEC 42001 AI MS Auditor'}
              </span>
            </span>
          </div>

          <div className={styles.skillsList}>
            {(['backend', 'ai', 'system'] as const).map((key) => (
              <div key={key} className={styles.skillRow}>
                <h2 className={styles.skillLabel}>{data.profile.coreSkills[key].title[lang]}</h2>
                <p className={styles.skillItems}>
                  {data.profile.coreSkills[key].skills.join(' · ')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{SECTION_TITLES.projects[lang]}</h2>
            <div className={styles.filterGroup} role="tablist" aria-label="Project filter">
              {projectFilters.map((f) => (
                <button
                  key={f.key}
                  className={`${styles.filterChip} ${projectFilter === f.key ? styles.filterActive : ''}`}
                  onClick={() => setProjectFilter(f.key)}
                >
                  {f.label[lang]}
                </button>
              ))}
            </div>
          </div>
          <ol className={styles.projectList}>
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} lang={lang} />
            ))}
          </ol>
        </section>

        {/* Research */}
        <section id="research" className={styles.section}>
          <h2 className={styles.sectionTitle}>{SECTION_TITLES.research[lang]}</h2>
          <Publications items={data.publications} lang={lang} />
        </section>

        {/* Journey */}
        <section id="journey" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{SECTION_TITLES.journey[lang]}</h2>
            <div className={styles.filterGroup} role="tablist" aria-label="Timeline filter">
              {timelineFilters.map((f) => (
                <button
                  key={f.key}
                  className={`${styles.filterChip} ${timelineFilter === f.key ? styles.filterActive : ''}`}
                  onClick={() => setTimelineFilter(f.key)}
                >
                  {f.label[lang]}
                </button>
              ))}
            </div>
          </div>
          <Timeline items={filteredTimeline} lang={lang} onCertClick={setCertModalImage} />
        </section>

        {/* Contact */}
        <footer id="contact" className={styles.footer}>
          <h2 className={styles.footerTitle}>{SECTION_TITLES.contact[lang]}</h2>
          <p className={styles.footerText}>
            {lang === 'ko'
              ? 'AI 관련 다양한 기회에 열려있습니다.'
              : 'Open to diverse AI opportunities.'}
          </p>
          <a href={`mailto:${data.profile.email}`} className={styles.footerEmail}>
            {data.profile.email}
          </a>
          <div className={styles.footerLinks}>
            <a
              href={data.profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={styles.footerIcon}
            >
              <Github size={20} strokeWidth={1.8} />
            </a>
            {data.profile.linkedin && (
              <a
                href={data.profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={styles.footerIcon}
              >
                <Linkedin size={20} strokeWidth={1.8} />
              </a>
            )}
          </div>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {data.profile.name[lang]}
          </p>
        </footer>
      </main>

      {/* Certificate Modal */}
      {certModalImage && (
        <div className={styles.certModal} onClick={() => setCertModalImage(null)}>
          <div className={styles.certModalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.certModalClose}
              onClick={() => setCertModalImage(null)}
              aria-label="Close"
            >
              <X size={22} strokeWidth={2} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={certModalImage} alt="Certificate" className={styles.certModalImage} />
          </div>
        </div>
      )}
    </>
  );
}
