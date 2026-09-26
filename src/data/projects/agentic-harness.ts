import type { Project } from '@/types';

const project = {
  id: 'agentic-harness',
  title: {
    ko: '멀티에이전트 오케스트레이션 & 자율 에이전트',
    en: 'Multi-Agent Orchestration & Agentic Harness',
  },
  shortDescription: {
    ko: '에이전트가 에이전트를 만들고 배포·검증하는 자율 제어 체계',
    en: 'A self-driving control plane where agents build, deploy, and verify agents',
  },
  fullDescription: {
    ko: '에이전트가 여러 도구·서브에이전트를 조율하고, 나아가 에이전트가 스스로 에이전트를 만들어 배포·검증·디버깅하는 자율 제어 체계를 설계·구현했습니다. 관리 플레인(저작·배포)과 런타임 플레인(실행·스트리밍)을 나눠 인증·권한 경계를 두었고, 되돌릴 수 없는 상용 배포만 사람이 승인합니다(HITL).',
    en: 'Designed and built a control system in which an agent orchestrates tools and sub-agents — and in turn authors, deploys, verifies, and debugs other agents. The management plane (authoring/deployment) is separated from the runtime plane (execution/streaming) for auth boundaries, and only irreversible production deploys need human approval (HITL).',
  },
  techStack: [
    'Python',
    'MCP (Model Context Protocol)',
    'Kubernetes',
    'Redis Stream',
    'SSE',
    'TypeScript/React',
    'Loki',
    'Prometheus',
  ],
  peekLine: {
    ko: '오케스트레이션 계층 설계·구현 — 의도 분류부터 서브에이전트 위임까지',
    en: 'Built the orchestration layer, from intent classification to sub-agent delegation.',
  },
  keyAchievements: [
    {
      ko: '오케스트레이션 계층 설계·구현 (의도 분류 → 도구 선택 → 병렬 실행 → 서브에이전트 위임)',
      en: 'Built the orchestration layer (intent classification → tool selection → parallel execution → sub-agent delegation)',
    },
    {
      ko: '추론 모델/일반 모델별 도구 선택 전략을 이원화해 백본 모델 교체 시 시나리오 무수정 대응',
      en: 'Split tool-selection strategy by reasoning vs. general models so scenarios survive a backbone swap unchanged',
    },
    {
      ko: '외부 MCP 서버 30종 이상(쿠버네티스 제어, 관측성, 코드 편집 등)을 표준 규약으로 에이전트 도구화',
      en: 'Standardized 30+ external MCP servers (Kubernetes control, observability, code editing) into agent tools',
    },
    {
      ko: '저작 → 검증 → 배포 → 실행 테스트 → 로그 기반 디버깅을 스스로 반복하는 자율 에이전트 하네스',
      en: 'Agentic harness that runs author → verify → deploy → smoke-test → log-driven debugging on its own',
    },
    {
      ko: '작업별 절차 문서를 필요할 때만 불러오는 스킬 체계로 시스템 프롬프트 26% 감축 (69,943자 → 51,449자)',
      en: 'Loading per-task procedure docs on demand as skills cut the system prompt 26% (69,943 → 51,449 chars)',
    },
    {
      ko: '추론 과정·도구 호출·코드 diff 실시간 스트리밍, 프로바이더와 무관한 추론 요약 추출(2경로)',
      en: 'Live streaming of reasoning, tool calls, and code diffs, with provider-agnostic reasoning summaries (two extraction paths)',
    },
  ],
  features: [
    'Multi-Agent Orchestration',
    'MCP Tool Integration (30+)',
    'Autonomous Agent Harness',
    'Two-Plane Architecture',
    'Human-in-the-Loop Gating',
    'Glass-box Streaming',
  ],
  company: {
    ko: '(주)포지큐브',
    en: 'Posicube Inc.',
  },
  period: {
    ko: '2025.06 ~ 현재',
    en: 'Jun 2025 ~ Present',
  },
  detail: {
    architecture: [
      {
        title: {
          ko: '자율 에이전트 라이프사이클',
          en: 'Autonomous Agent Lifecycle',
        },
        description: {
          ko: '하네스 에이전트가 요구 분석부터 저작·검증·배포·실행 테스트·실행 추적까지 스스로 도는 루프. 되돌릴 수 없는 배포만 사람이 승인하는 HITL 하드게이트를 통과하고, 결함이 발견되면 저작 단계로 되돌아가 수정합니다.',
          en: 'The harness agent closes the loop on its own — requirement analysis, authoring, validation, deployment, smoke testing, and execution tracing. Only irreversible deploys pass through a human-approval hard gate, and any defect loops back to authoring for a fix.',
        },
        mermaidFilePath: {
          ko: '/architecture/agentic-harness/harness-lifecycle.mmd',
          en: '/architecture/agentic-harness/harness-lifecycle-en.mmd',
        },
      },
      {
        title: {
          ko: '2-플레인 아키텍처',
          en: 'Two-Plane Architecture',
        },
        description: {
          ko: '저작·배포를 담당하는 관리 플레인과 실행·스트리밍을 담당하는 런타임 플레인을 분리한 구조. 모든 관리 작업은 인증 게이트웨이를 경유하고, 실행 테스트만 런타임 플레인으로 갑니다.',
          en: 'The management plane (authoring, deployment) is separated from the runtime plane (execution, streaming). Every management action goes through the auth gateway; only smoke tests touch the runtime plane.',
        },
        mermaidFilePath: {
          ko: '/architecture/agentic-harness/two-plane.mmd',
          en: '/architecture/agentic-harness/two-plane-en.mmd',
        },
      },
    ],
  },
  featured: true,
  order: 2,
  scope: 'company',
} satisfies Project;

export default project;
