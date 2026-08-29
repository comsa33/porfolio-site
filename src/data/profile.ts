import type { Profile } from '@/types';

export const profile = {
  name: {
    ko: '이루오',
    en: 'Ruo Lee',
  },
  title: 'AI Agent Platform Developer',
  email: 'comsa333@gmail.com',
  github: 'https://github.com/comsa33',
  linkedin: 'https://www.linkedin.com/in/ruo-lee-79864522a',
  story: {
    ko: '디자이너로 시작해 34개국을 여행하며 얻은 통찰을, 이제 AI 기술로 구현합니다',
    en: 'From Designer to World Traveler to AI Engineer — Building Intelligent Systems with Global Perspective',
  },
  intro: {
    ko: '{years}년차 AI 엔지니어입니다. AI 모델을 만드는 일에서 시작해, 지금은 모델이 실제로 동작하는 시스템을 만듭니다. LLM 에이전트의 실행 런타임과 오케스트레이션, 메모리, 품질 평가까지 전 계층을 설계하고 구현합니다.',
    en: 'A {years} AI engineer. I started out building models and now build the systems they actually run in — designing and implementing every layer of an LLM agent platform: execution runtime, orchestration, memory, and quality evaluation.',
  },
  coreSkills: {
    backend: {
      title: {
        ko: 'Backend & Infrastructure',
        en: 'Backend & Infrastructure',
      },
      skills: ['Python', 'FastAPI', 'Kubernetes', 'Redis', 'Elasticsearch', 'PostgreSQL'],
    },
    ai: {
      title: {
        ko: 'AI & LLM',
        en: 'AI & LLM',
      },
      skills: ['LLM Agent', 'MCP', 'RAG Pipeline', 'DSPy', 'QLoRA Fine-tuning'],
    },
    system: {
      title: {
        ko: 'System Design',
        en: 'System Design',
      },
      skills: [
        'Multi-Agent Orchestration',
        'Async/Concurrency',
        'Distributed Systems',
        'OpenTelemetry',
      ],
    },
  },
  certifications: [
    {
      id: 'iso-42001',
      name: {
        ko: 'ISO/IEC 42001 AI 경영시스템 심사원',
        en: 'ISO/IEC 42001 AI MS Auditor',
      },
      issuer: 'ISOC (ISO Certification)',
      date: '2026.01',
      certificateNumber: 'ISOC-AI-26006',
      pdfPath: '/certificates/iso_42001_certificate.png',
    },
    {
      id: 'iso-19011',
      name: {
        ko: 'ISO 19011 경영시스템 심사원',
        en: 'ISO 19011 MS Auditor',
      },
      issuer: 'ISOC (ISO Certification)',
      date: '2026.01',
      certificateNumber: 'ISOC-AS-26009',
      pdfPath: '/certificates/iso_19011_certificate.png',
    },
  ],
} satisfies Profile;
