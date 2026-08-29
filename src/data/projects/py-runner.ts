import type { Project } from '@/types';

const project = {
  id: 'py-runner',
  title: 'PyRunner',
  shortDescription: {
    ko: '분산형 Python 샌드박스 & 동적 에이전트 런타임',
    en: 'Distributed Python Sandbox & Dynamic Agent Runtime',
  },
  fullDescription: {
    ko: 'Multi-Pod 환경에서 AI 에이전트를 동적으로 배포하고 실행하는 고가용성 플랫폼입니다. Redis Pub/Sub 기반 분산 라우팅과 FastAPI Sub-app 동적 로딩을 통해 Zero-downtime 배포를 실현했습니다.',
    en: 'High-availability platform for dynamically deploying and executing AI agents in multi-pod environments. Achieved zero-downtime deployment through Redis Pub/Sub distributed routing and FastAPI sub-app dynamic loading.',
  },
  techStack: [
    'Python',
    'FastAPI',
    'Kubernetes',
    'Redis (Pub/Sub·Stream)',
    'Elasticsearch',
    'MongoDB',
    'OpenTelemetry',
    'pytest',
  ],
  keyAchievements: [
    {
      ko: '금융·공공·엔터프라이즈 7개 고객사 / 9개 프로젝트에 적용된 실행 런타임 (주 개발자, 커밋 71% · 코드 라인 63%)',
      en: 'Execution runtime adopted by 9 projects across 7 finance/public/enterprise clients (lead developer — 71% of commits, 63% of lines)',
    },
    {
      ko: '도구를 이름·스키마·실행부 3요소로 규약화해 코어 수정 없이 신규 도구를 편입하는 플러그인 구조 확립',
      en: 'Standardized tools around a name/schema/executor contract so new tools plug in without core changes',
    },
    {
      ko: 'Redis Pub/Sub 이벤트 버스로 Multi-Pod 실시간 배포 동기화 + Distributed Lock으로 배포 실패율 0% 달성',
      en: 'Real-time multi-pod deployment sync via a Redis Pub/Sub event bus, with distributed locks achieving 0% deployment failure',
    },
    {
      ko: 'FastAPI Sub-app 동적 로딩으로 서버 재시작 없이 기능 추가·교체 (Zero-downtime 배포)',
      en: 'Zero-downtime deployment — FastAPI sub-app dynamic loading adds or swaps features without a server restart',
    },
    {
      ko: '프로바이더 무관 LLM 어댑터 계층 (Azure/AWS Bedrock/Anthropic/Google/OpenAI) + Redis Stream 기반 SSE 토큰 스트리밍',
      en: 'Provider-agnostic LLM adapter layer (Azure/AWS Bedrock/Anthropic/Google/OpenAI) with Redis Stream-backed SSE token streaming',
    },
    {
      ko: '구조화 로깅·OTLP 트레이싱 등 관측성 계층과 로그 수집 워커를 단독 개발, 핵심 모듈 테스트 1.6만 줄 이상 작성',
      en: 'Solely built the observability layer (structured logging, OTLP tracing) and log-collection worker; wrote 16k+ lines of core-module tests',
    },
  ],
  features: [
    'Dynamic Agent Runtime',
    'Redis-based Distributed Routing',
    'Zero-downtime Deployment',
    'SSE Streaming Pipeline',
    'Secure Sandbox Isolation',
  ],
  repoPath: 'py-runner',
  company: {
    ko: '(주)포지큐브',
    en: 'Posicube Inc.',
  },
  period: {
    ko: '2024.12 ~ 2026.07',
    en: 'Dec 2024 ~ Jul 2026',
  },
  detail: {
    problemSolving: [
      {
        id: 'async-migration',
        title: {
          ko: '동시성 프로그래밍: 동기에서 비동기로의 대전환',
          en: 'Concurrency Programming: Async/Await Migration',
        },
        category: {
          ko: '동시성',
          en: 'Concurrency',
        },
        icon: '⚡',
        problem: {
          ko: '**이슈**: Redis 클라이언트가 동기 방식으로 작동하여 멀티팟 환경에서 블로킹 I/O 발생. 한 요청이 Redis 응답을 대기하는 동안 다른 모든 요청이 대기 상태로 전환되어 응답 시간이 급격히 증가하고 CPU가 낭비되는 문제.',
          en: '**Issue**: Synchronous Redis client caused blocking I/O in multi-pod environment. While one request waited for Redis response, all other requests were blocked, causing response time spikes and CPU waste.',
        },
        solution: {
          ko: '**해결**: `redis-py` → `aioredis`로 전면 마이그레이션하여 모든 Redis 작업을 `async/await` 패턴으로 전환. Event Loop 기반 아키텍처를 도입해 I/O 대기 중에도 다른 요청을 처리할 수 있도록 개선. Background Log Worker를 비동기로 구현하고, Lock Manager에 Context Manager 패턴을 적용해 자동 해제 보장.',
          en: '**Solution**: Migrated from `redis-py` to `aioredis`, converting all Redis operations to `async/await` pattern. Introduced event loop-based architecture to handle other requests during I/O waiting. Implemented asynchronous Background Log Worker and applied Context Manager pattern to Lock Manager for automatic release.',
        },
        technicalDetails: {
          ko: `\`\`\`python
# Before (동기)
def deploy_agent(agent_id):
    lock = redis.get(f"lock:{agent_id}")  # 블로킹 I/O
    result = redis.set(f"deployed:{agent_id}", "true")
    return result

# After (비동기)
async def deploy_agent(agent_id):
    lock = await redis.get(f"lock:{agent_id}")  # Non-blocking
    # await 중에 다른 코루틴 실행 가능
    result = await redis.set(f"deployed:{agent_id}", "true")
    return result
\`\`\`

**핵심 변경사항**:
- 13개 파일 수정, +704줄 / -338줄
- RedisClient 전면 리팩토링
- Event Loop 기반 아키텍처 구축
- Distributed Lock을 Non-blocking으로 전환`,
          en: `\`\`\`python
# Before (sync)
def deploy_agent(agent_id):
    lock = redis.get(f"lock:{agent_id}")  # Blocking I/O
    result = redis.set(f"deployed:{agent_id}", "true")
    return result

# After (async)
async def deploy_agent(agent_id):
    lock = await redis.get(f"lock:{agent_id}")  # Non-blocking
    # Other coroutines can run during await
    result = await redis.set(f"deployed:{agent_id}", "true")
    return result
\`\`\`

**Key Changes**:
- 13 files modified, +704 / -338 lines
- Complete RedisClient refactoring
- Event loop-based architecture
- Distributed Lock converted to non-blocking`,
        },
        csFoundations: [
          'Async/Await',
          'Event Loop',
          'Non-blocking I/O',
          'Cooperative Multitasking',
          'Concurrency vs Parallelism',
        ],
        impact: {
          ko: '**성과**: 멀티팟 환경에서 응답 시간 **40% 감소**. CPU 활용률 극대화로 동시 처리 용량 대폭 증가.',
          en: '**Impact**: **40% reduction** in response time in multi-pod environment. Significantly increased concurrent processing capacity through maximized CPU utilization.',
        },
        commits: ['4b7a8aa'],
      },
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
          ko: '**이슈**: 여러 Pod가 동시에 Agent 버전 목록을 읽고 수정할 때 Race Condition 발생. Pod A가 v3를 추가하는 동안 Pod B가 같은 시점에 읽어서 v4만 추가하면, v3 배포가 손실되는 심각한 데이터 무결성 문제.',
          en: '**Issue**: Race condition occurred when multiple pods simultaneously read and modified agent version list. When Pod A added v3 while Pod B read at the same time and added only v4, v3 deployment was lost - a critical data integrity issue.',
        },
        solution: {
          ko: '**해결**: Redis 기반 Distributed Lock을 도입하여 임계 영역(Critical Section) 보호. Context Manager 패턴(`async with`)으로 Lock 획득/해제를 자동화하고, 타입 검증 로직을 추가하여 None/str/bytes 등 다양한 타입을 안전하게 처리. 반환 타입을 `set[str]`로 통일하여 일관성 확보.',
          en: '**Solution**: Introduced Redis-based Distributed Lock to protect critical sections. Automated lock acquisition/release with Context Manager pattern (`async with`), added type validation logic to safely handle various types (None/str/bytes). Ensured consistency by unifying return type to `set[str]`.',
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
          ko: '**성과**: 배포 실패율 **0%** 달성. 데이터 무결성 **100%** 보장. 멀티팟 환경에서 완벽한 일관성 확보.',
          en: '**Impact**: Achieved **0% deployment failure rate**. Guaranteed **100% data integrity**. Perfect consistency in multi-pod environment.',
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
          ko: '**성과**: 메모리 사용량 **70% 감소**. 장시간 스트리밍에서도 안정적인 메모리 유지. 동시 처리 가능 요청 수 대폭 증가.',
          en: '**Impact**: **70% reduction** in memory usage. Stable memory maintenance even during long-term streaming. Significantly increased concurrent request capacity.',
        },
        commits: ['346a8f5', '8c4aba6'],
      },
      {
        id: 'data-normalization',
        title: {
          ko: '데이터 정규화: Agent ID 불일치 해결',
          en: 'Data Normalization: Agent ID Unification',
        },
        category: {
          ko: '데이터정규화',
          en: 'Data Normalization',
        },
        icon: '🎯',
        problem: {
          ko: "**이슈**: 시스템 전반에서 Agent ID 형식이 불일치('a123' vs '123')하여 같은 Agent를 다른 것으로 인식. Frontend, Backend, Redis Event에서 각각 다른 형식을 사용해 Join 연산 실패 및 중복 배포 발생.",
          en: "**Issue**: Inconsistent Agent ID format across system ('a123' vs '123') caused same agent to be recognized as different. Different formats used in Frontend, Backend, and Redis Events led to join operation failures and duplicate deployments.",
        },
        solution: {
          ko: '**해결**: 중앙화된 `AgentIdNormalizer` 클래스를 구현하여 단일 책임 원칙(SRP) 적용. API Entry Point에서 즉시 ID를 정규화하고, 내부 로직은 정규화된 ID만 사용하도록 통일. Integer → String 변환 및 공백 제거 로직 추가.',
          en: '**Solution**: Implemented centralized `AgentIdNormalizer` class applying Single Responsibility Principle (SRP). Normalized IDs immediately at API entry points, unified internal logic to use only normalized IDs. Added Integer → String conversion and whitespace trimming logic.',
        },
        technicalDetails: {
          ko: `\`\`\`python
class AgentIdNormalizer:
    @staticmethod
    def normalize(agent_id: str) -> str:
        """모든 Agent ID를 일관된 형식으로 변환"""
        if agent_id.startswith('a'):
            return agent_id[1:]  # 'a123' → '123'
        return agent_id
    
    @staticmethod
    def with_prefix(agent_id: str) -> str:
        """필요시 접두사 추가"""
        normalized = AgentIdNormalizer.normalize(agent_id)
        return f"a{normalized}"

# API 진입점에서 정규화
@app.post("/deploy")
async def deploy(agent_id: str):
    normalized_id = AgentIdNormalizer.normalize(agent_id)
    # 이후 모든 로직은 normalized_id 사용
\`\`\`

**핵심 원칙**: Data Governance + Defensive Programming`,
          en: `\`\`\`python
class AgentIdNormalizer:
    @staticmethod
    def normalize(agent_id: str) -> str:
        """Convert all Agent IDs to consistent format"""
        if agent_id.startswith('a'):
            return agent_id[1:]  # 'a123' → '123'
        return agent_id
    
    @staticmethod
    def with_prefix(agent_id: str) -> str:
        """Add prefix if needed"""
        normalized = AgentIdNormalizer.normalize(agent_id)
        return f"a{normalized}"

# Normalize at API entry point
@app.post("/deploy")
async def deploy(agent_id: str):
    normalized_id = AgentIdNormalizer.normalize(agent_id)
    # All subsequent logic uses normalized_id
\`\`\`

**Core Principles**: Data Governance + Defensive Programming`,
        },
        csFoundations: [
          'Data Normalization',
          'Canonical Form',
          'Single Responsibility Principle',
          'Defensive Programming',
          'Input Validation',
        ],
        impact: {
          ko: '**성과**: ID 관련 버그 **0건** 달성. 시스템 전반의 데이터 일관성 확보. 디버깅 시간 대폭 단축.',
          en: '**Impact**: Achieved **0 ID-related bugs**. Ensured data consistency across entire system. Significantly reduced debugging time.',
        },
        commits: ['5f21d96', 'da0d614'],
      },
    ],
    architecture: [
      {
        title: {
          ko: 'PyRunner 시스템 아키텍처',
          en: 'PyRunner System Architecture',
        },
        description: {
          ko: 'Multi-Process FastAPI 서버와 Redis 기반 분산 동기화 구조. 사용자 코드를 동적 Sub-App으로 로딩하여 독립성을 보장하며, Pub/Sub을 통해 무중단 배포를 실현합니다.',
          en: 'Multi-process FastAPI server with Redis-based distributed synchronization. Dynamically loads user code as isolated Sub-Apps and enables zero-downtime deployment via Pub/Sub.',
        },
        mermaidFilePath: {
          ko: '/architecture/pyrunner/system-architecture.mmd',
          en: '/architecture/pyrunner/system-architecture-en.mmd',
        },
      },
      {
        title: {
          ko: 'Race Condition 해결 과정',
          en: 'Race Condition Resolution',
        },
        description: {
          ko: '파일 시스템 직접 감지 방식의 한계를 극복하기 위해 Redis Distributed Lock을 도입. 배포 실패율 0%를 달성했습니다.',
          en: 'Overcame filesystem monitoring limitations by introducing Redis Distributed Lock, achieving 0% deployment failure rate.',
        },
        mermaidFilePath: {
          ko: '/architecture/pyrunner/race-condition-resolution.mmd',
          en: '/architecture/pyrunner/race-condition-resolution-en.mmd',
        },
      },
    ],
  },
  featured: true,
  order: 2,
  scope: 'company',
} satisfies Project;

export default project;
