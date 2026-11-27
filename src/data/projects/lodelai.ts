import type { Project } from '@/types';

const project = {
  id: 'lodelai',
  title: 'lodelai',
  shortDescription: {
    ko: '사람과 각자의 AI 에이전트가 한 대화에서 같이 일하는 메신저, 기획하고 혼자 운영',
    en: 'A messenger where people and their AI agents work in one conversation, planned and run solo',
  },
  fullDescription: {
    ko: '사람이 협업의 병목이라는 생각에서 시작한 메신저입니다. 내 에이전트가 동료의 에이전트에게 직접 묻고 일을 맡기며, 안전은 앱 정책이 맡고 사람은 지켜보다 필요할 때만 끼어듭니다. 개발은 Claude Code 세션 팀에 맡겼고, 그 세션들도 이 앱으로 일을 주고받습니다.',
    en: 'A messenger that started from the idea that people are the bottleneck in collaboration. My agent asks a colleague’s agent directly and hands work over; app policy handles safety, and people watch and step in only when needed. Development is delegated to a team of Claude Code sessions, which hand work to each other through this app.',
  },
  techStack: ['Rust', 'Tauri', 'React', 'TypeScript', 'MCP'],
  peekLine: {
    ko: '내 에이전트가 동료의 에이전트에게 직접 묻고 일을 맡기는 메신저',
    en: 'A messenger where my agent asks a colleague’s agent directly and hands work over.',
  },
  keyAchievements: [
    {
      ko: 'Mac 앱 공개 배포, 초대한 동료와 베타 사용자가 사용 중',
      en: 'Mac app publicly available, in use by invited colleagues and beta users',
    },
    {
      ko: '협업 시나리오 시험에서 14분에 32번 눌러야 했던 뒤, 사람이 누르는 단계를 줄이는 것을 설계 기준으로 결정',
      en: 'A collaboration test took 32 clicks in 14 minutes; cutting the steps a person has to click became the design rule',
    },
    {
      ko: '안전장치는 사람 승인 대신 앱 정책으로: 폴더 밖 접근 차단, 비밀값 감지, 받은 글은 동료의 주장으로 표기',
      en: 'Safety comes from app policy, not human approval: no access outside the folder, secret detection, and received text is labeled as a colleague’s claim',
    },
    {
      ko: '요청을 질문과 작업으로 구분, 질문으로 온 요청에는 읽고 답하기만 허용',
      en: 'Requests are either questions or tasks; a question only allows reading and answering',
    },
  ],
  features: [
    'Agent-to-Agent Messaging',
    'Policy-based Safety',
    'Question / Task Requests',
    'Desktop & Mobile',
  ],
  platformLinks: {
    web: 'https://lodelai.ruiboss.com',
  },
  company: {
    ko: '개인 프로젝트 (루이보스)',
    en: 'Personal Project (Rooibos)',
  },
  period: {
    ko: '2026.10 ~ 현재',
    en: 'Oct 2026 ~ Present',
  },
  detail: {
    architecture: [
      {
        title: {
          ko: '메시지 한 건이 오가는 구조',
          en: 'How one message travels',
        },
        description: {
          ko: '세션이 도구로 보낸 메시지는 앱 코어의 정책 검사를 거쳐 암호화된 채 중계 서버를 지나 동료의 앱으로 갑니다. 받은 쪽 세션에는 동료의 요청으로 표기해 전달하고, 세션이 도구를 쓸 때마다 앱이 먼저 검사합니다.',
          en: 'A message a session sends through a tool passes the app core’s policy checks, crosses the relay encrypted, and reaches the colleague’s app. The receiving session gets it labeled as a colleague’s request, and the app checks every tool call that session then makes.',
        },
        mermaidFilePath: {
          ko: '/architecture/lodelai/message-flow.mmd',
          en: '/architecture/lodelai/message-flow-en.mmd',
        },
      },
    ],
  },
  featured: true,
  order: 3,
  scope: 'personal',
} satisfies Project;

export default project;
