import type { Project } from '@/types';

const project = {
  id: 'py-editor',
  title: {
    ko: '브라우저 기반 Python 웹 IDE',
    en: 'Browser-based Python Web IDE',
  },
  shortDescription: {
    ko: 'Monaco Editor + Python LSP 연동, 멀티유저 지원 코드 편집 환경',
    en: 'Monaco Editor wired to a Python LSP with multi-user process pooling',
  },
  fullDescription: {
    ko: 'Monaco Editor와 Python LSP를 연동한 VSCode 스타일 웹 IDE입니다. Custom Process Pool을 통해 멀티유저 환경에서도 안정적인 LSP 서비스를 제공하며, WebSocket 기반 저지연 통신으로 실시간 자동완성과 Go-to-Definition을 지원합니다.',
    en: 'VSCode-style web IDE integrating Monaco Editor with Python LSP. Provides stable LSP service in multi-user environments through custom process pooling, and supports real-time auto-completion and go-to-definition via low-latency WebSocket communication.',
  },
  techStack: [
    'Vanilla JS (Vite)',
    'Monaco Editor',
    'Node.js',
    'Express',
    'WebSocket',
    'Python LSP',
    'Docker',
  ],
  keyAchievements: [
    {
      ko: 'Custom Process Pool로 pylsp 효율적 관리 (멀티유저 메모리 최적화)',
      en: 'Efficient pylsp management with custom process pool (multi-user memory optimization)',
    },
    {
      ko: 'WebSocket 양방향 JSON-RPC 프록시 (Monaco ↔ Python LSP)',
      en: 'Bi-directional WebSocket JSON-RPC proxy (Monaco ↔ Python LSP)',
    },
    {
      ko: '1MB 메시지 버퍼링 & Stale Request 자동 정리 (메모리 누수 방지)',
      en: '1MB message buffering & automatic stale request cleanup (memory leak prevention)',
    },
    {
      ko: 'Context-Aware AI Copilot (코드 분석 + RAG 파이프라인)',
      en: 'Context-aware AI Copilot (code analysis + RAG pipeline)',
    },
    {
      ko: '유휴 프로세스 자동 회수 & 좀비 프로세스 방지 로직',
      en: 'Automatic idle process cleanup & zombie process prevention logic',
    },
  ],
  features: [
    'Real-time LSP Integration',
    'Multi-user Process Pooling',
    'WebSocket JSON-RPC Proxy',
    'Context-aware AI Copilot',
    'Git Integration & Diff Viewer',
  ],
  company: {
    ko: '(주)포지큐브',
    en: 'Posicube Inc.',
  },
  period: {
    ko: '2025.06 ~ 2026.02',
    en: 'Jun 2025 ~ Feb 2026',
  },
  detail: {
    problemSolving: [
      {
        id: 'lsp-process-pool',
        title: {
          ko: 'LSP Process Pool 설계',
          en: 'LSP Process Pool Design',
        },
        category: {
          ko: '성능최적화',
          en: 'Performance',
        },
        icon: '🏊',
        problem: {
          ko: '멀티유저 환경에서 각 사용자마다 Python LSP 프로세스를 생성하면 메모리 사용량이 폭발적으로 증가합니다. 20명이 동시 접속하면 20개 pylsp 프로세스 × 150MB = 3GB 메모리 소비.',
          en: 'Creating a Python LSP process for each user in a multi-user environment causes explosive memory growth. 20 concurrent users = 20 pylsp processes × 150MB = 3GB memory consumption.',
        },
        solution: {
          ko: '**Object Pool Pattern** 기반 LSP Process Pool을 설계했습니다. 최대 20개 프로세스로 제한하고, Idle Timeout(5분)으로 자동 정리합니다. 사용자 연결 해제 시 프로세스를 종료하지 않고 Pool에 반환하여 재사용합니다.',
          en: 'Designed LSP Process Pool based on **Object Pool Pattern**. Limited to max 20 processes with idle timeout (5 min) for automatic cleanup. Processes are returned to pool instead of being killed when users disconnect.',
        },
        technicalDetails: {
          ko: `\`\`\`
class LSPProcessPool {
  constructor(maxProcesses = 20, idleTimeout = 300000) {
    this.maxProcesses = maxProcesses;
    this.idleTimeout = idleTimeout;
    this.processes = new Map(); // userId -> process
    this.idleProcesses = [];
  }

  async getOrCreateProcess(userId) {
    // 1. 기존 프로세스 재사용
    if (this.processes.has(userId)) {
      return this.processes.get(userId);
    }
    
    // 2. Idle 프로세스 재활용
    if (this.idleProcesses.length > 0) {
      const process = this.idleProcesses.pop();
      this.processes.set(userId, process);
      return process;
    }
    
    // 3. 새 프로세스 생성 (최대 20개)
    if (this.processes.size < this.maxProcesses) {
      const process = await this.createProcess();
      this.processes.set(userId, process);
      return process;
    }
    
    throw new Error('Process pool exhausted');
  }
  
  releaseProcess(userId) {
    const process = this.processes.get(userId);
    this.processes.delete(userId);
    this.idleProcesses.push(process);
    
    // 5분 후 자동 종료
    setTimeout(() => this.killIdleProcess(process), this.idleTimeout);
  }
}
\`\`\`

**핵심**: 프로세스 재사용으로 사용자당 기동 비용 제거`,
          en: `\`\`\`
class LSPProcessPool {
  constructor(maxProcesses = 20, idleTimeout = 300000) {
    this.maxProcesses = maxProcesses;
    this.idleTimeout = idleTimeout;
    this.processes = new Map(); // userId -> process
    this.idleProcesses = [];
  }

  async getOrCreateProcess(userId) {
    // 1. Reuse existing process
    if (this.processes.has(userId)) {
      return this.processes.get(userId);
    }
    
    // 2. Recycle idle process
    if (this.idleProcesses.length > 0) {
      const process = this.idleProcesses.pop();
      this.processes.set(userId, process);
      return process;
    }
    
    // 3. Create new process (max 20)
    if (this.processes.size < this.maxProcesses) {
      const process = await this.createProcess();
      this.processes.set(userId, process);
      return process;
    }
    
    throw new Error('Process pool exhausted');
  }
  
  releaseProcess(userId) {
    const process = this.processes.get(userId);
    this.processes.delete(userId);
    this.idleProcesses.push(process);
    
    // Auto-kill after 5 min
    setTimeout(() => this.killIdleProcess(process), this.idleTimeout);
  }
}
\`\`\`

**Key**: Process reuse removes per-user startup cost`,
        },
        csFoundations: [
          'Object Pool Pattern',
          'Resource Management',
          'Lazy Initialization',
          'Cache Eviction',
        ],
        impact: {
          ko: '프로세스 수 상한·유휴 회수·재사용으로 동시 사용자가 늘어도 메모리가 선형으로 증가하지 않음',
          en: 'With a process cap, idle reclamation, and reuse, memory no longer grows linearly with concurrent users',
        },
      },
      {
        id: 'concurrency-limiter',
        title: {
          ko: 'LLM API Concurrency Limiter',
          en: 'LLM API Concurrency Limiter',
        },
        category: {
          ko: '동시성',
          en: 'Concurrency',
        },
        icon: '🚦',
        problem: {
          ko: '100개의 동시 AI Copilot 요청이 발생하면 각 요청마다 context building(메모리 집약적)이 실행되어 서버 메모리 스파이크 발생. 백엔드 LB로도 해결 불가.',
          en: '100 concurrent AI Copilot requests trigger context building (memory intensive) for each request, causing server memory spikes. Backend LB cannot prevent this.',
        },
        solution: {
          ko: '`p-limit` 라이브러리 기반 Concurrency Limiter를 구현했습니다. 최대 10개 동시 요청으로 제한하고, 초과 요청은 자동으로 대기열에 적재됩니다. Statistics tracking으로 모니터링합니다.',
          en: 'Implemented Concurrency Limiter based on `p-limit` library. Limited to max 10 concurrent requests with automatic queueing for excess requests. Includes statistics tracking for monitoring.',
        },
        technicalDetails: {
          ko: `\`\`\`
const pLimit = require('p-limit');

class ConcurrencyLimiter {
  constructor(maxConcurrent = 10) {
    this.limit = pLimit(maxConcurrent);
    this.stats = {
      currentActive: 0,
      currentQueued: 0,
      peakActive: 0,
      peakQueued: 0
    };
  }
  
  async execute(fn) {
    this.stats.currentQueued++;
    
    return this.limit(async () => {
      this.stats.currentQueued--;
      this.stats.currentActive++;
      
      try {
        const result = await fn();
        return result;
      } finally {
        this.stats.currentActive--;
      }
    });
  }
  
  getStats() {
    return this.stats;
  }
}

// Usage
const limiter = new ConcurrencyLimiter(10);
await limiter.execute(() => callLLMAPI());
\`\`\`

**핵심**: Semaphore 패턴으로 동시 실행 제한`,
          en: `\`\`\`
const pLimit = require('p-limit');

class ConcurrencyLimiter {
  constructor(maxConcurrent = 10) {
    this.limit = pLimit(maxConcurrent);
    this.stats = {
      currentActive: 0,
      currentQueued: 0,
      peakActive: 0,
      peakQueued: 0
    };
  }
  
  async execute(fn) {
    this.stats.currentQueued++;
    
    return this.limit(async () => {
      this.stats.currentQueued--;
      this.stats.currentActive++;
      
      try {
        const result = await fn();
        return result;
      } finally {
        this.stats.currentActive--;
      }
    });
  }
  
  getStats() {
    return this.stats;
  }
}

// Usage
const limiter = new ConcurrencyLimiter(10);
await limiter.execute(() => callLLMAPI());
\`\`\`

**Key**: Semaphore pattern limits concurrent execution`,
        },
        csFoundations: ['Rate Limiting', 'Semaphore', 'Queue Management', 'Backpressure'],
        impact: {
          ko: '동시 LLM 호출 상한으로 메모리 스파이크 제거 — 큐 기반 백프레셔로 과부하에서도 응답성 유지',
          en: 'A concurrency cap removes memory spikes — queue-based backpressure keeps the server responsive under load',
        },
      },
      {
        id: 'path-access-control',
        title: {
          ko: 'Path-based Access Control',
          en: 'Path-based Access Control',
        },
        category: {
          ko: '보안',
          en: 'Security',
        },
        icon: '🛡️',
        problem: {
          ko: '브라우저 클라이언트가 시스템 경로(/constants, /llms)에 접근하면 민감한 설정 파일이 노출됩니다. 외부 FastAPI 서비스는 모든 경로 접근이 필요하지만, 브라우저는 /workspace만 허용해야 합니다.',
          en: 'Browser clients accessing system paths (/constants, /llms) exposes sensitive configuration files. External FastAPI services need full path access, but browsers should only access /workspace.',
        },
        solution: {
          ko: '**X-Service-Auth 헤더** 기반 인증으로 호출자를 구분합니다. 토큰이 있으면 외부 서비스로 인식하여 전체 경로 허용, 없으면 브라우저 클라이언트로 간주하여 /workspace만 허용합니다.',
          en: 'Implemented caller distinction based on **X-Service-Auth header**. With token = external service (full access), without token = browser client (workspace only).',
        },
        technicalDetails: {
          ko: `\`\`\`
function pathAccessControl(req, res, next) {
  const authHeader = req.headers['x-service-auth'];
  const isService = authHeader === process.env.SERVICE_AUTH_TOKEN;
  
  // External service: full access
  if (isService) {
    return next();
  }
  
  // Browser client: check restricted paths
  const folder = req.query.folder || '';
  const RESTRICTED = ['/constants', '/llms'];
  
  for (const restricted of RESTRICTED) {
    const normalized = restricted.replace(/^\\/+/, '');
    const folderPath = folder.replace(/^\\/+/, '');
    
    if (folderPath === normalized || 
        folderPath.startsWith(normalized + '/')) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Browser clients cannot access system paths'
      });
    }
  }
  
  next();
}

app.use('/api/files', pathAccessControl);
\`\`\`

**핵심**: Middleware로 경로 기반 격리 구현`,
          en: `\`\`\`
function pathAccessControl(req, res, next) {
  const authHeader = req.headers['x-service-auth'];
  const isService = authHeader === process.env.SERVICE_AUTH_TOKEN;
  
  // External service: full access
  if (isService) {
    return next();
  }
  
  // Browser client: check restricted paths
  const folder = req.query.folder || '';
  const RESTRICTED = ['/constants', '/llms'];
  
  for (const restricted of RESTRICTED) {
    const normalized = restricted.replace(/^\\/+/, '');
    const folderPath = folder.replace(/^\\/+/, '');
    
    if (folderPath === normalized || 
        folderPath.startsWith(normalized + '/')) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Browser clients cannot access system paths'
      });
    }
  }
  
  next();
}

app.use('/api/files', pathAccessControl);
\`\`\`

**Key**: Path-based isolation via middleware`,
        },
        csFoundations: [
          'Authorization',
          'Middleware Pattern',
          'Principle of Least Privilege',
          'Multi-tenancy',
        ],
        impact: {
          ko: '브라우저는 /workspace만, 인증된 서비스는 전체 경로 — 최소 권한 원칙으로 시스템 경로 노출 차단',
          en: 'Browsers reach only /workspace while authenticated services get full paths — least privilege blocks system-path exposure',
        },
      },
    ],
    architecture: [
      {
        title: {
          ko: '시스템 아키텍처',
          en: 'System Architecture',
        },
        description: {
          ko: '웹 IDE의 전체 시스템 구조. Client Layer, WebSocket Layer, Middleware, Service Layer, API Layer, External Resources 간의 상호작용을 보여줍니다.',
          en: 'Overall system structure of the web IDE. Shows interactions between Client Layer, WebSocket Layer, Middleware, Service Layer, API Layer, and External Resources.',
        },
        mermaidFilePath: {
          ko: '/architecture/pyeditor/system-architecture.mmd',
          en: '/architecture/pyeditor/system-architecture-en.mmd',
        },
      },
      {
        title: {
          ko: 'LSP WebSocket 통신 플로우',
          en: 'LSP WebSocket Communication Flow',
        },
        description: {
          ko: 'WebSocket 연결부터 LSP 요청/응답, 파일 변경 감지, Git 동기화, 연결 종료까지의 전체 흐름. Process Pool에서의 프로세스 할당/반환 및 Cache 관리 메커니즘을 포함합니다.',
          en: 'Complete flow from WebSocket connection to LSP request/response, file change detection, Git synchronization, and connection cleanup. Includes process allocation/release from pool and cache management mechanisms.',
        },
        mermaidFilePath: {
          ko: '/architecture/pyeditor/lsp-websocket-flow.mmd',
          en: '/architecture/pyeditor/lsp-websocket-flow-en.mmd',
        },
      },
    ],
  },
  featured: false,
  order: 9,
  scope: 'company',
} satisfies Project;

export default project;
