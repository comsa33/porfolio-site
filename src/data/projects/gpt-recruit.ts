import type { Project } from '@/types';

const project = {
  id: 'gpt-recruit',
  title: {
    ko: '채용공고 맞춤 AI 자기소개서 서비스',
    en: 'Job-Posting-Tailored AI Cover Letter Service',
  },
  shortDescription: {
    ko: 'GPT-4 공개 두 달 만에 구축한 초기 LLM 응용 서비스 (ASK 2023 발표)',
    en: 'Early LLM application built two months after the GPT-4 launch (presented at ASK 2023)',
  },
  fullDescription: {
    ko: '채용공고를 스크래핑해 DB에 적재하고, 검색·필터링을 거쳐 사용자 이력과 결합해 공고 맞춤형 자기소개서 작성 가이드를 생성하는 엔드투엔드 서비스입니다. GPT-4 API 공개(2023.03) 두 달 만에 구축한 초기 LLM 응용 사례로, 4단계 프롬프트 구조를 실험적으로 최적화해 한국정보처리학회 ASK 2023에서 주저자로 발표했습니다.',
    en: 'An end-to-end service that scrapes job postings into a database and combines search and filtering with a user’s history to generate posting-tailored cover-letter guides. Built within two months of the GPT-4 API launch (Mar 2023), with a four-stage prompt structure optimized experimentally — presented as first author at KIPS ASK 2023.',
  },
  techStack: ['Python', 'GPT-4 API', 'LangChain', 'LangServe', 'Elasticsearch', 'Airflow'],
  keyAchievements: [
    {
      ko: 'GPT-4 공개(2023.03) 두 달 만에 상용 LLM API를 적용한 엔드투엔드 서비스 설계·구현',
      en: 'Designed and shipped an end-to-end service on the commercial GPT-4 API within two months of its launch',
    },
    {
      ko: '스크래핑 → DB 적재 → 검색·필터링 → 개인화 생성 → 다운로드까지 전체 파이프라인 구축',
      en: 'Built the full pipeline: scraping → DB ingestion → search/filtering → personalized generation → download',
    },
    {
      ko: '4단계 프롬프트 구조(시스템 역할·기업 요구사항·지원자 이력·세부 요구사항) 실험적 최적화',
      en: 'Experimentally optimized a four-stage prompt structure (system role, company requirements, applicant history, detailed constraints)',
    },
    {
      ko: 'ASK 2023(한국정보처리학회 춘계학술발표대회) 주저자 발표 — DOI 10.3745/PKIPS.y2023m05a.430',
      en: 'Presented as first author at KIPS ASK 2023 — DOI 10.3745/PKIPS.y2023m05a.430',
    },
  ],
  features: [
    'GPT-4 API Integration',
    'Job-Posting Pipeline',
    'Personalized Generation',
    'Academic Presentation',
  ],
  company: {
    ko: '개인 프로젝트',
    en: 'Personal project',
  },
  period: {
    ko: '2023 (ASK 2023 발표)',
    en: '2023 (presented at ASK 2023)',
  },
  platformLinks: {
    github: 'https://github.com/comsa33/gpt-recruit.com',
  },
  featured: false,
  order: 12,
  scope: 'personal',
} satisfies Project;

export default project;
