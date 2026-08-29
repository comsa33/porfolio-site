import type { Project } from '@/types';

const project = {
  id: 'kr-longrag-bench',
  title: {
    ko: '한국어 Long-Context RAG 벤치마크',
    en: 'Korean Long-Context RAG Benchmark',
  },
  shortDescription: {
    ko: '공공 주거정책 문서 기반 QA 1,997문항 벤치마크 구축·공개 (CC-BY-4.0)',
    en: 'A 1,997-item QA benchmark built from public housing documents, released under CC-BY-4.0',
  },
  fullDescription: {
    ko: '한국 공공주택 공고·공공 표 데이터·주거 법령을 근거로 long-context LLM과 RAG 시스템, 표·도구 파이프라인을 평가하는 벤치마크를 단독 구축해 공개한 개인 연구입니다. 41개 공식 공고(10개 공급기관·9개 시도)에서 근거 연결형 QA 1,997문항을 구축했으며, 데이터셋은 Hugging Face에, 구축 코드는 GitHub에 공개되어 있습니다.',
    en: 'A solo research project building and releasing a benchmark that evaluates long-context LLMs, RAG systems, and table/tool pipelines against Korean public-housing announcements, public tabular data, and housing law. 1,997 evidence-linked QA items were built from 41 official announcements (10 providers, 9 regions); the dataset is on Hugging Face and the construction code on GitHub.',
  },
  techStack: [
    'Python',
    'Hugging Face Datasets',
    'Elasticsearch (BM25)',
    'bge-m3 (dense)',
    'LLM-as-judge',
  ],
  keyAchievements: [
    {
      ko: '41개 공식 공고 + 공공 데이터 포털 표 기반 근거 연결형 QA 1,997문항 구축 — 12개 태스크 패밀리, 32k~512k 컨텍스트 티어',
      en: 'Built 1,997 evidence-linked QA items from 41 official announcements plus public-portal tables — 12 task families across 32k–512k context tiers',
    },
    {
      ko: '원문 재배포 없는 릴리스 프로토콜 설계 — 정답·근거 로케이터·결정론적 술어만 공개해 저작권과 재현성을 양립',
      en: 'Designed a no-redistribution release protocol — only answers, evidence locators, and deterministic predicates are published, reconciling copyright with reproducibility',
    },
    {
      ko: 'closed-book / BM25·dense RAG / full-context 3개 접근을 동일 문항으로 비교하는 평가 하네스 구성',
      en: 'An evaluation harness comparing closed-book, BM25/dense RAG, and full-context approaches on identical items',
    },
    {
      ko: 'LLM-judge 채점을 사람 라벨 표본과 대조 검증 — 일치율 96.2%, Cohen’s κ 0.924',
      en: 'LLM-judge scoring validated against human labels — 96.2% agreement, Cohen’s κ 0.924',
    },
    {
      ko: '상용 API 4종 + 오픈웨이트 3종을 동일 프로토콜로 평가해 긴 컨텍스트 처리 능력의 격차를 분리 측정',
      en: 'Evaluated 4 commercial APIs and 3 open-weight models under one protocol, isolating gaps in long-context capability',
    },
  ],
  features: [
    'Evidence-linked QA Construction',
    'Long-context Tiers (32k–512k)',
    'No-redistribution Release Protocol',
    'LLM-as-judge Validation',
  ],
  company: {
    ko: '개인 연구 (오픈소스 공개)',
    en: 'Personal R&D (open-sourced)',
  },
  period: {
    ko: '2026.06 ~ 현재',
    en: 'Jun 2026 ~ Present',
  },
  platformLinks: {
    web: 'https://huggingface.co/datasets/comsa33/kr-housing-longrag-bench',
    github: 'https://github.com/comsa33/kr-housing-longrag-bench',
  },
  featured: false,
  order: 5,
  scope: 'personal',
} satisfies Project;

export default project;
