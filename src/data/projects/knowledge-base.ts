import type { Project } from '@/types';

const project = {
  id: 'knowledge-base',
  title: {
    ko: '사내 지식베이스 RAG',
    en: 'Internal Knowledge Base RAG',
  },
  shortDescription: {
    ko: '품질 평가 기반 반복 검색 RAG',
    en: 'RAG with quality-gated re-search',
  },
  fullDescription: {
    ko: '사내에 흩어진 문서를 대상으로 한 Self-Corrective RAG 질의응답 시스템입니다.',
    en: 'A Self-Corrective RAG Q&A system over scattered internal documents.',
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
      ko: 'Query Refinement',
      en: 'Query Refinement',
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
  peekLine: {
    ko: '임계값에 못 미친 답변은 검색어를 고쳐 최대 3회 다시 찾는 자기교정 루프',
    en: 'A self-correcting loop refines the query and retries up to three times.',
  },
  keyAchievements: [
    {
      ko: '답변 품질이 임계값 미만이면 검색어를 고쳐 최대 3회 재검색',
      en: 'Re-searches up to 3 times with a refined query when answer quality falls below threshold',
    },
    {
      ko: '일상어 질문을 도메인 기술 용어로 바꾸는 LLM 검색어 정제',
      en: 'LLM query refinement that rewrites casual questions into domain terms',
    },
    {
      ko: '재시도마다 패시지 누적·중복 제거, 여러 시스템에 걸친 질문의 답변 보강',
      en: 'Passages accumulate across retries (deduplicated) to fill out multi-part answers',
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
          ko: '```python\\n# 품질 평가 루프\\nQUALITY_THRESHOLD = 70\\nMAX_RETRY = 3\\ncurrent_retry = 0\\n\\nwhile current_retry < MAX_RETRY:\\n    # 답변 생성\\n    answer = generate_answer(passages, question)\\n    \\n    # 품질 평가 (GPT-4o-mini)\\n    eval_result = evaluate_quality(answer, question)\\n    \\n    if eval_result.score >= QUALITY_THRESHOLD:\\n        return answer  # 만족\\n    \\n    # 검색어 개선\\n    refined_query = refine_keywords(\\n        question,\\n        eval_result.suggestions,\\n        accumulated_passages\\n    )\\n    \\n    # 재검색 (누적)\\n    new_passages = search(refined_query)\\n    accumulated_passages.extend(new_passages)\\n    current_retry += 1\\n```',
          en: '```python\\n# Quality evaluation loop\\nQUALITY_THRESHOLD = 70\\nMAX_RETRY = 3\\ncurrent_retry = 0\\n\\nwhile current_retry < MAX_RETRY:\\n    # Generate answer\\n    answer = generate_answer(passages, question)\\n    \\n    # Quality evaluation (GPT-4o-mini)\\n    eval_result = evaluate_quality(answer, question)\\n    \\n    if eval_result.score >= QUALITY_THRESHOLD:\\n        return answer  # Satisfactory\\n    \\n    # Refine query\\n    refined_query = refine_keywords(\\n        question,\\n        eval_result.suggestions,\\n        accumulated_passages\\n    )\\n    \\n    # Re-search (accumulate)\\n    new_passages = search(refined_query)\\n    accumulated_passages.extend(new_passages)\\n    current_retry += 1\\n```',
        },
        csFoundations: [
          'Quality Assurance',
          'Feedback Loop',
          'Progressive Enhancement',
          'RAG Optimization',
        ],
        impact: {
          ko: '**성과**: 첫 검색에서 근거를 못 찾은 질문도 재검색으로 답변.',
          en: '**Impact**: Questions whose first search misses still get answered through re-search.',
        },
        commits: [],
      },
      {
        id: 'progressive-accumulation',
        title: {
          ko: '패시지 누적',
          en: 'Passage Accumulation',
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
          ko: '**해결**: `accumulated_passages` 배열로 재시도마다 새 패시지를 누적 저장. `used_passage_ids` Set으로 중복 ID 필터링하여 동일 문서 재포함 방지. 최종 답변 생성 시 누적 패시지 전체를 컨텍스트로 제공.',
          en: '**Solution**: Implemented `accumulated_passages` array to accumulate new passages with each retry. Used `used_passage_ids` Set to filter duplicate IDs, preventing re-inclusion of same documents. Provided all accumulated passages as context for final answer generation.',
        },
        technicalDetails: {
          ko: '```python\\naccumulated_passages = []\\nused_passage_ids = set()\\n\\ndef search_and_accumulate(query):\\n    # 벡터 검색\\n    new_passages = vector_search(query, top_k=5)\\n    \\n    for passage in new_passages:\\n        # 중복 체크\\n        if passage.id not in used_passage_ids:\\n            accumulated_passages.append(passage)\\n            used_passage_ids.add(passage.id)\\n    \\n    return accumulated_passages\\n\\n# 최종 답변 생성\\nanswer = llm.generate(\\n    question=user_question,\\n    context=accumulated_passages  # 누적된 모든 패시지\\n)\\n```',
          en: '```python\\naccumulated_passages = []\\nused_passage_ids = set()\\n\\ndef search_and_accumulate(query):\\n    # Vector search\\n    new_passages = vector_search(query, top_k=5)\\n    \\n    for passage in new_passages:\\n        # Deduplication\\n        if passage.id not in used_passage_ids:\\n            accumulated_passages.append(passage)\\n            used_passage_ids.add(passage.id)\\n    \\n    return accumulated_passages\\n\\n# Final answer generation\\nanswer = llm.generate(\\n    question=user_question,\\n    context=accumulated_passages  # All accumulated passages\\n)\\n```',
        },
        csFoundations: [
          'Stateful Processing',
          'Deduplication',
          'Set Data Structure',
          'Context Window Management',
        ],
        impact: {
          ko: '**성과**: 이전 검색 결과까지 최종 답변에 반영, 여러 시스템에 걸친 질문의 불완전 답변 감소.',
          en: '**Impact**: Earlier results feed the final answer, reducing incomplete answers to questions spanning multiple systems.',
        },
        commits: [],
      },
      {
        id: 'intelligent-refinement',
        title: {
          ko: 'LLM 기반 검색어 정제',
          en: 'LLM-Based Query Refinement',
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
          ko: '```python\\n# 키워드 추출 및 정제\\nrefinement_prompt = \\"\\"\\"\\n사용자 질문: {user_question}\\n이전 검색 실패: {eval_feedback}\\n\\n다음을 JSON으로 반환:\\n1. keywords_to_add: 추가할 기술 용어\\n2. keywords_to_remove: 제거할 일상어\\n3. suggested_query: 개선된 검색 쿼리\\n\\"\\"\\"\\n\\nrefined = llm.generate(refinement_prompt)\\n# {\\n#   \\"keywords_to_add\\": [\\"FastAPI\\", \\"subprocess\\"],\\n#   \\"keywords_to_remove\\": [\\"안돌아가요\\"],\\n#   \\"suggested_query\\": \\"FastAPI subprocess 실행 오류\\"\\n# }\\n\\n# 개선된 쿼리로 재검색\\npassages = vector_search(refined.suggested_query)\\n```',
          en: '```python\\n# Keyword extraction and refinement\\nrefinement_prompt = \\"\\"\\"\\nUser question: {user_question}\\nPrevious search failure: {eval_feedback}\\n\\nReturn JSON with:\\n1. keywords_to_add: technical terms to add\\n2. keywords_to_remove: casual words to remove\\n3. suggested_query: refined search query\\n\\"\\"\\"\\n\\nrefined = llm.generate(refinement_prompt)\\n# {\\n#   \\"keywords_to_add\\": [\\"FastAPI\\", \\"subprocess\\"],\\n#   \\"keywords_to_remove\\": [\\"not working\\"],\\n#   \\"suggested_query\\": \\"FastAPI subprocess execution error\\"\\n# }\\n\\n# Re-search with refined query\\npassages = vector_search(refined.suggested_query)\\n```',
        },
        csFoundations: [
          'Query Rewriting',
          'Semantic Search',
          'Natural Language Processing',
          'Domain Adaptation',
        ],
        impact: {
          ko: '**성과**: 기술 용어 없는 일상어 질문도 검색 가능.',
          en: '**Impact**: Casual questions without technical terms become searchable.',
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
          ko: '사용자 질문부터 품질 평가, 재검색, 최종 답변까지의 Self-Corrective RAG 흐름. 임계값 미달 시 검색어 개선과 패시지 누적을 반복.',
          en: 'Self-Corrective RAG flow from user question through quality evaluation and re-search to the final answer. Below threshold, it refines the query and accumulates passages.',
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
  order: 8,
  scope: 'company',
} satisfies Project;

export default project;
