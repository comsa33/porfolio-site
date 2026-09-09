'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Download, FileText, Loader, Minus, X } from 'lucide-react';
import sheet from './Sheet.module.css';
import styles from './ExportSheet.module.css';
import { useModalClose } from './useModalClose';
import ExportDocument from './ExportDocument';
import {
  DOC_LABELS,
  estimatePages,
  EXPORT_SECTIONS,
  matchPreset,
  OVERRIDE_LIMITS,
  PRESETS,
  presetPicks,
  TEMPLATES,
  type ExportSectionId,
  type TemplateId,
} from '@/data/exportSections';
import { portfolioData as data } from '@/data';
import { getCareerIntro } from '@/lib/career';

interface Props {
  lang: 'ko' | 'en';
  isOpen: boolean;
  onClose: () => void;
}

const LABEL = {
  idle: { ko: 'PDF 내려받기', en: 'Download PDF' },
  working: { ko: '조판하는 중', en: 'Rendering' },
  done: { ko: '저장됨', en: 'Saved' },
  error: { ko: '다시 시도', en: 'Try again' },
} as const;

/** Progress rides the button's own bottom hairline, not a separate bar. */
const FILL = { idle: '0%', working: '65%', done: '100%', error: '0%' } as const;

/** The preview is the real document, shrunk. 794px of A4 into a 300px column. */
const PREVIEW_SCALE = 300 / 794;

/**
 * Schematic of each template, drawn in the same hairlines the templates use.
 * A chip is a miniature of the page, not an icon — the big preview beside it
 * is the actual document.
 */
const TEMPLATE_LINES: Record<TemplateId, { w: string; t: number; h: number; c: string }[]> = {
  hairline: [
    { w: '54%', t: 0, h: 5, c: '#0f0f0f' },
    { w: '34%', t: 4, h: 2, c: '#cfcfcf' },
    { w: '100%', t: 8, h: 1, c: '#e8e8e8' },
    { w: '26%', t: 7, h: 2, c: '#cfcfcf' },
    { w: '88%', t: 4, h: 2, c: '#e8e8e8' },
    { w: '72%', t: 3, h: 2, c: '#e8e8e8' },
    { w: '100%', t: 8, h: 1, c: '#e8e8e8' },
    { w: '26%', t: 7, h: 2, c: '#cfcfcf' },
    { w: '92%', t: 4, h: 2, c: '#e8e8e8' },
    { w: '64%', t: 3, h: 2, c: '#e8e8e8' },
  ],
  ledger: [
    { w: '44%', t: 0, h: 4, c: '#0f0f0f' },
    { w: '100%', t: 5, h: 2, c: '#0f0f0f' },
    { w: '96%', t: 5, h: 2, c: '#cfcfcf' },
    { w: '99%', t: 3, h: 2, c: '#cfcfcf' },
    { w: '92%', t: 3, h: 2, c: '#cfcfcf' },
    { w: '100%', t: 3, h: 2, c: '#cfcfcf' },
    { w: '84%', t: 3, h: 2, c: '#cfcfcf' },
    { w: '97%', t: 3, h: 2, c: '#cfcfcf' },
    { w: '90%', t: 3, h: 2, c: '#cfcfcf' },
    { w: '76%', t: 3, h: 2, c: '#cfcfcf' },
  ],
  editorial: [
    { w: '30%', t: 0, h: 7, c: '#0f0f0f' },
    { w: '18%', t: 16, h: 2, c: '#cfcfcf' },
    { w: '64%', t: -2, h: 2, c: '#e8e8e8' },
    { w: '18%', t: 12, h: 2, c: '#cfcfcf' },
    { w: '58%', t: -2, h: 2, c: '#e8e8e8' },
    { w: '18%', t: 12, h: 2, c: '#cfcfcf' },
    { w: '66%', t: -2, h: 2, c: '#e8e8e8' },
    { w: '18%', t: 12, h: 2, c: '#cfcfcf' },
    { w: '52%', t: -2, h: 2, c: '#e8e8e8' },
  ],
};

/**
 * A field that starts as the site's own copy and stays that way until touched.
 * Overrides travel in the URL only once they differ, so the ordinary link stays
 * short and the reset really does put the original back.
 */
function Editor({
  label,
  value,
  placeholder,
  limit,
  multiline,
  disabled,
  edited,
  lang,
  onChange,
  onReset,
}: {
  label: string;
  value: string;
  placeholder: string;
  limit: number;
  multiline?: boolean;
  disabled?: boolean;
  edited: boolean;
  lang: 'ko' | 'en';
  onChange: (v: string) => void;
  onReset: () => void;
}) {
  const Field = multiline ? 'textarea' : 'input';
  return (
    <div className={styles.editor} data-disabled={disabled}>
      <div className={styles.editorHead}>
        <span className={styles.editorLabel}>{label}</span>
        <span className={styles.editorMeta}>
          {edited && (
            <button type="button" className={styles.editorReset} onClick={onReset}>
              {lang === 'ko' ? '원래대로' : 'Reset'}
            </button>
          )}
          <span className={styles.editorCount}>
            {value.length} / {limit}
          </span>
        </span>
      </div>
      <Field
        className={multiline ? styles.fieldArea : styles.field}
        value={value}
        placeholder={placeholder}
        maxLength={limit}
        disabled={disabled}
        rows={multiline ? 4 : undefined}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}

/**
 * Pick what goes in, not which template: the sheet is a list of everything the
 * site knows, and the document is whatever survives the checkboxes. The chosen
 * state travels in the URL, so the same link always rebuilds the same PDF.
 */
export default function ExportSheet({ lang, isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [picked, setPicked] = useState<Set<string>>(() => new Set(presetPicks('career')));
  const [template, setTemplate] = useState<TemplateId>('hairline');
  const [docLang, setDocLang] = useState<'ko' | 'en'>(lang);
  const [section, setSection] = useState<ExportSectionId>('projects');
  const [phase, setPhase] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const resetTimer = useRef<number | undefined>(undefined);
  const [titleOverride, setTitleOverride] = useState<string | null>(null);
  const [summaryOverride, setSummaryOverride] = useState<string | null>(null);
  const { closing, requestClose } = useModalClose(onClose);

  const defaultTitle = data.profile.title;
  const defaultSummary = getCareerIntro(docLang, data.profile.intro[docLang]);
  const title = titleOverride ?? defaultTitle;
  const summary = summaryOverride ?? defaultSummary;

  useEffect(() => {
    setMounted(true);
  }, []);

  const preset = matchPreset(picked);
  const pages = estimatePages(picked);

  const query = useMemo(() => {
    const params = new URLSearchParams({
      doc: preset,
      tpl: template,
      lang: docLang,
      pick: [...picked].join(','),
    });
    // Only what was actually rewritten rides along.
    if (title.trim() && title !== defaultTitle) params.set('title', title);
    if (summary.trim() && summary !== defaultSummary) params.set('summary', summary);
    return params.toString();
  }, [preset, template, docLang, picked, title, defaultTitle, summary, defaultSummary]);

  /*
   * The button is the whole progress display: it keeps its box, swaps what is
   * inside, and fills its own bottom hairline. Rendering runs on the server and
   * takes a few seconds cold, so saying nothing for that long is not an option.
   */
  const download = useCallback(async () => {
    if (phase === 'working' || picked.size === 0) return;
    window.clearTimeout(resetTimer.current);
    setPhase('working');
    try {
      const response = await fetch(`/api/export?${query}`);
      if (!response.ok) throw new Error(String(response.status));
      const blob = await response.blob();
      const disposition = response.headers.get('content-disposition') ?? '';
      const encoded = /filename\*=UTF-8''([^;]+)/.exec(disposition)?.[1];
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = encoded ? decodeURIComponent(encoded) : 'document.pdf';
      link.click();
      URL.revokeObjectURL(url);
      setPhase('done');
      resetTimer.current = window.setTimeout(() => setPhase('idle'), 4000);
    } catch {
      setPhase('error');
      resetTimer.current = window.setTimeout(() => setPhase('idle'), 4000);
    }
  }, [phase, picked.size, query]);

  // ⌘↵ / Ctrl+↵ is the shortcut the footer advertises.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        void download();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, download]);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  if (!isOpen || !mounted) return null;

  const toggleItem = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSection = (id: ExportSectionId) => {
    const target = EXPORT_SECTIONS.find((s) => s.id === id);
    if (!target) return;
    setSection(id);
    setPicked((prev) => {
      const next = new Set(prev);
      const all = target.items.every((i) => next.has(i.id));
      for (const item of target.items) {
        if (all) next.delete(item.id);
        else next.add(item.id);
      }
      return next;
    });
  };

  const activeSection = EXPORT_SECTIONS.find((s) => s.id === section) ?? EXPORT_SECTIONS[0];
  const activeOn = activeSection.items.filter((i) => picked.has(i.id)).length;
  const templateNote = TEMPLATES.find((t) => t.id === template)!;

  const groupTally = new Map<string, { on: number; total: number }>();
  for (const item of activeSection.items) {
    if (!item.group) continue;
    const tally = groupTally.get(item.group.ko) ?? { on: 0, total: 0 };
    tally.total += 1;
    if (picked.has(item.id)) tally.on += 1;
    groupTally.set(item.group.ko, tally);
  }

  const toggleGroup = (key: string) => {
    const ids = activeSection.items.filter((i) => i.group?.ko === key).map((i) => i.id);
    setPicked((prev) => {
      const next = new Set(prev);
      const all = ids.every((id) => next.has(id));
      for (const id of ids) {
        if (all) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  };

  return createPortal(
    <div
      className={`${sheet.overlay} ${closing ? sheet.closing : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'ko' ? '문서 내보내기' : 'Export document'}
    >
      <div className={sheet.panel}>
        <div className={sheet.header}>
          <div>
            <p className={sheet.eyebrow}>EXPORT — PDF</p>
            <h2 className={sheet.title}>
              {lang === 'ko' ? '필요한 것만 골라 담는 문서' : 'A document of only what you need'}
            </h2>
          </div>
          <div className={styles.headerControls}>
            <span className={styles.langLabel}>{lang === 'ko' ? '문서 언어' : 'Document'}</span>
            <div className={sheet.segment}>
              {(['ko', 'en'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  className={`${sheet.segmentBtn} ${docLang === l ? sheet.segmentActive : ''}`}
                  onClick={() => setDocLang(l)}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button onClick={requestClose} className={sheet.close} aria-label="Close">
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className={styles.body}>
          {/* Rail — presets, then every section with its selected count */}
          <div className={styles.rail}>
            <p className={styles.railLabel}>PRESET</p>
            <div className={styles.presets}>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={styles.preset}
                  onClick={() => setPicked(new Set(presetPicks(p.id)))}
                  aria-pressed={preset === p.id}
                >
                  <span
                    className={`${styles.presetLabel} ${preset === p.id ? styles.presetActive : ''}`}
                  >
                    {p.label[lang]}
                  </span>
                  <span className={styles.presetSub}>{p.sub[lang]}</span>
                </button>
              ))}
              <button
                type="button"
                className={styles.preset}
                onClick={() => setPicked(new Set())}
                aria-pressed={preset === 'custom'}
              >
                <span
                  className={`${styles.presetLabel} ${preset === 'custom' ? styles.presetActive : ''}`}
                >
                  {lang === 'ko' ? '직접 고르기' : 'Start empty'}
                </span>
                <span className={styles.presetSub}>
                  {lang === 'ko' ? '비우고 필요한 것만 체크' : 'Clear and tick what you need'}
                </span>
              </button>
            </div>

            <p className={`${styles.railLabel} ${styles.railLabelSection}`}>SECTION</p>
            <div>
              {EXPORT_SECTIONS.map((s) => {
                const on = s.items.filter((i) => picked.has(i.id)).length;
                const all = on === s.items.length;
                return (
                  <div key={s.id} className={styles.sectionRow}>
                    <button
                      type="button"
                      className={`${styles.box} ${on > 0 ? styles.boxOn : ''}`}
                      onClick={() => toggleSection(s.id)}
                      aria-label={`${s.name[lang]} ${lang === 'ko' ? '전체 선택' : 'select all'}`}
                    >
                      {on > 0 &&
                        (all ? (
                          <Check size={11} strokeWidth={2.6} />
                        ) : (
                          <Minus size={11} strokeWidth={2.6} />
                        ))}
                    </button>
                    <button
                      type="button"
                      className={styles.sectionName}
                      onClick={() => setSection(s.id)}
                      data-active={section === s.id}
                    >
                      <span>{s.name[lang]}</span>
                      <span className={styles.count} data-partial={on > 0 && !all}>
                        {on}/{s.items.length}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Picker — the active section, item by item */}
          <div className={styles.picker}>
            <div className={styles.pickerHead}>
              <h3 className={styles.pickerTitle}>{activeSection.name[lang]}</h3>
              <span className={styles.pickerCount}>
                {activeOn} / {activeSection.items.length} {lang === 'ko' ? '선택됨' : 'selected'}
              </span>
            </div>
            {activeSection.id === 'contact' && (
              <Editor
                label={lang === 'ko' ? '직함' : 'Title'}
                value={title}
                placeholder={defaultTitle}
                limit={OVERRIDE_LIMITS.title}
                edited={titleOverride !== null && titleOverride !== defaultTitle}
                lang={lang}
                onChange={setTitleOverride}
                onReset={() => setTitleOverride(null)}
              />
            )}

            <ul className={styles.items}>
              {activeSection.items.map((item, i) => {
                const on = picked.has(item.id);
                const group = item.group;
                const newGroup = group && activeSection.items[i - 1]?.group?.ko !== group.ko;
                const tally = group ? groupTally.get(group.ko) : undefined;
                return (
                  <li key={item.id}>
                    {newGroup && tally && (
                      <button
                        type="button"
                        className={styles.groupHead}
                        onClick={() => toggleGroup(group.ko)}
                      >
                        <span>{group[lang]}</span>
                        <span className={styles.groupCount} data-partial={tally.on > 0 && tally.on < tally.total}>
                          {tally.on}/{tally.total}
                        </span>
                      </button>
                    )}
                    <button
                      type="button"
                      className={styles.item}
                      onClick={() => toggleItem(item.id)}
                      aria-pressed={on}
                    >
                      <span className={`${styles.box} ${on ? styles.boxOn : ''}`}>
                        {on && <Check size={11} strokeWidth={2.6} />}
                      </span>
                      <span className={styles.itemMain}>
                        <span className={styles.itemTitle} data-on={on}>
                          {item.title[lang]}
                        </span>
                        <span className={styles.itemMeta}>{item.meta[lang]}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {activeSection.id === 'summary' && (
              <Editor
                label={lang === 'ko' ? '요약 문장' : 'Summary'}
                value={summary}
                placeholder={defaultSummary}
                limit={OVERRIDE_LIMITS.summary}
                multiline
                disabled={!picked.has('summary')}
                edited={summaryOverride !== null && summaryOverride !== defaultSummary}
                lang={lang}
                onChange={setSummaryOverride}
                onReset={() => setSummaryOverride(null)}
              />
            )}
          </div>

          {/* Preview — templates, then the document itself */}
          <div className={styles.preview}>
            <p className={styles.railLabel}>TEMPLATE</p>
            <div className={styles.templates}>
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={styles.template}
                  onClick={() => setTemplate(t.id)}
                  aria-pressed={template === t.id}
                >
                  <span className={styles.mini} data-on={template === t.id}>
                    {TEMPLATE_LINES[t.id].map((l, i) => (
                      <span
                        key={i}
                        style={{
                          display: 'block',
                          width: l.w,
                          height: l.h,
                          marginTop: l.t,
                          background: l.c,
                        }}
                      />
                    ))}
                  </span>
                  <span className={styles.miniLabel} data-on={template === t.id}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
            <p className={styles.templateNote}>{templateNote.note[lang]}</p>

            <div className={styles.previewHead}>
              <span className={styles.railLabel}>PREVIEW</span>
              <span className={styles.pageCount}>01 / {String(pages).padStart(2, '0')}</span>
            </div>

            <div className={styles.paperWrap}>
              <div className={styles.paperStack} aria-hidden />
              <div className={styles.paperStack} aria-hidden />
              <div className={styles.paper}>
                <div
                  className={styles.paperInner}
                  style={{ transform: `scale(${PREVIEW_SCALE})` }}
                  aria-hidden
                >
                  <ExportDocument
                    picked={picked}
                    template={template}
                    lang={docLang}
                    doc={preset}
                    title={title}
                    summary={summary}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={sheet.footer}>
          <span className={sheet.footerNote}>
            {DOC_LABELS[preset][lang]} · {lang === 'ko' ? '항목' : 'items'} {picked.size} · A4{' '}
            {pages}
            {lang === 'ko' ? '쪽' : 'pp'} · {docLang === 'ko' ? '국문' : '영문'} ·{' '}
            {templateNote.name[lang]}
          </span>
          <div className={styles.actions}>
            <a
              href={`/api/export?${query}&inline=1`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.preview}
            >
              {lang === 'ko' ? '미리보기' : 'Preview'}
            </a>
            <span className={styles.shortcut}>⌘ ⏎</span>
            <button
              type="button"
              className={styles.download}
              onClick={download}
              disabled={picked.size === 0}
              data-phase={phase}
            >
              <span className={styles.fill} style={{ width: FILL[phase] }} aria-hidden />
              {phase === 'working' && <Loader size={14} strokeWidth={1.6} />}
              {phase === 'idle' && <Download size={14} strokeWidth={1.6} />}
              {phase === 'done' && <Check size={14} strokeWidth={2} />}
              {phase === 'error' && <FileText size={14} strokeWidth={1.6} />}
              <span>{LABEL[phase][lang]}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
