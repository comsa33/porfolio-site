import type { Project } from '@/types';

const project = {
  id: 'agent-engine',
  title: {
    ko: '에이전트 편집·실행 엔진',
    en: 'Agent Authoring & Execution Engine',
  },
  shortDescription: {
    ko: '오픈소스 워크플로 엔진을 사내 에이전트 플랫폼의 편집·실행 엔진으로 흡수 (백엔드 담당)',
    en: 'An open-source workflow engine absorbed into the in-house agent platform as its authoring and execution engine (backend owner)',
  },
  fullDescription: {
    ko: '오픈소스 워크플로 엔진을 사내 에이전트 플랫폼의 편집·실행 엔진으로 재구성했습니다. 자체 로그인·워크스페이스 같은 사용자 표면은 걷어내고 사용자·권한의 원본은 플랫폼에 둡니다. 백엔드를 담당하며 재구성의 방향과 설계 결정을 맡았습니다.',
    en: 'Rebuilt an open-source workflow engine as the authoring and execution engine of the in-house agent platform. Its own login and workspace surfaces were removed, and the platform is the source of users and permissions. I own the backend and made the direction and design decisions for the rebuild.',
  },
  techStack: ['Python', 'PostgreSQL', 'Redis', 'TypeScript/React', 'Kubernetes', 'Locust'],
  peekLine: {
    ko: 'fork로 따라가는 대신 플랫폼의 엔진으로 흡수하기로 정했다',
    en: 'Chose to absorb the engine into the platform, not to keep following a fork.',
  },
  keyAchievements: [
    {
      ko: '오픈소스 fork를 유지하는 대신 플랫폼의 엔진으로 흡수하기로 결정. 별도 로그인·워크스페이스가 플랫폼 권한 모델과 이중으로 충돌했기 때문. 표면은 화면, 라우터, 코드 순으로 제거',
      en: 'Decided to absorb the engine into the platform, not to maintain a fork: its separate login and workspaces collided with the platform’s permission model. Surfaces come out in order: screens, routers, code',
    },
    {
      ko: '앱 모드 5개를 2개(Agent, Chatflow)로 축소. 남은 데이터가 깨지지 않게 화면, 입력, 저장 데이터, 코드 4단계로 나눠 진행',
      en: 'Cut five app modes down to two (Agent, Chatflow), in four stages (screens, inputs, stored data, code) so existing data keeps working',
    },
    {
      ko: '모델 호출을 프록시 경유에서 직접 호출로 바꿔 2분 제한 제거. 시간 초과 응답은 모델이 이미 실행됐을 수 있어 재시도하지 않음',
      en: 'Moved model calls from a proxy to direct calls, removing a two-minute limit. Timed-out responses are not retried, since the model may already have run',
    },
    {
      ko: '실행 1건의 SQL·트랜잭션·연결 수를 테스트에 숫자로 고정. 늘면 실패하고, 줄어도 숫자를 낮추라며 실패',
      en: 'The SQL, transaction, and connection counts of one run are pinned as exact numbers in tests: an increase fails, and a decrease fails too until the number is lowered',
    },
    {
      ko: '실행 중 화면의 노드 목록이 비어 있던 것을, 늦게 열어도 끝난 노드와 도는 노드가 보이도록 변경',
      en: 'The live run view used to show an empty node list; it now shows finished and running nodes even when opened late',
    },
    {
      ko: '교육 중 발견한 문제 4건을 당일 이슈 등록부터 수정, 리뷰, 개발 환경 배포까지 약 2시간',
      en: 'Four problems found during a training session went from issue to fix, review, and dev deployment the same day, in about two hours',
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
