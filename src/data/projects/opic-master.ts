import type { Project } from '@/types';

const project = {
  id: 'opic-master',
  title: 'OPIc Master',
  shortDescription: {
    ko: 'AI 기반 OPIc 실전 모의고사 & 피드백 앱',
    en: 'AI-Powered OPIc Mock Test & Feedback App',
  },
  fullDescription: {
    ko: 'Google Play/App Store 출시된 크로스플랫폼 OPIc 학습 앱입니다. Gemini AI 기반 실시간 음성 분석으로 문법/발음/유창성 피드백을 제공하고, SRS(간격반복) 학습 시스템과 구조화된 모범 답안 쉐도잉 기능을 통해 효과적인 OPIc 준비를 지원합니다.',
    en: 'Cross-platform OPIc learning app published on Google Play/App Store. Provides real-time grammar/pronunciation/fluency feedback through Gemini AI-based voice analysis, with SRS flashcard system and structured model answer shadowing for effective OPIc preparation.',
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
  keyAchievements: [
    {
      ko: 'Google Play/App Store 동시 출시 (Web + iOS + Android)',
      en: 'Published on both Google Play & App Store (Web + iOS + Android)',
    },
    {
      ko: 'Gemini AI 기반 실시간 STT 분석 & 5개 영역 피드백 (문법/어휘/발음/유창성/내용)',
      en: 'Real-time STT analysis & 5-domain feedback with Gemini AI (Grammar/Vocabulary/Pronunciation/Fluency/Content)',
    },
    {
      ko: '인라인 문법 교정 UI (탭하여 수정 내용 확인)',
      en: 'Inline grammar correction UI (tap to view fix details)',
    },
    {
      ko: 'SRS(간격반복) 기반 표현 학습 시스템',
      en: 'SRS-based expression learning system',
    },
    {
      ko: '구조화된 모범 답안 쉐도잉 (OPIc 템플릿 학습)',
      en: 'Structured model answer shadowing (OPIc template learning)',
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
    problemSolving: [
      {
        id: 'inline-grammar-correction',
        title: {
          ko: '인라인 문법 교정: 직관적 피드백 UX',
          en: 'Inline Grammar Correction: Intuitive Feedback UX',
        },
        category: {
          ko: 'UX설계',
          en: 'UX Design',
        },
        icon: '✏️',
        problem: {
          ko: '**이슈**: 문법 오류를 별도 섹션에 리스트로 표시하면 사용자가 자신의 답변에서 어디가 틀렸는지 찾기 어려움. 팝오버 방식은 모바일에서 사용성이 떨어지고, 정적 diff는 UI가 복잡해지는 문제.',
          en: '**Issue**: Displaying grammar errors as a separate list made it difficult for users to locate errors in their answers. Popovers were unreliable on mobile, and static diffs cluttered the UI.',
        },
        solution: {
          ko: '**해결**: 인라인 확장형 아코디언 패턴 도입. 틀린 표현에 밑줄을 표시하고, 탭하면 해당 위치에서 바로 수정 내용과 설명이 펼쳐지는 UX. 텍스트 매칭 알고리즘으로 AI 인덱스 오류에도 안정적으로 하이라이트 표시.',
          en: '**Solution**: Introduced inline-expandable accordion pattern. Underlined incorrect phrases that expand correction details on tap. Implemented text-matching algorithm for reliable highlighting even with AI index errors.',
        },
        technicalDetails: {
          ko: `\`\`\`tsx
// 인라인 확장 패턴
<span className={styles.correctionWrapper}>
  <span 
    className={\`\${styles.originalText} \${isExpanded ? styles.expanded : ''}\`}
    onClick={() => toggleExpand(idx)}
  >
    {original}
  </span>
  {isExpanded && (
    <span className={styles.correctionDetail}>
      <span className={styles.arrow}>→</span>
      <span className={styles.correctedText}>{corrected}</span>
      {explanation && <span className={styles.explanation}>{explanation}</span>}
    </span>
  )}
</span>
\`\`\`

**핵심**: Case-insensitive 텍스트 매칭으로 안정성 확보`,
          en: `\`\`\`tsx
// Inline expansion pattern
<span className={styles.correctionWrapper}>
  <span 
    className={\`\${styles.originalText} \${isExpanded ? styles.expanded : ''}\`}
    onClick={() => toggleExpand(idx)}
  >
    {original}
  </span>
  {isExpanded && (
    <span className={styles.correctionDetail}>
      <span className={styles.arrow}>→</span>
      <span className={styles.correctedText}>{corrected}</span>
      {explanation && <span className={styles.explanation}>{explanation}</span>}
    </span>
  )}
</span>
\`\`\`

**Key**: Case-insensitive text matching for reliability`,
        },
        csFoundations: [
          'Progressive Disclosure',
          'Text Matching Algorithm',
          'Accessible UI',
          'Mobile-first Design',
        ],
        impact: {
          ko: '**성과**: 팝오버에서 인라인 표시로 전환해 모바일 터치에서 오동작 없이 문법 교정 확인 가능.',
          en: '**Impact**: Switching from popovers to inline display makes grammar corrections reliably viewable on mobile touch.',
        },
        commits: [],
      },
      {
        id: 'srs-flashcard-system',
        title: {
          ko: 'SRS 간격반복 학습 시스템',
          en: 'SRS Spaced Repetition System',
        },
        category: {
          ko: '학습알고리즘',
          en: 'Learning Algorithm',
        },
        icon: '🧠',
        problem: {
          ko: "**이슈**: 단순 플래시카드 학습은 효율이 떨어지고, 사용자가 복습 시점을 직접 관리하기 어려움. 학습 완료 후 '막다른 길' 느낌으로 이탈 발생.",
          en: "**Issue**: Simple flashcard learning was inefficient, and users struggled to manage review timing. Post-completion 'dead end' feeling caused user drop-off.",
        },
        solution: {
          ko: "**해결**: SM-2 기반 SRS 알고리즘 구현. 정답/오답에 따라 다음 복습 간격을 자동 조절하고, 'Due Cards' 카운터로 복습 필요 카드를 실시간 표시. 완료 화면에서 '새 학습'/'복습' 분기를 명시적으로 제공.",
          en: "**Solution**: Implemented SM-2 based SRS algorithm. Auto-adjusts next review interval based on correct/incorrect answers. Displays 'Due Cards' counter in real-time. Provides explicit 'New Learning'/'Review' branching on completion screen.",
        },
        technicalDetails: {
          ko: `\`\`\`typescript
// SRS 간격 계산
function calculateNextReview(card: Card, quality: number) {
  const { easeFactor, interval, repetitions } = card;
  
  if (quality >= 3) { // 정답
    const newInterval = repetitions === 0 ? 1 
      : repetitions === 1 ? 6 
      : Math.round(interval * easeFactor);
    return {
      interval: newInterval,
      repetitions: repetitions + 1,
      easeFactor: Math.max(1.3, easeFactor + 0.1 - (5 - quality) * 0.08)
    };
  } else { // 오답
    return { interval: 1, repetitions: 0, easeFactor };
  }
}
\`\`\`

**핵심**: SM-2 알고리즘 기반 망각 곡선 최적화`,
          en: `\`\`\`typescript
// SRS interval calculation
function calculateNextReview(card: Card, quality: number) {
  const { easeFactor, interval, repetitions } = card;
  
  if (quality >= 3) { // Correct
    const newInterval = repetitions === 0 ? 1 
      : repetitions === 1 ? 6 
      : Math.round(interval * easeFactor);
    return {
      interval: newInterval,
      repetitions: repetitions + 1,
      easeFactor: Math.max(1.3, easeFactor + 0.1 - (5 - quality) * 0.08)
    };
  } else { // Incorrect
    return { interval: 1, repetitions: 0, easeFactor };
  }
}
\`\`\`

**Key**: SM-2 algorithm optimizing forgetting curve`,
        },
        csFoundations: ['Spaced Repetition', 'SM-2 Algorithm', 'Learning Science', 'State Machine'],
        impact: {
          ko: '**성과**: SM-2 기반 간격 반복으로 복습 타이밍 자동화 — 일정 관리 없이 망각 곡선에 맞춰 복습 제시.',
          en: '**Impact**: SM-2 spaced repetition automates review timing — reviews follow the forgetting curve without manual scheduling.',
        },
        commits: [],
      },
      {
        id: 'cross-platform-iap',
        title: {
          ko: '크로스플랫폼 인앱결제 통합',
          en: 'Cross-platform In-App Purchase Integration',
        },
        category: {
          ko: '결제',
          en: 'Payments',
        },
        icon: '�',
        problem: {
          ko: '**이슈**: Web은 TossPayments, iOS는 App Store IAP, Android는 Google Play Billing으로 결제 시스템이 완전히 분리. 각 플랫폼별 영수증 검증 로직 필요. 환불 처리 시 프리미엄 권한 동기화 문제.',
          en: '**Issue**: Completely separate payment systems - Web (TossPayments), iOS (App Store IAP), Android (Google Play Billing). Each platform required different receipt verification logic. Premium access sync issues during refunds.',
        },
        solution: {
          ko: '**해결**: 플랫폼별 전용 결제 API 엔드포인트 구현. Google/Apple 서버사이드 영수증 검증 로직 구축. Webhook으로 환불 이벤트 수신하여 프리미엄 권한 즉시 취소. 결제 상태를 DB에서 통합 관리.',
          en: '**Solution**: Implemented platform-specific payment API endpoints. Built server-side receipt verification for Google/Apple. Received refund events via webhooks to immediately revoke premium access. Unified payment status management in DB.',
        },
        technicalDetails: {
          ko: `\`\`\`typescript
// Google Play 영수증 검증 API
export async function POST(request: Request) {
  const { purchaseToken, productId } = await request.json();
  
  // 1. Google Play API로 영수증 검증
  const auth = new GoogleAuth({ credentials });
  const client = await auth.getClient();
  const response = await client.request({
    url: \`https://androidpublisher.googleapis.com/...\`,
    method: 'GET'
  });
  
  // 2. 결제 상태 확인
  if (response.data.purchaseState !== 0) {
    throw new Error('Invalid purchase');
  }
  
  // 3. DB에 결제 기록 & 프리미엄 권한 부여
  await prisma.user.update({
    where: { id: userId },
    data: { tier: 'PREMIUM', premiumExpiresAt }
  });
}
\`\`\`

**핵심**: 플랫폼별 영수증 검증 + Webhook 환불 처리`,
          en: `\`\`\`typescript
// Google Play receipt verification API
export async function POST(request: Request) {
  const { purchaseToken, productId } = await request.json();
  
  // 1. Verify receipt with Google Play API
  const auth = new GoogleAuth({ credentials });
  const client = await auth.getClient();
  const response = await client.request({
    url: \`https://androidpublisher.googleapis.com/...\`,
    method: 'GET'
  });
  
  // 2. Check purchase state
  if (response.data.purchaseState !== 0) {
    throw new Error('Invalid purchase');
  }
  
  // 3. Record payment & grant premium
  await prisma.user.update({
    where: { id: userId },
    data: { tier: 'PREMIUM', premiumExpiresAt }
  });
}
\`\`\`

**Key**: Platform-specific receipt verification + Webhook refund handling`,
        },
        csFoundations: [
          'Payment Gateway Integration',
          'Receipt Verification',
          'Webhook Processing',
          'Cross-platform Development',
        ],
        impact: {
          ko: '**성과**: Web/iOS/Android 3개 플랫폼 결제를 단일 흐름으로 통합 — 환불 시 권한 자동 회수까지 서버에서 일원 처리.',
          en: '**Impact**: One payment flow across Web/iOS/Android — entitlement auto-revocation on refund handled server-side.',
        },
        commits: ['66d81f6', 'e9a79a4', '632c2b4'],
      },
    ],
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
  order: 10,
  scope: 'personal',
} satisfies Project;

export default project;
