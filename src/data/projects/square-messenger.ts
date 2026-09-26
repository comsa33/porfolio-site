import type { Project } from '@/types';

const project = {
  id: 'square-messenger',
  title: 'Square Messenger',
  shortDescription: {
    ko: 'Privacy-First 미니멀 소셜 메신저 앱',
    en: 'Privacy-First Minimalist Social Messenger App',
  },
  fullDescription: {
    ko: "Firebase·Cloud Functions로 만든 프라이버시 중심 메신저로, Google Play/App Store에 출시했습니다. 전화번호 해시로 친구를 찾고, 익명 커넥트와 '스퀘어 로그' 피드를 제공합니다.",
    en: "A privacy-focused messenger built on Firebase and Cloud Functions, published on Google Play/App Store. Friends are found through phone-number hashes, with anonymous 'Connect' and a 'Square Log' feed.",
  },
  techStack: ['Flutter', 'Dart', 'Firebase', 'Cloud Functions', 'TypeScript', 'Firestore', 'FCM'],
  peekLine: {
    ko: 'SHA-256 연락처 해싱 — 서버에 원본 전화번호를 남기지 않는 친구 찾기',
    en: 'SHA-256 contact hashing — friend finding with zero raw phone numbers stored.',
  },
  keyAchievements: [
    {
      ko: 'SHA-256 연락처 해싱으로 원본 전화번호 없이 친구 찾기',
      en: 'Friend finding via SHA-256 contact hashing, no raw phone numbers on the server',
    },
    {
      ko: 'Asymmetric Soft Delete 패턴으로 채팅방 비대칭 삭제 구현',
      en: 'Implemented asymmetric chat room deletion with Soft Delete pattern',
    },
    {
      ko: 'Shadow Block으로 차단 사실 노출 없는 UX 설계',
      en: 'Shadow Block pattern for blocking without recipient awareness',
    },
    {
      ko: '쌍방향 동시 오픈 프로토콜로 익명→실명 전환 보안 강화',
      en: 'Bi-directional simultaneous open protocol for secure anonymous-to-real identity reveal',
    },
    {
      ko: 'Google Play + App Store 동시 출시',
      en: 'Published on both Google Play and App Store',
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
    problemSolving: [
      {
        id: 'privacy-first-contact-sync',
        title: {
          ko: '해시 기반 연락처 동기화',
          en: 'Hash-based Contact Sync',
        },
        category: {
          ko: '보안',
          en: 'Security',
        },
        icon: '🔐',
        problem: {
          ko: '**이슈**: 연락처로 친구를 찾으려면 전화번호를 서버에 올려야 함. 평문으로 저장하면 유출 시 번호가 그대로 노출.',
          en: '**Issue**: Finding friends from contacts meant uploading phone numbers; stored in plain text, a breach would expose them directly.',
        },
        solution: {
          ko: '**해결**: 클라이언트에서 E.164 정규화 후 SHA-256 해싱만 서버로 전송. 서버는 phoneHashes 역인덱스로 해시 매칭만 수행. Firestore Rules로 클라이언트 직접 접근 차단.',
          en: '**Solution**: Client normalizes to E.164 format then sends only SHA-256 hashes to server. Server performs hash matching via phoneHashes reverse index. Firestore Rules block direct client access.',
        },
        technicalDetails: {
          ko: `\`\`\`dart
// Client: 전화번호 해싱만 서버로 전송
String _hashPhoneNumber(String normalizedPhone) {
  final bytes = utf8.encode(normalizedPhone);
  final digest = sha256.convert(bytes);
  return digest.toString();
}

// Cloud Functions: 해시 매칭만 수행
const phoneHashDoc = await db
  .collection('phoneHashes')
  .doc(contact.phoneHash).get();

// 검색 허용 여부 체크
if (!matchedUserData.settings?.allowPhoneSearch) continue;
\`\`\`

**핵심**: 원본 전화번호는 클라이언트를 떠나지 않음`,
          en: `\`\`\`dart
// Client: Only hash sent to server
String _hashPhoneNumber(String normalizedPhone) {
  final bytes = utf8.encode(normalizedPhone);
  final digest = sha256.convert(bytes);
  return digest.toString();
}

// Cloud Functions: Hash matching only
const phoneHashDoc = await db
  .collection('phoneHashes')
  .doc(contact.phoneHash).get();

// Check search permission
if (!matchedUserData.settings?.allowPhoneSearch) continue;
\`\`\`

**Key**: Raw phone number never leaves client`,
        },
        csFoundations: [
          'SHA-256 Hashing',
          'Privacy by Design',
          'Zero-Knowledge Proof Concept',
          'Firestore Security Rules',
        ],
        impact: {
          ko: '**성과**: DB에는 해시만 저장, 유출돼도 원본 번호가 바로 드러나지 않음.',
          en: '**Impact**: The DB holds only hashes, so a breach does not directly expose numbers.',
        },
      },
      {
        id: 'asymmetric-soft-delete',
        title: {
          ko: 'Asymmetric Soft Delete: 채팅방 비대칭 삭제',
          en: 'Asymmetric Soft Delete: Independent Chat Deletion',
        },
        category: {
          ko: '아키텍처',
          en: 'Architecture',
        },
        icon: '🗑️',
        problem: {
          ko: '**이슈**: 채팅방을 나가면 상대방 대화까지 삭제되는 일반적인 메신저와 달리, 한쪽만 나가도 상대방 대화는 보존해야 함. 단, 나간 후 새 메시지가 오면 다시 보여야 함.',
          en: "**Issue**: Unlike typical messengers where leaving deletes both sides, needed to preserve other party's chat. Plus, new messages after leaving should restore visibility.",
        },
        solution: {
          ko: '**해결**: participantDetails에 hiddenSince/visibleFrom 타임스탬프 패턴 도입. 나갈 때 hiddenSince 설정, 상대방이 메시지 보내면 visibleFrom 설정으로 복원.',
          en: '**Solution**: Introduced hiddenSince/visibleFrom timestamp pattern in participantDetails. Set hiddenSince on leave, restore with visibleFrom when other party sends message.',
        },
        technicalDetails: {
          ko: `\`\`\`dart
// 나가기: hiddenSince 타임스탬프 설정
await chatRoomRef.update({
  'participantDetails.$currentUserId.hiddenSince':
    FieldValue.serverTimestamp(),
  'participantDetails.$currentUserId.visibleFrom': null,
});

// 복원: 메시지 전송 전 상대방 복원
Future<void> _restoreHiddenParticipant() async {
  if (otherDetails?['hiddenSince'] != null) {
    await chatRoomRef.update({
      'participantDetails.$otherUserId.hiddenSince': null,
      'participantDetails.$otherUserId.visibleFrom':
        FieldValue.serverTimestamp(),
    });
  }
}
\`\`\`

**핵심**: 복원→전송 순서로 Race Condition 방지`,
          en: `\`\`\`dart
// Leave: Set hiddenSince timestamp
await chatRoomRef.update({
  'participantDetails.$currentUserId.hiddenSince':
    FieldValue.serverTimestamp(),
  'participantDetails.$currentUserId.visibleFrom': null,
});

// Restore: Before sending message
Future<void> _restoreHiddenParticipant() async {
  if (otherDetails?['hiddenSince'] != null) {
    await chatRoomRef.update({
      'participantDetails.$otherUserId.hiddenSince': null,
      'participantDetails.$otherUserId.visibleFrom':
        FieldValue.serverTimestamp(),
    });
  }
}
\`\`\`

**Key**: Restore-then-Send order prevents Race Condition`,
        },
        csFoundations: [
          'Soft Delete Pattern',
          'Timestamp-based Filtering',
          'NoSQL Data Modeling',
          'Race Condition Prevention',
        ],
        impact: {
          ko: '**성과**: 한쪽이 나가거나 삭제해도 상대방 대화 이력은 그대로, 복원 시에도 각자의 시점 유지.',
          en: "**Impact**: One side's leave or delete leaves the other's history intact, and each keeps their own view on restore.",
        },
      },
      {
        id: 'shadow-block',
        title: {
          ko: 'Shadow Block: 차단 사실 숨김 패턴',
          en: 'Shadow Block: Invisible Blocking Pattern',
        },
        category: {
          ko: 'UX',
          en: 'UX',
        },
        icon: '👻',
        problem: {
          ko: '**이슈**: 일반적인 차단은 전송 실패 표시로 차단 사실이 드러나 사용자 간 갈등 유발.',
          en: '**Issue**: Typical blocking reveals itself through a send-failure message, causing conflict between users.',
        },
        solution: {
          ko: '**해결**: 차단된 사용자의 메시지는 DB에 정상 저장하되 shadowBlocked: true 플래그 추가. 알림/배지 업데이트 생략으로 수신자에게 도달 안 함.',
          en: "**Solution**: Blocked user's messages saved normally but with shadowBlocked: true flag. Skip notification/badge updates so recipient never sees them.",
        },
        technicalDetails: {
          ko: `\`\`\`dart
// 차단 여부 조용히 체크 (상대방 모름)
Future<bool> _isBlockedByOther(String chatRoomId) async {
  final blockedDoc = await _firestore
    .collection('users')
    .doc(otherUserId)
    .collection(blockCollection)
    .doc(currentUserId).get();
  return blockedDoc.exists;
}

// Shadow Block 시 조용히 처리
if (isShadowBlocked) {
  messageData['shadowBlocked'] = true;
}
// 알림/배지 업데이트 생략
if (!isShadowBlocked) {
  await _updateChatRoomLastMessage(chatRoomId, text);
}
\`\`\`

**핵심**: 발신자에게는 정상, 수신자에게는 투명`,
          en: `\`\`\`dart
// Quietly check block status (other party unaware)
Future<bool> _isBlockedByOther(String chatRoomId) async {
  final blockedDoc = await _firestore
    .collection('users')
    .doc(otherUserId)
    .collection(blockCollection)
    .doc(currentUserId).get();
  return blockedDoc.exists;
}

// Silent handling on Shadow Block
if (isShadowBlocked) {
  messageData['shadowBlocked'] = true;
}
// Skip notification/badge update
if (!isShadowBlocked) {
  await _updateChatRoomLastMessage(chatRoomId, text);
}
\`\`\`

**Key**: Normal for sender, invisible to recipient`,
        },
        csFoundations: [
          'Shadow Ban Pattern',
          'UX Psychology',
          'Conflict Prevention',
          'Firestore Subcollection',
        ],
        impact: {
          ko: '**성과**: 발신자는 평소처럼 보내고, 메시지는 차단한 사람에게 도달하지 않음.',
          en: '**Impact**: The sender sends as usual; the message never reaches the blocker.',
        },
      },
      {
        id: 'bidirectional-open-protocol',
        title: {
          ko: '쌍방향 동시 오픈 프로토콜',
          en: 'Bi-directional Simultaneous Open Protocol',
        },
        category: {
          ko: '보안',
          en: 'Security',
        },
        icon: '🤝',
        problem: {
          ko: '**이슈**: 익명 커넥트 친구의 정체를 공개할 때 한쪽만 먼저 공개하면, 상대가 내 정보만 보고 대화를 피할 수 있음.',
          en: '**Issue**: If only one side reveals identity in an anonymous connect, the other can see it and avoid the conversation.',
        },
        solution: {
          ko: '**해결**: openRequests 맵으로 양측 요청 추적. 둘 다 요청해야만 _completeSquareOpen 실행. 오픈 시 커넥트 채팅방 아카이브, 일반 friendship 생성까지 원자적 처리.',
          en: '**Solution**: Track both requests with openRequests map. Execute _completeSquareOpen only when both request. Atomically handle connect chat archive and regular friendship creation on open.',
        },
        technicalDetails: {
          ko: `\`\`\`dart
// 내 오픈 요청 저장
openRequests[_currentUserId] = FieldValue.serverTimestamp();
await friendshipRef.update({'openRequests': openRequests});

// 상대도 요청했는지 확인
if (openRequests[otherUserId] != null) {
  // 둘 다 요청 → 동시 오픈!
  return await _completeSquareOpen(connectFriendshipId, users);
}
return {'status': 'pending', 'message': '오픈 대기중'};

// 오픈 완료 시 원자적 처리 (Firestore batch)
batch.update(connectRef, {'status': 'opened'});
batch.update(connectChatRef, {'status': 'archived'});
batch.set(regularRef, {/*새 friendship*/});
\`\`\`

**핵심**: 양측 동시 요청 필수 = 공정한 정보 공개`,
          en: `\`\`\`dart
// Save my open request
openRequests[_currentUserId] = FieldValue.serverTimestamp();
await friendshipRef.update({'openRequests': openRequests});

// Check if other party also requested
if (openRequests[otherUserId] != null) {
  // Both requested → simultaneous open!
  return await _completeSquareOpen(connectFriendshipId, users);
}
return {'status': 'pending', 'message': 'Waiting for open'};

// Atomic processing on open completion (Firestore batch)
batch.update(connectRef, {'status': 'opened'});
batch.update(connectChatRef, {'status': 'archived'});
batch.set(regularRef, {/*new friendship*/});
\`\`\`

**Key**: Both parties must request = fair information disclosure`,
        },
        csFoundations: [
          'Two-Phase Commit Concept',
          'Atomic Batch Operations',
          'State Machine',
          'Information Symmetry',
        ],
        impact: {
          ko: '**성과**: 양쪽이 모두 요청해야 실명 전환, 한쪽만 노출되는 경우 없음.',
          en: '**Impact**: Identities switch only when both sides request it, so neither is exposed alone.',
        },
      },
    ],
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
  order: 12,
  scope: 'personal',
} satisfies Project;

export default project;
