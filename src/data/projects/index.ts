import type { Project } from '@/types';
import agenticHarness from './agentic-harness';
import pyRunner from './py-runner';
import logCollector from './log-collector';
import opicMaster from './opic-master';
import evaluator from './evaluator';
import pyEditor from './py-editor';
import knowledgeBase from './knowledge-base';
import squareMessenger from './square-messenger';
import agentMemory from './agent-memory';
import llmFinetuning from './llm-finetuning';

// 표시 순서는 각 프로젝트의 order 필드가 결정한다. 이 배열 순서는 무관.
export const projects: Project[] = [
  agenticHarness,
  pyRunner,
  logCollector,
  opicMaster,
  evaluator,
  pyEditor,
  knowledgeBase,
  squareMessenger,
  agentMemory,
  llmFinetuning,
];
