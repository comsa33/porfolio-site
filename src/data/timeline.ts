import type { TimelineItem } from '@/types';

export const timeline = [
  {
    id: 'edudesign',
    date: '2003.03 ~ 2013.02',
    title: {
      ko: '전남대학교',
      en: 'Chonnam National Univ.',
    },
    role: {
      ko: '시각디자인 · 미술학사',
      en: 'Visual Design · BFA',
    },
    type: 'Education',
    description: {
      ko: '시각디자인 전공 졸업.',
      en: 'Graduated in Visual Design.',
    },
  },
  {
    id: 'design-biennale',
    date: '2009.09 ~ 2009.11',
    title: {
      ko: '2009 광주디자인비엔날레',
      en: '2009 Gwangju Design Biennale',
    },
    role: {
      ko: '출품작가',
      en: 'Exhibiting Artist',
    },
    type: 'Design',
    description: {
      ko: "주제 'The Clue-더할 나위 없는' 전시에 작품 2점 출품.",
      en: "Exhibited 2 works at 'The Clue' themed exhibition.",
    },
  },
  {
    id: 'career-english-edu',
    date: '2011.05 ~ 2021.03',
    title: {
      ko: '영어 교육 분야 경력',
      en: 'English Education Career',
    },
    role: {
      ko: '설립자 · 전임강사',
      en: 'Founder · Instructor',
    },
    type: 'Career',
    description: {
      ko: '토익쉽/고파토익 어학원 설립 및 운영. 대학·교육기관 영어 회화·토익 강의, 개인사업자로 온라인 강의 (약 10년).',
      en: 'Founded and ran two language institutes; taught TOEIC and English conversation at universities and institutions, and online courses as a sole proprietor (about 10 years).',
    },
  },
  {
    id: 'world-travel',
    date: '2016.08 ~ 2017.07',
    title: {
      ko: '세계일주',
      en: 'World Travel',
    },
    role: {
      ko: '경력 휴식기',
      en: 'Career Break',
    },
    type: 'Travel',
    description: {
      ko: '31개국 배낭여행.',
      en: 'Backpacked through 31 countries.',
    },
    paperLink: 'https://backpacking.po24lio.com/',
    paperTitle: {
      ko: '여행 스토리',
      en: 'Travel Story',
    },
  },
  {
    id: 'edu-kcyber',
    date: '2020.03 ~ 2023.08',
    title: {
      ko: '고려사이버대학교',
      en: 'Korea Cyber University',
    },
    role: {
      ko: '인공지능 · 학사',
      en: "Artificial Intelligence · Bachelor's",
    },
    type: 'Education',
    description: {
      ko: '• 학점 4.3/4.5',
      en: '• GPA 4.3/4.5',
    },
    paperLink: 'https://kiss.kstudy.com/Detail/Ar?key=4028402',
    paperTitle: {
      ko: '학술대회 발표 (ASK 2023)',
      en: 'Conference paper (ASK 2023)',
    },
  },
  {
    id: 'edu-kcci',
    date: '2021.03 ~ 2021.07',
    title: {
      ko: '대한상공회의소',
      en: 'Korea Chamber of Commerce',
    },
    role: {
      ko: 'AI 소프트웨어 프로그래밍',
      en: 'AI Software Programming',
    },
    type: 'Education',
    description: {
      ko: 'Python 프로그래밍, 데이터 수집/분석 및 RDBMS 활용 능력 습득.',
      en: 'Learned Python programming, data collection/analysis, and RDBMS skills.',
    },
  },
  {
    id: 'edu-codestates',
    date: '2021.09 ~ 2022.04',
    title: {
      ko: '코드스테이츠',
      en: 'Code States',
    },
    role: {
      ko: 'AI 부트캠프',
      en: 'AI Bootcamp',
    },
    type: 'Education',
    description: {
      ko: '머신러닝/딥러닝 프로젝트 및 Data Engineering/MLOps 실무 경험.',
      en: 'Practical experience in ML/DL projects and Data Engineering/MLOps.',
    },
  },
  {
    id: 'dev-gravylab',
    date: '2022.05 ~ 2023.06',
    title: {
      ko: '그레이비랩',
      en: 'GravyLab',
    },
    role: {
      ko: 'ML 엔지니어 · AI Lab.',
      en: 'ML Engineer · AI Lab.',
    },
    type: 'Dev',
    description: {
      ko: `• 구직자-기업 매칭 ML 모델 개발 및 특허 등록
• 데이터 파이프라인 구축
• 대규모 웹크롤러 개발`,
      en: `• Developed job seeker-company matching ML model (patent registered)
• Built data pipelines
• Developed large-scale web crawlers`,
    },
    paperLink:
      'https://patentimages.storage.googleapis.com/3c/c8/73/b770f95a418ac0/KR102721044B1.pdf',
    paperTitle: {
      ko: '특허: 구직자 추천 시스템',
      en: 'Patent: Job Seeker Recommendation System',
    },
  },
  {
    id: 'dev-illunex',
    date: '2023.11 ~ 2024.07',
    title: {
      ko: '일루넥스',
      en: 'Illunex',
    },
    role: {
      ko: '데이터엔지니어 · 인공지능팀',
      en: 'Data Engineer · AI Team',
    },
    type: 'Dev',
    description: {
      ko: `• 특허/뉴스 챗봇을 위한 RAG 시스템 개발
• ElasticSearch 기반 검색 Retriever 서버 구축
• ETL 파이프라인 구축`,
      en: `• Developed RAG system for patent/news chatbot
• Built ElasticSearch-based Retriever server
• Built ETL pipelines`,
    },
  },
  {
    id: 'dev-posicube',
    date: '2024.08 ~',
    title: {
      ko: '포지큐브',
      en: 'Posicube',
    },
    role: {
      ko: 'AI 개발자 · AI 개발1팀',
      en: 'AI Engineer · AI Dev Team 1',
    },
    type: 'Dev',
    description: {
      ko: `• AI Agent 실행 런타임 설계/개발 (주 개발자)
• 멀티에이전트 오케스트레이션 및 자율 에이전트 구현
• 에이전트 메모리·컨텍스트 관리 시스템 구축
• RAG/Agent 품질 평가 서비스 단독 개발`,
      en: `• Designed/built the AI agent execution runtime (lead developer)
• Implemented multi-agent orchestration and autonomous agents
• Built the agent memory & context management system
• Sole developer of the RAG/Agent quality evaluation service`,
    },
  },
  {
    id: 'edu-aSST',
    date: '2024.09 ~ 2025.08',
    title: {
      ko: '서울과학종합대학원대학교',
      en: 'aSSIST · Seoul AI School',
    },
    role: {
      ko: 'AI·빅데이터 · 석사',
      en: "AI & Big Data · Master's",
    },
    type: 'Education',
    description: {
      ko: `• 학점 4.23/4.3
• 석사논문: 생성형 AI 기반 시계열 예측 자동화 연구`,
      en: `• GPA 4.23/4.3
• Thesis: Generative AI-based Time Series Forecasting Automation`,
    },
    paperLink:
      'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003244700',
    paperTitle: {
      ko: '학술지 게재',
      en: 'Journal article',
    },
  },
  {
    id: 'edu-sdg',
    date: '2024.09 ~ 2025.08',
    title: {
      ko: 'SDG Management School',
      en: 'SDG Management School',
    },
    role: {
      ko: '경영학 · EMBA',
      en: 'Business Administration · EMBA',
    },
    type: 'Education',
    description: {
      ko: '스위스 경영대학원. 서울과학종합대학원대학교 AI·빅데이터 석사와 복수학위.',
      en: "Swiss business school, a dual degree with the AI & Big Data master's at aSSIST.",
    },
  },
  {
    id: 'edu-assist-phd',
    date: '2026.03 ~',
    title: {
      ko: '서울과학종합대학원대학교',
      en: 'aSSIST · Seoul AI School',
    },
    role: {
      ko: 'AI 공학 · 박사과정',
      en: 'AI Engineering · PhD (in progress)',
    },
    type: 'Education',
    description: {
      ko: 'SDG Management School 경영학 박사(DBA)와 복수학위.',
      en: 'A dual degree with the DBA at SDG Management School.',
    },
  },
  {
    id: 'edu-sdg-dba',
    date: '2026.03 ~',
    title: {
      ko: 'SDG Management School',
      en: 'SDG Management School',
    },
    role: {
      ko: '경영학 · DBA 과정',
      en: 'Business Administration · DBA (in progress)',
    },
    type: 'Education',
    description: {
      ko: '스위스 경영대학원 박사과정. 서울과학종합대학원대학교 AI 공학 박사과정과 복수학위.',
      en: 'Swiss business school doctorate, a dual degree with the AI Engineering PhD at aSSIST.',
    },
  },
  {
    id: 'cert-iso-19011',
    date: '2026.01',
    title: {
      ko: 'ISO 19011 경영시스템 심사원보',
      en: 'ISO 19011 MS Provisional Auditor',
    },
    role: {
      ko: '심사원/선임심사원 과정 수료 · 공통 모듈',
      en: 'Auditor/Lead Auditor course · common module',
    },
    type: 'Certification',
    description: {
      ko: 'ISO 19011:2018 경영시스템 심사 과정 수료 (ISOC 공통 모듈).',
      en: 'Completed the ISO 19011:2018 auditing management systems course (ISOC common module).',
    },
    paperLink: '/certificates/iso_19011_certificate.png',
    paperTitle: {
      ko: '19011 합격증',
      en: '19011 certificate',
    },
    foldInto: 'cert-iso-42001',
  },
  {
    id: 'cert-iso-42001',
    date: '2026.01',
    title: {
      ko: 'ISO/IEC 42001 AI 경영시스템 심사원보',
      en: 'ISO/IEC 42001 AI MS Provisional Auditor',
    },
    role: {
      ko: '심사원/선임심사원 과정 수료 · ISO 19011 공통 모듈 포함',
      en: 'Auditor/Lead Auditor course · incl. ISO 19011 common module',
    },
    type: 'Certification',
    description: {
      ko: 'ISOC 공통 모듈(ISO 19011:2018 경영시스템 심사)과 AI 모듈(ISO/IEC 42001:2023) 수료.',
      en: 'Completed the ISOC common module (ISO 19011:2018 auditing management systems) and the AI module (ISO/IEC 42001:2023).',
    },
    paperLink: '/certificates/iso_42001_certificate.png',
    paperTitle: {
      ko: '42001 합격증',
      en: '42001 certificate',
    },
  },
] satisfies TimelineItem[];
