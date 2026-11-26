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
      ko: '모델 호출의 2분 제한 제거, 시간 초과는 재시도하지 않아 비용 중복 방지',
      en: 'Removed a two-minute limit on model calls; timeouts are not retried, so a call is never paid for twice',
    },
    {
      ko: '실행 1건의 SQL 수를 테스트로 고정해 성능 회귀를 CI에서 차단',
      en: 'The SQL count of a single run is pinned in tests, so CI blocks performance regressions',
    },
    {
      ko: '교육 중 나온 문제 4건을 당일 수정해 개발 환경에 배포',
      en: 'Four problems raised during a training session were fixed and deployed to dev the same day',
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
  featured: true,
  order: 2,
  scope: 'company',
} satisfies Project;

export default project;
