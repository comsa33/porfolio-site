import type { Project } from '@/types';

const project = {
  id: 'llm-finetuning',
  title: {
    ko: '오픈소스 LLM/SLM 파인튜닝 & 평가 벤치마크',
    en: 'Open-source LLM/SLM Fine-tuning & Benchmarks',
  },
  shortDescription: {
    ko: '모델·데이터셋·코드를 공개한 개인 R&D (단일 GPU QLoRA)',
    en: 'Personal R&D with openly released models, datasets, and code (single-GPU QLoRA)',
  },
  fullDescription: {
    ko: '업무와 별개로 오픈소스 모델을 직접 파인튜닝하고, LLM·에이전트 품질을 측정하는 평가 벤치마크를 구축해 공개해 온 개인 연구입니다. 모델과 데이터셋은 Hugging Face, 코드는 GitHub에 공개되어 있어 결과를 직접 확인할 수 있습니다.',
    en: 'Personal research, separate from day-to-day work, fine-tuning open-source models and building public benchmarks for LLM and agent quality. Models and datasets are on Hugging Face and the code is on GitHub, so the results are directly verifiable.',
  },
  techStack: [
    'PyTorch',
    'Unsloth',
    'TRL (SFTTrainer)',
    'PEFT/QLoRA',
    'Hugging Face Transformers·Hub',
    'GGUF (llama.cpp)',
    'Flutter',
  ],
  keyAchievements: [
    {
      ko: 'Llama-3-Open-Ko-8B(8B)와 Gemma-ko-2b(2B)를 영어 시험 문항 생성 태스크로 도메인 특화 파인튜닝 후 공개',
      en: 'Fine-tuned and released Llama-3-Open-Ko-8B (8B) and Gemma-ko-2b (2B) for English exam-item generation',
    },
    {
      ko: 'RTX 3090 24GB 단일 GPU 제약에서 4bit 양자화 로딩 기반 QLoRA로 SFT 수행 (LoRA r=32 / α=64 / dropout 0.05)',
      en: 'Ran SFT via 4-bit QLoRA under a single RTX 3090 24GB (LoRA r=32 / α=64 / dropout 0.05)',
    },
    {
      ko: '어댑터를 어텐션과 MLP 전 프로젝션에 임베딩·출력층까지 포함해 적용, gradient checkpointing·accumulation으로 메모리 한계 아래 학습 성립',
      en: 'Applied adapters across all attention and MLP projections including embedding and output layers, fitting training under the memory ceiling with gradient checkpointing and accumulation',
    },
    {
      ko: '학습 데이터셋 직접 구축 — 문항 생성 태스크용 QA 데이터셋을 설계·구축하고 모델 출력이 JSON 스키마를 지키도록 학습 데이터 형식(Alpaca 계열 지시 포맷)을 규정',
      en: 'Built the training data from scratch — designed a QA dataset for item generation and specified an Alpaca-style instruction format that enforces JSON-schema-conformant output',
    },
    {
      ko: '학습 모델을 GGUF(q8_0)로 양자화해 로컬 추론이 가능한 형태로 배포, 문항 생성 관리자 백엔드·조회 API·인증 서버·모바일 앱(Flutter)까지 연결해 엔드투엔드 서비스로 완성',
      en: 'Quantized to GGUF (q8_0) for local inference and wired it end-to-end — item-generation admin backend, query API, auth server, and a Flutter mobile app',
    },
    {
      ko: '한국어 주거정책 long-context RAG 벤치마크 구축·공개 — 41개 공식 공고 기반 QA 1,997문항, 32k~512k 컨텍스트 티어 (Hugging Face 데이터셋, CC-BY-4.0)',
      en: 'Built and released a Korean housing-policy long-context RAG benchmark — 1,997 QA items from 41 official notices across 32k–512k context tiers (Hugging Face dataset, CC-BY-4.0)',
    },
    {
      ko: '상용 API 4종 + 오픈웨이트 3종을 LLM-judge로 채점하고 사람 라벨 표본과 대조 — 일치율 96.2%, Cohen’s κ 0.924',
      en: 'Scored 4 commercial APIs and 3 open-weight models with an LLM judge, validated against human labels — 96.2% agreement, Cohen’s κ 0.924',
    },
  ],
  features: [
    'QLoRA Fine-tuning (single GPU)',
    'Custom Instruction Dataset',
    'GGUF Quantization',
    'Open Model & Dataset Release',
    'End-to-end Service Integration',
  ],
  company: {
    ko: '개인 연구 (오픈소스 공개)',
    en: 'Personal R&D (open-sourced)',
  },
  period: {
    ko: '2024.05 ~ 현재',
    en: 'May 2024 ~ Present',
  },
  platformLinks: {
    web: 'https://huggingface.co/comsa33',
    github: 'https://github.com/comsa33',
  },
  featured: false,
  order: 5,
  scope: 'personal',
} satisfies Project;

export default project;
