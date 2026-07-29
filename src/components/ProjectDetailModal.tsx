'use client';

import { Project, ProblemSolvingCase } from '@/types';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './ProjectDetailModal.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  project: Project;
  lang: 'ko' | 'en';
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, lang, isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  // Client-side mount check for portal
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project.detail || !mounted) return null;

  const problemSolvingCases = project.detail.problemSolving;

  const modalContent = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {typeof project.title === 'string' ? project.title : project.title[lang]}
            <span className={styles.tag}>Deep Dive</span>
          </h2>
          <button className={styles.closeBtn} onClick={onClose} arial-label="Close">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Section: Problem Solving Cases (핵심) */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {lang === 'ko' ? '핵심 문제 해결 사례' : 'Core Problem-Solving Cases'}
            </h3>
            <p className={styles.sectionDesc}>
              {lang === 'ko'
                ? '개발 과정에서 직면한 기술적 문제와 해결 방법'
                : 'Technical challenges encountered and solutions implemented during development'}
            </p>

            <div className={styles.casesGrid}>
              {(problemSolvingCases || []).map((case_: ProblemSolvingCase) => (
                <div key={case_.id} className={styles.caseCard}>
                  {/* Card Header */}
                  <div className={styles.caseHeader}>
                    <span className={styles.caseIcon}>{case_.icon}</span>
                    <div>
                      <h4 className={styles.caseTitle}>{case_.title[lang]}</h4>
                      <span className={styles.caseCategory}>{case_.category[lang]}</span>
                    </div>
                  </div>

                  {/* Problem */}
                  <div className={styles.caseSection}>
                    <div className={styles.caseSectionLabel}>
                      {lang === 'ko' ? '문제 (Issue)' : 'Problem'}
                    </div>
                    <div
                      className={styles.caseSectionContent}
                      dangerouslySetInnerHTML={{
                        __html: case_.problem[lang].replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong>$1</strong>',
                        ),
                      }}
                    />
                  </div>

                  {/* Solution */}
                  <div className={styles.caseSection}>
                    <div className={styles.caseSectionLabel}>
                      {lang === 'ko' ? '해결 (Solution)' : 'Solution'}
                    </div>
                    <div
                      className={styles.caseSectionContent}
                      dangerouslySetInnerHTML={{
                        __html: case_.solution[lang]
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/`(.*?)`/g, '<code>$1</code>'),
                      }}
                    />
                  </div>

                  {/* Technical Details (Collapsible with Syntax Highlighting) */}
                  <details className={styles.detailsExpander}>
                    <summary className={styles.detailsSummary}>
                      {lang === 'ko' ? '기술 구현 상세' : 'Technical Implementation Details'}
                    </summary>
                    <div className={styles.detailsContent}>
                      {/* DSL Note for knowledge-base project */}
                      {project.id === 'knowledge-base' && (
                        <div className={styles.dslNote}>
                          {lang === 'ko'
                            ? '※ 실제 구현은 사내 DSL(Domain-Specific Language)로 작성되었으며, 이해를 돕기 위해 Python 코드로 표현했습니다.'
                            : '※ The actual implementation uses an internal DSL (Domain-Specific Language), presented here as Python code for clarity.'}
                        </div>
                      )}
                      {(() => {
                        const codeText = case_.technicalDetails[lang];
                        // Extract language from code fence (```tsx, ```typescript, ```python, etc.)
                        const langMatch = codeText.match(/^```(\w+)/);
                        const codeLanguage = langMatch ? langMatch[1] : 'python';
                        const cleanedCode = codeText
                          .replace(/^```\w*\n?/, '')
                          .replace(/```\n?$/, '')
                          .replace(/\\n/g, '\n')
                          .trim();
                        return (
                          <SyntaxHighlighter
                            language={codeLanguage}
                            style={oneLight}
                            customStyle={{
                              margin: 0,
                              padding: '1.25rem',
                              background: 'var(--bg-subtle)',
                              fontSize: '0.84rem',
                              borderRadius: '0 0 8px 8px',
                            }}
                          >
                            {cleanedCode}
                          </SyntaxHighlighter>
                        );
                      })()}
                    </div>
                  </details>

                  {/* CS Foundations */}
                  <div className={styles.csFoundations}>
                    <div className={styles.caseSectionLabel}>
                      {lang === 'ko' ? '활용 기술 개념' : 'Key Concepts'}
                    </div>
                    <div className={styles.tagList}>
                      {case_.csFoundations.map((foundation, idx) => (
                        <span key={idx} className={styles.foundationTag}>
                          {foundation}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Impact */}
                  <div className={`${styles.caseSection} ${styles.impactSection}`}>
                    <div className={styles.caseSectionLabel}>
                      {lang === 'ko' ? '성과 (Impact)' : 'Impact'}
                    </div>
                    <div
                      className={`${styles.caseSectionContent} ${styles.impactContent}`}
                      dangerouslySetInnerHTML={{
                        __html: case_.impact[lang].replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="highlight">$1</strong>',
                        ),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
