import type { Project } from '@/types';

const project = {
  id: 'evaluator',
  title: {
    ko: 'RAG/Agent 품질 평가 서비스',
    en: 'RAG/Agent Quality Evaluation Service',
  },
  shortDescription: {
    ko: '검색 정확도·생성 품질을 정량 측정하는 벤치마크 자동화 (단독 개발)',
    en: 'Automated benchmarking of retrieval accuracy and generation quality (sole developer)',
  },
  fullDescription: {
    ko: '에이전트·RAG 품질을 정량 측정하는 평가 서비스를 단독 개발했습니다. 검색 정확도(Recall)와 생성 품질(RAGAS 계열 메트릭)을 자동 측정하고, 평가용 QnA 데이터셋 자동 생성 파이프라인까지 구축해 전 고객사 서비스의 품질 검증에 사용됩니다. 현재는 평가 데이터셋·평가 실행·생성 프롬프트·판정 기준을 도메인으로 분리한 DB 기반 v2로 전면 재설계해 기존 버전과 병행 운영 중입니다.',
    en: 'Sole developer of a service that quantifies agent and RAG quality. It automatically measures retrieval accuracy (Recall) and generation quality (RAGAS-family metrics) and includes a pipeline that generates evaluation QnA datasets — used to validate quality across every client service. It has since been redesigned from the ground up as a DB-backed v2 that separates evaluation datasets, runs, generation prompts, and judgment criteria into their own domains, running alongside the original.',
  },
  techStack: [
    'Python',
    'FastAPI',
    'DSPy',
    'SQLAlchemy 2.0 (async)',
    'PostgreSQL 16',
    'Elasticsearch',
    'Redis',
    'Kubernetes',
    'pytest',
  ],
  peekLine: {
    ko: 'RAGAS 지표를 자체 구현해 버전·프로바이더 종속을 걷어냈다',
    en: 'Reimplemented the RAGAS metrics in-house, removing version and provider lock-in.',
  },
  keyAchievements: [
    {
      ko: 'RAGAS 메트릭 경량 자체 구현 (프롬프트 규격 준수, 라이브러리 버전·프로바이더 종속 없음)',
      en: 'Reimplemented RAGAS metrics in-house (keeping prompt specifications) to remove version and provider lock-in',
    },
    {
      ko: '재현성을 위해 LLM 호출을 의도 추출 1회로 줄이고 요청 조립은 결정론적 상태머신으로 전환 (파싱 실패 제거)',
      en: 'For reproducibility, cut LLM calls to one intent extraction and moved request assembly to a deterministic state machine (no parse failures)',
    },
    {
      ko: 'LLM-as-judge self-bias 회피 가이드 작성 (평가·대상 모델 패밀리 분리, 모델별 점수 차이 문서화)',
      en: 'Wrote LLM-as-judge self-bias guidance (separate judge and target model families, documented expected score differences)',
    },
    {
      ko: '특정 서비스의 Recall이 0으로 잘못 계산되던 결함 수정 (실데이터 97/100건 교정)',
      en: 'Fixed a defect that computed Recall as 0 for certain services (97 of 100 real records corrected)',
    },
    {
      ko: '사내 LLM 게이트웨이용 커스텀 DSPy LM 어댑터 구현, BootstrapFewShot·MIPROv2 프롬프트 자동 최적화, 배포 번들 369KB → 175KB',
      en: 'Custom DSPy LM adapter for the in-house LLM gateway, automated prompt optimization with BootstrapFewShot/MIPROv2, deploy bundle 369KB → 175KB',
    },
    {
      ko: 'v2 재설계 (평가 데이터셋·실행·생성 프롬프트·판정 기준 도메인 분리, FastAPI + SQLAlchemy 2.0(async) + PostgreSQL, alembic 마이그레이션)',
      en: 'v2 redesign (evaluation datasets, runs, generation prompts, and judgment criteria as separate domains; FastAPI + SQLAlchemy 2.0 (async) + PostgreSQL; alembic migrations)',
    },
    {
      ko: '실행 시점 판정 기준 스냅샷·전역 실행 큐·구조화된 실행 오류로 평가 이력 추적, 검색·응답·판정 워커의 gold 대조·판정 분류·집계 로직 공통화',
      en: 'Traceable evaluation history via run-time criteria snapshots, a global run queue, and structured run errors; retrieval, response, and judgment workers share gold comparison, classification, and aggregation',
    },
  ],
  features: [
    'Agentic RAG Evaluator',
    'Custom Recall & Retrieval Metrics',
    'Automated QnA Generation',
    'Real-time Progress Tracking',
    'Markdown Result Visualization',
  ],
  company: {
    ko: '(주)포지큐브',
    en: 'Posicube Inc.',
  },
  period: {
    ko: '2025.02 ~ 현재',
    en: 'Feb 2025 ~ Present',
  },
  detail: {
    architecture: [
      {
        title: {
          ko: '검색 평가 실행',
          en: 'Retrieval Evaluation Run',
        },
        description: {
          ko: '전역 큐에서 슬롯을 받아 데이터셋 정합 검사 후 결과 행을 전량 선생성하고, 행별로 검색 서비스를 질의해 정답(gold)과 대조하는 흐름. 실행 시점의 설정·인덱스를 스냅샷으로 남겨 재현할 수 있습니다.',
          en: 'A run claims a global queue slot, integrity-checks the dataset, pre-creates every result row, then queries the retrieval service per row and compares against gold. The config and index are snapshotted at run time so runs can be reproduced.',
        },
        mermaidFilePath: {
          ko: '/architecture/evaluator/retrieval-run.mmd',
          en: '/architecture/evaluator/retrieval-run-en.mmd',
        },
      },
      {
        title: {
          ko: '응답 평가 실행',
          en: 'Response Evaluation Run',
        },
        description: {
          ko: '실서비스 대화 경로로 실제 질의를 보내 end-to-end 응답 품질을 측정합니다. 호출 단위 추적 ID 선저장, 폴링 타임아웃, 실패 시 근거 문서 보존으로 실패 원인을 추적할 수 있습니다.',
          en: 'Real queries go through the live conversation path to measure end-to-end response quality. Pre-stored per-call trace IDs, polling timeouts, and passage preservation on failure make failures traceable.',
        },
        mermaidFilePath: {
          ko: '/architecture/evaluator/response-run.mmd',
          en: '/architecture/evaluator/response-run-en.mmd',
        },
      },
      {
        title: {
          ko: '품질 판정',
          en: 'Quality Judgment',
        },
        description: {
          ko: 'RAGAS 계열 지표 4종을 LLM 게이트웨이로 판정하는 단계. 판정 기준을 실행 시점에 스냅샷하고 라운드를 표식해 같은 실행을 다른 기준·모델로 재판정해도 이력이 섞이지 않습니다. 판정 불가 건은 집계 모수에서 제외됩니다.',
          en: 'Four RAGAS-family metrics judged through the LLM gateway. Criteria are snapshotted at run time and rounds are marked, so re-judging the same run with different criteria or models never mixes histories; unjudgeable rows drop out of the aggregates.',
        },
        mermaidFilePath: {
          ko: '/architecture/evaluator/judgment-run.mmd',
          en: '/architecture/evaluator/judgment-run-en.mmd',
        },
      },
      {
        title: {
          ko: '평가 데이터셋 생성',
          en: 'Evaluation Dataset Generation',
        },
        description: {
          ko: '문서 저장소에서 표본을 추출해 LLM으로 QnA를 생성하고, 스키마 검증·중복 제거를 거쳐 사람 검토 후 데이터셋에 반영하는 파이프라인. 생성에 사용한 청크가 그대로 정답 근거(gold)가 되어 검색 평가와 연결됩니다.',
          en: 'Samples documents, generates QnA with an LLM, and applies items to the dataset after schema validation, deduplication, and human review. The source chunk of each item becomes its gold passage, linking generation directly to retrieval evaluation.',
        },
        mermaidFilePath: {
          ko: '/architecture/evaluator/dataset-generation.mmd',
          en: '/architecture/evaluator/dataset-generation-en.mmd',
        },
      },
    ],
  },
  featured: true,
  order: 4,
  scope: 'company',
} satisfies Project;

export default project;
