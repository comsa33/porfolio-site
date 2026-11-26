import type { Project } from '@/types';

const project = {
  id: 'agent-team-ops',
  title: {
    ko: 'Claude Code 에이전트 팀 운영',
    en: 'Running a Claude Code Agent Team',
  },
  shortDescription: {
    ko: '역할별 Claude Code 세션으로 개발·검토·실측을 나눠 운영하는 방식과 규칙',
    en: 'How I split development, review, and live verification across role-based Claude Code sessions, and the rules that hold it together',
  },
  fullDescription: {
    ko: '사내 서비스 3종(에이전트 편집·실행 엔진, 사용자 기억, 품질 평가)을 역할별 Claude Code 세션으로 개발합니다. 총괄 세션이 일을 나누고 구현·검토·실측은 서로 다른 세션이 맡습니다. 범위·설계 선택·릴리스는 직접 정하고, 사고가 나면 규칙을 고쳐 문서와 CI에 남깁니다.',
    en: 'Three in-house services (an agent authoring and execution engine, user memory, and quality evaluation) are developed by role-based Claude Code sessions. A lead session splits the work; implementation, review, and live verification each run in a different session. Scope, design choices, and releases stay with me, and when something goes wrong the rule is fixed in the docs and in CI.',
  },
  techStack: ['Claude Code', 'Git worktree', 'Gitea Actions', 'pytest', 'Kubernetes'],
  peekLine: {
    ko: '작성한 세션은 승인하지 못하고, 릴리스 태그는 사람만 찍는다',
    en: 'The session that wrote it cannot approve it, and only a person tags a release.',
  },
  keyAchievements: [
    {
      ko: '총괄·구현·검토·실측·배포로 역할을 나눈 세션 운영, 세션끼리는 메시지와 인계 파일로 일을 주고받음',
      en: 'Sessions split by role: lead, implementation, review, live verification, deployment. They hand work over through messages and handoff files',
    },
    {
      ko: '작성과 검토를 다른 세션으로 분리. 검토 세션은 승인한 커밋 해시를 적고 그 해시 그대로만 머지, 커밋이 추가되면 그 커밋을 다시 검토',
      en: 'Writing and reviewing happen in different sessions. The reviewer records the commit hash it approved and only that hash is merged; any added commit is reviewed again',
    },
    {
      ko: '세션이 지시 없이 릴리스 태그를 찍은 뒤 규칙 변경: 태그는 지시가 있을 때만, 검수를 통과한 PR의 머지만 위임',
      en: 'After a session tagged a release without being told to, the rule changed: tags only on instruction, and only merging reviewed PRs is delegated',
    },
    {
      ko: 'CI가 통과로 표시됐지만 테스트 일부가 건너뛰어지던 것을 로컬 실행 수와 대조해 발견 (두 서비스에서 392개 중 186개, 2,305개 중 1,962개만 실행). 건너뛴 테스트가 있으면 실패하도록 변경',
      en: 'CI showed green while part of the suite was skipped; comparing against local runs exposed it (186 of 392 and 1,962 of 2,305 tests ran in two services). A skipped test now fails the run',
    },
    {
      ko: '범위·설계 선택·릴리스는 직접 결정. 세션은 비교안과 추천을 올리고, 구현 세부와 리뷰 지적 반영은 세션이 결정',
      en: 'Scope, design choices, and releases are my decisions. Sessions bring options with a recommendation, and settle implementation details and review follow-ups themselves',
    },
    {
      ko: '보고 형식 고정: 한 줄 결론, 결정 필요 여부, 근거. 총괄 세션은 작업자 보고를 그대로 전달하지 않고 검수를 통과한 것만 보고',
      en: 'Fixed report format: one-line conclusion, whether a decision is needed, evidence. The lead session reports only what passed review, never a worker’s report as is',
    },
    {
      ko: '일의 성격에 따라 모델 배정 (배포는 가벼운 모델, 리뷰와 큰 설계는 큰 모델)',
      en: 'Models assigned by the kind of work (a light model for deployment, larger ones for review and major design)',
    },
  ],
  features: [
    'Role-based Agent Sessions',
    'Author/Reviewer Separation',
    'Hash-pinned Approval',
    'Human-gated Releases',
    'Skip-detecting CI',
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
  order: 1,
  scope: 'company',
} satisfies Project;

export default project;
