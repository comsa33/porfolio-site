import type { Project } from '@/types';

const project = {
  id: 'a2a-orchestration',
  title: {
    ko: 'A2A 멀티에이전트 오케스트레이션',
    en: 'A2A Multi-Agent Orchestration',
  },
  shortDescription: {
    ko: '목적별 에이전트를 A2A 워커로 나누고 오케스트레이터가 골라 부르는 구조',
    en: 'Purpose-built agents split into A2A workers that an orchestrator picks from',
  },
  fullDescription: {
    ko: '실행 런타임의 에이전트들이 A2A v1.0(JSON-RPC)으로 서로를 부를 수 있게 설계·구현했습니다. 목적마다 따로 만들던 RAG·첨부 검색·웹검색 에이전트를 작은 워커로 나누고, 오케스트레이터가 매 턴 워커의 Agent Card를 LLM 도구로 받아 필요한 워커를 부릅니다.',
    en: 'Designed and built A2A v1.0 (JSON-RPC) calls between agents on the execution runtime. RAG, attachment-search, and web-search agents that used to be built per purpose are split into small workers; each turn the orchestrator turns its workers’ Agent Cards into LLM tools and calls the ones it needs.',
  },
  techStack: ['Python', 'FastAPI', 'A2A v1.0 (JSON-RPC)', 'Redis', 'SSE', 'LLM Tool Calling'],
  peekLine: {
    ko: '워커를 붙여도 오케스트레이터는 그대로, 다음 턴부터 카드로 잡힘',
    en: 'Adding a worker changes nothing in the orchestrator; its card is picked up next turn.',
  },
  keyAchievements: [
    {
      ko: '정적 라우터 하나로 모든 에이전트에 A2A 엔드포인트 제공 (에이전트별 API 등록 불필요)',
      en: 'One static router gives every agent an A2A endpoint, with no per-agent API registration',
    },
    {
      ko: 'Agent Card 레지스트리·카탈로그 설계, 설명·사용 기준·예시 3개 미만 카드는 등록 거절',
      en: 'Designed the Agent Card registry and catalog; cards missing a description, usage criteria, or three examples are rejected',
    },
    {
      ko: '워커 추가 시 오케스트레이터 수정 없이 다음 턴부터 도구로 노출',
      en: 'New workers appear as tools from the next turn without touching the orchestrator',
    },
    {
      ko: '호출 상태를 저장하지 않는 HMAC 서명 task_id, 워커별 요청 ID 분리로 연쇄 호출 답변 유실 해결',
      en: 'Stateless HMAC-signed task_id, and per-worker request IDs that fixed lost answers in chained calls',
    },
    {
      ko: '테스트 대화 77건에서 엉뚱한 워커 선택 0건, 실패 8건은 워커나 프롬프트 한 곳 단위로 수정',
      en: 'No wrong-worker picks across 77 test conversations; the 8 failures were each fixed in one worker or one prompt',
    },
    {
      ko: '첨부·사내 문서·웹·코드 계산을 묻는 한 질문에 워커 다섯 종류가 29.5초에 답',
      en: 'One question spanning an attachment, internal docs, the web, and a calculation answered by five kinds of workers in 29.5s',
    },
  ],
  posts: [
    {
      slug: 'splitting-agents-into-workers',
      title: {
        ko: '목적별 에이전트를 A2A 워커로 쪼갠 오케스트레이터',
        en: 'An orchestrator that splits purpose-built agents into A2A workers',
      },
    },
    {
      slug: 'allowed-to-worker-agent-ids',
      title: {
        ko: 'allowed_agent_ids 가 worker_agent_ids 가 되기까지',
        en: 'How allowed_agent_ids became worker_agent_ids',
      },
    },
  ],
  features: [
    'A2A v1.0',
    'Agent Card Registry',
    'Dynamic Tool Catalog',
    'Stateless Signed Task IDs',
    'Parallel Worker Calls',
  ],
  company: {
    ko: '(주)포지큐브',
    en: 'Posicube Inc.',
  },
  period: {
    ko: '2026.07 ~ 현재',
    en: 'Jul 2026 ~ Present',
  },
  featured: true,
  order: 2,
  scope: 'company',
} satisfies Project;

export default project;
