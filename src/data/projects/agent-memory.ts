import type { Project } from '@/types';

const project = {
  id: 'agent-memory',
  title: {
    ko: 'AI Agent 메모리 · 컨텍스트 관리 시스템',
    en: 'AI Agent Memory & Context Management',
  },
  shortDescription: {
    ko: '단기 컨텍스트(STM)와 장기기억(LTM)을 분리한 사용자 기억 서비스 — LTM 전담 개발',
    en: 'A user-memory service split into short-term context (STM) and long-term memory (LTM) — owned the LTM side',
  },
  fullDescription: {
    ko: '에이전트가 턴·세션을 넘어 사용자 맥락을 유지하도록 하는 독립 사용자 기억 서비스입니다. 현재 대화를 토큰 예산 안에서 원문 또는 압축본으로 제공하는 단기 컨텍스트(STM)와, 사용자 취향·지난 대화를 저장·검색하는 장기기억(LTM)으로 분리했습니다. 무한 누적(append-only) 구조가 컨텍스트를 오염시키는 문제를 실사용 로그로 진단해 카테고리 관리형 구조로 재설계한 결론을 PostgreSQL(pgvector) 기반 서비스로 구현했으며, 장기기억 파트를 전담했습니다.',
    en: 'A standalone user-memory service that lets agents retain user context across turns and sessions. It splits into short-term context (STM), which serves the current conversation verbatim or compacted within a token budget, and long-term memory (LTM), which stores and retrieves user preferences and past conversations. The redesign conclusions — drawn from production logs showing how append-only accumulation pollutes context — were implemented as a PostgreSQL (pgvector) service; I owned the LTM side.',
  },
  techStack: ['Python 3.13', 'FastAPI', 'PostgreSQL (pgvector)', 'mem0 (vendored)', 'MCP', 'Redis'],
  keyAchievements: [
    {
      ko: '저장 전 검증 게이트 — 추출된 기억을 독립 판정 LLM으로 검증 후 저장(판정 기준은 원문 지지가 아닌 귀속·신규성). 어시스턴트 제안이 사용자 생각으로 둔갑해 다음 추출로 증폭되는 오염 루프를 쓰기 시점에 차단',
      en: 'Write-time verification gate — an independent judge LLM validates extracted memories before storage, judging attribution and novelty rather than source support, blocking the loop where assistant suggestions masquerade as user statements and amplify through later extractions',
    },
    {
      ko: '무한 누적 대신 선호·대상·환경·교훈 4축 카테고리 관리형 기억 — 저장뿐 아니라 갱신·삭제까지 에이전트가 자율 수행하는 기억 도구를 MCP + REST 이중 표면으로 제공',
      en: 'Managed memory across four categories (preference, focus, context, learning) instead of unbounded accumulation — memory tools exposed over both MCP and REST let the agent update and delete entries autonomously, not merely write',
    },
    {
      ko: '매 턴 주입 예산 관리 — 카테고리 기억에 글자·건수 상한을 두고 잘림을 모델에 명시적으로 고지, 사용자 선호가 조용히 누락되는 손실 제거',
      en: 'Per-turn injection budgeting — character and count caps on injected memories, with truncation explicitly disclosed to the model so user preferences never silently drop out',
    },
    {
      ko: '스코프 정규화 — 진입점마다 다른 사용자 식별 형식을 단일 계층에서 정규화해 같은 사용자의 기억이 두 벌로 갈리는 문제 차단. 조직 스코프는 프라이버시 판단으로 의도적 배제(기억은 본인 것만)',
      en: 'Scope normalization — user identifiers that differ per entry point are normalized in one layer so a user’s memory never forks in two; organizational scope was deliberately excluded on privacy grounds (memory belongs to its owner only)',
    },
    {
      ko: '오픈소스 메모리 엔진(mem0)을 벤더링하고 검증 게이트·어댑터를 최소 침습 훅으로 장착 — 미장착 시 벤더 원형 그대로 동작하는 안전한 확장 구조',
      en: 'Vendored an open-source memory engine (mem0) and attached the gate and adapters through minimal hooks — with nothing attached, the vendor code runs exactly as upstream',
    },
    {
      ko: '백그라운드 적재·보존 스윕 워커와 관리자 런타임 설정(프롬프트 저장·검증 포함) — 재배포 없이 운영 중 프롬프트·정책 교체',
      en: 'Background ingest and retention-sweep workers plus admin runtime settings (including prompt store and verification) — prompts and policies swap in production without a redeploy',
    },
  ],
  features: [
    'STM/LTM Split',
    'Write-time Verification Gate',
    'Injection Budgeting',
    'Memory CRUD Tools (MCP + REST)',
    'Managed Memory Categories',
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
