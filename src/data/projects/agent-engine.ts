import type { Project } from '@/types';

const project = {
  id: 'agent-engine',
  title: {
    ko: '에이전트 편집·실행 엔진',
    en: 'Agent Authoring & Execution Engine',
  },
  shortDescription: {
    ko: '오픈소스 워크플로 엔진을 사내 에이전트 플랫폼의 엔진으로 흡수 (백엔드 담당)',
    en: 'An open-source workflow engine absorbed into the in-house agent platform (backend owner)',
  },
  fullDescription: {
    ko: '오픈소스 워크플로 엔진을 사내 에이전트 플랫폼의 편집·실행 엔진으로 재구성했습니다. 백엔드를 담당하며 재구성의 방향과 설계 결정을 맡았습니다.',
    en: 'Rebuilt an open-source workflow engine as the authoring and execution engine of the in-house agent platform. I own the backend and made the direction and design decisions.',
  },
  techStack: ['Python', 'PostgreSQL', 'Redis', 'TypeScript/React', 'Kubernetes', 'Locust'],
  peekLine: {
    ko: 'fork로 따라가는 대신 플랫폼의 엔진으로 흡수하기로 정했다',
    en: 'Chose to absorb the engine into the platform, not to keep following a fork.',
  },
  keyAchievements: [
    {
      ko: 'fork를 따라가는 대신 플랫폼의 엔진으로 흡수하기로 결정, 로그인·권한의 이중 구조 제거',
      en: 'Chose to absorb the engine into the platform instead of following a fork, removing the duplicate login and permission model',
    },
    {
      ko: '앱 모드 5개를 2개로 축소, 기존 데이터가 깨지지 않게 4단계로 진행',
      en: 'Cut five app modes to two, in four stages so existing data keeps working',
    },
    {
      ko: '시간 초과된 모델 호출은 재시도하지 않기로 결정, 이미 실행된 호출에 비용이 두 번 나가는 것 방지',
      en: 'Decided not to retry timed-out model calls, so a call that already ran is never paid for twice',
    },
    {
      ko: '실행 1건의 SQL 수를 테스트로 고정해 성능 회귀를 CI에서 차단',
      en: 'The SQL count of a single run is pinned in tests, so CI blocks performance regressions',
    },
  ],
  features: [
    'Agent & Chatflow Modes',
    'Performance Budgets in CI',
    'Direct Model Calls',
    'Live Run View',
  ],
  company: {
    ko: '(주)포지큐브',
    en: 'Posicube Inc.',
  },
  period: {
    ko: '2026.10 ~ 현재',
    en: 'Oct 2026 ~ Present',
  },
  detail: {
    architecture: [
      {
        title: {
          ko: '플랫폼 안에서의 자리',
          en: 'Where the engine sits in the platform',
        },
        description: {
          ko: '로그인·권한·모델 호출은 플랫폼 서비스에 맡기고, 엔진은 편집과 실행만 맡는 구조. 사용자는 대화 서비스를 거쳐서만 실행을 요청합니다.',
          en: 'Login, permissions, and model calls belong to platform services; the engine only authors and runs. Users reach a run only through the chat service.',
        },
        mermaidFilePath: {
          ko: '/architecture/agent-engine/system.mmd',
          en: '/architecture/agent-engine/system-en.mmd',
        },
      },
      {
        title: {
          ko: '실행 한 건의 흐름',
          en: 'One run, end to end',
        },
        description: {
          ko: '질문이 작업 큐를 거쳐 실행 엔진에서 돌고, 노드 이벤트가 스트림으로 돌아오는 흐름. 시간 초과된 모델 호출은 자동으로 다시 보내지 않습니다.',
          en: 'A question goes through the job queue to the execution engine, and node events stream back. A timed-out model call is not retried automatically.',
        },
        mermaidFilePath: {
          ko: '/architecture/agent-engine/run-sequence.mmd',
          en: '/architecture/agent-engine/run-sequence-en.mmd',
        },
      },
    ],
  },
  featured: true,
  order: 2,
  scope: 'company',
} satisfies Project;

export default project;
