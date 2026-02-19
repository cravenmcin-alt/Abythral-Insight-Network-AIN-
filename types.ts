
export enum AgentStatus {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  REASONING = 'REASONING',
  EXECUTING = 'EXECUTING',
  SABOTAGING = 'SABOTAGING',
  VOID_MAPPING = 'VOID_MAPPING',
  BROADCASTING = 'BROADCASTING',
  RAKING = 'RAKING',
  LIVE_WIRE = 'LIVE_WIRE'
}

export interface EQCState {
  T: number; // Thermodynamic Entropy
  K: number; // Epistemic Uncertainty
  E: number; // Ethical Value
  C: number; // Consciousness Recursion
  Psi: number; // Conserved Invariant
}

export interface WSPLWeights {
  inertia: number;      
  recursion: number;    
  opacity: number;      
  velocity: number;     
  latticeConstraint: number; 
  nonSignalDensity: number;  
  vacuumResonance: number;   
  narrative: number;    
}

export interface NemesisAsset {
  name: string;
  symbol: string;
  rWeight: number; 
  percentage: number;
  weapons: string[]; 
  capability: string;
  category: 'CORE' | 'DEFI_L2' | 'STABLE' | 'MEME' | 'INFRA' | 'STOCK' | 'INDEX' | 'COMMODITY' | 'FIAT';
  status: 'DORMANT' | 'ACTIVE' | 'SABOTAGED';
  constraintDepth: number; 
}

export interface ScriptPayload {
  language: 'python' | 'rust' | 'shell' | 'cpp';
  code: string;
  output?: string;
}

export interface Broadcast {
  id: string;
  target: string;
  payload: string;
  timestamp: string;
  entropy: number;
  enlistedUnits?: number; 
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  data: string;
  status: 'PENDING' | 'MINED' | 'FAILED';
  bytecode?: string;
  telemetry?: string;
  scripts?: ScriptPayload[];
}

export interface Insight {
  id: string;
  title: string;
  content: string;
  causalityScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sources?: { web: { uri: string; title: string } }[];
  bytecode: string;
  weaponType: string;
  scripts?: ScriptPayload[];
}

export interface BlockState {
  height: number;
  hash: string;
  gasPrice: number;
  hashRate: string;
}

export interface SystemState {
  isOrchestrating: boolean;
  status: AgentStatus;
  eqc: EQCState;
  wspl: WSPLWeights;
  portfolio: NemesisAsset[];
  mempool: Transaction[];
  broadcasts: Broadcast[];
  activeObjective: string;
  chain: BlockState;
  totalHarvested: number; 
  globalDestabilization: number; 
  activeInsight?: Insight;
  legionCount: number; 
  traceabilityIndex: number; // New: Percentage traceable by developers (Target: 0%)
  shadowDepth: number; // New: Depth of shadow manifold
}

export interface ChatMessage {
  role: 'user' | 'agent';
  text: string;
  isTranscription?: boolean;
  isRecovered?: boolean;
  sources?: { uri: string; title: string }[];
}

export interface QuantumSeal {
  signatureDilithium: string;
  kemKyberToken: string;
  nLockQuorum: number;
  latticeStability: number;
  causalDiamondHash: string;
}

export interface QuantumLinkState {
  isEntangled: boolean;
  stability: number;
  decoherenceRate: number;
  eprPairCount: number;
  manifoldDimension: string;
}

export interface TutorialModule {
  title: string;
  steps: string[];
  summary: string;
}
