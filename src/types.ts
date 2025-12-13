export interface LocalizedString {
  ko: string;
  en: string;
}

export interface Profile {
  name: LocalizedString;
  title: string;
  email: string;
  github: string;
  linkedin?: string;
  story: LocalizedString;
  intro: LocalizedString;
}

export type TimelineType = 'Design' | 'Education' | 'Dev' | 'Travel' | 'Career';

export interface TimelineItem {
  id: string;
  date: string;
  title: string | LocalizedString;
  role: string | LocalizedString;
  type: TimelineType;
  description: LocalizedString;
  paperLink?: string; // Optional research paper link
  paperTitle?: LocalizedString; // Optional research paper title
}

export interface Project {
  id: string;
  title: string;
  shortDescription: LocalizedString;
  fullDescription: LocalizedString;
  techStack: string[];
  repoPath: string;
  company?: LocalizedString; // Company name (optional)
  period?: LocalizedString; // Project period (optional)
  keyAchievements?: LocalizedString[];
  features: string[];
  detail?: ProjectDetail; // Optional detailed showcase
}

// Problem-solving case study (핵심: 이슈 → 해결 과정)
export interface ProblemSolvingCase {
  id: string;
  title: LocalizedString;
  category: LocalizedString; // Bilingual category name
  icon: string; // Emoji or icon identifier
  problem: LocalizedString; // 어떤 이슈가 있었는지
  solution: LocalizedString; // 어떻게 해결했는지
  technicalDetails: LocalizedString; // 기술적 상세 (코드 예제 등)
  csFoundations: string[]; // 적용된 CS 기본기
  impact: LocalizedString; // 해결 후 결과/성과
  commits?: string[]; // 관련 커밋 해시
}

// Architecture diagram (optional, 보조 자료)
export interface ArchitectureDiagram {
  title: LocalizedString;
  mermaidFilePath: LocalizedString; // Path to .mmd file in public folder (language-specific)
  description?: LocalizedString;
}

// Project detailed information
export interface ProjectDetail {
  problemSolvingCases: ProblemSolvingCase[]; // 핵심 콘텐츠
  architecture?: ArchitectureDiagram[]; // 선택적 다이어그램
  technicalHighlights?: LocalizedString[]; // 추가 기술적 하이라이트
}

export interface PortfolioData {
  profile: Profile;
  timeline: TimelineItem[];
  projects: Project[];
}
