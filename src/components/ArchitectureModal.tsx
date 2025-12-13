'use client';

import { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';
import type { ArchitectureDiagram, LocalizedString } from '@/types';
import styles from './ArchitectureModal.module.css';

interface ArchitectureModalProps {
  diagrams: ArchitectureDiagram[];
  projectTitle: string;
  company: LocalizedString;
  lang: 'ko' | 'en';
  onClose: () => void;
}

export default function ArchitectureModal({ 
  diagrams, 
  projectTitle, 
  company,
  lang, 
  onClose 
}: ArchitectureModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [diagramCodes, setDiagramCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const diagramRef = useRef<HTMLDivElement>(null);

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#4f46e5',
        primaryTextColor: '#fff',
        primaryBorderColor: '#818cf8',
        lineColor: '#06b6d4',
        secondaryColor: '#0891b2',
        tertiaryColor: '#dc2626',
      },
    });
  }, []);

  // Fetch all Mermaid diagram files
  useEffect(() => {
    async function fetchDiagrams() {
      try {
        const codes = await Promise.all(
          diagrams.map(async (diagram) => {
            const filePath = diagram.mermaidFilePath[lang];
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Failed to load ${filePath}`);
            return await response.text();
          })
        );
        setDiagramCodes(codes);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load Mermaid diagrams:', error);
        setLoading(false);
      }
    }
    fetchDiagrams();
  }, [diagrams, lang]);

  // Render Mermaid diagram when tab changes or diagram loads
  useEffect(() => {
    if (!loading && diagramCodes.length > 0 && diagramRef.current) {
      const code = diagramCodes[activeTab];
      if (code) {
        // Clear previous diagram
        diagramRef.current.innerHTML = '';
        
        // Create unique ID for this diagram
        const id = `mermaid-${Date.now()}`;
        const div = document.createElement('div');
        div.className = styles.mermaidContainer;
        diagramRef.current.appendChild(div);

        // Render mermaid
        mermaid.render(id, code).then(({ svg }) => {
          div.innerHTML = svg;
        }).catch(error => {
          console.error('Mermaid rendering error:', error);
          div.innerHTML = `<p>${lang === 'ko' ? '다이어그램 렌더링 실패' : 'Diagram rendering failed'}</p>`;
        });
      }
    }
  }, [activeTab, diagramCodes, loading]);

  // Keyboard shortcut (ESC to close)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{projectTitle} - {lang === 'ko' ? '아키텍처' : 'Architecture'}</h2>
            <p className={styles.company}>{company[lang]}</p>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Privacy Notice */}
        <div className={styles.privacyNotice}>
          <span className={styles.icon}>⚠️</span>
          <p>
            {lang === 'ko' 
              ? '전체 소스코드는 회사 소유의 자산으로 공개가 불가능합니다. 아키텍처 구조와 문제 해결 사례만 공유합니다.'
              : 'Full source code is proprietary and cannot be publicly shared. Only architecture and problem-solving insights are showcased.'}
          </p>
        </div>

        {/* Tabs */}
        {diagrams.length > 1 && (
          <div className={styles.tabs}>
            {diagrams.map((diagram, idx) => (
              <button
                key={idx}
                className={`${styles.tab} ${activeTab === idx ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(idx)}
              >
                {diagram.title[lang]}
              </button>
            ))}
          </div>
        )}

        {/* Diagram Content */}
        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>{lang === 'ko' ? '다이어그램 로딩 중...' : 'Loading diagram...'}</p>
            </div>
          ) : (
            <>
              {/* Description */}
              {diagrams[activeTab]?.description && (
                <p className={styles.description}>
                  {diagrams[activeTab].description[lang]}
                </p>
              )}

              {/* Diagram */}
              <div ref={diagramRef} className={styles.diagram} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
