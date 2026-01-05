
export enum AgentStatus {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  PERCEIVING = 'PERCEIVING',
  REASONING = 'REASONING',
  VERIFYING_CODE = 'VERIFYING_CODE',
  VERIFYING = 'VERIFYING',
  EXECUTING = 'EXECUTING',
  TEACHING = 'TEACHING',
  LEARNING = 'LEARNING'
}

export enum ModalityType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  SENSOR = 'SENSOR',
  CODE = 'CODE'
}

export interface ThoughtStep {
  id: string;
  timestamp: number;
  status: AgentStatus;
  description: string;
  modalityUsed?: ModalityType[];
  confidence: number;
  hash: string; // Cryptographic Seal
}

export interface Insight {
  id: string;
  title: string;
  content: string;
  causalityScore: number;
  evidence: string[]; // Base64 or URLs
  recommendation: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface TutorialModule {
  title: string;
  steps: string[];
  summary: string;
}

export interface SystemState {
  isOrchestrating: boolean;
  status: AgentStatus;
  thoughts: ThoughtStep[];
  insights: Insight[];
  activeObjective: string;
  currentCodeSnippet?: string;
  verificationLogs: string[];
  activeTutorial?: TutorialModule;
}
