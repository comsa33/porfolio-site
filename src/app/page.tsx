'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  ArrowUpRight,
  Check,
  FileDown,
  Github,
  Globe,
  Linkedin,
  Mail,
  PenLine,
  ShieldCheck,
  X,
} from 'lucide-react';
import styles from './page.module.css';
import Timeline from '@/components/Timeline';
import Publications from '@/components/Publications';
import ProjectCard from '@/components/ProjectCard';
import BrandIcon from '@/components/BrandIcon';
import TravelingDot from '@/components/TravelingDot';
import ExportSheet from '@/components/ExportSheet';
import { portfolioData as data } from '@/data';
import { countProjectsForSkill, projectMatchesSkill } from '@/data/skillMatch';
import { getCareerIntro, LEDE_KEYWORDS } from '@/lib/career';

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

function setDocumentTheme(next: Theme, origin: DOMRect) {
  const root = document.documentElement;

  // The new theme spreads from the button that was pressed (globals.css,
  // themeSpread), so the transition needs to know where that was and how far
  // the farthest corner is.
  const x = origin.left + origin.width / 2;
  const y = origin.top + origin.height / 2;
  const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.style.setProperty('--theme-x', `${Math.round(x)}px`);
  root.style.setProperty('--theme-y', `${Math.round(y)}px`);
  root.style.setProperty('--theme-r', `${Math.ceil(far)}px`);

  // Suppress interaction transitions while the document switches, otherwise
  // every hover-tuned transition on the page fires at once.
  root.setAttribute('data-theme-switching', '');

  const apply = () => {
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage unavailable; the choice just won't persist.
    }
  };

  if (typeof document.startViewTransition === 'function') {
    document
      .startViewTransition(apply)
      .finished.finally(() => root.removeAttribute('data-theme-switching'));
  } else {
    apply();
    requestAnimationFrame(() => root.removeAttribute('data-theme-switching'));
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
      // At the very end of the page the last section may be too short to
      // reach the line; it is still what the reader is looking at.
      const atEnd =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atEnd) current = els[els.length - 1].id;
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
  const [exportOpen, setExportOpen] = useState(false);

  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => 'light' as Theme);
  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) =>
    setDocumentTheme(theme === 'dark' ? 'light' : 'dark', e.currentTarget.getBoundingClientRect());
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
          {/* The dot's home. On the page below, the travelling dot starts
              here and covers this exactly; once it leaves, what stays behind
              is the ring (see .wordmarkDot). */}
          <a href="#top" className={styles.wordmark}>
            <span className={styles.wordmarkDot} data-dot-home aria-hidden />
            {data.profile.name[lang]}
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
            {/*
              The blog is a separate site, so it gets a rule and an arrow to
              set it apart from the in-page anchors beside it. It mirrors the
              "포트폴리오" link in the blog's own header.
            */}
            {data.profile.blog && (
              <>
                <span className={styles.navSep} aria-hidden />
                <a
                  href={data.profile.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.navLink} ${styles.navExternal}`}
                >
                  <span>{lang === 'ko' ? '블로그' : 'Blog'}</span>
                  <ArrowUpRight size={12} strokeWidth={1.75} />
                </a>
              </>
            )}
            {/*
              Third site in the series. Desktop only in the header: the phone
              nav is sized for exactly five items, and the contact section
              carries this link on every width.
            */}
            {data.profile.worldtrip && (
              <a
                href={data.profile.worldtrip}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.navLink} ${styles.navExternal} ${styles.navWorldtrip}`}
              >
                <span>{lang === 'ko' ? '세계일주' : 'World Trip'}</span>
                <ArrowUpRight size={12} strokeWidth={1.75} />
              </a>
            )}
          </nav>
          <div className={styles.controls}>
            <button onClick={toggleLang} className={styles.ctrlBtn} aria-label="Toggle language">
              {lang === 'ko' ? 'EN' : 'KO'}
            </button>
            {/* The same control the blog carries: the mark itself, filled in
                the light theme and hollow in the dark one. */}
            <button
              onClick={toggleTheme}
              className={`${styles.ctrlBtn} ${styles.themeBtn}`}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? '○' : '●'}
            </button>
          </div>
        </div>
      </header>

      <main id="top" className={styles.frame}>
        <TravelingDot active={activeSection} />
        {/* Hero — the intro sentence is the headline */}
        <section className={styles.hero}>
          {/* The name is in the header, on the mark the dot comes from; saying
              it again here was the same word twice. What is left is the role,
              and that one line is the dot's first stop off the mark — the lede
              below wraps to four lines, and a slot opening in a paragraph
              moves more type than it marks. */}
          <p className={`${styles.eyebrow} rise`} style={rise(0)}>
            <span className={styles.eyebrowTitle} data-dot="hero">
              {data.profile.title}
            </span>
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
            {data.profile.blog && (
              <a
                href={data.profile.blog}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                <PenLine size={14} strokeWidth={1.75} />
                <span>Blog</span>
              </a>
            )}
            {data.profile.worldtrip && (
              <a
                href={data.profile.worldtrip}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                <Globe size={14} strokeWidth={1.75} />
                <span>{lang === 'ko' ? '세계일주' : 'World Trip'}</span>
              </a>
            )}
            {/*
              Sits with the links rather than in the header: the phone nav is
              already sized for exactly five items, and this belongs next to
              the other ways of taking something away from the page.
            */}
            <button
              type="button"
              className={styles.contactLink}
              onClick={() => setExportOpen(true)}
            >
              <FileDown size={14} strokeWidth={1.75} />
              <span>{lang === 'ko' ? '이력서 · 경력기술서' : 'Résumé · Experience'}</span>
            </button>
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
          <div className={`${styles.skills} rise`} style={rise(3)} data-lang={lang}>
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
            <h2 className={styles.sectionTitle} data-dot="projects">
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
            <h2 className={styles.sectionTitle} data-dot="research">
              {SECTION_TITLES.research[lang]}
            </h2>
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
            <h2 className={styles.sectionTitle} data-dot="journey">
              {SECTION_TITLES.journey[lang]}
            </h2>
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
          {/* The sentence ends without a full stop of its own: the dot that
              has been following the reader down the page is the full stop,
              and this seat is its last move. */}
          <p className={styles.footerText}>
            {lang === 'ko'
              ? '에이전트 플랫폼이나 LLM 품질 평가에 관한 이야기라면 언제든 환영합니다'
              : 'Always glad to talk agent platforms or LLM evaluation'}
            <span className={styles.endDot} data-dot="contact" data-dot-end aria-hidden />
          </p>
          <div className={styles.footerActions}>
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
            <button
              type="button"
              className={styles.footerSecondary}
              onClick={() => setExportOpen(true)}
            >
              <FileDown size={15} strokeWidth={1.75} />
              <span>{lang === 'ko' ? '문서로 내려받기' : 'Take it as a document'}</span>
              <span className={styles.footerTag}>PDF</span>
            </button>
          </div>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {data.profile.name[lang]}
          </p>
        </footer>
      </main>

      <ExportSheet lang={lang} isOpen={exportOpen} onClose={() => setExportOpen(false)} />

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
