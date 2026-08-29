import type { Project } from '@/types';

const project = {
  id: 'py-runner',
  title: {
    ko: 'AI Agent 실행 런타임',
    en: 'AI Agent Execution Runtime',
  },
  shortDescription: {
    ko: '멀티팟 분산 Python 샌드박스 & 무중단 동적 배포',
    en: 'Multi-pod distributed Python sandbox with zero-downtime dynamic deployment',
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
      ko: '금융·공공·엔터프라이즈 7개 고객사 / 9개 프로젝트에 적용된 실행 런타임 (주 개발자)',
      en: 'Execution runtime adopted by 9 projects across 7 finance/public/enterprise clients (lead developer)',
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
      ko: '구조화 로깅·OTLP 트레이싱 등 관측성 계층과 로그 수집 워커(배치 flush · At-least-once)를 단독 개발, 핵심 모듈 테스트 1.6만 줄 이상 작성',
      en: 'Solely built the observability layer (structured logging, OTLP tracing) and the batched, at-least-once log-collection worker; wrote 16k+ lines of core-module tests',
    },
  ],
  features: [
    'Dynamic Agent Runtime',
    'Redis-based Distributed Routing',
    'Zero-downtime Deployment',
    'SSE Streaming Pipeline',
    'Secure Sandbox Isolation',
    'At-least-once Log Collection',
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
        id: 'async-migration',
        title: {
          ko: '동시성 프로그래밍: 동기에서 비동기로 전환',
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
          ko: '**성과**: 블로킹 I/O 제거 — 한 요청의 대기가 다른 요청을 막지 않게 되어 멀티팟 환경의 동시 처리 용량 확대.',
          en: "**Impact**: Removed blocking I/O — one request's wait no longer stalls others, expanding concurrent capacity across pods.",
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
          ko: '**성과**: 도입 후 동시 배포로 인한 버전 유실 재발 0건 — 배포 실패율 0% 유지.',
          en: '**Impact**: No version-loss recurrence from concurrent deployments since the fix — deployment failure rate held at 0%.',
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
          ko: '**성과**: 토큰 누적 제거로 응답 길이와 무관하게 메모리 사용량 평탄 유지 — 장시간 스트리밍·동시 요청에서 안정성 확보.',
          en: '**Impact**: Memory stays flat regardless of response length — stable under long streams and concurrent requests.',
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
          ko: '**성과**: 정규화 도입 후 ID 형식 불일치로 인한 중복 배포·조인 실패 재발 0건.',
          en: '**Impact**: No recurrence of duplicate deployments or failed joins from ID format mismatches after normalization.',
        },
        commits: ['5f21d96', 'da0d614'],
      },

      {
        id: 'batch-processing',
        title: {
          ko: '배치 처리: HTTP 오버헤드 99% 감소',
          en: 'Batch Processing: 99% HTTP Overhead Reduction',
        },
        category: {
          ko: '성능최적화',
          en: 'Performance',
        },
        icon: '🚀',
        problem: {
          ko: '**이슈**: 로그 1건당 HTTP 호출 2회(GET+POST) 필요. 초당 100건 로그 발생 시 200회 HTTP 호출로 네트워크 병목 발생. 각 HTTP 호출의 고정 비용(~50ms)으로 인해 처리량이 초당 10건에 불과.',
          en: '**Issue**: Each log required 2 HTTP calls (GET+POST). With 100 logs/second, 200 HTTP calls caused network bottleneck. Fixed cost per HTTP call (~50ms) limited throughput to only 10 logs/second.',
        },
        solution: {
          ko: '**해결**: 1초 주기 배치 처리 도입. 로그를 메모리 버퍼에 축적 후 한 번에 전송하여 HTTP 호출을 2회로 통합. 에이전트별 버퍼 관리로 독립성 보장.',
          en: '**Solution**: Introduced 1-second interval batch processing. Accumulated logs in memory buffer then sent at once, consolidating HTTP calls to just 2. Maintained independence through per-agent buffer management.',
        },
        technicalDetails: {
          ko: `\`\`\`python
# Before (건당 처리)
for log in logs:  # 100개
    await client.get(url)   # 50ms × 100
    await client.post(url)  # 50ms × 100
# 총 시간: 10,000ms (10초)

# After (배치 처리)
buffer.extend(logs)  # 버퍼에 축적
await asyncio.sleep(1)  # 1초 대기

# 한 번에 처리
combined = '\\n'.join(buffer)
await client.get(url)   # 50ms × 1
await client.post(url)  # 50ms × 1
# 총 시간: ~1,100ms
\`\`\`

**핵심**: 네트워크 왕복 횟수 최소화`,
          en: `\`\`\`python
# Before (per-log)
for log in logs:  # 100 logs
    await client.get(url)   # 50ms × 100
    await client.post(url)  # 50ms × 100
# Total: 10,000ms (10 seconds)

# After (batch)
buffer.extend(logs)  # Accumulate
await asyncio.sleep(1)  # Wait 1 sec

# Process at once
combined = '\\n'.join(buffer)
await client.get(url)   # 50ms × 1
await client.post(url)  # 50ms × 1
# Total: ~1,100ms
\`\`\`

**Key**: Minimize network round-trips`,
        },
        csFoundations: [
          'Batch Processing',
          'Buffer Management',
          'Amortized Cost',
          'I/O Optimization',
        ],
        impact: {
          ko: '**성과**: HTTP 호출 횟수 **99% 감소** (건당 2회 → 배치당 2회) — 네트워크 왕복이 로그량과 무관해짐.',
          en: '**Impact**: HTTP calls cut by **99%** (2 per log → 2 per batch) — network round-trips no longer scale with log volume.',
        },
        commits: [],
      },
      {
        id: 'at-least-once',
        title: {
          ko: 'At-least-once: 장애에도 로그 손실 제로',
          en: 'At-least-once: Zero Log Loss Even During Failures',
        },
        category: {
          ko: '분산시스템',
          en: 'Distributed System',
        },
        icon: '🛡️',
        problem: {
          ko: '**이슈**: 기존 방식은 메시지 수신 즉시 ACK 처리. 버퍼에 로그가 있는 상태에서 서버 장애 시 해당 로그 영구 손실. Redis에서 이미 ACK된 메시지는 재전달되지 않음.',
          en: "**Issue**: Previous approach ACKed messages immediately upon receipt. If server crashed with logs in buffer, those logs were permanently lost. Redis doesn't redeliver already-ACKed messages.",
        },
        solution: {
          ko: '**해결**: ACK를 flush 성공 후에만 수행하도록 변경. 실패 시 버퍼에 로그를 다시 넣어 다음 주기에 재시도. 서버 장애 시 Redis Consumer Group이 마지막 ACK 지점부터 재전달.',
          en: '**Solution**: Changed to ACK only after successful flush. On failure, put logs back in buffer for retry in next cycle. On server crash, Redis Consumer Group redelivers from last ACK point.',
        },
        technicalDetails: {
          ko: `\`\`\`python
async def _flush_agent(self, agent_key):
    logs = self.buffer.pop(agent_key, [])
    
    try:
        await self._write_batch(logs)
        
        # 성공 시에만 ACK
        for log in logs:
            await self.ack_callback(log.msg_id)
            
    except Exception:
        # 실패 시 버퍼에 반환
        self.buffer[agent_key] = logs
\`\`\`

**핵심**: ACK 지연 + 실패 시 재시도 = At-least-once`,
          en: `\`\`\`python
async def _flush_agent(self, agent_key):
    logs = self.buffer.pop(agent_key, [])
    
    try:
        await self._write_batch(logs)
        
        # ACK only on success
        for log in logs:
            await self.ack_callback(log.msg_id)
            
    except Exception:
        # On failure, return to buffer
        self.buffer[agent_key] = logs
\`\`\`

**Key**: Delayed ACK + retry on failure = At-least-once`,
        },
        csFoundations: [
          'At-least-once Delivery',
          'Consumer Group',
          'Message Acknowledgment',
          'Failure Recovery',
        ],
        impact: {
          ko: '**성과**: 장애 시 로그 손실 0건 — flush 성공 후에만 ACK하므로 재시작 시 마지막 ACK 지점부터 자동 재전달.',
          en: '**Impact**: Zero log loss on failure — ACK only after a successful flush, so redelivery resumes from the last ACK point on restart.',
        },
        commits: [],
      },
      {
        id: 'dedup-sorting',
        title: {
          ko: '중복 제거 & 시간순 정렬: 재전달 로그 처리',
          en: 'Deduplication & Sorting: Handling Redelivered Logs',
        },
        category: {
          ko: '데이터관리',
          en: 'Data Management',
        },
        icon: '🔄',
        problem: {
          ko: '**이슈**: At-least-once 방식은 재전달로 인한 중복 로그 발생 가능. 또한 비동기 처리로 로그 순서가 뒤섞일 수 있어 디버깅 시 시간순 추적이 어려움.',
          en: '**Issue**: At-least-once delivery can cause duplicate logs due to redelivery. Also, async processing can scramble log order, making time-based debugging difficult.',
        },
        solution: {
          ko: '**해결**: 파일 저장소에 쓰기 전 중복 제거(dict.fromkeys로 순서 유지) 및 타임스탬프 기반 정렬 적용. 로그 포맷 `[date][time]...`에서 타임스탬프 추출하여 정렬.',
          en: '**Solution**: Applied deduplication (dict.fromkeys preserves order) and timestamp-based sorting before writing to the file store. Extracted timestamp from log format `[date][time]...` for sorting.',
        },
        technicalDetails: {
          ko: `\`\`\`python
def _write_batch(self, logs):
    new_lines = [log.format() for log in logs]
    all_lines = existing_lines + new_lines
    
    # 중복 제거 (순서 유지)
    unique = list(dict.fromkeys(all_lines))
    
    # 시간순 정렬
    unique.sort(key=self._extract_timestamp)
    return unique
\`\`\`

**핵심**: Idempotent Write (멱등 쓰기)`,
          en: `\`\`\`python
def _write_batch(self, logs):
    new_lines = [log.format() for log in logs]
    all_lines = existing_lines + new_lines
    
    # Deduplicate (preserve order)
    unique = list(dict.fromkeys(all_lines))
    
    # Sort by time
    unique.sort(key=self._extract_timestamp)
    return unique
\`\`\`

**Key**: Idempotent Write`,
        },
        csFoundations: ['Idempotency', 'Deduplication', 'Sorting Algorithm', 'Data Integrity'],
        impact: {
          ko: '**성과**: 재전달로 생긴 중복 로그 자동 제거, 시간순 정렬로 장애 추적 시 로그 흐름 재구성 가능.',
          en: '**Impact**: Redelivered duplicates removed automatically; time-ordered logs make incident timelines reconstructable.',
        },
        commits: [],
      },
    ],
    architecture: [
      {
        title: {
          ko: '실행 런타임 시스템 아키텍처',
          en: 'Execution Runtime System Architecture',
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

      {
        title: {
          ko: '배치 처리 플로우',
          en: 'Batch Processing Flow',
        },
        description: {
          ko: 'Redis Stream에서 파일 저장소까지의 At-least-once 배치 처리 플로우. 메시지 수신, 버퍼 축적, flush, ACK의 전체 과정과 실패 시 재시도 메커니즘.',
          en: 'At-least-once batch processing flow from Redis Stream to the file store. Complete process of message reception, buffer accumulation, flush, ACK, and retry mechanism on failure.',
        },
        mermaidFilePath: {
          ko: '/architecture/pyrunner/batch-flow.mmd',
          en: '/architecture/pyrunner/batch-flow-en.mmd',
        },
      },
    ],
  },
  featured: true,
  order: 1,
  scope: 'company',
} satisfies Project;

export default project;
