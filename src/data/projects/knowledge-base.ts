import type { Project } from '@/types';

const project = {
  id: 'knowledge-base',
  title: {
    ko: '사내 지식베이스 RAG',
    en: 'Internal Knowledge Base RAG',
  },
  shortDescription: {
    ko: 'Self-Corrective RAG 구조로 사내 분산 지식 통합 및 고품질 답변 제공',
    en: 'Self-Corrective RAG system integrating distributed internal knowledge',
  },
  fullDescription: {
    ko: 'PM, 타부서, B2B 이해관계자, 신입사원의 업무 효율화를 위한 Self-Corrective RAG 시스템입니다. 품질 평가 기반 반복 검색과 누적 컨텍스트로 일반 RAG 대비 높은 정확도를 실현했습니다.',
    en: 'Self-Corrective RAG system for PMs, cross-department teams, B2B stakeholders, and new employees. Achieved higher accuracy than standard RAG through quality-driven iterative search and accumulated context.',
  },
  period: {
    ko: '2024.10 ~ 현재',
    en: 'Oct 2024 ~ Present',
  },
  company: {
    ko: '(주)포지큐브',
    en: 'Posicube Inc.',
  },
  techStack: ['Python', 'LangChain', 'OpenAI GPT-4o', 'Faiss', 'Streamlit', 'FastAPI'],
  features: [
    {
      ko: 'Self-Corrective RAG Loop',
      en: 'Self-Corrective RAG Loop',
    },
    {
      ko: 'Progressive Context Accumulation',
      en: 'Progressive Context Accumulation',
    },
    {
      ko: 'Intelligent Query Refinement',
      en: 'Intelligent Query Refinement',
    },
    {
      ko: 'Hallucination Detection',
      en: 'Hallucination Detection',
    },
    {
      ko: 'Source Attribution',
      en: 'Source Attribution',
    },
  ],
  keyAchievements: [
    {
      ko: '품질 평가 기반 Self-Corrective Loop — 답변이 임계값에 못 미치면 검색어를 개선해 최대 3회 재검색',
      en: 'Quality-gated Self-Corrective Loop — refines the query and retries up to 3 times when an answer falls below threshold',
    },
    {
      ko: 'LLM 기반 Query Refinement — 일상어 질문을 도메인 기술 용어로 변환해 검색 실패를 회복',
      en: 'LLM-based query refinement — recovers failed searches by rewriting casual questions into domain terminology',
    },
    {
      ko: 'Progressive Context Accumulation — 재시도마다 패시지를 누적·중복 제거해 복합 질문의 답변 완성도 개선',
      en: 'Progressive context accumulation — passages accumulate (deduplicated) across retries, improving answers to multi-part questions',
    },
    {
      ko: 'PM·타부서·B2B 이해관계자·신입사원의 상시 질의 채널로 운영',
      en: 'Runs as the everyday Q&A channel for PMs, other departments, B2B stakeholders, and new hires',
    },
  ],
  detail: {
    problemSolving: [
      {
        id: 'self-corrective-loop',
        title: {
          ko: 'Self-Corrective RAG: 품질 평가 기반 반복 검색',
          en: 'Self-Corrective RAG: Quality-Driven Iterative Search',
        },
        category: {
          ko: 'RAG최적화',
          en: 'RAG Optimization',
        },
        icon: '🔄',
        problem: {
          ko: '**이슈**: 일반 RAG는 첫 검색 결과가 부정확하거나 불충분해도 재시도 없이 그대로 답변 생성. 사내 복잡한 기술 질문의 경우 첫 검색만으로는 적절한 컨텍스트를 확보하지 못해 오답이 잦았습니다.',
          en: '**Issue**: Standard RAG generates answers without retry even when initial search results are inaccurate or insufficient. For complex internal technical questions, single search cannot secure appropriate context, so wrong answers were frequent.',
        },
        solution: {
          ko: '**해결**: GPT-4o-mini 기반 평가 LLM을 도입하여 생성된 답변의 품질을 70점 기준으로 자동 평가. 임계값 미달 시 최대 3회까지 검색어를 개선하여 재검색하는 Self-Corrective Loop 구현. 재시도마다 이전 검색 결과를 누적하여 컨텍스트를 점진적으로 확장.',
          en: '**Solution**: Introduced GPT-4o-mini based evaluation LLM to automatically assess answer quality with 70-point threshold. Implemented Self-Corrective Loop that refines search queries and retries up to 3 times when below threshold. Progressively expands context by accumulating previous search results with each retry.',
        },
        technicalDetails: {
          ko: '```python\\n# 품질 평가 루프\\nQUALITY_THRESHOLD = 70\\nMAX_RETRY = 3\\ncurrent_retry = 0\\n\\nwhile current_retry < MAX_RETRY:\\n    # 답변 생성\\n    answer = generate_answer(passages, question)\\n    \\n    # 품질 평가 (GPT-4o-mini)\\n    eval_result = evaluate_quality(answer, question)\\n    \\n    if eval_result.score >= QUALITY_THRESHOLD:\\n        return answer  # 만족\\n    \\n    # 검색어 개선\\n    refined_query = refine_keywords(\\n        question,\\n        eval_result.suggestions,\\n        accumulated_passages\\n    )\\n    \\n    # 재검색 (누적)\\n    new_passages = search(refined_query)\\n    accumulated_passages.extend(new_passages)\\n    current_retry += 1\\n```\\n\\n**핵심**: Quality Assurance Loop + Progressive Retrieval',
          en: '```python\\n# Quality evaluation loop\\nQUALITY_THRESHOLD = 70\\nMAX_RETRY = 3\\ncurrent_retry = 0\\n\\nwhile current_retry < MAX_RETRY:\\n    # Generate answer\\n    answer = generate_answer(passages, question)\\n    \\n    # Quality evaluation (GPT-4o-mini)\\n    eval_result = evaluate_quality(answer, question)\\n    \\n    if eval_result.score >= QUALITY_THRESHOLD:\\n        return answer  # Satisfactory\\n    \\n    # Refine query\\n    refined_query = refine_keywords(\\n        question,\\n        eval_result.suggestions,\\n        accumulated_passages\\n    )\\n    \\n    # Re-search (accumulate)\\n    new_passages = search(refined_query)\\n    accumulated_passages.extend(new_passages)\\n    current_retry += 1\\n```\\n\\n**Core**: Quality Assurance Loop + Progressive Retrieval',
        },
        csFoundations: [
          'Quality Assurance',
          'Feedback Loop',
          'Progressive Enhancement',
          'RAG Optimization',
        ],
        impact: {
          ko: '**성과**: 첫 검색이 실패한 질문에 자동 회복 경로 확보 — 재시도마다 컨텍스트가 누적되어 답변 근거가 강화됨.',
          en: '**Impact**: Questions that fail the first search now have an automatic recovery path — context accumulates with each retry, strengthening answer grounding.',
        },
        commits: [],
      },
      {
        id: 'progressive-accumulation',
        title: {
          ko: 'Progressive Context: 패시지 누적 시스템',
          en: 'Progressive Context: Passage Accumulation System',
        },
        category: {
          ko: '컨텍스트관리',
          en: 'Context Management',
        },
        icon: '📚',
        problem: {
          ko: '**이슈**: 재검색 시 이전 검색 결과를 버리고 새 결과만 사용하면 유용한 컨텍스트가 손실됨. 특히 복잡한 질문(예: \\"시스템 A와 B의 연동 방법\\")의 경우 첫 검색에서 A 정보, 재검색에서 B 정보를 얻더라도 통합이 안 되어 불완전한 답변 생성.',
          en: '**Issue**: Discarding previous search results during re-search and using only new results leads to loss of useful context. Especially for complex questions (e.g., \\"How to integrate systems A and B\\"), even if first search retrieves A info and re-search retrieves B info, they aren\'t integrated, resulting in incomplete answers.',
        },
        solution: {
          ko: '**해결**: `accumulated_passages` 배열로 재시도마다 새 패시지를 누적 저장. `used_passage_ids` Set으로 중복 ID 필터링하여 동일 문서 재포함 방지. 최종 답변 생성 시 누적된 모든 패시지를 컨텍스트로 제공하여 comprehensive한 답변 가능.',
          en: '**Solution**: Implemented `accumulated_passages` array to accumulate new passages with each retry. Used `used_passage_ids` Set to filter duplicate IDs, preventing re-inclusion of same documents. Provided all accumulated passages as context for final answer generation, enabling comprehensive responses.',
        },
        technicalDetails: {
          ko: '```python\\naccumulated_passages = []\\nused_passage_ids = set()\\n\\ndef search_and_accumulate(query):\\n    # 벡터 검색\\n    new_passages = vector_search(query, top_k=5)\\n    \\n    for passage in new_passages:\\n        # 중복 체크\\n        if passage.id not in used_passage_ids:\\n            accumulated_passages.append(passage)\\n            used_passage_ids.add(passage.id)\\n    \\n    return accumulated_passages\\n\\n# 최종 답변 생성\\nanswer = llm.generate(\\n    question=user_question,\\n    context=accumulated_passages  # 누적된 모든 패시지\\n)\\n```\\n\\n**핵심**: Stateful Retrieval + Deduplication',
          en: '```python\\naccumulated_passages = []\\nused_passage_ids = set()\\n\\ndef search_and_accumulate(query):\\n    # Vector search\\n    new_passages = vector_search(query, top_k=5)\\n    \\n    for passage in new_passages:\\n        # Deduplication\\n        if passage.id not in used_passage_ids:\\n            accumulated_passages.append(passage)\\n            used_passage_ids.add(passage.id)\\n    \\n    return accumulated_passages\\n\\n# Final answer generation\\nanswer = llm.generate(\\n    question=user_question,\\n    context=accumulated_passages  # All accumulated passages\\n)\\n```\\n\\n**Core**: Stateful Retrieval + Deduplication',
        },
        csFoundations: [
          'Stateful Processing',
          'Deduplication',
          'Set Data Structure',
          'Context Window Management',
        ],
        impact: {
          ko: '**성과**: 이전 라운드의 검색 결과가 버려지지 않고 최종 답변에 통합 — 여러 시스템에 걸친 복합 질문의 불완전 답변 감소.',
          en: "**Impact**: Earlier rounds' passages are integrated into the final answer instead of discarded — fewer incomplete answers to questions spanning multiple systems.",
        },
        commits: [],
      },
      {
        id: 'intelligent-refinement',
        title: {
          ko: 'Intelligent Query: LLM 기반 검색어 정제',
          en: 'Intelligent Query: LLM-Based Search Refinement',
        },
        category: {
          ko: '쿼리최적화',
          en: 'Query Optimization',
        },
        icon: '🎯',
        problem: {
          ko: '**이슈**: 사용자 질문이 모호하거나 일상어로 작성되면 벡터 검색 실패율 증가. 예: \\"에이전트가 안돌아가요\\" → 검색 실패 (기술 용어 부재). 도메인 특화 키워드 없이는 정확한 문서 매칭 불가.',
          en: '**Issue**: Vector search failure rate increases when user questions are ambiguous or written in casual language. Example: \\"Agent not working\\" → search fails (lacks technical terms). Cannot accurately match documents without domain-specific keywords.',
        },
        solution: {
          ko: '**해결**: 전처리 단계에서 LLM이 사용자 질문을 분석하여 핵심 키워드 추출 및 기술 용어로 변환. `keywords_to_add` (추가할 도메인 용어), `keywords_to_remove` (불필요한 일상어), `suggested_query` (개선된 쿼리) 자동 생성. 예: \\"안돌아가요\\" → [\\"agent\\", \\"error\\", \\"execution\\", \\"workflow\\"]',
          en: '**Solution**: In preprocessing stage, LLM analyzes user question to extract core keywords and convert to technical terms. Auto-generates `keywords_to_add` (domain terms to add), `keywords_to_remove` (unnecessary casual words), `suggested_query` (refined query). Example: \\"not working\\" → [\\"agent\\", \\"error\\", \\"execution\\", \\"workflow\\"]',
        },
        technicalDetails: {
          ko: '```python\\n# 키워드 추출 및 정제\\nrefinement_prompt = \\"\\"\\"\\n사용자 질문: {user_question}\\n이전 검색 실패: {eval_feedback}\\n\\n다음을 JSON으로 반환:\\n1. keywords_to_add: 추가할 기술 용어\\n2. keywords_to_remove: 제거할 일상어\\n3. suggested_query: 개선된 검색 쿼리\\n\\"\\"\\"\\n\\nrefined = llm.generate(refinement_prompt)\\n# {\\n#   \\"keywords_to_add\\": [\\"FastAPI\\", \\"subprocess\\"],\\n#   \\"keywords_to_remove\\": [\\"안돌아가요\\"],\\n#   \\"suggested_query\\": \\"FastAPI subprocess 실행 오류\\"\\n# }\\n\\n# 개선된 쿼리로 재검색\\npassages = vector_search(refined.suggested_query)\\n```\\n\\n**핵심**: Semantic Query Expansion + Domain Adaptation',
          en: '```python\\n# Keyword extraction and refinement\\nrefinement_prompt = \\"\\"\\"\\nUser question: {user_question}\\nPrevious search failure: {eval_feedback}\\n\\nReturn JSON with:\\n1. keywords_to_add: technical terms to add\\n2. keywords_to_remove: casual words to remove\\n3. suggested_query: refined search query\\n\\"\\"\\"\\n\\nrefined = llm.generate(refinement_prompt)\\n# {\\n#   \\"keywords_to_add\\": [\\"FastAPI\\", \\"subprocess\\"],\\n#   \\"keywords_to_remove\\": [\\"not working\\"],\\n#   \\"suggested_query\\": \\"FastAPI subprocess execution error\\"\\n# }\\n\\n# Re-search with refined query\\npassages = vector_search(refined.suggested_query)\\n```\\n\\n**Core**: Semantic Query Expansion + Domain Adaptation',
        },
        csFoundations: [
          'Query Rewriting',
          'Semantic Search',
          'Natural Language Processing',
          'Domain Adaptation',
        ],
        impact: {
          ko: '**성과**: 기술 용어가 없는 일상어 질문도 도메인 키워드로 변환되어 검색 가능 — 실패 시 평가 피드백을 반영해 쿼리 재작성.',
          en: '**Impact**: Casual questions without technical terms become searchable through domain-keyword rewriting — on failure, the query is rewritten using evaluator feedback.',
        },
        commits: [],
      },
    ],
    architecture: [
      {
        title: {
          ko: 'Self-Corrective RAG Flow',
          en: 'Self-Corrective RAG Flow',
        },
        description: {
          ko: '사용자 질문부터 품질 평가, 재검색, 최종 답변까지의 전체 Self-Corrective RAG 프로세스. 품질 임계값 미달 시 자동으로 검색어개선 및 패시지 누적을 통해 답변 품질을 향상시키는 피드백 루프.',
          en: 'Complete Self-Corrective RAG process from user question through quality evaluation, re-search, to final answer. Feedback loop that automatically refines search queries and accumulates passages to improve answer quality when below threshold.',
        },
        mermaidFilePath: {
          ko: '/architecture/knowledge-base/self-corrective-flow.mmd',
          en: '/architecture/knowledge-base/self-corrective-flow-en.mmd',
        },
      },
      {
        title: {
          ko: 'System Architecture',
          en: 'System Architecture',
        },
        description: {
          ko: 'Agent Builder 기반 워크플로우 엔진과 외부 서비스 통합 아키텍처. Main, Preprocessing, QnA, Evaluation 워크플로우 간의 상호작용 및 데이터 관리 백엔드, LLM 프로바이더, 벡터 DB와의 연동 구조.',
          en: 'Workflow engine based on Agent Builder and external service integration architecture. Interactions between Main, Preprocessing, QnA, and Evaluation workflows, plus integration structure with Data Management Backend, LLM Provider, and Vector DB.',
        },
        mermaidFilePath: {
          ko: '/architecture/knowledge-base/system-architecture.mmd',
          en: '/architecture/knowledge-base/system-architecture-en.mmd',
        },
      },
    ],
  },
  featured: false,
  order: 9,
  scope: 'company',
} satisfies Project;

export default project;
