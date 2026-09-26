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
    ko: '에이전트가 턴·세션을 넘어 사용자 맥락을 유지하도록 하는 독립 사용자 기억 서비스입니다. 현재 대화를 토큰 예산 안에서 원문 또는 압축본으로 제공하는 단기 컨텍스트(STM)와, 사용자 취향·지난 대화를 저장·검색하는 장기기억(LTM)으로 분리했습니다. 실사용 로그에서 무한 누적(append-only) 구조가 컨텍스트를 오염시키는 문제를 확인해 카테고리 관리형으로 재설계했고, PostgreSQL(pgvector) 기반으로 구현했습니다.',
    en: 'A standalone user-memory service that lets agents retain user context across turns and sessions. It splits into short-term context (STM), which serves the current conversation verbatim or compacted within a token budget, and long-term memory (LTM), which stores and retrieves user preferences and past conversations. Production logs showed append-only accumulation polluting context, so it was redesigned around managed categories and built on PostgreSQL (pgvector).',
  },
  techStack: ['Python 3.13', 'FastAPI', 'PostgreSQL (pgvector)', 'mem0 (vendored)', 'MCP', 'Redis'],
  peekLine: {
    ko: '저장 전 독립 판정 LLM이 검증해 기억 오염 루프를 쓰기 시점에 끊는다',
    en: 'An independent judge LLM verifies each memory before it is stored.',
  },
  keyAchievements: [
    {
      ko: '추출한 기억을 저장 전에 독립 판정 LLM으로 검증 (기준: 귀속·신규성), 어시스턴트 제안이 사용자 생각으로 저장돼 다음 추출에서 반복되는 문제 차단',
      en: 'An independent judge LLM verifies extracted memories before storage (criteria: attribution and novelty), so assistant suggestions are not saved as the user’s own and repeated in later extractions',
    },
    {
      ko: '선호·대상·환경·교훈 4개 카테고리로 기억 관리, 에이전트가 저장·갱신·삭제하는 기억 도구를 MCP·REST로 제공',
      en: 'Memory managed in four categories (preference, focus, context, learning); tools for the agent to store, update, and delete memories over MCP and REST',
    },
    {
      ko: '매 턴 주입하는 기억에 글자·건수 상한, 잘린 경우 모델에 고지',
      en: 'Per-turn character and count caps on injected memories, with truncation disclosed to the model',
    },
    {
      ko: '진입점마다 다른 사용자 식별자를 한 계층에서 정규화해 기억이 두 벌로 갈리는 문제 해결, 조직 스코프는 프라이버시 문제로 제외',
      en: 'Normalized per-entry-point user identifiers in one layer so a user’s memory doesn’t split in two; organization scope excluded for privacy',
    },
    {
      ko: '오픈소스 메모리 엔진(mem0) 벤더링, 검증 게이트·어댑터는 훅으로 연결해 떼면 원본 그대로 동작',
      en: 'Vendored the mem0 memory engine; the gate and adapters attach through hooks, and without them the code runs as upstream',
    },
    {
      ko: '백그라운드 적재·보존 스윕 워커, 재배포 없이 프롬프트·정책을 바꾸는 관리자 런타임 설정',
      en: 'Background ingest and retention-sweep workers; admin runtime settings swap prompts and policies without a redeploy',
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
  detail: {
    architecture: [
      {
        title: {
          ko: '매 턴 회상 흐름',
          en: 'Per-turn Recall Flow',
        },
        description: {
          ko: '대화 오케스트레이터가 매 턴 카테고리 기억 전량과 현재 대화(예산 초과 시 압축본)를 받아 프롬프트를 조립하고, 모델은 필요할 때만 MCP 도구로 기억을 검색·저장하는 흐름. 적재는 신호 한 번으로 끝나 응답을 막지 않습니다.',
          en: 'Each turn the orchestrator assembles the prompt from all category memories and the current conversation (compacted when over budget); the model reaches for MCP memory tools only when needed. Ingest is a single signal that never blocks the response.',
        },
        mermaidFilePath: {
          ko: '/architecture/agent-memory/recall-sequence.mmd',
          en: '/architecture/agent-memory/recall-sequence-en.mmd',
        },
      },
      {
        title: {
          ko: '기억 적재 파이프라인',
          en: 'Memory Ingest Pipeline',
        },
        description: {
          ko: '대화 원문을 서비스 DB에 복제하지 않고 커서 기반으로 원본 저장소에서 재조회해 N턴씩 묶어 추출하는 파이프라인. 추출 게이트가 저장 전에 오염을 차단하고, 실패 시 커서를 옮기지 않아 재시도가 멱등입니다.',
          en: 'Conversation text is never replicated — the pipeline re-reads the source store past a cursor and extracts in N-turn batches. The extraction gate blocks contamination before storage, and the cursor holds back on failure so retries stay idempotent.',
        },
        mermaidFilePath: {
          ko: '/architecture/agent-memory/ingest-pipeline.mmd',
          en: '/architecture/agent-memory/ingest-pipeline-en.mmd',
        },
      },
    ],
  },
  featured: true,
  order: 3,
  scope: 'company',
} satisfies Project;

export default project;
