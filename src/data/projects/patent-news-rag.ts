import type { Project } from '@/types';

const project = {
  id: 'patent-news-rag',
  title: {
    ko: '특허·뉴스 RAG 검색 시스템',
    en: 'Patent & News RAG Retrieval System',
  },
  shortDescription: {
    ko: '특허/뉴스 챗봇을 위한 Elasticsearch 기반 문서 검색 서버',
    en: 'Elasticsearch-backed document retrieval server for a patent/news chatbot',
  },
  fullDescription: {
    ko: '일루넥스 AI팀에서 특허·뉴스 챗봇의 RAG 검색 계층을 개발했습니다. Elasticsearch 색인·검색 파이프라인을 설계하고, LangChain 기반 임베딩·Retrieval 모듈과 대규모 특허·뉴스 데이터 ETL 파이프라인을 구축했습니다.',
    en: 'Built the RAG retrieval layer for a patent/news chatbot on the Illunex AI team — designed the Elasticsearch indexing and search pipeline, implemented LangChain-based embedding and retrieval modules, and built ETL pipelines for large-scale patent and news data.',
  },
  techStack: ['Python', 'Elasticsearch', 'LangChain', 'ETL Pipeline'],
  keyAchievements: [
    {
      ko: 'RAG 문서검색 서버 개발 — 특허/뉴스 챗봇의 검색 계층 담당',
      en: 'Developed the RAG document-retrieval server powering the chatbot’s search layer',
    },
    {
      ko: 'Elasticsearch 색인·검색 파이프라인 설계',
      en: 'Designed the Elasticsearch indexing and search pipeline',
    },
    {
      ko: 'LangChain 기반 임베딩·Retrieval 모듈 구현',
      en: 'Implemented LangChain-based embedding and retrieval modules',
    },
    {
      ko: '대규모 특허·뉴스 데이터 ETL 파이프라인 구축',
      en: 'Built ETL pipelines for large-scale patent and news data',
    },
  ],
  features: ['RAG Retrieval Server', 'Elasticsearch Indexing', 'Embedding Pipeline', 'ETL'],
  company: {
    ko: '(주)일루넥스',
    en: 'Illunex Inc.',
  },
  period: {
    ko: '2023.11 ~ 2024.07',
    en: 'Nov 2023 ~ Jul 2024',
  },
  featured: false,
  order: 10,
  scope: 'company',
} satisfies Project;

export default project;
