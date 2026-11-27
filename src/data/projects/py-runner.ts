import type { Project } from '@/types';

const project = {
  id: 'py-runner',
  title: {
    ko: 'AI Agent 실행 런타임',
    en: 'AI Agent Execution Runtime',
  },
  shortDescription: {
    ko: '멀티팟 분산 Python 샌드박스 & 재시작 없는 동적 배포',
    en: 'Multi-pod distributed Python sandbox with restart-free dynamic deployment',
  },
  fullDescription: {
    ko: '멀티팟 환경에서 AI 에이전트를 동적으로 등록·배포·실행하는 실행 런타임입니다. 에이전트 관리 서버와 프로덕션·개발 샌드박스를 3개 프로세스로 나눈 구조 위에서 Redis Pub/Sub 동기화와 FastAPI 서브앱 동적 로딩으로 서버 재시작 없이 배포합니다.',
    en: 'An execution runtime that registers, deploys, and runs AI agents dynamically across pods. Three separate server processes — agent management, production sandbox, dev sandbox — with Redis Pub/Sub synchronization and dynamic FastAPI sub-app loading deploy changes without a restart.',
  },
  techStack: [
    'Python',
    'FastAPI',
    'Kubernetes',
    'Redis (Pub/Sub·Stream)',
    'Elasticsearch',
    'MongoDB',
    'pytest',
  ],
  peekLine: {
    ko: '여러 고객사 프로젝트가 함께 쓰는 공통 실행 런타임, 주 개발자',
    en: 'The shared execution runtime behind multiple client projects; lead developer.',
  },
  keyAchievements: [
    {
      ko: '여러 고객사 프로젝트가 함께 쓰는 공통 실행 런타임 (주 개발자)',
      en: 'The shared execution runtime behind multiple client projects (lead developer)',
    },
    {
      ko: 'Redis Pub/Sub 이벤트 버스로 멀티 파드 배포 동기화, 분산 락으로 동시 배포 시 버전 유실 방지',
      en: 'Multi-pod deployment sync over a Redis Pub/Sub event bus, with a distributed lock that keeps concurrent deploys from losing versions',
    },
    {
      ko: 'FastAPI 서브앱 동적 로딩으로 사용자 정의 에이전트 API·커스텀 LLM·알고리즘 스크립트를 재시작 없이 배포',
      en: 'Dynamic FastAPI sub-app loading deploys user-defined agent APIs, custom LLMs, and algorithm scripts without a restart',
    },
    {
      ko: '프로바이더 무관 LLM 어댑터 계층 (Azure/AWS Bedrock/Anthropic/Google/OpenAI) + Redis Stream 기반 SSE 토큰 스트리밍',
      en: 'Provider-agnostic LLM adapter layer (Azure/AWS Bedrock/Anthropic/Google/OpenAI) with Redis Stream-backed SSE token streaming',
    },
    {
      ko: '샌드박스 로그 송신부와 서버 쪽 로그 추가 API(중복 제거·크기 상한) 구현, 핵심 모듈 테스트 1.6만 줄 이상 작성',
      en: 'Built the sandbox log sender and the server-side log append API (dedup, size caps); wrote 16k+ lines of core-module tests',
    },
  ],
  posts: [
    {
      slug: 'filesystem-instead-of-a-database',
      title: {
        ko: '사용자 코드를 런타임에 import 하는 엔진',
        en: 'An engine that imports user code at runtime',
      },
    },
    {
      slug: 'touching-someone-elses-stream',
      title: {
        ko: 'SSE 프레임 파싱을 하루 동안 고친 기록',
        en: 'A day of fixing SSE frame parsing',
      },
    },
    {
      slug: 'a-channel-named-after-the-wrong-thing',
      title: {
        ko: '채널 키를 요청 ID로 잡으면 안 되는 이유',
        en: 'Why a channel key should not be the request ID',
      },
    },
    {
      slug: 'mounted-but-unreachable',
      title: {
        ko: 'Mount 접두어 매칭이 라우트를 가릴 때',
        en: 'When Mount prefix matching hides a route',
      },
    },
  ],
  features: [
    'Dynamic Agent Runtime',
    'Redis-based Distributed Routing',
    'Restart-free Deployment',
    'SSE Streaming Pipeline',
  ],
  company: {
    ko: '(주)포지큐브',
    en: 'Posicube Inc.',
  },
  period: {
    ko: '2024.12 ~ 현재',
    en: 'Dec 2024 ~ Present',
  },
  detail: {
    problemSolving: [
      {
        id: 'race-condition',
        title: {
          ko: '분산 시스템: Race Condition과 데이터 일관성',
          en: 'Distributed System: Race Condition Resolution',
        },
        category: {
          ko: '분산시스템',
          en: 'Distributed System',
        },
        icon: '🔒',
        problem: {
          ko: '**이슈**: 여러 Pod가 동시에 Agent 버전 목록을 읽고 수정할 때 Race Condition 발생. Pod A가 v3를 추가하는 동안 Pod B가 같은 시점에 읽어서 v4만 추가하면, v3 배포가 유실됨.',
          en: '**Issue**: Race condition occurred when multiple pods simultaneously read and modified agent version list. When Pod A added v3 while Pod B read at the same time and added only v4, v3 deployment was lost.',
        },
        solution: {
          ko: '**해결**: Redis 기반 Distributed Lock을 도입하여 임계 영역(Critical Section) 보호. Context Manager 패턴(`async with`)으로 Lock 획득/해제를 자동화하고, None/str/bytes 타입 검증 추가, 반환 타입을 `set[str]`로 통일.',
          en: '**Solution**: Introduced Redis-based Distributed Lock to protect critical sections. Automated lock acquisition/release with Context Manager pattern (`async with`), added None/str/bytes type checks, and unified the return type to `set[str]`.',
        },
        technicalDetails: {
          ko: `\`\`\`python
async def safe_deploy(agent_id, version):
    async with RedisLock(f"deploy:{agent_id}") as lock:
        # 임계 영역 시작 - 한 번에 하나의 Pod만 진입
        versions = await redis.get("versions")
        
        # 타입 검증 (None 체크 + 타입 변환)
        if versions is None:
            versions = set()
        elif not isinstance(versions, set):
            versions = set(versions) if versions else set()
        
        versions.add(version)
        await redis.set("versions", versions)
        # 임계 영역 끝
    
    return versions
\`\`\`

**핵심 개념**: Mutual Exclusion (상호 배제) + CAP 이론 적용`,
          en: `\`\`\`python
async def safe_deploy(agent_id, version):
    async with RedisLock(f"deploy:{agent_id}") as lock:
        # Critical section - only one pod can enter
        versions = await redis.get("versions")
        
        # Type validation (None check + type conversion)
        if versions is None:
            versions = set()
        elif not isinstance(versions, set):
            versions = set(versions) if versions else set()
        
        versions.add(version)
        await redis.set("versions", versions)
        # End of critical section
    
    return versions
\`\`\`

**Core Concepts**: Mutual Exclusion + CAP Theorem`,
        },
        csFoundations: [
          'Distributed Lock',
          'Race Condition',
          'Mutual Exclusion',
          'CAP Theorem',
          'Type Safety',
        ],
        impact: {
          ko: '**성과**: 도입 후 동시 배포로 인한 버전 유실 재발 없음.',
          en: '**Impact**: No version loss from concurrent deploys since the fix.',
        },
        commits: ['942909a', '76dfbc3'],
      },
      {
        id: 'memory-optimization',
        title: {
          ko: '메모리 관리: SSE 스트리밍 최적화',
          en: 'Memory Management: SSE Streaming Optimization',
        },
        category: {
          ko: '메모리관리',
          en: 'Memory Management',
        },
        icon: '💾',
        problem: {
          ko: '**이슈**: LLM 토큰을 SSE로 스트리밍할 때 모든 토큰을 리스트에 누적 저장하여 메모리 누수 발생. 긴 응답(수천 토큰)의 경우 수 MB 메모리를 소비하고, 다수의 동시 요청 시 서버 메모리 고갈 위험.',
          en: '**Issue**: Memory leak occurred by accumulating all tokens in a list during LLM token streaming via SSE. Long responses (thousands of tokens) consumed several MB of memory, risking server memory exhaustion with multiple concurrent requests.',
        },
        solution: {
          ko: '**해결**: Generator 패턴으로 전환하여 Lazy Evaluation 구현. 각 토큰을 yield 즉시 GC(Garbage Collection) 대상으로 만들어 메모리에 누적되지 않도록 개선. 메타데이터는 처음 한 번만 전송하고, 1MB 버퍼 제한 및 Stale Request 자동 정리 로직 추가.',
          en: '**Solution**: Implemented Lazy Evaluation by switching to Generator pattern. Made each token eligible for GC (Garbage Collection) immediately after yield to prevent memory accumulation. Sent metadata only once at start, added 1MB buffer limit and automatic stale request cleanup logic.',
        },
        technicalDetails: {
          ko: `\`\`\`python
# Before (메모리 누수)
def stream_tokens():
    all_tokens = []  # 모든 토큰을 메모리에 저장!
    for token in llm.generate():
        all_tokens.append(token)
        yield token
    # all_tokens는 끝까지 메모리에 남음

# After (메모리 효율적)
async def stream_handler(request):
    # 메타데이터는 한 번만
    yield {"type": "metadata", "headers": {...}}
    
    # 토큰은 하나씩 yield (메모리 저장 안 함)
    async for token in llm.agenerate():
        yield {"type": "data", "content": token}
        # token은 yield 후 GC 대상
\`\`\`

**핵심**: Stream Processing (배치 처리 대신 실시간 처리)`,
          en: `\`\`\`python
# Before (memory leak)
def stream_tokens():
    all_tokens = []  # Stores all tokens in memory!
    for token in llm.generate():
        all_tokens.append(token)
        yield token
    # all_tokens remains in memory until end

# After (memory efficient)
async def stream_handler(request):
    # Metadata only once
    yield {"type": "metadata", "headers": {...}}
    
    # Yield tokens one by one (no memory storage)
    async for token in llm.agenerate():
        yield {"type": "data", "content": token}
        # token becomes GC target after yield
\`\`\`

**Key**: Stream Processing (real-time instead of batch)`,
        },
        csFoundations: [
          'Generator Pattern',
          'Lazy Evaluation',
          'Garbage Collection',
          'Stream Processing',
          'Memory Management',
        ],
        impact: {
          ko: '**성과**: 토큰을 쌓지 않아 응답 길이와 관계없이 메모리 사용량 일정.',
          en: '**Impact**: Memory stays flat regardless of response length.',
        },
        commits: ['346a8f5', '8c4aba6'],
      },
    ],
    architecture: [
      {
        title: {
          ko: '실행 런타임 시스템 아키텍처',
          en: 'Execution Runtime System Architecture',
        },
        description: {
          ko: '메인 프로세스가 에이전트 관리 서버와 프로덕션·개발 샌드박스를 별도 프로세스로 스폰하는 3서버 구조. Redis가 배포 상태·분산 락·Pub/Sub을 담당하고, 공유 볼륨과 S3 호환 오브젝트 스토리지 위에서 사용자 스크립트·커스텀 LLM·알고리즘이 실행됩니다.',
          en: 'A main process spawns three separate server processes — agent management, production sandbox, and dev sandbox. Redis carries deploy state, distributed locks, and Pub/Sub, while user scripts, custom LLMs, and algorithms run over a shared volume and S3-compatible object storage.',
        },
        mermaidFilePath: {
          ko: '/architecture/pyrunner/system-architecture.mmd',
          en: '/architecture/pyrunner/system-architecture-en.mmd',
        },
      },
      {
        title: {
          ko: '동적 등록 · 재시작 없는 배포 전파',
          en: 'Dynamic Registration & Restart-free Propagation',
        },
        description: {
          ko: '스키마 등록 한 번으로 코드 템플릿 생성 → 파일 저장 → 분산 락 하의 상태 갱신 → Pub/Sub 브로드캐스트 → 전 파드 서브앱 동적 로딩까지 이어지는 흐름. 동시 배포는 락으로 직렬화됩니다.',
          en: 'One schema registration flows through template generation, file save, state update under a distributed lock, Pub/Sub broadcast, and dynamic sub-app loading on every pod. Concurrent deploys are serialized by the lock.',
        },
        mermaidFilePath: {
          ko: '/architecture/pyrunner/deploy-propagation.mmd',
          en: '/architecture/pyrunner/deploy-propagation-en.mmd',
        },
      },
    ],
  },
  featured: true,
  order: 4,
  scope: 'company',
} satisfies Project;

export default project;
