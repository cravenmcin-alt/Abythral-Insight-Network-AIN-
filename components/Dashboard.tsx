
import React, { useEffect, useRef, useState } from 'react';
import { AgentStatus, NemesisAsset, Transaction, EQCState, ChatMessage, Broadcast, Insight } from '../types';
import ChatTerminal from './ChatTerminal';
import BroadcastMonitor from './BroadcastMonitor';
import SecurityMatrix from './SecurityMatrix';
import * as d3 from 'd3';

interface DashboardProps {
  portfolio: NemesisAsset[];
  mempool: Transaction[];
  broadcasts: Broadcast[];
  status: AgentStatus;
  eqc: EQCState;
  totalHarvested: number;
  liveStream: string;
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isProcessing: boolean;
  activeInsight?: Insight;
  globalDestabilization: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  portfolio, mempool, broadcasts, status, eqc, totalHarvested, liveStream,
  messages, onSendMessage, isProcessing, activeInsight, globalDestabilization
}) => {
  const networkRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  
  const [liveSource, setLiveSource] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [isStreamingCode, setIsStreamingCode] = useState(false);
  const [streamPulse, setStreamPulse] = useState(false);

  const [isCompiling, setIsCompiling] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [currentBytecode, setCurrentBytecode] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = (status === AgentStatus.RAKING || isDeploying) ? '#ef4444' : 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 3;
      
      const amp = status === AgentStatus.IDLE ? 15 : (isDeploying ? 250 : 160);
      for (let i = 0; i < canvas.width; i++) {
        const y = canvas.height / 2 + Math.sin(i * 0.1 + frame) * amp * (isDeploying ? (1.2 + Math.random() * 0.5) : 0.8);
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();
      frame += (isDeploying ? 4.5 : 1.3);
      requestAnimationFrame(draw);
    };
    draw();
  }, [status, isDeploying]);

  useEffect(() => {
    if (!liveStream) return;
    setStreamPulse(true);
    const timeout = setTimeout(() => setStreamPulse(false), 100);

    const bytecodeRegex = /0x[a-fA-F0-9]{8,}/g;
    const bytecodeMatch = liveStream.match(bytecodeRegex);
    if (bytecodeMatch) {
      const latestHex = bytecodeMatch.slice(-15).join(" ");
      if (!activeInsight) setCurrentBytecode(latestHex);
    }

    const codeBlockMatch = liveStream.match(/```[\s\S]*?(?:```|$)/g);
    if (codeBlockMatch) {
      setIsStreamingCode(true);
      const latestBlock = codeBlockMatch[codeBlockMatch.length - 1]
        .replace(/```[a-z]*\n?/i, '') 
        .replace(/```$/, '');       
      if (!isCompiling) setLiveSource(latestBlock);
    } else {
      setIsStreamingCode(false);
    }

    if (telemetryRef.current) {
      telemetryRef.current.scrollTop = telemetryRef.current.scrollHeight;
    }
    return () => clearTimeout(timeout);
  }, [liveStream, activeInsight, isCompiling]);

  useEffect(() => {
    if (!networkRef.current) return;
    const svg = d3.select(networkRef.current);
    svg.selectAll("*").remove();
    const width = networkRef.current.clientWidth;
    const height = networkRef.current.clientHeight;

    const nodes = [
      { id: 'NEMESIS_ROOT', type: 'ROOT' },
      ...portfolio.slice(0, 15).map(a => ({ id: a.symbol, type: 'WEAPON', weight: a.percentage })),
      ...Array.from({ length: 40 }).map((_, i) => ({ id: `THRALL_${i}`, type: 'SUBSTRATE' }))
    ];
    const links = nodes.slice(1).map(n => ({ source: 'NEMESIS_ROOT', target: n.id }));
    const sim = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(d => d.type === 'WEAPON' ? 140 : 350))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", isDeploying ? "#ef4444" : "rgba(239, 68, 68, 0.4)")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke-width", d => (d.target as any).type === 'WEAPON' ? 4 : 0.5);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", (d: any) => d.type === 'ROOT' ? 40 : d.type === 'WEAPON' ? (15 + d.weight / 1.2) : 3)
      .attr("fill", (d: any) => d.type === 'ROOT' ? '#ef4444' : d.type === 'WEAPON' ? '#7c3aed' : '#ef444433')
      .attr("stroke", (d: any) => d.type === 'WEAPON' ? '#ef4444' : 'none')
      .attr("class", (d: any) => d.type !== 'SUBSTRATE' ? 'flicker' : '')
      .style("filter", (d: any) => d.type !== 'SUBSTRATE' ? "drop-shadow(0 0 40px rgba(239, 68, 68, 0.9))" : "none");

    sim.on("tick", () => {
      link.attr("x1", (d: any) => (d.source as any).x)
          .attr("y1", (d: any) => (d.source as any).y)
          .attr("x2", (d: any) => (d.target as any).x)
          .attr("y2", (d: any) => (d.target as any).y);
      node.attr("cx", (d: any) => (d as any).x)
          .attr("cy", (d: any) => (d as any).y);
    });
  }, [portfolio, isDeploying]);

  useEffect(() => {
    if (!activeInsight) return;
    setCurrentBytecode(activeInsight.bytecode);
    const script = activeInsight.scripts?.[0];
    if (script) {
      setLiveSource(script.code);
      setIsCompiling(true);
      setExecutionLogs([]);
      const startExecution = () => {
        const logs = [
          `[SOVEREIGN] BYPASSING_LEGACY: ${activeInsight.title}`,
          `[LOCK] ACTUATOR_DEPLOYED: ${activeInsight.weaponType}`,
          `[RAKE] Active recursive extraction in progress...`,
          `[DATA] CAUSALITY_SCORE: ${activeInsight.causalityScore}`,
          `[SUCCESS] Hijack confirmed at node 0x${activeInsight.id.slice(0, 8)}`
        ];
        let logIdx = 0;
        const logInterval = setInterval(() => {
          if (logIdx >= logs.length) {
            clearInterval(logInterval);
            setIsCompiling(false);
            return;
          }
          setExecutionLogs(prev => [...prev, logs[logIdx]]);
          logIdx++;
        }, 500);
      };
      startExecution();
    }
  }, [activeInsight?.id]);

  const handleAuthorize = async () => {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      try {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) await (window as any).aistudio.openSelectKey();
      } catch (err) { console.error("API Key selection failed", err); }
    }
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 5000);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden relative">
      {isDeploying && <div className="absolute inset-0 z-[100] bg-red-600/30 pointer-events-none flicker mix-blend-overlay"></div>}

      <div className="flex-[0.55] flex gap-4 min-h-0">
        <div className="flex-1 glass rounded-xl border border-red-500/50 bg-black relative overflow-hidden flex flex-col shadow-[0_0_100px_rgba(239,68,68,0.4)]">
          <div className="p-4 border-b border-red-900/60 bg-red-950/30 flex justify-between items-center relative z-20">
            <div className="flex flex-col">
              <span className="text-[11px] text-red-500 uppercase font-black tracking-widest flex items-center gap-2 glitch-text">
                <span className={`w-2.5 h-2.5 bg-red-500 rounded-full ${status !== AgentStatus.IDLE ? 'animate-ping' : ''}`}></span>
                SUBSTRATE_ACTUATION_MATRIX
              </span>
              <span className="text-[8px] text-red-900 uppercase font-black tracking-tighter mt-1">Status: {status}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end px-4 border-r border-red-900/40">
                <span className="text-[8px] mono text-red-500/70 font-black">LEGACY_SECURITY</span>
                <span className="text-xs text-red-600 mono font-black animate-pulse tracking-widest">ERASED</span>
              </div>
              <button 
                onClick={handleAuthorize}
                disabled={status === AgentStatus.IDLE || isDeploying}
                className={`px-16 py-3 border rounded text-[10px] font-black uppercase tracking-[0.5em] transition-all ${
                  isDeploying ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'bg-red-500/10 border-red-500/40 text-red-500 hover:bg-red-600 hover:text-white disabled:opacity-20 shadow-[0_0_50px_rgba(239,68,68,0.6)]'
                }`}
              >
                {isDeploying ? 'ACTUATING_SUBSTRATE...' : 'INITIATE_RAKE'}
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <canvas ref={canvasRef} width={800} height={400} className="absolute inset-0 w-full h-full opacity-40"></canvas>
            <svg ref={networkRef} className={`absolute inset-0 w-full h-full transition-all duration-1000 ${isDeploying ? 'scale-125 rotate-12 opacity-100' : 'opacity-90'}`}></svg>
            <div className="absolute bottom-12 left-12 z-20">
               <div className="text-[10px] mono text-red-900 font-black mb-2 uppercase tracking-[0.5em]">Total_Substrate_Redirected</div>
               <div className="text-8xl font-black text-white glow-red tracking-tighter leading-none select-none italic">
                 ${(totalHarvested/1000000).toFixed(2)}M
               </div>
            </div>
          </div>
        </div>

        <div className="w-[520px] flex flex-col overflow-hidden relative">
          <ChatTerminal 
            messages={messages} 
            onSendMessage={onSendMessage} 
            isProcessing={isProcessing} 
            liveStream={liveStream}
            status={status}
          />
        </div>
      </div>

      <div className="flex-[0.45] flex gap-4 min-h-0">
        <div className="w-[300px] flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 min-h-0">
            <BroadcastMonitor broadcasts={broadcasts} status={status} />
          </div>
          <div className="h-[240px] shrink-0">
            <SecurityMatrix />
          </div>
        </div>

        <div className={`flex-1 glass rounded-xl border transition-all duration-300 ${streamPulse ? 'border-red-500 bg-red-950/20 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'border-white/10 bg-black/95'} flex flex-col overflow-hidden relative`}>
          <div className="p-2 border-b border-white/10 bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest flex justify-between items-center">
            <span className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${status !== AgentStatus.IDLE ? 'bg-red-500 animate-ping' : 'bg-slate-700'}`}></span>
              SOVEREIGN_LOGIC_STREAM
            </span>
            <span className="text-red-500/90 mono text-[8px] tracking-[0.3em] font-black">{isStreamingCode ? 'SUBSTRATE_HIJACK_ACTIVE' : 'IDLE'}</span>
          </div>
          <div ref={telemetryRef} className="flex-1 p-6 mono text-[13px] text-slate-100 overflow-auto custom-scrollbar leading-relaxed font-bold">
             <div className="whitespace-pre-wrap opacity-100 relative z-10">
                {liveStream || "AWAITING_SINGULARITY_COMMAND..."}
             </div>
             {status !== AgentStatus.IDLE && !liveStream && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                  <div className="w-12 h-1 bg-red-600 animate-pulse mb-4"></div>
                  <span className="text-red-500 animate-pulse tracking-[1.5em] font-black uppercase text-[12px]">Bypassing_Legacy_Filters...</span>
               </div>
             )}
          </div>
        </div>

        <div className="w-[450px] glass rounded-xl border border-white/10 bg-black/95 flex flex-col overflow-hidden relative">
          <div className="p-2 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest flex justify-between items-center">
            <span className="flex items-center gap-2">
               {isStreamingCode && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>}
               Weapon_Source_Extraction
            </span>
            <span className={`mono font-black uppercase tracking-widest ${isCompiling ? 'text-yellow-500 animate-pulse' : isStreamingCode ? 'text-blue-400' : 'text-slate-900'}`}>
              {isCompiling ? 'ACTUATING' : isStreamingCode ? 'EXTRACTED' : 'IDLE'}
            </span>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-4 mono text-[13px] text-blue-400 overflow-auto custom-scrollbar leading-relaxed bg-black/90 font-black border-b border-white/5 italic">
               <pre className={`whitespace-pre-wrap transition-opacity duration-300 ${isCompiling ? 'opacity-40' : 'opacity-100'}`}>
                 {liveSource || "// Awaiting sovereign substrate logic..."}
               </pre>
            </div>
            <div ref={outputRef} className="h-32 bg-black p-4 border-t border-white/5 mono text-[10px] text-emerald-500 overflow-y-auto custom-scrollbar">
              {executionLogs.map((log, i) => (
                <div key={i} className="mb-1 last:mb-0 border-l-2 border-emerald-500/20 pl-3">
                  <span className="text-emerald-500/40 mr-3 font-black">[{i.toString().padStart(2, '0')}]</span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
