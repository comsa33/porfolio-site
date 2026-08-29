import type { Project } from '@/types';

const project = {
  id: 'llm-finetuning',
  title: {
    ko: '오픈소스 LLM/SLM QLoRA 파인튜닝',
    en: 'Open-source LLM/SLM QLoRA Fine-tuning',
  },
  shortDescription: {
    ko: '단일 GPU로 한국어 모델을 도메인 특화 학습해 공개한 개인 R&D',
    en: 'Domain-tuned Korean models on a single GPU, released openly',
  },
  fullDescription: {
    ko: '업무와 별개로 오픈소스 모델을 직접 파인튜닝해 공개해 온 개인 연구입니다. 모델은 Hugging Face(MIT), 학습 코드는 GitHub에 공개되어 있어 결과를 직접 확인할 수 있고, 학습한 모델을 영어 시험 학습 서비스에 연결해 실사용까지 완결했습니다.',
    en: 'Personal research, separate from day-to-day work, fine-tuning open-source models and releasing them. The models are on Hugging Face (MIT) and the training code on GitHub, so results are directly verifiable — and the tuned models power a real English-exam study service.',
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
    ko: '2024.05 ~ 2025.05',
    en: 'May 2024 ~ May 2025',
  },
  platformLinks: {
    web: 'https://huggingface.co/comsa33/Llama3-Open-Ko-8B-Instruct-toeic4all',
    github: 'https://github.com/comsa33/finetune-llm',
  },
  featured: false,
  order: 6,
  scope: 'personal',
} satisfies Project;

export default project;
