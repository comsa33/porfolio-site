'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Project, ProblemSolvingCase } from '@/types';
import sheet from './Sheet.module.css';
import styles from './ProjectDetailModal.module.css';
import { useModalClose } from './useModalClose';

interface Props {
  project: Project;
  lang: 'ko' | 'en';
  isOpen: boolean;
  onClose: () => void;
}

/** Minimal inline markdown: **bold** and `code`. Content is authored in-repo. */
function inline(md: string): string {
  return md
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

/** Strips the ``` fence and returns [language, code]. */
function unfence(text: string): [string, string] {
  const langMatch = text.match(/^```(\w+)/);
  const language = langMatch ? langMatch[1] : 'python';
  const code = text
    .replace(/^```\w*\n?/, '')
    .replace(/```\n?$/, '')
    .replace(/\\n/g, '\n')
    .trim();
  return [language, code];
}

function readTheme(): 'light' | 'dark' {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function CaseView({
  case_,
  lang,
  projectId,
  theme,
}: {
  case_: ProblemSolvingCase;
  lang: 'ko' | 'en';
  projectId: string;
  theme: 'light' | 'dark';
}) {
  const [codeOpen, setCodeOpen] = useState(false);
  const [language, code] = unfence(case_.technicalDetails[lang]);
  const codeId = `code-${case_.id}`;

  return (
    <div className={sheet.swap}>
      <div className={styles.caseHead}>
        <p className={styles.category}>{case_.category[lang]}</p>
        <h3 className={styles.caseTitle}>{case_.title[lang]}</h3>
      </div>

      <div className={styles.steps}>
        <div className={styles.step}>
          <p className={styles.stepLabel}>{lang === 'ko' ? '문제' : 'Problem'}</p>
          <div
            className={styles.stepBody}
            dangerouslySetInnerHTML={{ __html: inline(case_.problem[lang]) }}
          />
        </div>

        <div className={styles.step}>
          <p className={styles.stepLabel}>{lang === 'ko' ? '해결' : 'Solution'}</p>
          <div
            className={styles.stepBody}
            dangerouslySetInnerHTML={{ __html: inline(case_.solution[lang]) }}
          />
          {case_.csFoundations.length > 0 && (
            <p className={styles.concepts}>
              {case_.csFoundations.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </p>
          )}
          <button
            type="button"
            className={styles.codeToggle}
            onClick={() => setCodeOpen((v) => !v)}
            aria-expanded={codeOpen}
            aria-controls={codeId}
          >
            {codeOpen
              ? lang === 'ko'
                ? '코드 접기'
                : 'Hide code'
              : lang === 'ko'
                ? '코드 보기'
                : 'Show code'}
            <ChevronDown
              size={13}
              strokeWidth={1.75}
              className={codeOpen ? styles.chevronOpen : undefined}
            />
          </button>
          <div
            id={codeId}
            className={`${styles.code} ${codeOpen ? styles.codeOpen : ''}`}
            aria-hidden={!codeOpen}
          >
            <div className={styles.codeInner}>
              <div className={styles.codeFrame}>
                {projectId === 'knowledge-base' && (
                  <p className={styles.note}>
                    {lang === 'ko'
                      ? '실제 구현은 사내 DSL로 작성되었으며, 이해를 돕기 위해 Python으로 표현했습니다.'
                      : 'The actual implementation uses an internal DSL; shown here as Python for clarity.'}
                  </p>
                )}
                <SyntaxHighlighter
                  language={language}
                  style={theme === 'dark' ? oneDark : oneLight}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.step} ${styles.stepImpact}`}>
          <p className={styles.stepLabel}>{lang === 'ko' ? '결과' : 'Impact'}</p>
          <div
            className={styles.stepBody}
            dangerouslySetInnerHTML={{ __html: inline(case_.impact[lang]) }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Problem-solving cases, one at a time: a rail of cases on the left, the
 * selected case as Problem → Solution → Impact on the right.
 */
export default function ProjectDetailModal({ project, lang, isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { closing, requestClose } = useModalClose(onClose);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setTheme(readTheme());
    const obs = new MutationObserver(() => setTheme(readTheme()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const cases = project.detail?.problemSolving ?? [];
  if (!isOpen || !mounted || cases.length === 0) return null;

  const title = typeof project.title === 'string' ? project.title : project.title[lang];
  const current = cases[Math.min(active, cases.length - 1)];

  return createPortal(
    <div
      className={`${sheet.overlay} ${closing ? sheet.closing : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} ${lang === 'ko' ? '문제 해결 과정' : 'problem solving'}`}
    >
      <div className={sheet.panel}>
        <div className={sheet.header}>
          <div>
            <p className={sheet.eyebrow}>
              {project.company ? `${project.company[lang]} · ` : ''}
              {title}
            </p>
            <h2 className={sheet.title}>{lang === 'ko' ? '문제 해결 과정' : 'Problem solving'}</h2>
          </div>
          <button onClick={requestClose} className={sheet.close} aria-label="Close">
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className={sheet.body}>
          <nav className={sheet.rail} aria-label="Cases">
            {cases.map((c, i) => (
              <button
                key={c.id}
                type="button"
                className={`${sheet.railItem} ${i === active ? sheet.railItemActive : ''}`}
                onClick={() => setActive(i)}
                aria-current={i === active}
              >
                <span className={sheet.railIndex}>{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className={sheet.railTitle}>{c.title[lang]}</span>
                  <span className={sheet.railSub}>{c.category[lang]}</span>
                </span>
              </button>
            ))}
          </nav>

          <div className={sheet.content}>
            <CaseView
              key={current.id}
              case_={current}
              lang={lang}
              projectId={project.id}
              theme={theme}
            />
          </div>
        </div>

        <div className={sheet.footer}>
          <span className={sheet.footerNote}>
            {lang === 'ko'
              ? '소스코드는 회사 자산으로 비공개. 구조와 문제 해결 과정만 공유합니다.'
              : 'Source is proprietary; only structure and problem-solving are shared.'}
          </span>
          <div className={sheet.pager}>
            <button
              type="button"
              className={sheet.pagerBtn}
              onClick={() => setActive((i) => Math.max(0, i - 1))}
              disabled={active === 0}
              aria-label={lang === 'ko' ? '이전' : 'Previous'}
            >
              <ChevronLeft size={16} strokeWidth={1.75} />
            </button>
            <span className={sheet.pagerCount}>
              {String(active + 1).padStart(2, '0')} / {String(cases.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              className={sheet.pagerBtn}
              onClick={() => setActive((i) => Math.min(cases.length - 1, i + 1))}
              disabled={active === cases.length - 1}
              aria-label={lang === 'ko' ? '다음' : 'Next'}
            >
              <ChevronRight size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
