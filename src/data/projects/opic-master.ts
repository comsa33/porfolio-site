import type { Project } from '@/types';

// Cumulative users, as a floor. "N+" stays true while the app keeps growing,
// so it only needs raising now and then, never correcting. One number, used
// in both places below.
const USERS = 800;

const project = {
  id: 'opic-master',
  title: 'OPIc Master',
  shortDescription: {
    ko: '강의 10년 경험으로 기획한 AI 채점 OPIc 모의고사 앱, 혼자 운영',
    en: 'An AI-graded OPIc mock-test app planned from ten years of teaching, run solo',
  },
  fullDescription: {
    ko: '토익·오픽 강의 10년의 경험으로 기획해 Google Play/App Store에 출시한 OPIc 모의고사 앱입니다. 개발은 Claude Code 세션 팀에 맡기고, 무엇을 만들지와 돈이 걸린 결정은 가입·결제·원가를 직접 조회해 내립니다.',
    en: 'An OPIc mock-test app on Google Play and the App Store, planned from ten years of teaching TOEIC and OPIc. Development is delegated to a team of Claude Code sessions; what to build and anything involving money I decide myself, from signup, payment, and cost data.',
  },
  techStack: [
    'Next.js 16',
    'React 19',
    'Capacitor',
    'TypeScript',
    'Prisma',
    'Gemini AI',
    'TossPayments',
  ],
  peekLine: {
    ko: `Web·iOS·Android 동시 출시, 누적 사용자 ${USERS}명 이상`,
    en: `Shipped on web, iOS and Android, ${USERS}+ cumulative users.`,
  },
  keyAchievements: [
    {
      ko: `Web·iOS·Android 출시, 누적 사용자 ${USERS}명 이상, 유료 결제 운영`,
      en: `Live on web, iOS and Android with ${USERS}+ cumulative users and paid plans`,
    },
    {
      ko: '토익·오픽 강의 10년 경험으로 기획, 개발은 Claude Code 세션 팀에 위임',
      en: 'Planned from ten years of teaching TOEIC and OPIc; development delegated to a team of Claude Code sessions',
    },
    {
      ko: '가입이 27% 줄었을 때 검색 트렌드와 대조해 장애가 아닌 계절 수요임을 확인, 연 2회 피크에 맞추는 전략으로 전환',
      en: 'When signups fell 27%, checked them against search trends: seasonal demand, not an outage. Strategy now follows the two yearly peaks',
    },
    {
      ko: '무료 크레딧 축소안을 결제 기록으로 검증. 결제는 무료분을 다 쓴 직후에 일어나 줄이면 손해라 현행 유지',
      en: 'Tested a plan to cut free credits against payment records: people pay right after the free credits run out, so cutting would lose money. Kept as is',
    },
  ],
  posts: [
    {
      slug: 'measuring-abuse-then-doing-nothing',
      title: {
        ko: '다계정 파밍 피해액을 확인해 보니 $0.27',
        en: 'Multi-account farming cost us $0.27',
      },
    },
    {
      slug: 'where-is-midnight',
      title: {
        ko: 'UTC 서버에서 생긴 KST 경계 버그 여섯 개',
        en: 'Six KST boundary bugs on a UTC server',
      },
    },
    {
      slug: 'blamed-ios-twice',
      title: {
        ko: 'moof 로 시작하는 파일',
        en: 'A file that starts with moof',
      },
    },
    {
      slug: 'everything-but-the-payment-test',
      title: {
        ko: 'R8 최적화가 결제 플러그인을 지웠다',
        en: 'R8 optimisation deleted the payment plugin',
      },
    },
    {
      slug: 'signups-down-revenue-up',
      title: {
        ko: '가입이 27% 줄었는데 매출은 최고였던 주',
        en: 'The week signups fell 27% and revenue hit a high',
      },
    },
    {
      slug: 'nobody-reads-the-banner',
      title: {
        ko: '사람들은 저런 거 잘 안 읽어',
        en: "People don't read those things",
      },
    },
  ],
  features: [
    'Real-time AI Feedback',
    'Cross-platform (Capacitor)',
    'SRS Flashcards',
    'Inline Grammar Correction',
    'Structured Shadowing',
  ],
  platformLinks: {
    web: 'https://opic.po24lio.com',
    ios: 'https://apps.apple.com/kr/app/%EC%98%A4%ED%94%BD-%EB%A7%88%EC%8A%A4%ED%84%B0/id6757357743',
    android: 'https://play.google.com/store/apps/details?id=com.ruiboss.opic',
  },
  company: {
    ko: '개인 프로젝트 (루이보스)',
    en: 'Personal Project (Rooibos)',
  },
  period: {
    ko: '2025.12 ~ 현재',
    en: 'Dec 2025 ~ Present',
  },
  detail: {
    architecture: [
      {
        title: {
          ko: 'AI 피드백 파이프라인',
          en: 'AI Feedback Pipeline',
        },
        description: {
          ko: '음성 녹음부터 Gemini AI 분석, 구조화된 피드백 렌더링까지의 전체 파이프라인. STT → 5개 영역 분석 → 인라인 문법 교정 → 모범 답안 생성 흐름.',
          en: 'Complete pipeline from audio recording through Gemini AI analysis to structured feedback rendering. STT → 5-domain analysis → inline grammar correction → model answer generation flow.',
        },
        mermaidFilePath: {
          ko: '/architecture/opic-master/feedback-pipeline.mmd',
          en: '/architecture/opic-master/feedback-pipeline-en.mmd',
        },
      },
      {
        title: {
          ko: '크로스플랫폼 아키텍처',
          en: 'Cross-platform Architecture',
        },
        description: {
          ko: 'Next.js 웹앱을 Capacitor로 래핑하여 iOS/Android 네이티브 앱 생성. 네이티브 플러그인 통합 및 플랫폼별 분기 처리.',
          en: 'Wrapping Next.js web app with Capacitor to create iOS/Android native apps. Native plugin integration and platform-specific branching.',
        },
        mermaidFilePath: {
          ko: '/architecture/opic-master/cross-platform.mmd',
          en: '/architecture/opic-master/cross-platform-en.mmd',
        },
      },
    ],
  },
  featured: false,
  order: 14,
  scope: 'personal',
} satisfies Project;

export default project;
