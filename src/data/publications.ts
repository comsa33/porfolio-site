// ⚠️ 사실관계 SoT는 resume-kit의 career-facts.md — 논문 상태·수치를 갱신할 때 반드시 대조할 것.
import type { Publication } from '@/types';

export const publications = [
  {
    id: 'tara-knosys',
    title: 'TARA: Tool-Augmented Retrieval Agents for Self-Corrective RAG',
    venue: {
      ko: 'Knowledge-Based Systems (Elsevier)',
      en: 'Knowledge-Based Systems (Elsevier)',
    },
    year: '2026',
    status: 'under-review',
    statusLabel: {
      ko: '심사 완료 · 편집자 결정 대기',
      en: 'Review complete · awaiting editor decision',
    },
    authorRole: {
      ko: '제1저자 (주저자)',
      en: 'First author',
    },
    indexing: 'SCIE',
    summary: {
      ko: '고정 루프 기반 Self-Corrective RAG를 6개 도구(검색·질의분해·품질평가·본문조회·문서구조탐색·용어매핑)를 갖춘 ReAct 에이전트로 대체한 프레임워크. 전체 파이프라인을 DSPy 선언적 프로그램으로 구현해 프롬프트 자동 최적화를 적용했고, 4개 데이터셋에서 2WikiMultiHopQA F1 +0.089 (p<0.001)를 달성했습니다. 교차 모델 검증을 통해 추론형 모델의 거부 비대칭(Reasoning Model Refusal Asymmetry) 현상을 규명했습니다.',
      en: 'Replaces fixed-loop Self-Corrective RAG with a ReAct agent equipped with six tools (retrieval, query decomposition, quality assessment, passage lookup, document-structure exploration, terminology mapping). The full pipeline is written as a declarative DSPy program with automatic prompt optimization, achieving +0.089 F1 on 2WikiMultiHopQA (p<0.001) across four datasets. Cross-model validation identified a Reasoning Model Refusal Asymmetry.',
    },
    codeLink: 'https://github.com/comsa33/self-corrective-rag',
    category: 'journal',
  },
  {
    id: 'jips-trajectory-clustering',
    title:
      'Auditing Trajectory Clustering in LLM-Agent Failure Analysis: A Multi-Dataset Validation Protocol',
    venue: {
      ko: 'Journal of Information Processing Systems (한국정보처리학회)',
      en: 'Journal of Information Processing Systems (KIPS)',
    },
    year: '2026',
    status: 'under-review',
    statusLabel: {
      ko: '심사 진행 중',
      en: 'Under review',
    },
    authorRole: {
      ko: '제1저자 (주저자)',
      en: 'First author',
    },
    indexing: 'SCOPUS',
    summary: {
      ko: "LLM 에이전트 실패 분석에서 '트래젝토리 클러스터가 외부 실패 라벨과 정렬된다'는 통념을 검증한 연구. 누수 감사·층화 라벨 검증·멀티라벨 검증·matched-K 베이스라인 비교로 구성된 4단계 프로토콜을 제안하고, 3개 공개 벤치마크(AFTraj-2K, AgentErrorBench, AgentRx)에 26개 피처 기반 표현으로 적용했습니다. 겉보기 정렬 대부분이 태스크·프레임워크 교란요인으로 설명됨을 규명했습니다 (NMI 0.32→0.21).",
      en: 'Tests the common assumption that trajectory clusters align with external failure labels in LLM-agent analysis. Proposes a four-stage protocol — leakage audit, stratified label validation, multi-label validation, and matched-K baseline comparison — applied to three public benchmarks (AFTraj-2K, AgentErrorBench, AgentRx) under 26 feature-based representations, showing most apparent alignment is explained by task and framework confounders (NMI 0.32→0.21).',
    },
    category: 'journal',
  },
  {
    id: 'jksqm-lhtt',
    title:
      'LLM 기반 시계열 예측 하이퍼파라미터 자동 튜닝 프레임워크: 서울시 대기질 데이터 사례연구',
    venue: {
      ko: '품질경영학회지 제53권 제3호, pp.343-360',
      en: 'J. of the Korean Society for Quality Management, 53(3), 343-360',
    },
    year: '2025',
    status: 'published',
    statusLabel: {
      ko: '게재 완료',
      en: 'Published',
    },
    authorRole: {
      ko: '제1저자 (3인 공저)',
      en: 'First author (3 authors)',
    },
    indexing: 'KCI',
    summary: {
      ko: '생성형 AI를 활용한 시계열 예측 자동화 프레임워크 LHTT를 제안한 연구. Gemma3:27B를 반복 피드백 루프에 결합해 모델 선택부터 하이퍼파라미터 최적화, 결과 분석, 리포트 생성까지 end-to-end로 자동화했습니다. 서울시 PM2.5 데이터(2025.05, 25개 측정소 18,500건)에 5개 모델을 적용해 검증했으며, LSTM이 RMSE 3.70 / R² 0.82로 베이스라인 대비 17.86% 개선을 달성했습니다.',
      en: 'Proposes LHTT, an LLM-based automation framework for time-series forecasting. Gemma3:27B is placed in an iterative feedback loop that automates model selection, hyperparameter optimization, result analysis, and report generation end-to-end. Validated on Seoul PM2.5 data (May 2025, 18,500 records across 25 stations) with five models; LSTM reached RMSE 3.70 / R² 0.82, a 17.86% improvement over baseline.',
    },
    doi: '10.7469/JKSQM.2025.53.3.343',
    link: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003244700',
    category: 'journal',
  },
  {
    id: 'patent-culturefit',
    title: '기계학습을 이용한 구직자-구인자 컬쳐핏 매칭 방법',
    venue: {
      ko: '대한민국 등록특허 제10-2721044호',
      en: 'Korean Patent No. 10-2721044',
    },
    year: '2024',
    status: 'patent',
    statusLabel: {
      ko: '등록',
      en: 'Registered',
    },
    authorRole: {
      ko: '공동발명자 (4인)',
      en: 'Co-inventor (4 inventors)',
    },
    summary: {
      ko: '그레이비랩 재직 중 개발한 구직자-기업 매칭 ML 모델의 등록특허. 경력·학력 데이터 기반 구직자 클러스터링과 설문 기반 업무 성향 도출, 기업 평판·정보 데이터 기반 구인자 클러스터링을 결합해 개인 그룹과 기업 그룹을 컬쳐핏 관점에서 매칭하는 방법을 제안합니다. 스킬 매칭 중심의 기존 접근을 넘어 객관 지표와 문화적 적합성을 함께 반영한 것이 특징입니다. (2022.08.31 출원 · 2024.10.23 등록)',
      en: 'Registered patent for the job-seeker–employer matching ML model built at GravyLab. It clusters job seekers from career and education data with survey-derived work tendencies, clusters employers from reputation and company data, and matches the two groups at the culture-fit level — combining objective metrics with cultural compatibility beyond skill-based matching. Filed Aug 31, 2022; granted Oct 23, 2024.',
    },
    link: 'https://patents.google.com/patent/KR102721044B1/ko',
    category: 'patent',
  },
  {
    id: 'ask2023-coverletter',
    title: 'GPT-4 기반 채용공고별 AI 자기소개서 작성 가이드 개인화 서비스',
    venue: {
      ko: '2023년 한국정보처리학회 춘계학술발표대회 (ASK 2023) 제30권 1호',
      en: 'ASK 2023, Annual Spring Conference of KIPS, Vol. 30 No. 1',
    },
    year: '2023',
    status: 'presented',
    statusLabel: {
      ko: '발표 완료',
      en: 'Presented',
    },
    authorRole: {
      ko: '제1저자 (주저자)',
      en: 'First author',
    },
    summary: {
      ko: 'GPT-4 API 기반으로 채용공고 맞춤 자기소개서를 생성하는 end-to-end 서비스를 설계·구현하고 발표한 연구. 채용공고 스크래핑 → DB 적재 → 검색·필터링 → 사용자 이력 입력 → 개인화 문서 생성 → 다운로드까지 파이프라인을 구축했고, 4단계 프롬프트 구조를 실험적으로 최적화해 템플릿 기반 서비스 대비 개인화 품질을 개선했습니다. GPT-4 공개(2023.03) 두 달 만의 초기 상용 LLM 응용 사례입니다.',
      en: "Designed and implemented an end-to-end service that generates job-posting-specific cover letters with the GPT-4 API. The pipeline spans posting scraping, database ingestion, search/filtering, applicant-history input, personalized document generation, and download; a four-stage prompt structure was empirically optimized to improve personalization over template-based services. Built within two months of GPT-4's March 2023 release.",
    },
    doi: '10.3745/PKIPS.y2023m05a.430',
    category: 'conference',
  },
] satisfies Publication[];
