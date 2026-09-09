import React from 'react';
import { portfolioData as data } from '@/data';
import {
  bareUrl,
  CAREER_ENTRIES,
  CONTACT_LINKS,
  DOC_LABELS,
  EDUCATION_ENTRIES,
  ETC_ENTRIES,
  PROJECT_ENTRIES,
  RESEARCH_ENTRIES,
  SKILL_ITEMS,
  SKILL_KEYS,
  type PresetId,
  type TemplateId,
} from '@/data/exportSections';
import { getCareerIntro, LEDE_KEYWORDS } from '@/lib/career';
import type { LocalizedString, TimelineItem } from '@/types';
import styles from './ExportDocument.module.css';

interface Props {
  picked: Set<string>;
  template: TemplateId;
  lang: 'ko' | 'en';
  doc: PresetId;
  /** Composer overrides. Absent means the copy in profile.ts stands. */
  title?: string;
  summary?: string;
  /** Off when a real PDF footer will carry the same information per page. */
  colophon?: boolean;
}

const value = (v: string | LocalizedString, lang: 'ko' | 'en') =>
  typeof v === 'string' ? v : v[lang];

/** Descriptions are authored as `• ` lines; the paper renders them as a list. */
const bullets = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.replace(/^[•\-]\s*/, '').trim())
    .filter(Boolean);

/** Same treatment as the hero: listed keywords stay ink, the rest recedes. */
function emphasize(text: string, keywords: readonly string[]) {
  const pattern = new RegExp(
    `(${keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
  );
  return text
    .split(pattern)
    .map((part, i) =>
      keywords.includes(part) ? (
        <strong key={i}>{part}</strong>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    );
}

function Section({
  label,
  index,
  children,
}: {
  label: string;
  index: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionLabel}>
        <span className={styles.labelText}>{label}</span>
        <span className={styles.labelIndex}>{index}</span>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

/** One dated entry: heading and period on a line, then its own bullets. */
function Entry({
  index,
  title,
  role,
  date,
  lead,
  lines,
  stack,
}: {
  index?: string;
  title: string;
  role?: string;
  date?: string;
  lead?: string;
  lines?: string[];
  stack?: string;
}) {
  return (
    <article className={styles.entry}>
      <span className={styles.entryIndex} aria-hidden={!index}>
        {index ?? ''}
      </span>
      <div className={styles.entryBody}>
        <div className={styles.entryHead}>
          <h3 className={styles.entryTitle}>
            {title}
            {role && <span className={styles.entryRole}>{role}</span>}
          </h3>
          {date && <span className={styles.entryDate}>{date}</span>}
        </div>
        {lead && <p className={styles.entryLead}>{lead}</p>}
        {lines && lines.length > 0 && (
          <ul className={styles.bullets}>
            {lines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
        {stack && <p className={styles.stack}>{stack}</p>}
      </div>
    </article>
  );
}

function timelineEntry(item: TimelineItem, lang: 'ko' | 'en', withBody: boolean) {
  return (
    <Entry
      key={item.id}
      title={value(item.title, lang)}
      role={value(item.role, lang)}
      date={item.date}
      lines={withBody ? bullets(item.description[lang]) : undefined}
    />
  );
}

/**
 * The document itself. One DOM for all three templates — the layout, the rules
 * and the colour of every part are the stylesheet's business, so a template
 * swap can never change what the paper says.
 */
export default function ExportDocument({
  picked,
  template,
  lang,
  doc,
  title,
  summary,
  colophon = true,
}: Props) {
  const { profile } = data;
  const has = (id: string) => picked.has(id);

  const roleLine = title?.trim() || profile.title;
  const summaryText = summary?.trim() || getCareerIntro(lang, profile.intro[lang]);

  // All four lists are already newest-first, and bootcamps already sit under
  // "other" — the manifest settled that once so the paper doesn't re-decide it.
  const contacts = CONTACT_LINKS.filter((c) => has(c.id));
  const careerItems = CAREER_ENTRIES.filter((t) => has(t.id));
  const degrees = EDUCATION_ENTRIES.filter((t) => has(t.id));
  const other = ETC_ENTRIES.filter((t) => has(t.id));
  const projects = PROJECT_ENTRIES.filter((p) => has(p.id));
  const research = RESEARCH_ENTRIES.filter((r) => has(r.id));

  // A group prints only if something in it was ticked, and only what was ticked.
  const skillRows = SKILL_KEYS.map((key) => ({
    key,
    names: SKILL_ITEMS.filter((s) => s.key === key && has(s.id)).map((s) => s.name),
  })).filter((row) => row.names.length > 0);

  const docLabel = DOC_LABELS[doc][lang];
  const name = profile.name[lang];

  let n = 0;
  const nextIndex = () => String(++n).padStart(2, '0');

  return (
    <article className={styles.doc} data-tpl={template} lang={lang}>
      <header className={styles.masthead}>
        <div>
          <div className={styles.accent} aria-hidden />
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.role}>
            {lang === 'ko' ? `${profile.name.en} — ${roleLine}` : roleLine}
          </p>
        </div>
        <address className={styles.contact}>
          {contacts.map((c) => (
            <span key={c.id}>{bareUrl(c.value)}</span>
          ))}
        </address>
      </header>

      <div className={styles.mastheadRule} aria-hidden />

      {has('summary') && (
        <Section label={lang === 'ko' ? '요약' : 'Summary'} index={nextIndex()}>
          <p className={styles.lede}>{emphasize(summaryText, LEDE_KEYWORDS[lang])}</p>
        </Section>
      )}

      {skillRows.length > 0 && (
        <Section label={lang === 'ko' ? '핵심 역량' : 'Skills'} index={nextIndex()}>
          <div className={styles.skills}>
            {skillRows.map((row) => (
              <div key={row.key} className={styles.skillRow}>
                <span className={styles.skillLabel}>{profile.coreSkills[row.key].title[lang]}</span>
                <span className={styles.skillValue}>{row.names.join(', ')}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {careerItems.length > 0 && (
        <Section label={lang === 'ko' ? '경력' : 'Experience'} index={nextIndex()}>
          {careerItems.map((item) => timelineEntry(item, lang, true))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section label={lang === 'ko' ? '프로젝트' : 'Projects'} index={nextIndex()}>
          {projects.map((p, i) => (
            <Entry
              key={p.id}
              index={String(i + 1).padStart(2, '0')}
              title={value(p.title, lang)}
              date={[p.company?.[lang], p.period?.[lang]].filter(Boolean).join(' · ')}
              lead={p.shortDescription[lang]}
              lines={(p.keyAchievements ?? []).map((a) => a[lang])}
              stack={p.techStack.join(', ')}
            />
          ))}
        </Section>
      )}

      {research.length > 0 && (
        <Section label={lang === 'ko' ? '연구 · 특허' : 'Research'} index={nextIndex()}>
          {research.map((r) => (
            <Entry
              key={r.id}
              title={r.title}
              date={r.year}
              lead={r.venue[lang]}
              stack={[r.authorRole[lang], r.indexing, r.statusLabel[lang]]
                .filter(Boolean)
                .join(' · ')}
            />
          ))}
        </Section>
      )}

      {degrees.length > 0 && (
        <Section label={lang === 'ko' ? '학력' : 'Education'} index={nextIndex()}>
          {degrees.map((item) => timelineEntry(item, lang, true))}
        </Section>
      )}

      {other.length > 0 && (
        <Section
          label={lang === 'ko' ? '자격 · 기타' : 'Certifications & more'}
          index={nextIndex()}
        >
          {other.map((item) => timelineEntry(item, lang, false))}
        </Section>
      )}

      {colophon && (
        <footer className={styles.foot}>
          <span>
            {name} — {docLabel}
          </span>
          <span>{profile.email}</span>
        </footer>
      )}
    </article>
  );
}
