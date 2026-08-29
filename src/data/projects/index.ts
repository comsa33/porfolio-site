import type { Project } from '@/types';
import agenticHarness from './agentic-harness';
import pyRunner from './py-runner';
import opicMaster from './opic-master';
import evaluator from './evaluator';
import pyEditor from './py-editor';
import knowledgeBase from './knowledge-base';
import squareMessenger from './square-messenger';
import agentMemory from './agent-memory';
import llmFinetuning from './llm-finetuning';
import krLongragBench from './kr-longrag-bench';
import culturefitMatching from './culturefit-matching';
import patentNewsRag from './patent-news-rag';
import gptRecruit from './gpt-recruit';

// 표시 순서는 각 프로젝트의 order 필드가 결정한다. 이 배열 순서는 무관.
export const projects: Project[] = [
  agenticHarness,
  pyRunner,
  opicMaster,
  evaluator,
  pyEditor,
  knowledgeBase,
  squareMessenger,
  agentMemory,
  llmFinetuning,
  krLongragBench,
  culturefitMatching,
  patentNewsRag,
  gptRecruit,
];
