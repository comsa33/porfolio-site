import type { Project } from '@/types';

const project = {
  id: 'evaluator',
  title: 'Evaluator',
  shortDescription: {
    ko: 'RAG/Agent 품질 평가 벤치마크 자동화 서비스 (단독 개발)',
    en: 'Automated RAG/Agent quality benchmarking service (sole developer)',
  },
  fullDescription: {
    ko: '에이전트·RAG 품질을 정량 측정하는 평가 서비스를 단독 개발했습니다(코드 라인 100%, 커밋 95% — git 실측). 검색 정확도(Recall)와 생성 품질(RAGAS 계열 메트릭)을 자동 측정하고, 평가용 QnA 데이터셋 자동 생성 파이프라인까지 구축해 전 고객사 서비스의 품질 검증에 사용됩니다.',
    en: 'Sole developer of a service that quantifies agent and RAG quality (100% of lines, 95% of commits by git measurement). It automatically measures retrieval accuracy (Recall) and generation quality (RAGAS-family metrics) and includes a pipeline that generates evaluation QnA datasets — now used to validate quality across every client service.',
  },
  techStack: ['Python', 'DSPy 3.1.3', 'Elasticsearch', 'httpx', 'Redis', 'Kubernetes', 'pytest'],
  keyAchievements: [
    {
      ko: 'RAGAS 라이브러리 직접 의존 없이 경량 자체 구현 (프롬프트 규격은 준수) — 버전·프로바이더 종속 제거',
      en: 'Reimplemented RAGAS metrics in-house (keeping prompt specifications) to remove version and provider lock-in',
    },
    {
      ko: '평가 재현성을 위한 의도적 탈-LLM 설계 — LLM 호출을 의도 추출 1회로 한정하고 요청 조립을 결정론적 상태머신으로 전환, 파싱 실패 원천 제거',
      en: "Deliberately de-LLM'd for reproducibility — one LLM call for intent extraction, with request assembly moved to a deterministic state machine, eliminating parse failures",
    },
    {
      ko: 'LLM-as-judge self-bias 회피 원칙 수립 — 평가 모델과 대상 모델의 패밀리 분리를 가이드하고 모델별 점수 차이가 정상임을 문서화',
      en: 'Established an LLM-as-judge self-bias policy — judge and target models must come from different families, with expected score variation documented',
    },
    {
      ko: '측정값 자체가 틀렸던 결함을 근본 수정 — 특정 서비스 Recall이 0으로 오측정되던 문제를 규명·수정, 실데이터 97/100건 교정 및 기존 정상 케이스 회귀 0',
      en: 'Root-caused a defect in the measurements themselves — fixed Recall misreporting as 0 for certain services, correcting 97 of 100 real records with zero regression',
    },
    {
      ko: 'LLMOps — 사내 LLM 게이트웨이용 커스텀 DSPy LM 어댑터 구현, BootstrapFewShot·MIPROv2로 프롬프트 자동 최적화, 배포 산출물 번들 369KB → 175KB 감축',
      en: 'LLMOps — built a custom DSPy LM adapter for the in-house gateway, automated prompt optimization with BootstrapFewShot/MIPROv2, and cut the deployment bundle from 369KB to 175KB',
    },
  ],
  features: [
    'Agentic RAG Evaluator',
    'Custom Recall & VecDash Metrics',
    'Automated QnA Generation',
    'Real-time Progress Tracking',
    'Markdown Result Visualization',
  ],
  repoPath: 'evaluator',
  company: {
    ko: '(주)포지큐브',
    en: 'Posicube Inc.',
  },
  period: {
    ko: '2025.02 ~ 2026.07',
    en: 'Feb 2025 ~ Jul 2026',
  },
  detail: {
    problemSolving: [
      {
        id: 'progress-tracker',
        title: {
          ko: 'Progress Tracker 설계',
          en: 'Progress Tracker Design',
        },
        category: {
          ko: '동시성',
          en: 'Concurrency',
        },
        icon: '📊',
        problem: {
          ko: '대규모 평가 작업(수백~수천 개 QnA) 실행 시 사용자는 진행 상황을 알 수 없고, 매 작업마다 상태 업데이트 시 API 서버 부하 과다 발생. 또한 이전 단계 평가 결과가 유실되는 문제가 있었습니다.',
          en: 'During large-scale evaluation tasks (hundreds to thousands of QnAs), users had no visibility into progress, and updating status for every task caused excessive API server load. Additionally, previous stage evaluation results were being lost.',
        },
        solution: {
          ko: '**ProgressTracker 클래스**를 설계하여 10% 단위로만 진행률을 DataHub API에 보고하도록 최적화했습니다. **Prefix message 패턴**을 도입하여 이전 단계의 결과를 현재 업데이트 메시지 앞에 prepend함으로써 평가 히스토리를 보존했습니다.',
          en: 'Designed a **ProgressTracker class** to optimize progress reporting to DataHub API at 10% intervals only. Introduced a **prefix message pattern** that prepends previous stage results to current update messages.',
        },
        technicalDetails: {
          ko: `\`\`\`python
class ProgressTracker:
    def __init__(self, total, interval=10):
        self.total = total
        self.interval = interval
        self.current = 0
        self.last_percent = 0
    
    async def update(self, inc=1):
        self.current += inc
        percent = int((self.current / self.total) * 100)
        
        # Decile-based: 10% 단위로만 API 호출
        if percent // self.interval > self.last_percent // self.interval:
            self.last_percent = percent
            await self._send_update()  # 1000개 → 10번만
\`\`\`

**핵심**: API 호출 1000번 → 10번 (99% 감소)`,
          en: `\`\`\`python
class ProgressTracker:
    def __init__(self, total, interval=10):
        self.total = total
        self.interval = interval
        self.current = 0
        self.last_percent = 0
    
    async def update(self, inc=1):
        self.current += inc
        percent = int((self.current / self.total) * 100)
        
        # Decile-based: API calls only at 10% intervals
        if percent // self.interval > self.last_percent // self.interval:
            self.last_percent = percent
            await self._send_update()  # 1000 tasks → 10 calls
\`\`\`

**Key**: API calls 1000 → 10 (99% reduction)`,
        },
        csFoundations: [
          'Rate Limiting',
          'State Accumulation',
          'Progress Tracking',
          'API Optimization',
        ],
        impact: {
          ko: 'API 서버 부하 **99% 감소**, 평가 결과 손실 **제로화**, 사용자 경험 개선',
          en: 'API server load reduced by **99%**, evaluation result loss **eliminated**, improved UX',
        },
      },
      {
        id: 'multi-processor-pattern',
        title: {
          ko: 'Multi-Processor Pattern 도입',
          en: 'Multi-Processor Pattern',
        },
        category: {
          ko: '설계패턴',
          en: 'Design Pattern',
        },
        icon: '🏭',
        problem: {
          ko: 'Recall, Ragas, VecDash, Pipeline 등 4가지 평가 타입마다 중복된 파일 로딩, 에러 처리, 로깅 로직이 반복 구현되어 있었고, 신규 평가 방식 추가 시 보일러플레이트 코드가 증가했습니다.',
          en: 'For four evaluation types (Recall, Ragas, VecDash, Pipeline), duplicate file loading, error handling, and logging logic was repeatedly implemented.',
        },
        solution: {
          ko: '**Template Method 패턴** 기반 `BaseEvaluationProcessor` 추상 클래스를 설계했습니다. 공통 흐름(`run()`)은 부모에서 정의하고, 평가별 핵심 로직만 서브클래스가 구현하도록 강제했습니다.',
          en: 'Designed `BaseEvaluationProcessor` abstract class based on **Template Method pattern**. Common flow (`run()`) defined in parent class, evaluation-specific logic in subclasses.',
        },
        technicalDetails: {
          ko: `\`\`\`python
from abc import ABC, abstractmethod

class BaseEvaluationProcessor(ABC):
    async def run(self):
        try:
            data = await self._load_input()  # 추상
            result = await self._process(data)
            return await self._save_output(result)
        except Exception as e:
            logger.error(f"Failed: {e}")
            raise
    
    @abstractmethod
    async def _load_input(self): pass
    
    @abstractmethod
    async def _process(self, data): pass
\`\`\`

**핵심**: Template Method + Factory로 코드 중복 70% 감소`,
          en: `\`\`\`python
from abc import ABC, abstractmethod

class BaseEvaluationProcessor(ABC):
    async def run(self):
        try:
            data = await self._load_input()  # abstract
            result = await self._process(data)
            return await self._save_output(result)
        except Exception as e:
            logger.error(f"Failed: {e}")
            raise
    
    @abstractmethod
    async def _load_input(self): pass
    
    @abstractmethod
    async def _process(self, data): pass
\`\`\`

**Key**: Template Method + Factory reduced duplication by 70%`,
        },
        csFoundations: [
          'Template Method Pattern',
          'Factory Pattern',
          'Dependency Injection',
          'Abstract Base Class',
        ],
        impact: {
          ko: '코드 중복 **70% 감소**, 신규 평가 타입 추가 시간 **3일 → 4시간**, 테스트 커버리지 **45% → 85%**',
          en: 'Code duplication reduced by **70%**, new evaluation type time **3 days → 4 hours**, test coverage **45% → 85%**',
        },
      },
      {
        id: 'async-job-processing',
        title: {
          ko: '비동기 작업 처리 시스템',
          en: 'Async Job Processing',
        },
        category: {
          ko: '성능최적화',
          en: 'Performance',
        },
        icon: '⏱️',
        problem: {
          ko: '수백 개의 QnA 평가 작업을 동기식으로 처리하면 API 타임아웃이 발생하고, 사용자는 작업 완료까지 브라우저를 닫을 수 없어 UX가 저하되었습니다.',
          en: "Processing hundreds of QnA evaluation tasks synchronously caused API timeouts, and users couldn't close their browsers until completion.",
        },
        solution: {
          ko: '`chat_logs_id` 파라미터 기반 동기/비동기 실행 분기. `asyncio.create_task()`로 백그라운드 작업 생성하고 즉시 응답 반환. 작업 상태를 ProgressTracker를 통해 실시간 보고.',
          en: 'Implemented sync/async branching based on `chat_logs_id` parameter. Creates background task with `asyncio.create_task()` and returns immediately.',
        },
        technicalDetails: {
          ko: `\`\`\`python
@router.post("/evaluation/ragas")
async def submit_evaluation(request, chat_logs_id: Optional[int]):
    processor = get_processor("ragas", request)
    
    if chat_logs_id:
        # 비동기: 백그라운드 실행
        asyncio.create_task(run_job(processor, chat_logs_id))
        return {"status": "queued"}
    else:
        # 동기: 즉시 완료
        await processor.run()
        return {"status": "completed"}
\`\`\`

**핵심**: Event Loop에서 독립 실행, 즉시 응답`,
          en: `\`\`\`python
@router.post("/evaluation/ragas")
async def submit_evaluation(request, chat_logs_id: Optional[int]):
    processor = get_processor("ragas", request)
    
    if chat_logs_id:
        # Async: background execution
        asyncio.create_task(run_job(processor, chat_logs_id))
        return {"status": "queued"}
    else:
        # Sync: immediate completion
        await processor.run()
        return {"status": "completed"}
\`\`\`

**Key**: Independent execution in Event Loop`,
        },
        csFoundations: [
          'Async Programming',
          'Event Loop',
          'Graceful Error Handling',
          'Background Tasks',
        ],
        impact: {
          ko: 'API 타임아웃 **제로화**, 사용자 대기 시간 **95% 감소**, 운영 효율성 **150% 향상**',
          en: 'API timeouts **eliminated**, user wait time reduced by **95%**, operational efficiency improved by **150%**',
        },
      },
    ],
    architecture: [
      {
        title: {
          ko: '시스템 아키텍처',
          en: 'System Architecture',
        },
        description: {
          ko: 'Evaluator의 전체 시스템 구조. API Layer, Processor Factory, Base Processor Pattern, Evaluation Layer, Progress Tracking, External Services 간의 상호작용을 보여줍니다.',
          en: 'Overall system structure of Evaluator. Shows interactions between API Layer, Processor Factory, Base Processor Pattern, Evaluation Layer, Progress Tracking, and External Services.',
        },
        mermaidFilePath: {
          ko: '/architecture/evaluator/system-architecture.mmd',
          en: '/architecture/evaluator/system-architecture-en.mmd',
        },
      },
      {
        title: {
          ko: '평가 파이프라인 플로우',
          en: 'Evaluation Pipeline Flow',
        },
        description: {
          ko: 'QnA 생성 → Recall 평가 → Ragas 평가로 이어지는 E2E 평가 파이프라인의 상세 흐름. 각 단계별 Progress Tracking, 파일 관리, 비동기 처리 메커니즘을 포함합니다.',
          en: 'Detailed flow of the E2E evaluation pipeline from QnA Generation → Recall Evaluation → Ragas Evaluation. Includes Progress Tracking, file management, and async processing mechanisms for each stage.',
        },
        mermaidFilePath: {
          ko: '/architecture/evaluator/evaluation-pipeline.mmd',
          en: '/architecture/evaluator/evaluation-pipeline-en.mmd',
        },
      },
    ],
  },
  featured: true,
  order: 4,
  scope: 'company',
} satisfies Project;

export default project;
