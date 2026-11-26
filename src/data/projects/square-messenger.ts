import type { Project } from '@/types';

const project = {
  id: 'square-messenger',
  title: 'Square Messenger',
  shortDescription: {
    ko: '전화번호를 서버에 남기지 않는 프라이버시 중심 메신저, 기획하고 혼자 운영',
    en: 'A privacy-first messenger that keeps no phone numbers on the server, planned and run solo',
  },
  fullDescription: {
    ko: 'Google Play/App Store에 출시한 프라이버시 중심 메신저입니다. 어떤 정보도 한쪽에만 불리하게 드러나지 않는다는 원칙을 정했고, 개발은 AI 코딩 에이전트에 맡겼습니다.',
    en: 'A privacy-first messenger on Google Play and the App Store. I set one principle, that no information is ever exposed to one side’s disadvantage, and delegated development to AI coding agents.',
  },
  techStack: ['Flutter', 'Dart', 'Firebase', 'Cloud Functions', 'TypeScript', 'Firestore', 'FCM'],
  peekLine: {
    ko: '서버에 전화번호 원본을 남기지 않는 메신저',
    en: 'A messenger that keeps no raw phone numbers on the server.',
  },
  keyAchievements: [
    {
      ko: 'Google Play·App Store 출시, 개발은 AI 코딩 에이전트에 위임',
      en: 'Live on Google Play and the App Store; development delegated to AI coding agents',
    },
    {
      ko: '친구 찾기에 전화번호 원본을 서버로 보내지 않음, 기기에서 해시한 값만 전송',
      en: 'Friend finding never sends raw phone numbers to the server, only values hashed on the device',
    },
    {
      ko: '익명 대화의 실명 공개는 양쪽이 모두 요청했을 때만',
      en: 'In anonymous chats, real names are revealed only when both sides ask',
    },
    {
      ko: '차단해도 상대에게 차단 사실이 드러나지 않음',
      en: 'Blocking someone never tells them they were blocked',
    },
    {
      ko: '한쪽이 채팅방을 나가도 상대의 대화 기록은 유지',
      en: 'When one person leaves a chat, the other keeps their history',
    },
  ],
  features: [
    'Privacy-First Design',
    'Anonymous Connect',
    'Square Log Feed',
    'Real-time Chat',
    'Contact Sync',
  ],
  platformLinks: {
    web: 'https://square.po24lio.com',
    ios: 'https://apps.apple.com/app/id6758040597',
    android: 'https://play.google.com/store/apps/details?id=com.ruiboss.square',
  },
  company: {
    ko: '개인 프로젝트 (루이보스)',
    en: 'Personal Project (Rooibos)',
  },
  period: {
    ko: '2024.11 ~ 현재',
    en: 'Nov 2024 ~ Present',
  },
  detail: {
    architecture: [
      {
        title: {
          ko: 'Contact Sync 시스템 플로우',
          en: 'Contact Sync System Flow',
        },
        description: {
          ko: '클라이언트 연락처 해싱부터 Cloud Functions 매칭, Firestore 업데이트까지의 연락처 동기화 흐름.',
          en: 'Contact sync flow from client-side hashing through Cloud Functions matching to Firestore updates.',
        },
        mermaidFilePath: {
          ko: '/architecture/square/contact-sync-flow.mmd',
          en: '/architecture/square/contact-sync-flow-en.mmd',
        },
      },
    ],
  },
  featured: false,
  order: 15,
  scope: 'personal',
} satisfies Project;

export default project;
