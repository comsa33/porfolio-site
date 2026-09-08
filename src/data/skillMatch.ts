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
  'LLM Agent': ['agent', '에이전트'],
  'Agent Memory': ['memory', '메모리', '기억', 'mem0'],
  'RAG Pipeline': ['rag'],
  'LLM Evaluation': ['evaluat', '평가', 'judge', 'benchmark', '벤치마크'],
  MCP: ['mcp'],
  DSPy: ['dspy'],
  'LLM Fine-tuning': ['qlora', 'lora', 'fine-tun', 'unsloth', 'trl', 'peft', '파인튜닝'],
  'Multi-Agent Orchestration': ['multi-agent', 'orchestrat', '멀티에이전트', '오케스트레이션'],
  'Sandboxed Execution': ['sandbox', '샌드박스', 'runtime', '런타임'],
  'Distributed Systems': ['distributed', '분산', 'multi-pod', '멀티팟'],
  'Streaming · Pub/Sub': ['sse', 'streaming', 'redis stream', 'pub/sub', 'websocket', '스트리밍'],
  'Async/Concurrency': ['async', 'concurren', '비동기', '멀티프로세스', 'multiprocess'],
  Observability: ['opentelemetry', 'otel', 'prometheus', 'loki', 'grafana'],
};

function haystack(p: Project): string {
  const title = typeof p.title === 'string' ? p.title : `${p.title.ko} ${p.title.en}`;
  return [p.techStack.join(' '), title, p.shortDescription.ko, p.shortDescription.en]
    .join(' ')
    .toLowerCase();
}

/**
 * Short keys ("sse", "rag", "mcp") must match as whole tokens, otherwise
 * they fire inside unrelated words ("messenger", "storage"). Longer keys
 * are stems and may match as substrings.
 */
function matches(hay: string, key: string): boolean {
  if (key.length > 4) return hay.includes(key);
  const escaped = key.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, 'i').test(hay);
}

export function projectMatchesSkill(project: Project, skill: string): boolean {
  const keys = ALIASES[skill] ?? [skill.toLowerCase()];
  const hay = haystack(project);
  return keys.some((k) => matches(hay, k));
}

export function countProjectsForSkill(projects: Project[], skill: string): number {
  return projects.reduce((n, p) => n + (projectMatchesSkill(p, skill) ? 1 : 0), 0);
}
