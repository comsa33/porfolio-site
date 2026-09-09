'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Printer } from 'lucide-react';
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
  const [printed, setPrinted] = useState(false);

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

  const picked = useMemo(() => {
    const raw = (params.get('pick') ?? '').split(',').filter(isExportId);
    // A bare /export?doc=resume is still a valid request for that document.
    return new Set(raw.length > 0 ? raw : doc === 'custom' ? presetPicks('career') : presetPicks(doc));
  }, [params, doc]);

  const filename = useMemo(() => {
    const now = new Date();
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return `${data.profile.name[lang]}_${DOC_LABELS[doc][lang]}_${stamp}`.replace(/\s+/g, '');
  }, [doc, lang]);

  /*
   * Chrome names the saved PDF after the document title, so the title is the
   * filename. Set it before the print dialog opens, and put it back on the way
   * out so a reader who navigates on doesn't keep it.
   */
  useEffect(() => {
    const previous = document.title;
    document.title = filename;
    return () => {
      document.title = previous;
    };
  }, [filename]);

  // Print once the fonts have settled — printing mid-swap reflows the pagination.
  useEffect(() => {
    if (printed || params.get('print') === '0') return;
    let cancelled = false;
    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => {
      if (cancelled) return;
      setPrinted(true);
      // One frame so the settled fonts are painted before the dialog snapshots.
      requestAnimationFrame(() => window.print());
    });
    return () => {
      cancelled = true;
    };
  }, [printed, params]);

  return (
    <>
      <div className={styles.bar}>
        <Link href="/" className={styles.back}>
          <ArrowLeft size={14} strokeWidth={1.75} />
          <span>{lang === 'ko' ? '포트폴리오로' : 'Back to portfolio'}</span>
        </Link>
        <span className={styles.name}>{filename}.pdf</span>
        <button type="button" className={styles.print} onClick={() => window.print()}>
          <Printer size={14} strokeWidth={1.6} />
          <span>{lang === 'ko' ? '인쇄 · PDF로 저장' : 'Print · Save as PDF'}</span>
        </button>
      </div>

      <p className={styles.hint}>
        {lang === 'ko'
          ? '인쇄 대화상자에서 대상을 “PDF로 저장”으로 두고, 배경 그래픽을 켜면 화면과 같은 문서가 저장됩니다.'
          : 'In the print dialog choose “Save as PDF” and enable background graphics for an identical document.'}
      </p>

      <main className={styles.stage}>
        <ExportDocument
          picked={picked}
          template={template}
          lang={lang}
          doc={doc}
          title={title}
          summary={summary}
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
