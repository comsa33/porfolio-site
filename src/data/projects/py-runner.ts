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
    ko: '멀티팟 환경에서 AI 에이전트를 동적으로 등록·배포·실행하는 실행 런타임입니다. 에이전트 관리 서버와 프로덕션·개발 샌드박스를 프로세스 격리로 나눈 3서버 구조 위에서, Redis Pub/Sub 동기화와 FastAPI 서브앱 동적 로딩으로 서버 재시작 없는 배포를 실현했습니다.',
    en: 'An execution runtime that registers, deploys, and runs AI agents dynamically across pods. Three process-isolated servers — agent management, production sandbox, dev sandbox — with Redis Pub/Sub synchronization and dynamic FastAPI sub-app loading deploy changes without a restart.',
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
      ko: 'FastAPI 서브앱 동적 로딩으로 서버 재시작 없이 기능 추가·교체 — 사용자 정의 에이전트 API·커스텀 LLM·알고리즘 스크립트까지 무중단 배포',
      en: 'Zero-downtime deployment — dynamic sub-app loading adds or swaps user-defined agent APIs, custom LLMs, and algorithm scripts without a restart',
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
    ko: '2024.12 ~ 2026.02',
    en: 'Dec 2024 ~ Feb 2026',
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
    ],
    architecture: [
      {
        title: {
          ko: '실행 런타임 시스템 아키텍처',
          en: 'Execution Runtime System Architecture',
        },
        description: {
          ko: '메인 프로세스가 에이전트 관리 서버와 프로덕션·개발 샌드박스를 프로세스 격리로 스폰하는 3서버 구조. Redis가 배포 상태·분산 락·Pub/Sub을 담당하고, 공유 볼륨과 S3 호환 오브젝트 스토리지 위에서 사용자 스크립트·커스텀 LLM·알고리즘이 실행됩니다.',
          en: 'A main process spawns three isolated servers — agent management, production sandbox, and dev sandbox. Redis carries deploy state, distributed locks, and Pub/Sub, while user scripts, custom LLMs, and algorithms run over a shared volume and S3-compatible object storage.',
        },
        mermaidFilePath: {
          ko: '/architecture/pyrunner/system-architecture.mmd',
          en: '/architecture/pyrunner/system-architecture-en.mmd',
        },
      },
      {
        title: {
          ko: '동적 등록 · 무중단 배포 전파',
          en: 'Dynamic Registration & Zero-downtime Propagation',
        },
        description: {
          ko: '스키마 등록 한 번으로 코드 템플릿 생성 → 파일 저장 → 분산 락 하의 상태 갱신 → Pub/Sub 브로드캐스트 → 전 파드 서브앱 동적 로딩까지 이어지는 흐름. 동시 배포가 락으로 직렬화되어 배포 실패율 0%를 유지합니다.',
          en: 'One schema registration flows through template generation, file save, state update under a distributed lock, Pub/Sub broadcast, and dynamic sub-app loading on every pod. Concurrent deploys are serialized by the lock, holding deploy failures at 0%.',
        },
        mermaidFilePath: {
          ko: '/architecture/pyrunner/deploy-propagation.mmd',
          en: '/architecture/pyrunner/deploy-propagation-en.mmd',
        },
      },
      {
        title: {
          ko: '로그 수집 파이프라인',
          en: 'Log Collection Pipeline',
        },
        description: {
          ko: '에이전트 실행 로그를 Redis Stream Consumer Group으로 수집하는 배치 파이프라인. flush 성공 후에만 ACK하는 At-least-once 보장으로 장애 시에도 로그가 유실되지 않습니다.',
          en: 'A batched pipeline collecting agent execution logs via Redis Stream consumer groups. ACK only after a successful flush gives at-least-once delivery — no log loss even through failures.',
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
