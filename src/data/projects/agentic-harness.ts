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
    ko: '에이전트가 여러 도구·서브에이전트를 조율하고, 나아가 에이전트가 스스로 에이전트를 만들어 배포·검증·디버깅하는 자율 제어 체계를 설계·구현했습니다. 관리 플레인(저작·배포)과 런타임 플레인(실행·스트리밍)을 분리한 2-플레인 아키텍처로 인증·권한 경계를 확보하고, 되돌릴 수 없는 상용 배포만 사람이 승인하도록(HITL) 자율성과 통제의 경계를 명시적으로 그었습니다.',
    en: 'Designed and built a control system in which an agent orchestrates tools and sub-agents — and ultimately authors, deploys, verifies, and debugs other agents. A two-plane architecture separates the management plane (authoring/deployment) from the runtime plane (execution/streaming) to establish clear auth boundaries, with human approval (HITL) required only for irreversible production deployments.',
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
  keyAchievements: [
    {
      ko: '오케스트레이션 계층 설계·구현 — 의도 분류 → 도구 선택 → 병렬 실행 → 서브에이전트 위임',
      en: 'Built the orchestration layer — intent classification → tool selection → parallel execution → sub-agent delegation',
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
      ko: '자율 에이전트 하네스 — 저작 → 검증 → 배포 → 실행 테스트 → 로그 기반 디버깅까지 스스로 도는 풀 라이프사이클 루프',
      en: 'An agentic harness that closes the full lifecycle loop on its own: author → verify → deploy → smoke-test → log-driven debugging',
    },
    {
      ko: '컨텍스트·비용 효율화 — 작업별 절차 문서를 온디맨드 로드하는 스킬 체계로 시스템 프롬프트 26% 감축 (69,943자 → 51,449자), 기능 회귀 0',
      en: 'Context and cost efficiency — an on-demand skill system for per-task procedure docs cut the system prompt 26% (69,943 → 51,449 chars) with zero functional regression',
    },
    {
      ko: '글래스박스 — 추론 과정·도구 호출·코드 diff를 실시간 스트리밍으로 노출, 추론 요약을 2경로 하이브리드로 추출해 프로바이더 무관하게 제공',
      en: 'Glass-box execution — streams reasoning, tool calls, and code diffs live, extracting reasoning summaries through a dual-path hybrid that stays provider-agnostic',
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
  repoPath: 'agentic-harness',
  company: {
    ko: '(주)포지큐브',
    en: 'Posicube Inc.',
  },
  period: {
    ko: '2025.06 ~ 2026.07',
    en: 'Jun 2025 ~ Jul 2026',
  },
  featured: true,
  order: 1,
  scope: 'company',
} satisfies Project;

export default project;
