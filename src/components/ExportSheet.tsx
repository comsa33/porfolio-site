'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Download, Minus, X } from 'lucide-react';
import sheet from './Sheet.module.css';
import styles from './ExportSheet.module.css';
import { useModalClose } from './useModalClose';
import ExportDocument from './ExportDocument';
import {
  DOC_LABELS,
  estimatePages,
  EXPORT_SECTIONS,
  matchPreset,
  PRESETS,
  presetPicks,
  TEMPLATES,
  type ExportSectionId,
  type TemplateId,
} from '@/data/exportSections';

interface Props {
  lang: 'ko' | 'en';
  isOpen: boolean;
  onClose: () => void;
}

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
  const { closing, requestClose } = useModalClose(onClose);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const preset = matchPreset(picked);
  const pages = estimatePages(picked);

  const href = useMemo(() => {
    const params = new URLSearchParams({
      doc: preset,
      tpl: template,
      lang: docLang,
      pick: [...picked].join(','),
    });
    return `/export?${params.toString()}`;
  }, [preset, template, docLang, picked]);

  // ⌘↵ / Ctrl+↵ is the shortcut the footer advertises.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        window.open(href, '_blank', 'noopener');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, href]);

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
            <ul className={styles.items}>
              {activeSection.items.map((item) => {
                const on = picked.has(item.id);
                return (
                  <li key={item.id}>
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
            <span className={styles.shortcut}>⌘ ⏎</span>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.download}
              aria-disabled={picked.size === 0}
              onClick={(e) => {
                if (picked.size === 0) e.preventDefault();
              }}
            >
              <Download size={14} strokeWidth={1.6} />
              <span>{lang === 'ko' ? 'PDF 내려받기' : 'Download PDF'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
