import type { Project } from '@/types';

const project = {
  id: 'log-collector',
  title: 'Log Collector',
  shortDescription: {
    ko: 'At-least-once 보장 분산 로그 수집 시스템',
    en: 'At-least-once Guaranteed Distributed Log Collection System',
  },
  fullDescription: {
    ko: 'Redis Stream Consumer Group 기반 로그 수집 백그라운드 워커입니다. 배치 처리로 초당 수백 건의 로그를 효율적으로 처리하며, 장애 시에도 로그 손실 없이 At-least-once 전달을 보장합니다.',
    en: 'Background worker for log collection based on Redis Stream Consumer Group. Efficiently processes hundreds of logs per second through batch processing, ensuring at-least-once delivery without log loss even during failures.',
  },
  techStack: ['Python 3.11', 'asyncio', 'Redis Stream', 'Consumer Group', 'httpx', 'Pydantic'],
  keyAchievements: [
    {
      ko: '배치 처리로 HTTP 호출 99% 감소 (1건당 2회 → 배치당 2회)',
      en: '99% reduction in HTTP calls through batch processing (2 per log → 2 per batch)',
    },
    {
      ko: 'At-least-once 전달 보장 (flush 성공 후에만 ACK)',
      en: 'At-least-once delivery guarantee (ACK only after successful flush)',
    },
    {
      ko: '중복 제거 & 시간순 정렬로 재전달 로그 자동 처리',
      en: 'Automatic handling of redelivered logs via deduplication & time-based sorting',
    },
    {
      ko: 'Sidecar 패턴으로 PyEditor와 함께 배포 (~50MB 메모리)',
      en: 'Sidecar pattern deployment with PyEditor (~50MB memory)',
    },
  ],
  features: [
    'Redis Consumer Group',
    'Batch Processing',
    'At-least-once Delivery',
    'Graceful Shutdown',
    'Time-based Sorting',
  ],
  repoPath: 'log-collector',
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
          ko: '**성과**: HTTP 호출 횟수 **99% 감소** (200회 → 2회). 처리량 **10배 이상 향상** (초당 10건 → 수백 건).',
          en: '**Impact**: HTTP calls reduced by **99%** (200 → 2). Throughput improved by **10x+** (10/sec → hundreds/sec).',
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
          ko: '**성과**: 장애 시 로그 손실 **제로**. 서버 재시작 후 자동 복구. 데이터 신뢰성 **100%** 보장.',
          en: '**Impact**: **Zero** log loss during failures. Automatic recovery after server restart. **100%** data reliability guaranteed.',
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
          ko: '**해결**: PyEditor에 쓰기 전 중복 제거(dict.fromkeys로 순서 유지) 및 타임스탬프 기반 정렬 적용. 로그 포맷 `[date][time]...`에서 타임스탬프 추출하여 정렬.',
          en: '**Solution**: Applied deduplication (dict.fromkeys preserves order) and timestamp-based sorting before writing to PyEditor. Extracted timestamp from log format `[date][time]...` for sorting.',
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
          ko: '**성과**: 중복 로그 **자동 제거**. 시간순 정렬로 디버깅 효율성 **향상**. 로그 품질 **100%** 보장.',
          en: '**Impact**: Duplicate logs **automatically removed**. Debugging efficiency **improved** with time-sorted logs. **100%** log quality guaranteed.',
        },
        commits: [],
      },
    ],
    architecture: [
      {
        title: {
          ko: '배치 처리 플로우',
          en: 'Batch Processing Flow',
        },
        description: {
          ko: 'Redis Stream에서 PyEditor까지의 At-least-once 배치 처리 플로우. 메시지 수신, 버퍼 축적, flush, ACK의 전체 과정과 실패 시 재시도 메커니즘.',
          en: 'At-least-once batch processing flow from Redis Stream to PyEditor. Complete process of message reception, buffer accumulation, flush, ACK, and retry mechanism on failure.',
        },
        mermaidFilePath: {
          ko: '/architecture/log-collector/batch-flow.mmd',
          en: '/architecture/log-collector/batch-flow-en.mmd',
        },
      },
    ],
  },
  featured: false,
  order: 10,
  scope: 'company',
} satisfies Project;

export default project;
