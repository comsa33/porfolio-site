'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  ArrowUpRight,
  Check,
  Github,
  Linkedin,
  Mail,
  Moon,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react';
import styles from './page.module.css';
import Timeline from '@/components/Timeline';
import Publications from '@/components/Publications';
import ProjectCard from '@/components/ProjectCard';
import BrandIcon from '@/components/BrandIcon';
import { portfolioData as data } from '@/data';
import { countProjectsForSkill, projectMatchesSkill } from '@/data/skillMatch';

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
 * Phrases in the intro that stay full-ink while the rest of the sentence
 * recedes to grey. Matched literally against the copy in profile.ts.
 */
const LEDE_KEYWORDS = {
  ko: ['실행 런타임', '오케스트레이션', '메모리', '품질 평가'],
  en: ['execution runtime', 'orchestration', 'memory', 'quality evaluation'],
} as const;

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

/** Splits text so listed keywords render as <em> (full ink) inside grey prose. */
function emphasize(text: string, keywords: readonly string[]) {
  if (keywords.length === 0) return text;
  const pattern = new RegExp(
    `(${keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
  );
  return text
    .split(pattern)
    .map((part, i) =>
      keywords.includes(part) ? <em key={i}>{part}</em> : <span key={i}>{part}</span>,
    );
}

/*
 * Theme lives on <html data-theme>, set before paint by layout.tsx. React only
 * observes it (for the toggle icon) rather than owning it, so there's no
 * light-flash and no hydration mismatch.
 */
type Theme = 'light' | 'dark';

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function readTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function setDocumentTheme(next: Theme) {
  const apply = () => document.documentElement.setAttribute('data-theme', next);
  // Cross-fade the whole page where the View Transitions API exists.
  if (typeof document.startViewTransition === 'function') {
    document.startViewTransition(apply);
  } else {
    apply();
  }
  try {
    localStorage.setItem('theme', next);
  } catch {
    // Storage unavailable; the choice just won't persist.
  }
}

/** True once the page has scrolled past the top; drives the header hairline. */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

/** Tracks which section is in view so the nav underline can follow the reader. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    // Nothing is active while the reader is still above the first section.
    const update = () => {
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      setActive(current);
    };

    let frame = 0;
    const onScroll = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);

  return active;
}

const SECTION_IDS = NAV_ITEMS.map((n) => n.id);

export default function Home() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [timelineFilter, setTimelineFilter] = useState<
    'all' | 'education' | 'career' | 'certification' | 'other'
  >('career');
  const [projectFilter, setProjectFilter] = useState<'featured' | 'all' | 'company' | 'personal'>(
    'featured',
  );
  const [researchFilter, setResearchFilter] = useState<
    'featured' | 'all' | 'journal' | 'conference' | 'patent'
  >('featured');
  // Set by clicking a skill in the hero; narrows the project list to that tech.
  const [techFilter, setTechFilter] = useState<string | null>(null);
  const [certModalImage, setCertModalImage] = useState<string | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);

  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => 'light' as Theme);
  const toggleTheme = () => setDocumentTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang((prev) => (prev === 'ko' ? 'en' : 'ko'));
  const activeSection = useActiveSection(SECTION_IDS);
  const scrolled = useScrolled();

  /**
   * A mailto: link does nothing at all when the visitor has no mail client
   * registered. Copy on click as well: whichever of the two works, they end
   * up with the address.
   */
  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(data.profile.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2200);
    } catch {
      // Clipboard unavailable — the mailto still fires.
    }
  };

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
      if (techFilter) return projectMatchesSkill(p, techFilter);
      if (projectFilter === 'all') return true;
      if (projectFilter === 'featured') return p.featured === true;
      return p.scope === projectFilter;
    })
    .sort(sortByOrder);

  const selectSkill = (skill: string) => {
    setTechFilter(skill);
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const skillGroups = (['backend', 'ai', 'system'] as const).map((key) => ({
    key,
    title: data.profile.coreSkills[key].title[lang],
    skills: data.profile.coreSkills[key].skills
      .map((name) => ({ name, count: countProjectsForSkill(data.projects, name) }))
      .sort((a, b) => b.count - a.count),
  }));

  const researchFilters = [
    { key: 'featured', label: { ko: '주요', en: 'Featured' } },
    { key: 'all', label: { ko: '전체', en: 'All' } },
    { key: 'journal', label: { ko: '저널', en: 'Journals' } },
    { key: 'conference', label: { ko: '학회', en: 'Conferences' } },
    { key: 'patent', label: { ko: '특허', en: 'Patents' } },
  ] as const;

  const visiblePublications = data.publications.filter((p) => {
    if (researchFilter === 'all') return true;
    if (researchFilter === 'featured') return p.status !== 'under-review';
    return p.category === researchFilter;
  });

  const rise = (i: number) => ({ '--i': i }) as React.CSSProperties;

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled}>
        <div className={styles.headerInner}>
          <a href="#top" className={styles.wordmark}>
            Ruo Lee
          </a>
          <nav className={styles.nav} aria-label="Sections">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={styles.navLink}
                data-active={activeSection === item.id}
              >
                {item.label[lang]}
              </a>
            ))}
          </nav>
          <div className={styles.controls}>
            <button onClick={toggleLang} className={styles.ctrlBtn} aria-label="Toggle language">
              {lang === 'ko' ? 'EN' : 'KO'}
            </button>
            <button
              onClick={toggleTheme}
              className={styles.ctrlBtn}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? (
                <Sun size={15} strokeWidth={1.75} />
              ) : (
                <Moon size={15} strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>
      </header>

      <main id="top" className={styles.frame}>
        {/* Hero — the intro sentence is the headline */}
        <section className={styles.hero}>
          <p className={`${styles.eyebrow} rise`} style={rise(0)}>
            <strong>{data.profile.name[lang]}</strong>
            <span className={styles.eyebrowTitle}>{data.profile.title}</span>
          </p>
          <h1 className={`${styles.lede} rise`} style={rise(1)}>
            {emphasize(getCareerIntro(lang, data.profile.intro[lang]), LEDE_KEYWORDS[lang])}
          </h1>

          <div className={`${styles.contact} rise`} style={rise(2)}>
            <a href={`mailto:${data.profile.email}`} className={styles.contactLink}>
              <Mail size={14} strokeWidth={1.75} />
              <span>{data.profile.email}</span>
            </a>
            <a
              href={data.profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              <Github size={14} strokeWidth={1.75} />
              <span>GitHub</span>
            </a>
            {data.profile.linkedin && (
              <a
                href={data.profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                <Linkedin size={14} strokeWidth={1.75} />
                <span>LinkedIn</span>
              </a>
            )}
            {data.profile.orcid && (
              <a
                href={data.profile.orcid}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                <BrandIcon url={data.profile.orcid} size={14} />
                <span>ORCID</span>
              </a>
            )}
            <span className={styles.contactLink}>
              <ShieldCheck size={14} strokeWidth={1.75} />
              <span>
                {lang === 'ko'
                  ? 'ISO/IEC 42001 AI 경영시스템 심사원'
                  : 'ISO/IEC 42001 AI MS Auditor'}
              </span>
            </span>
          </div>

          {/*
            Skills double as a project index: the count is how many projects
            use the skill, and clicking one filters the list below.
          */}
          <div className={`${styles.skills} rise`} style={rise(3)}>
            {skillGroups.map((group) => (
              <div key={group.key} className={styles.skillRow}>
                <h2 className={styles.skillLabel}>{group.title}</h2>
                <ul className={styles.skillTokens}>
                  {group.skills.map(({ name, count }) => (
                    <li key={name}>
                      <button
                        type="button"
                        className={`${styles.skillToken} ${techFilter === name ? styles.skillTokenActive : ''}`}
                        onClick={() => selectSkill(name)}
                        title={
                          lang === 'ko'
                            ? `${name} 사용 프로젝트 ${count}개 보기`
                            : `Show ${count} project${count === 1 ? '' : 's'} using ${name}`
                        }
                      >
                        <span>{name}</span>
                        <sup className={styles.skillCount}>{count}</sup>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {SECTION_TITLES.projects[lang]}
              {techFilter && (
                <button
                  type="button"
                  className={styles.techChip}
                  onClick={() => setTechFilter(null)}
                  aria-label={lang === 'ko' ? '기술 필터 해제' : 'Clear tech filter'}
                >
                  {techFilter}
                  <X size={12} strokeWidth={2} />
                </button>
              )}
            </h2>
            <div
              className={`${styles.filterGroup} ${techFilter ? styles.filterGroupMuted : ''}`}
              role="tablist"
              aria-label="Project filter"
            >
              {projectFilters.map((f) => (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={!techFilter && projectFilter === f.key}
                  className={`${styles.filterChip} ${!techFilter && projectFilter === f.key ? styles.filterActive : ''}`}
                  onClick={() => {
                    setTechFilter(null);
                    setProjectFilter(f.key);
                  }}
                >
                  {f.label[lang]}
                </button>
              ))}
            </div>
          </div>
          {/* Keyed on the filter so a change remounts the rows and replays the stagger. */}
          <ol className={styles.projectList} key={techFilter ?? projectFilter}>
            {visibleProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} lang={lang} index={i} />
            ))}
          </ol>
        </section>

        {/* Research */}
        <section id="research" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{SECTION_TITLES.research[lang]}</h2>
            <div className={styles.filterGroup} role="tablist" aria-label="Research filter">
              {researchFilters.map((f) => (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={researchFilter === f.key}
                  className={`${styles.filterChip} ${researchFilter === f.key ? styles.filterActive : ''}`}
                  onClick={() => setResearchFilter(f.key)}
                >
                  {f.label[lang]}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.listWrap} key={researchFilter}>
            <Publications items={visiblePublications} lang={lang} />
          </div>
        </section>

        {/* Journey */}
        <section id="journey" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{SECTION_TITLES.journey[lang]}</h2>
            <div className={styles.filterGroup} role="tablist" aria-label="Timeline filter">
              {timelineFilters.map((f) => (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={timelineFilter === f.key}
                  className={`${styles.filterChip} ${timelineFilter === f.key ? styles.filterActive : ''}`}
                  onClick={() => setTimelineFilter(f.key)}
                >
                  {f.label[lang]}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.listWrap} key={timelineFilter}>
            <Timeline items={filteredTimeline} lang={lang} onCertClick={setCertModalImage} />
          </div>
        </section>

        <footer id="contact" className={styles.footer}>
          <p className={styles.footerText}>
            {lang === 'ko'
              ? '에이전트 플랫폼이나 LLM 품질 평가에 관한 이야기라면 언제든 환영합니다.'
              : 'Always glad to talk agent platforms or LLM evaluation.'}
          </p>
          <a
            href={`mailto:${data.profile.email}`}
            className={`${styles.footerCta} ${emailCopied ? styles.copied : ''}`}
            onClick={handleEmailClick}
            title={data.profile.email}
          >
            <span className={styles.footerCtaLabel}>
              {emailCopied ? (
                <>
                  <Check size={15} strokeWidth={2} />
                  {lang === 'ko' ? '주소 복사됨' : 'Address copied'}
                </>
              ) : (
                <>
                  <Mail size={15} strokeWidth={1.75} />
                  {lang === 'ko' ? '이메일 보내기' : 'Send an email'}
                </>
              )}
            </span>
            <ArrowUpRight size={15} strokeWidth={1.75} />
          </a>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {data.profile.name[lang]}
          </p>
        </footer>
      </main>

      {certModalImage && (
        <div className={styles.certModal} onClick={() => setCertModalImage(null)}>
          <div className={styles.certModalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.certModalClose}
              onClick={() => setCertModalImage(null)}
              aria-label="Close"
            >
              <X size={20} strokeWidth={1.75} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={certModalImage} alt="Certificate" className={styles.certModalImage} />
          </div>
        </div>
      )}
    </>
  );
}
