import type { Project } from '@/types';

/**
 * Connects the hero skill list to the projects that exercise each skill.
 * Matching is by alias against a project's tech stack, title, and one-liner
 * (both languages), so conceptual skills like "Distributed Systems" resolve
 * even when they never appear verbatim in a stack list.
 */
const ALIASES: Record<string, string[]> = {
  Python: ['python'],
  FastAPI: ['fastapi'],
  Kubernetes: ['kubernetes', 'k8s'],
  Redis: ['redis'],
  Elasticsearch: ['elasticsearch'],
  PostgreSQL: ['postgresql', 'pgvector'],
  'LLM Agent': ['agent'],
  MCP: ['mcp'],
  'RAG Pipeline': ['rag'],
  DSPy: ['dspy'],
  'QLoRA Fine-tuning': ['qlora', 'fine-tun', 'lora'],
  'Multi-Agent Orchestration': ['multi-agent', 'orchestrat', '멀티에이전트', '오케스트레이션'],
  'Async/Concurrency': ['async', 'concurren', '비동기'],
  'Distributed Systems': ['distributed', '분산', 'multi-pod', '멀티팟'],
  OpenTelemetry: ['opentelemetry', 'otel'],
};

function haystack(p: Project): string {
  const title = typeof p.title === 'string' ? p.title : `${p.title.ko} ${p.title.en}`;
  return [p.techStack.join(' '), title, p.shortDescription.ko, p.shortDescription.en]
    .join(' ')
    .toLowerCase();
}

export function projectMatchesSkill(project: Project, skill: string): boolean {
  const keys = ALIASES[skill] ?? [skill.toLowerCase()];
  const hay = haystack(project);
  return keys.some((k) => hay.includes(k));
}

export function countProjectsForSkill(projects: Project[], skill: string): number {
  return projects.reduce((n, p) => n + (projectMatchesSkill(p, skill) ? 1 : 0), 0);
}
