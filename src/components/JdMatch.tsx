'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowDown, ArrowRight, Loader } from 'lucide-react';
import styles from './JdMatch.module.css';
import {
  matchLevel,
  MAX_JD_CHARS,
  MIN_JD_CHARS,
  type MatchError,
  type MatchScore,
} from '@/lib/jdMatch';

interface Props {
  lang: 'ko' | 'en';
  onMatched: (matches: MatchScore[]) => void;
}

const n = (x: number) => x.toLocaleString();

const COPY = {
  ko: {
    open: '채용 공고로 맞춤 보기',
    browse: '전체 둘러보기',
    hint: '공고를 붙여넣으면 관련 경력만 골라 이력서로 묶습니다 · 공고는 저장하지 않습니다',
    label: '채용 공고',
    stored: '공고는 저장하지 않습니다',
    cancel: '취소',
    submit: '맞춤 보기',
    working: '맞추는 중…',
    over: (len: number) =>
      `${n(MAX_JD_CHARS)}자까지 받습니다 (지금 ${n(len)}자). 주요 업무·자격 요건만 남겨 주세요`,
    // Light on purpose: a refusal should cost the reader a smile, not the page.
    // Each line still says what to do next.
    errors: {
      too_short: `이것만으로는 저도 감이 안 옵니다. ${MIN_JD_CHARS}자 이상 붙여 주세요`,
      too_long: `AI도 긴 글은 부담스러워합니다. ${n(MAX_JD_CHARS)}자 안으로 줄여 주세요`,
      not_posting:
        '아무리 읽어도 채용 공고 같지 않습니다. 주요 업무·자격 요건이 담긴 공고를 붙여 주세요',
      rate_limited: 'AI가 잠깐 숨을 고르는 중입니다. 1분 뒤 다시 눌러 주세요',
      unavailable: '공고 읽는 AI가 오늘 몫을 다 썼습니다. 아래 목록은 제가 직접 골라 둔 것입니다',
      upstream: 'AI가 잠깐 딴생각을 했습니다. 다시 눌러 주세요',
      invalid: '요청이 어딘가에서 길을 잃었습니다. 새로고침 후 다시 해 주세요',
      network: '인터넷이 잠깐 자리를 비웠습니다. 연결을 확인하고 다시 눌러 주세요',
      no_match:
        '맞는 프로젝트를 못 찾았습니다. 채용 공고가 맞다면, 아직 제가 안 해 본 일인가 봅니다',
    },
  },
  en: {
    open: 'Match to a job posting',
    browse: 'Browse everything',
    hint: 'Paste a posting to pull out the relevant work as a résumé · Postings are not stored',
    label: 'Job posting',
    stored: 'Postings are not stored',
    cancel: 'Cancel',
    submit: 'Match',
    working: 'Matching…',
    over: (len: number) =>
      `Up to ${n(MAX_JD_CHARS)} characters (now ${n(len)}). Keep the role and requirements`,
    errors: {
      too_short: `That is not much to go on. Paste ${MIN_JD_CHARS}+ characters`,
      too_long: `Even the AI balks at that length. Keep it under ${n(MAX_JD_CHARS)} characters`,
      not_posting:
        'However I read it, this is not a job posting. Paste one with the role and requirements',
      rate_limited: 'The AI is catching its breath. Try again in a minute',
      unavailable: 'The posting reader is done for the day. The list below was picked by hand',
      upstream: 'The AI lost its train of thought. Try again',
      invalid: 'The request got lost somewhere. Reload and try again',
      network: 'The internet stepped out for a moment. Check your connection and try again',
      no_match: 'No project matched. If this is a job posting, it is something I have not done yet',
    },
  },
};

type ErrorKey = MatchError | 'network' | 'no_match';

/**
 * The fork at the top of the page. Nothing is hidden behind it: the page reads
 * the same whether or not anyone presses either button. Only a pasted posting
 * changes anything.
 *
 * The buttons and the panel are two folds in one place: opening grows the panel
 * out of where the buttons were and closing folds it back, with the same
 * tokens and the same late fade as a project row's details, so nothing below
 * jumps. Both stay mounted; the closed one is inert.
 */
export default function JdMatch({ lang, onMatched }: Props) {
  const t = COPY[lang];
  const fieldId = useId();
  const noteId = useId();
  const [open, setOpen] = useState(false);
  // Set when the panel closes because the page is scrolling away to the
  // results: there is no fold left to watch, and a collapsing hero would move
  // the scroll target while the page travels to it (ProjectCard does the same).
  const [snap, setSnap] = useState(false);
  const [jd, setJd] = useState('');
  const [phase, setPhase] = useState<'idle' | 'working'>('idle');
  const [error, setError] = useState<ErrorKey | null>(null);
  const inflight = useRef<AbortController | null>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  // Leaving the page mid-request must not land a result on nothing.
  useEffect(() => () => inflight.current?.abort(), []);

  // Counted the way the server counts: surrounding whitespace is not posting.
  // Nothing is cut off silently — an over-long paste stays whole and says so.
  const length = jd.trim().length;
  const over = length > MAX_JD_CHARS;
  // Short pastes can still be submitted so the reason is said, not implied by a
  // greyed-out button.
  const canSubmit = phase === 'idle' && length > 0 && !over;

  const openPanel = () => {
    // Committed synchronously so the field is no longer inert when it takes
    // focus — still inside the tap, which is what lets iOS raise the keyboard.
    flushSync(() => {
      setSnap(false);
      setOpen(true);
    });
    fieldRef.current?.focus({ preventScroll: true });
  };

  const cancel = () => {
    inflight.current?.abort();
    flushSync(() => {
      setOpen(false);
      setError(null);
    });
    // Back to the button that opened it, not to the top of the document.
    openRef.current?.focus({ preventScroll: true });
  };

  const submit = async () => {
    if (!canSubmit) return;
    if (length < MIN_JD_CHARS) {
      setError('too_short');
      return;
    }
    const controller = new AbortController();
    inflight.current = controller;
    setPhase('working');
    setError(null);
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd }),
        signal: controller.signal,
      });
      const body = (await res.json().catch(() => null)) as {
        matches?: MatchScore[];
        error?: MatchError;
      } | null;
      if (!res.ok || !body?.matches) {
        setError(body?.error && body.error in t.errors ? body.error : 'upstream');
        return;
      }
      // Nothing clears the bar: a company intro or a cover letter can pass as a
      // posting, and an unrelated one reorders the page by noise. Either way the
      // page stays as it was and the panel says what to paste instead.
      if (!body.matches.some((m) => matchLevel(m.score))) {
        setError('no_match');
        return;
      }
      // A matched posting is done with: the next visit to the panel is for a
      // different one. A refused paste (any return above) stays to be fixed.
      setJd('');
      setSnap(true);
      setOpen(false);
      onMatched(body.matches);
    } catch {
      // An abort is the visitor's own cancel; nothing to report.
      if (!controller.signal.aborted) setError('network');
    } finally {
      if (inflight.current === controller) inflight.current = null;
      setPhase('idle');
    }
  };

  // The same keys as the export sheet: ⌘↵ sends, Esc puts it away.
  const onFieldKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void submit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  };

  const message = over ? t.over(length) : error ? t.errors[error] : null;

  return (
    <div className={styles.fork} data-snap={snap ? '' : undefined}>
      <div className={styles.fold} data-open={!open} inert={open}>
        <div className={styles.foldInner}>
          <div className={styles.actions}>
            <button ref={openRef} type="button" className={styles.primary} onClick={openPanel}>
              {t.open}
              <ArrowRight size={16} strokeWidth={1.75} />
            </button>
            <a href="#projects" className={styles.secondary}>
              {t.browse}
              <ArrowDown size={16} strokeWidth={1.75} />
            </a>
          </div>
          <p className={styles.hint}>{t.hint}</p>
        </div>
      </div>

      <div className={styles.fold} data-open={open} inert={!open}>
        <div className={styles.foldInner}>
          <form
            className={styles.panel}
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            noValidate
          >
            <div className={styles.panelHead}>
              <label htmlFor={fieldId} className={styles.label}>
                {t.label}
              </label>
              <span
                className={`${styles.note} ${styles.count} ${over ? styles.noteOver : ''}`}
                aria-hidden="true"
              >
                {n(length)} / {n(MAX_JD_CHARS)}
              </span>
            </div>
            <textarea
              ref={fieldRef}
              id={fieldId}
              className={styles.field}
              value={jd}
              rows={6}
              aria-invalid={over || Boolean(error)}
              aria-describedby={noteId}
              readOnly={phase === 'working'}
              onKeyDown={onFieldKey}
              onChange={(e) => {
                setJd(e.target.value);
                if (error) setError(null);
              }}
            />
            <div className={styles.panelFoot}>
              <span
                id={noteId}
                className={`${styles.note} ${message ? styles.noteOver : ''}`}
                role={message ? 'alert' : undefined}
              >
                {message ?? t.stored}
              </span>
              <div className={styles.panelButtons}>
                <span className={styles.shortcut} aria-hidden="true">
                  ⌘ ⏎
                </span>
                <button type="button" className={styles.ghost} onClick={cancel}>
                  {t.cancel}
                </button>
                {/* The button keeps its box while it works; only the icon
                    changes, as the export sheet's download button does. */}
                <button
                  type="submit"
                  className={styles.primary}
                  disabled={!canSubmit}
                  aria-busy={phase === 'working'}
                  data-phase={phase}
                >
                  {t.submit}
                  {phase === 'working' ? (
                    <Loader size={16} strokeWidth={1.75} aria-label={t.working} />
                  ) : (
                    <ArrowRight size={16} strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
