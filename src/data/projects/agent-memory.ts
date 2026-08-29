import type { Project } from '@/types';

const project = {
  id: 'agent-memory',
  title: {
    ko: 'AI Agent 메모리 · 컨텍스트 관리 시스템',
    en: 'AI Agent Memory & Context Management',
  },
  shortDescription: {
    ko: '턴·세션을 넘어 사용자 맥락을 유지하는 장기 메모리 아키텍처',
    en: 'Long-term memory that carries user context across turns and sessions',
  },
  fullDescription: {
    ko: '에이전트가 턴·세션을 넘어 사용자 맥락을 유지하도록 장기 메모리와 단기 컨텍스트 관리 체계를 설계·구현했습니다. 무한 누적(append-only) 구조가 컨텍스트를 오염시키고 비용을 키우는 문제를 실사용 로그로 진단한 뒤, 카테고리 기반 관리형 구조로 재설계했습니다. 장기기억(LTM) 파트 전담 — 코드 라인 기여 81.6% (git 실측, 벤더 제외).',
    en: 'Designed and implemented long-term memory and short-term context management so agents retain user context across turns and sessions. After diagnosing from production logs how an append-only structure pollutes context and inflates cost, the store was redesigned around managed, categorized memory. Owned the long-term-memory (LTM) side — 81.6% of lines by git measurement (vendors excluded).',
  },
  techStack: ['Elasticsearch', 'PostgreSQL', 'MongoDB', 'Redis', 'mem0', 'Knowledge Graph'],
  keyAchievements: [
    {
      ko: '관리형 사용자 메모리 구현 — 무한 누적 구조를 선호·대상·환경·교훈 4축 카테고리 관리형 구조로 재설계',
      en: 'Managed user memory — replaced unbounded accumulation with four managed categories (preference, subject, environment, lesson)',
    },
    {
      ko: '에이전트가 저장뿐 아니라 낡은 항목의 갱신·삭제까지 자율 수행하는 메모리 CRUD 도구 설계',
      en: 'Memory CRUD tools that let the agent update and delete stale entries autonomously, not merely write',
    },
    {
      ko: '시점 종속 정보 저장 금지를 프롬프트 계약으로 명문화 — 시간이 지나면 거짓이 되는 기록을 원천 차단',
      en: 'Codified a prompt-level contract banning time-dependent facts, blocking records that become false over time',
    },
    {
      ko: '단기 컨텍스트 recency-tier 압축 — 최근 턴은 원문 보존, 과거 턴은 절삭하여 LLM 호출 0으로 비용 절감',
      en: 'Recency-tier compression for short-term context — recent turns verbatim, older turns truncated, at zero LLM cost',
    },
    {
      ko: '차세대 아키텍처 설계 — 사용자 global / 에이전트 local 스코프 분리와 저장소 역할 분리 하이브리드 권고안 수립 (Elasticsearch·PostgreSQL·Knowledge Graph)',
      en: 'Next-generation design — separated user-global from agent-local scope and produced a hybrid storage recommendation (Elasticsearch / PostgreSQL / Knowledge Graph)',
    },
    {
      ko: '사내 메모리 3세대 이력을 커밋 단위로 실측 분석하고 외부 레퍼런스(mem0, Cognee, Claude Memory Tool, LongMemEval)를 교차 검증 → 그래프 전면 도입 대신 질의 유형 라우팅형 하이브리드로 결론',
      en: 'Measured three in-house memory generations commit by commit and cross-checked external references (mem0, Cognee, Claude Memory Tool, LongMemEval), concluding on query-type routing over a full graph rollout',
    },
  ],
  features: [
    'Managed Long-term Memory',
    'Memory CRUD Tools',
    'Recency-tier Compression',
    'Global/Local Scope Separation',
    'Hybrid Storage Design',
  ],
  company: {
    ko: '(주)포지큐브',
    en: 'Posicube Inc.',
  },
  period: {
    ko: '2026.03 ~ 현재',
    en: 'Mar 2026 ~ Present',
  },
  featured: true,
  order: 3,
  scope: 'company',
} satisfies Project;

export default project;
