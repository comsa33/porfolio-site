import type { Project } from '@/types';

const project = {
  id: 'agent-team-ops',
  title: {
    ko: 'Claude Code 에이전트 팀 운영',
    en: 'Running a Claude Code Agent Team',
  },
  shortDescription: {
    ko: '역할별 Claude Code 세션이 개발·검토·실측을 나눠 맡고, 결정과 릴리스는 직접',
    en: 'Role-based Claude Code sessions build, review, and verify; decisions and releases stay with me',
  },
  fullDescription: {
    ko: '사내 서비스 3종을 역할별 Claude Code 세션으로 개발합니다. 일이 잘못될 때마다 규칙을 고쳐 문서와 CI에 남깁니다.',
    en: 'Three in-house services are developed by role-based Claude Code sessions. Each time something goes wrong, the rule is fixed in the docs and in CI.',
  },
  techStack: ['Claude Code', 'Git worktree', 'Gitea Actions', 'pytest', 'Kubernetes'],
  peekLine: {
    ko: '작성한 세션은 승인하지 못하고, 릴리스 태그는 사람만 찍는다',
    en: 'The session that wrote it cannot approve it, and only a person tags a release.',
  },
  keyAchievements: [
    {
      ko: '총괄·구현·검토·실측·배포로 세션 역할 분리, 작성한 세션은 승인 불가',
      en: 'Sessions split into lead, implementation, review, verification, and deployment; the session that wrote a change cannot approve it',
    },
    {
      ko: '검토가 승인한 커밋 해시 그대로만 머지',
      en: 'Only the exact commit hash a reviewer approved gets merged',
    },
    {
      ko: '세션이 지시 없이 릴리스 태그를 찍은 뒤, 태그는 사람 지시가 있을 때만',
      en: 'After a session tagged a release unprompted, tags happen only on a person’s instruction',
    },
    {
      ko: 'CI가 통과인데 테스트 392개 중 186개만 돌고 있던 것을 발견, 건너뛰면 실패하도록 변경',
      en: 'Found CI passing while running only 186 of 392 tests; a skipped test now fails the run',
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
