import type { LocalizedString, Project, Publication, TimelineItem } from '@/types';
import { portfolioData as data } from './index';
import { countProjectsForSkill } from './skillMatch';

/*
 * The manifest behind the export composer.
 *
 * Every selectable line in the sheet is one entry here, and every entry keeps
 * the id of the record it stands for — a timeline id, a project id, a
 * publication id. That is what lets a selection survive as a URL: the export
 * page re-reads the same records from `@/data` by id, so nothing about the
 * document is duplicated in this file.
 */

export type ExportSectionId =
  | 'contact'
  | 'summary'
  | 'skills'
  | 'career'
  | 'projects'
  | 'research'
  | 'education'
  | 'etc';

export type TemplateId = 'hairline' | 'ledger' | 'editorial';
export type PresetId = 'resume' | 'career' | 'portfolio' | 'custom';

export interface ExportItem {
  id: string;
  title: LocalizedString;
  meta: LocalizedString;
  /** Optional subhead in the picker; consecutive items sharing one are grouped. */
  group?: LocalizedString;
}

/** Free text the composer can override, carried in the URL when it differs. */
export const OVERRIDE_LIMITS = { title: 90, summary: 420 };

export interface ExportSection {
  id: ExportSectionId;
  name: LocalizedString;
  /**
   * Roughly what share of one A4 page a single item of this section takes.
   * Only used for the live page estimate in the sheet — the real pagination
   * happens in the browser's print engine.
   */
  weight: number;
  items: ExportItem[];
}

const both = (v: string | LocalizedString): LocalizedString =>
  typeof v === 'string' ? { ko: v, en: v } : v;

const join = (a: LocalizedString, b: LocalizedString): LocalizedString => ({
  ko: `${a.ko} · ${b.ko}`,
  en: `${a.en} · ${b.en}`,
});

/** Bootcamps are filed under "other" here, the same way the Journey filter does. */
const BOOTCAMP_IDS = ['edu-kcci', 'edu-codestates'];

const startOf = (date: string): number => {
  const m = date.match(/(\d{4})\.(\d{2})/);
  return m ? parseInt(m[1], 10) * 100 + parseInt(m[2], 10) : 0;
};

const newestFirst = (a: TimelineItem, b: TimelineItem) => startOf(b.date) - startOf(a.date);

const timeline = (pred: (t: TimelineItem) => boolean) => data.timeline.filter(pred).sort(newestFirst);

export const CAREER_ENTRIES = timeline((t) => t.type === 'Dev' || t.type === 'Career');

export const EDUCATION_ENTRIES = timeline(
  (t) => t.type === 'Education' && !BOOTCAMP_IDS.includes(t.id),
);

export const ETC_ENTRIES = timeline(
  (t) =>
    t.type === 'Certification' ||
    t.type === 'Design' ||
    t.type === 'Travel' ||
    BOOTCAMP_IDS.includes(t.id),
);

export const PROJECT_ENTRIES: Project[] = [...data.projects].sort(
  (a, b) => (a.order ?? 999) - (b.order ?? 999),
);

export const RESEARCH_ENTRIES: Publication[] = data.publications;

export const SKILL_KEYS = ['backend', 'ai', 'system'] as const;

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * One checkbox per skill, not per group: which stack you lead with is exactly
 * the thing that changes between two applications. The group survives as the
 * row the skill prints on.
 */
export const SKILL_ITEMS: {
  id: string;
  name: string;
  key: (typeof SKILL_KEYS)[number];
}[] = SKILL_KEYS.flatMap((key) =>
  data.profile.coreSkills[key].skills.map((name) => ({ id: `skill-${slug(name)}`, name, key })),
);

const timelineItem = (t: TimelineItem): ExportItem => ({
  id: t.id,
  title: both(t.title),
  meta: join(both(t.role), both(t.date)),
});

/**
 * The name and the title are the document's identity, so they are never a
 * checkbox — what varies is how much of a way back to you the paper carries.
 * A résumé for an agency does not need the travel blog on it.
 */
export const CONTACT_LINKS: { id: string; label: LocalizedString; value: string }[] = (
  [
    { id: 'contact-email', label: { ko: '이메일', en: 'Email' }, value: data.profile.email },
    { id: 'contact-github', label: both('GitHub'), value: data.profile.github },
    { id: 'contact-linkedin', label: both('LinkedIn'), value: data.profile.linkedin },
    { id: 'contact-orcid', label: both('ORCID'), value: data.profile.orcid },
    { id: 'contact-blog', label: { ko: '기술 블로그', en: 'Tech blog' }, value: data.profile.blog },
    {
      id: 'contact-worldtrip',
      label: { ko: '세계일주 기록', en: 'World trip' },
      value: data.profile.worldtrip,
    },
  ] as { id: string; label: LocalizedString; value?: string }[]
).filter((c): c is { id: string; label: LocalizedString; value: string } => Boolean(c.value));

/** `https://` and `www.` are noise on paper; the address is the address. */
export const bareUrl = (url: string) =>
  url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');

export const EXPORT_SECTIONS: ExportSection[] = [
  {
    id: 'contact',
    name: { ko: '머리말 · 연락처', en: 'Masthead & contact' },
    weight: 0.02,
    items: CONTACT_LINKS.map((c) => ({
      id: c.id,
      title: c.label,
      meta: both(bareUrl(c.value)),
    })),
  },
  {
    id: 'summary',
    name: { ko: '요약', en: 'Summary' },
    weight: 0.08,
    items: [
      {
        id: 'summary',
        title: { ko: '소개 문장', en: 'Intro statement' },
        meta: {
          ko: '실행 런타임 · 오케스트레이션 · 메모리 · 품질 평가',
          en: 'Execution runtime · orchestration · memory · evaluation',
        },
      },
    ],
  },
  {
    id: 'skills',
    name: { ko: '핵심 역량', en: 'Skills' },
    weight: 0.011,
    items: SKILL_ITEMS.map((s) => {
      const n = countProjectsForSkill(data.projects, s.name);
      return {
        id: s.id,
        title: both(s.name),
        // The same count the hero shows beside each skill token.
        meta: { ko: `프로젝트 ${n}개`, en: `${n} project${n === 1 ? '' : 's'}` },
        group: data.profile.coreSkills[s.key].title,
      };
    }),
  },
  {
    id: 'career',
    name: { ko: '경력', en: 'Experience' },
    weight: 0.12,
    items: CAREER_ENTRIES.map(timelineItem),
  },
  {
    id: 'projects',
    name: { ko: '프로젝트', en: 'Projects' },
    weight: 0.35,
    items: PROJECT_ENTRIES.map((p) => ({
      id: p.id,
      title: both(p.title),
      meta: p.company && p.period ? join(p.company, p.period) : both(p.period ?? p.company ?? ''),
    })),
  },
  {
    id: 'research',
    name: { ko: '연구 · 특허', en: 'Research' },
    weight: 0.1,
    items: RESEARCH_ENTRIES.map((r) => ({
      id: r.id,
      title: both(r.title),
      meta: join(r.venue, both(`${r.year} · ${r.statusLabel.ko}`)),
    })),
  },
  {
    id: 'education',
    name: { ko: '학력', en: 'Education' },
    weight: 0.07,
    items: EDUCATION_ENTRIES.map(timelineItem),
  },
  {
    id: 'etc',
    name: { ko: '자격 · 기타', en: 'Certifications & more' },
    weight: 0.05,
    items: ETC_ENTRIES.map(timelineItem),
  },
];

const SECTION_BY_ID = new Map(EXPORT_SECTIONS.map((s) => [s.id, s]));

/** Every selectable id, in document order. */
export const ALL_ITEM_IDS: string[] = EXPORT_SECTIONS.flatMap((s) => s.items.map((i) => i.id));

const VALID_IDS = new Set(ALL_ITEM_IDS);

export const isExportId = (id: string) => VALID_IDS.has(id);

export const PRESETS: { id: Exclude<PresetId, 'custom'>; label: LocalizedString; sub: LocalizedString }[] =
  [
    {
      id: 'resume',
      label: { ko: '이력서', en: 'Résumé' },
      sub: { ko: '프로필 · 경력 · 학력 · 자격', en: 'Profile · experience · education · certs' },
    },
    {
      id: 'career',
      label: { ko: '경력기술서', en: 'Experience report' },
      sub: { ko: '회사 프로젝트와 성과 중심', en: 'Company projects and outcomes' },
    },
    {
      id: 'portfolio',
      label: { ko: '포트폴리오', en: 'Portfolio' },
      sub: { ko: '연구 · 개인 프로젝트 · 여정까지', en: 'Research, personal work, the journey' },
    },
  ];

const idsOf = (section: ExportSectionId) => SECTION_BY_ID.get(section)?.items.map((i) => i.id) ?? [];

/**
 * A preset is a starting point, not a mode: the sheet drops to "직접 고르기"
 * the moment one box is touched.
 */
export function presetPicks(preset: Exclude<PresetId, 'custom'>): string[] {
  if (preset === 'portfolio') return [...ALL_ITEM_IDS];

  // The travel blog is a portfolio link, not a résumé one.
  const workContacts = idsOf('contact').filter((id) => id !== 'contact-worldtrip');

  if (preset === 'resume') {
    return [
      ...workContacts,
      ...idsOf('summary'),
      ...idsOf('skills'),
      ...idsOf('career'),
      ...idsOf('research'),
      ...idsOf('education'),
      // Certifications only — bootcamps, exhibitions and travel are not résumé material.
      ...ETC_ENTRIES.filter((t) => t.type === 'Certification').map((t) => t.id),
    ];
  }

  return [
    ...workContacts,
    ...idsOf('summary'),
    ...idsOf('skills'),
    ...idsOf('career'),
    ...PROJECT_ENTRIES.filter((p) => p.scope === 'company').map((p) => p.id),
    ...idsOf('research'),
  ];
}

/** Which preset, if any, a selection is still identical to. */
export function matchPreset(picked: Set<string>): PresetId {
  for (const p of PRESETS) {
    const ids = presetPicks(p.id);
    if (ids.length === picked.size && ids.every((id) => picked.has(id))) return p.id;
  }
  return 'custom';
}

/**
 * Live page estimate for the sheet. The print engine has the final say.
 * The masthead and the colophon are on every document, hence the floor.
 */
export function estimatePages(picked: Set<string>): number {
  let total = 0.13;
  for (const section of EXPORT_SECTIONS) {
    for (const item of section.items) if (picked.has(item.id)) total += section.weight;
  }
  return Math.max(1, Math.ceil(total));
}

export const DOC_LABELS: Record<PresetId, LocalizedString> = {
  resume: { ko: '이력서', en: 'Resume' },
  career: { ko: '경력기술서', en: 'Experience' },
  portfolio: { ko: '포트폴리오', en: 'Portfolio' },
  custom: { ko: '문서', en: 'Document' },
};

export const TEMPLATES: {
  id: TemplateId;
  label: string;
  name: LocalizedString;
  note: LocalizedString;
}[] = [
  {
    id: 'hairline',
    label: 'HAIRLINE',
    name: { ko: '헤어라인', en: 'Hairline' },
    note: {
      ko: '사이트를 그대로 종이에 옮긴 기본형. 액센트는 머리의 한 획뿐.',
      en: 'The site on paper. A single accent stroke at the masthead.',
    },
  },
  {
    id: 'ledger',
    label: 'LEDGER',
    name: { ko: '레저', en: 'Ledger' },
    note: {
      ko: '액센트 없이 검정 하나. 한 단 고밀도로 ATS 파싱과 흑백 출력을 우선합니다.',
      en: 'Black ink only, one dense column — built for ATS parsing and mono printing.',
    },
  },
  {
    id: 'editorial',
    label: 'EDITORIAL',
    name: { ko: '에디토리얼', en: 'Editorial' },
    note: {
      ko: '넓은 여백과 왼쪽 색인 단. 사람이 처음부터 읽는 문서용.',
      en: 'Wide margins and a left index column — for a document read end to end.',
    },
  },
];
