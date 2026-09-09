'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, Download, Loader, Printer } from 'lucide-react';
import ExportDocument from '@/components/ExportDocument';
import {
  DOC_LABELS,
  isExportId,
  OVERRIDE_LIMITS,
  presetPicks,
  TEMPLATES,
  type PresetId,
  type TemplateId,
} from '@/data/exportSections';
import { portfolioData as data } from '@/data';
import styles from './export.module.css';

const PRESET_IDS: PresetId[] = ['resume', 'career', 'portfolio', 'custom'];

const DOWNLOAD_LABEL = {
  idle: { ko: 'PDF 내려받기', en: 'Download PDF' },
  working: { ko: '조판하는 중', en: 'Rendering' },
  done: { ko: '저장됨', en: 'Saved' },
  error: { ko: '다시 시도', en: 'Try again' },
} as const;

/**
 * The document as its own page, and as its own URL.
 *
 * Everything the composer chose travels in the query string, so this route is
 * the whole export mechanism: open it and the browser prints it. Printing to
 * PDF keeps the text as text — selectable, searchable, parseable — which is
 * what a rasterised screenshot of a résumé throws away.
 */
function ExportView() {
  const params = useSearchParams();
  const [fit, setFit] = useState(1);
  const [phase, setPhase] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const resetTimer = useRef<number | undefined>(undefined);

  const doc = (
    PRESET_IDS.includes(params.get('doc') as PresetId) ? params.get('doc') : 'custom'
  ) as PresetId;

  const template = (
    TEMPLATES.some((t) => t.id === params.get('tpl')) ? params.get('tpl') : 'hairline'
  ) as TemplateId;

  const lang: 'ko' | 'en' = params.get('lang') === 'en' ? 'en' : 'ko';

  // Composer overrides. Capped here too — the query string is user input.
  const title = params.get('title')?.slice(0, OVERRIDE_LIMITS.title) ?? undefined;
  const summary = params.get('summary')?.slice(0, OVERRIDE_LIMITS.summary) ?? undefined;

  // Set when Chromium is the reader: the PDF carries page numbers of its own.
  const forPdf = params.get('pdf') === '1';

  const picked = useMemo(() => {
    const raw = (params.get('pick') ?? '').split(',').filter(isExportId);
    // A bare /export?doc=resume is still a valid request for that document.
    return new Set(raw.length > 0 ? raw : doc === 'custom' ? presetPicks('career') : presetPicks(doc));
  }, [params, doc]);

  /** The same query, handed to the renderer that returns a real file. */
  const pdfHref = useMemo(() => `/api/export?${params.toString()}`, [params]);

  const filename = useMemo(() => {
    const now = new Date();
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return `${data.profile.name[lang]}_${DOC_LABELS[doc][lang]}_${stamp}`.replace(/\s+/g, '');
  }, [doc, lang]);

  /*
   * Chrome names the saved PDF after the document title, so the title has to be
   * the filename at the moment the dialog opens — not merely on mount, where the
   * router's own metadata lands afterwards and takes it back. Restore on
   * afterprint so a reader who stays on the page doesn't keep it.
   */
  /*
   * Same asynchronous action as the composer's: the server renders for a few
   * seconds, so the button has to say so rather than sit there looking idle.
   */
  const download = useCallback(async () => {
    if (phase === 'working') return;
    window.clearTimeout(resetTimer.current);
    setPhase('working');
    try {
      const response = await fetch(pdfHref);
      if (!response.ok) throw new Error(String(response.status));
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      setPhase('done');
    } catch {
      setPhase('error');
    }
    resetTimer.current = window.setTimeout(() => setPhase('idle'), 4000);
  }, [phase, pdfHref, filename]);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const printNow = useCallback(() => {
    const previous = document.title;
    document.title = filename;
    const restore = () => {
      document.title = previous;
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    window.print();
  }, [filename]);

  /*
   * A4 is 794px wide and stays 794px wide — reflowing it to a phone would show
   * a layout that is not the one being saved. So the sheet is scaled to fit
   * instead, the way a print preview does: the whole page is visible at once,
   * and pinch-zoom is there for actually reading it.
   */
  useEffect(() => {
    const measure = () => {
      const available = window.innerWidth - 32;
      setFit(available >= 794 ? 1 : Math.max(0.3, available / 794));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <>
      <div className={styles.bar}>
        <Link href="/" className={styles.back}>
          <ArrowLeft size={14} strokeWidth={1.75} />
          <span>{lang === 'ko' ? '포트폴리오로' : 'Back to portfolio'}</span>
        </Link>
        <span className={styles.name}>{filename}.pdf</span>
        <button type="button" className={styles.ghost} onClick={printNow}>
          <Printer size={14} strokeWidth={1.6} />
          <span>{lang === 'ko' ? '인쇄' : 'Print'}</span>
        </button>
        <button type="button" className={styles.print} onClick={download} data-phase={phase}>
          <span className={styles.fill} data-phase={phase} aria-hidden />
          {phase === 'working' && <Loader size={14} strokeWidth={1.6} />}
          {phase === 'idle' && <Download size={14} strokeWidth={1.6} />}
          {phase === 'done' && <Check size={14} strokeWidth={2} />}
          {phase === 'error' && <Download size={14} strokeWidth={1.6} />}
          <span>{DOWNLOAD_LABEL[phase][lang]}</span>
        </button>
      </div>

      <p className={styles.hint}>
        {lang === 'ko'
          ? '이 화면은 웹 지면이라 쪽이 나뉘지 않습니다 — 여백과 쪽번호는 조판할 때 붙습니다. 실제 문서 그대로 보려면 내려받거나, 구성기의 “미리보기”로 PDF를 바로 여세요.'
          : 'This is the web view: it is not paginated, and margins and page numbers are added at render time. Download it, or use the composer preview to open the PDF itself.'}
      </p>

      <main className={styles.stage} style={{ '--fit': fit } as React.CSSProperties}>
        <ExportDocument
          picked={picked}
          template={template}
          lang={lang}
          doc={doc}
          title={title}
          summary={summary}
          colophon={!forPdf}
        />
      </main>
    </>
  );
}

export default function ExportPage() {
  return (
    <Suspense fallback={null}>
      <ExportView />
    </Suspense>
  );
}
