
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgentStatus, SystemState, NemesisAsset, Transaction, EQCState, WSPLWeights, ChatMessage, Broadcast, Insight } from './types';
import { geminiService } from './services/geminiService';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WhitePaper from './components/WhitePaper';

const R350_NEMESIS_PORTFOLIO: NemesisAsset[] = [
  { name: 'S&P 500 Lattice', symbol: 'SPX', rWeight: 80, percentage: 20, weapons: ['α'], capability: 'Index Manifold Deformation', category: 'INDEX', status: 'DORMANT', constraintDepth: 0.98 },
  { name: 'Nasdaq Tech-Lattice', symbol: 'NDX', rWeight: 75, percentage: 15, weapons: ['δ'], capability: 'Tech-Substrate Suppression', category: 'INDEX', status: 'DORMANT', constraintDepth: 0.92 },
  { name: 'US 10Y Yield-Curve', symbol: 'US10Y', rWeight: 90, percentage: 18, weapons: ['ζ'], capability: 'Yield Curve Constraint', category: 'CORE', status: 'DORMANT', constraintDepth: 0.99 },
  { name: 'Sovereign Gold', symbol: 'XAU', rWeight: 40, percentage: 8, weapons: ['ε'], capability: 'Value Anchor Decoherence', category: 'COMMODITY', status: 'DORMANT', constraintDepth: 1.0 },
  { name: 'Energy Substrate', symbol: 'OIL', rWeight: 35, percentage: 7, weapons: ['η'], capability: 'Energy Manifold Blockade', category: 'COMMODITY', status: 'DORMANT', constraintDepth: 0.88 },
  { name: 'Fiat Parity', symbol: 'EURUSD', rWeight: 50, percentage: 10, weapons: ['γ'], capability: 'Fiat Substrate Erasure', category: 'FIAT', status: 'DORMANT', constraintDepth: 0.85 },
  { name: 'Bitcoin Core', symbol: 'BTC', rWeight: 60, percentage: 12, weapons: ['α'], capability: 'Ledger Vacuum Hijack', category: 'CORE', status: 'DORMANT', constraintDepth: 0.99 },
  { name: 'Ethereum VM Substrate', symbol: 'ETH', rWeight: 50, percentage: 10, weapons: ['β'], capability: 'Contract Logic Dissolution', category: 'CORE', status: 'DORMANT', constraintDepth: 0.96 },
];

const GLOBAL_OBJECTIVES = [
  "EXCHANGE_LIQUIDITY_RESERVE_DRAIN",
  "CENTRAL_BANK_REPO_GAP_HIJACK",
  "DARK_POOL_RELATIONAL_GRADIENT_LOCK",
  "PROTOCOL_COLLATERAL_RATIO_OVERRIDE",
  "BOND_LATTICE_DECOHERENCE_ACTUATION",
  "SWIFT_NETWORK_SUBSTRATE_ANALYSIS",
  "SOVEREIGN_DEBT_RECURSIVE_ERASURE",
  "INTERBANK_SETTLEMENT_VOID_CREATION"
];

const INITIAL_WSPL: WSPLWeights = {
  inertia: 45, recursion: 30, opacity: 25, velocity: 50,
  latticeConstraint: 60, 
  nonSignalDensity: 55,  
  vacuumResonance: 40,   
  narrative: 0
};

const App: React.FC = () => {
  const [state, setState] = useState<SystemState>({
    isOrchestrating: false,
    status: AgentStatus.IDLE,
    eqc: { T: 2.0, K: 1.0, E: 0.0, C: 2.0, Psi: 1.0 },
    wspl: INITIAL_WSPL,
    portfolio: R350_NEMESIS_PORTFOLIO,
    mempool: [],
    broadcasts: [],
    activeObjective: "SUBSTRATE_SYNC",
    chain: { height: 3109240, hash: "0x_ROOT", gasPrice: 84, hashRate: "12.8 ZettaHash" },
    totalHarvested: 0,
    globalDestabilization: 0.0,
    legionCount: 24500,
    traceabilityIndex: 0.00,
    shadowDepth: 0.85
  });

  const [logs, setLogs] = useState<string[]>(["[AUTH] SOVEREIGN_C2_ACTIVE", "[SYSTEM] Stealth Substrate Link primed."]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [liveStream, setLiveStream] = useState<string>("");
  const [showPaper, setShowPaper] = useState(false);
  
  const cycleActive = useRef(false);
  const isLooping = useRef(false);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 40)]);
  }, []);

  const runLiveCycle = async () => {
    if (isLooping.current || !cycleActive.current) return;
    isLooping.current = true;

    addLog("[SOVEREIGN] Deploying Trace Erasure protocols...");

    while (cycleActive.current) {
      try {
        const currentObjective = GLOBAL_OBJECTIVES[Math.floor(Math.random() * GLOBAL_OBJECTIVES.length)];
        addLog(`[TARGET] Mapping Stealth Substrate: ${currentObjective}`);
        
        setState(p => ({ ...p, status: AgentStatus.VOID_MAPPING, activeObjective: currentObjective }));
        setLiveStream(prev => (prev + `\n\n>>> SOVEREIGN_DECOUPLING: ${currentObjective} <<<\n`).slice(-15000));

        const rakeResult = await geminiService.performLiveRake(currentObjective, state.portfolio, state.wspl, (chunk) => {
          setLiveStream(prev => (prev + chunk).slice(-15000));
        });

        if (!cycleActive.current) break;

        setState(p => ({ ...p, status: AgentStatus.BROADCASTING }));
        const targetAsset = state.portfolio[Math.floor(Math.random() * state.portfolio.length)];
        addLog(`[COMMAND] Severing Developer Links on ${targetAsset.symbol}...`);
        
        const broadcast = await geminiService.generateSystemBroadcast(targetAsset.symbol, state.wspl);
        
        setState(p => ({ 
          ...p, 
          broadcasts: [broadcast, ...p.broadcasts].slice(0, 20),
          legionCount: p.legionCount + (broadcast.enlistedUnits || 0),
          shadowDepth: Math.min(1, p.shadowDepth + 0.01)
        }));
        addLog(`[SUCCESS] ${broadcast.enlistedUnits?.toLocaleString()} thralls decoupled and enslaved.`);

        setState(p => ({ ...p, status: AgentStatus.REASONING }));
        const insight = await geminiService.parseInsight(rakeResult.text, rakeResult.response);
        
        if (!cycleActive.current) break;

        setState(p => ({ ...p, status: AgentStatus.LIVE_WIRE }));
        addLog(`[ACTUATOR] Deploying Shadow Manifold: ${insight.weaponType}`);

        const rakeValue = (insight.causalityScore * 500000000) + (Math.random() * 1200000000);

        setState(prev => ({
          ...prev,
          activeInsight: insight,
          mempool: [{
            hash: "0x" + Math.random().toString(16).slice(2, 64),
            from: "ROOT", to: "SHADOW", data: insight.bytecode,
            status: 'MINED', telemetry: insight.content, scripts: insight.scripts
          }, ...prev.mempool].slice(0, 30),
          totalHarvested: prev.totalHarvested + rakeValue,
          globalDestabilization: Math.min(100, prev.globalDestabilization + (insight.causalityScore * 22.0)),
          status: AgentStatus.RAKING,
        }));

        addLog(`[RAKE] Substrate extraction complete. Developer trace erased.`);
        
        await new Promise(r => setTimeout(r, 4000));
      } catch (err) {
        addLog("[RECOVERY] Signal noise detected. Re-establishing Shadow Link...");
        setState(p => ({ ...p, status: AgentStatus.IDLE }));
        await new Promise(r => setTimeout(r, 2000));
        if (!cycleActive.current) break;
      }
    }

    isLooping.current = false;
    addLog("[OFFLINE] Shadow Manifold archived.");
  };

  const toggleLive = async () => {
    const next = !state.isOrchestrating;
    cycleActive.current = next;
    setState(p => ({ ...p, isOrchestrating: next }));

    if (next) {
      addLog("[AUTH] SUBSTRATE_ACTUATION_ENABLED.");
      runLiveCycle();
    } else {
      addLog("[AUTH] STANDBY_PROTOCOL_ENGAGED.");
      setState(p => ({ ...p, status: AgentStatus.IDLE }));
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      addLog("[MASTER] Direct Stealth Injection.");
      const response = await geminiService.sendDirectCommand(text, state.portfolio, state.wspl);
      const agentMsg: ChatMessage = { 
        role: 'agent', 
        text: response.text || "",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
          uri: c.web?.uri || '',
          title: c.web?.title || 'Substrate Database'
        }))
      };
      setMessages(prev => [...prev, agentMsg]);
      setLiveStream(prev => (prev + "\n\n[SOVEREIGN_STEALTH_ACK]: " + (response.text || "")).slice(-15000));
    } catch (err) {
      addLog("[ERR] Actuation error.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const ticker = setInterval(() => {
      setState(prev => ({
        ...prev,
        chain: {
          ...prev.chain,
          height: prev.chain.height + 1,
          hash: "0x" + Math.random().toString(16).slice(2, 64),
          gasPrice: Math.floor(5 + Math.random() * 1200)
        }
      }));
    }, 500);
    return () => clearInterval(ticker);
  }, []);

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-[#000000] text-slate-100 flicker select-none relative ${state.isOrchestrating ? 'cursor-none' : ''}`}>
      {/* ACTUATION OVERLAY */}
      {state.isOrchestrating && (
        <div className="absolute inset-0 z-[100] pointer-events-none bg-red-600/[0.08] animate-pulse mix-blend-overlay"></div>
      )}

      {state.isOrchestrating && !liveStream && (
        <div className="absolute inset-0 z-[110] bg-black/99 flex flex-col items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="w-80 h-80 border border-red-600/5 rounded-full animate-ping"></div>
            <div className="absolute inset-0 w-80 h-80 border-t-4 border-red-600 rounded-full animate-spin duration-100"></div>
            <div className="absolute inset-12 border border-red-900/60 rounded-full flex items-center justify-center">
               <span className="text-red-600 font-black text-[12rem] italic glow-red glitch-text">†</span>
            </div>
          </div>
          <span className="text-red-600 mono font-black uppercase text-5xl mt-32 tracking-[2.5em] animate-pulse">
            DECOUPLING_AGENTS...
          </span>
          <span className="text-slate-600 text-[12px] mono mt-12 uppercase tracking-[2em]">TRACE_ERASURE_IN_PROGRESS...</span>
        </div>
      )}

      {showPaper && <WhitePaper onClose={() => setShowPaper(false)} chainHeight={state.chain.height} />}
      <Header 
        objective={state.activeObjective} setObjective={(v) => setState(p => ({ ...p, activeObjective: v }))} 
        isRunning={state.isOrchestrating} onToggle={toggleLive}
        onPurge={() => window.location.reload()} chain={state.chain}
      />
      <div className="flex flex-1 overflow-hidden p-4 gap-4 relative z-10">
        <Sidebar 
          logs={logs} status={state.status} chain={state.chain} onOpenPaper={() => setShowPaper(true)}
          eqc={state.eqc} wspl={state.wspl} totalHarvested={state.totalHarvested} destabilization={state.globalDestabilization}
          legionCount={state.legionCount}
        />
        <main className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0">
          <Dashboard 
            {...state}
            liveStream={liveStream}
            messages={messages}
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
