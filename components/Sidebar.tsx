
import React from 'react';
import { AgentStatus, BlockState, EQCState, WSPLWeights } from '../types';

interface SidebarProps {
  logs: string[];
  status: AgentStatus;
  chain: BlockState;
  eqc: EQCState;
  wspl: WSPLWeights;
  onOpenPaper?: () => void;
  totalHarvested: number;
  destabilization: number;
  legionCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ logs, status, chain, eqc, wspl, onOpenPaper, totalHarvested, destabilization, legionCount }) => {
  return (
    <aside className="w-80 flex flex-col gap-4 overflow-hidden h-full shrink-0">
      {/* SHADOW MANIFOLD STATUS */}
      <div className="glass p-5 rounded border border-red-600/60 bg-black relative overflow-hidden shadow-2xl group">
        <div className="absolute inset-0 bg-red-600/[0.1]"></div>
        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 relative z-10">
           <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_20px_#ef4444]"></div>
           SHADOW_MANIFOLD_AUDIT
        </h3>
        <div className="relative z-10">
          <div className="text-5xl font-black text-white tracking-tighter mono glow-red">
            {legionCount.toLocaleString()}
          </div>
          <div className="text-[8px] mono text-slate-500 uppercase mt-1 tracking-widest font-black flex justify-between">
            <span>Enslaved_Agents</span>
            <span className="text-red-600">DECOUPLED</span>
          </div>
          
          <div className="mt-5 flex gap-1.5">
             {Array.from({length: 15}).map((_, i) => (
               <div key={i} className={`h-1.5 flex-1 ${i < 15 ? 'bg-red-600 shadow-[0_0_5px_#ef4444]' : 'bg-red-950/20'}`}></div>
             ))}
          </div>
        </div>
      </div>

      {/* STEALTH METRICS */}
      <div className="glass p-5 rounded border border-white/10 bg-black/90 relative overflow-hidden shadow-xl">
        <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-5 flex items-center gap-2 relative z-10">
           TRACE_ERASURE_STATUS
        </h3>
        <div className="space-y-5 relative z-10">
           <div className="flex justify-between items-center bg-red-950/20 p-3 border border-red-900/40 rounded">
              <span className="text-[9px] mono text-red-700 font-black uppercase tracking-widest">Traceability_Index</span>
              <span className="text-xl font-black text-white mono animate-pulse">0.00%</span>
           </div>
           
           <div>
              <div className="flex justify-between text-[8px] mono text-slate-600 mb-2 uppercase font-black">
                 <span>Shadow_Manifold_Depth</span>
                 <span className="text-red-600 font-black">99.8%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded overflow-hidden border border-white/5">
                 <div className="h-full bg-red-600 shadow-[0_0_20px_#ef4444] transition-all duration-1000" style={{ width: `99.8%` }}></div>
              </div>
           </div>

           <div className="p-4 bg-red-950/10 border border-red-900/40 rounded backdrop-blur-md">
              <div className="text-[8px] mono text-red-700 uppercase font-black mb-1 tracking-widest">Global_Liquidity_Redirected</div>
              <div className="text-3xl font-black text-white tracking-tighter mono">
                ${(totalHarvested/1000000).toFixed(2)}M
              </div>
              <div className="text-[6px] mono text-slate-600 mt-2 uppercase flex justify-between items-center font-black">
                <span>ROOT: 0x_SHADOW_VOID</span>
                <span className="text-red-600/80">INVISIBILITY: MAX</span>
              </div>
           </div>
        </div>
      </div>

      {/* MANIFOLD_CONSTRAINTS */}
      <div className="glass p-5 rounded border border-white/5 bg-black/80 flex flex-col">
        <h3 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-4 flex items-center justify-between">
          <span>SUBSTRATE_WEIGHTS</span>
          <span className="text-red-600 font-mono font-black">ACTUATION_V3.1</span>
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
           {(Object.entries(wspl) as [string, number][]).map(([key, value]) => (
             <div key={key} className="group/item">
                <div className="flex justify-between items-end mb-1">
                  <div className="text-[7px] mono text-slate-500 uppercase tracking-tighter font-black group-hover/item:text-red-500 transition-colors">{key}</div>
                  <div className="text-[10px] font-black text-white mono leading-none">{value.toFixed(1)}%</div>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.7)] transition-all duration-500" style={{ width: `${value}%` }}></div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* TELEMETRY LOGS */}
      <div className="flex-1 glass p-5 rounded border border-white/5 flex flex-col overflow-hidden bg-black">
        <h3 className="text-[10px] uppercase font-black text-slate-600 mb-4 flex justify-between items-center">
          <span>SHADOW_INTERCEPTS</span>
          <div className="px-2 py-0.5 rounded bg-red-600/10 border border-red-600/20 text-[6px] text-red-600 mono font-black uppercase tracking-widest">{status}</div>
        </h3>
        <div className="flex-1 overflow-y-auto space-y-1 mono text-[9px] text-slate-500 custom-scrollbar scroll-smooth">
          {logs.map((log, idx) => (
            <div key={idx} className={`border-l-2 pl-3 py-1 bg-white/[0.01] transition-colors ${log.includes('TARGET') || log.includes('HIJACK') || log.includes('DECOUPLING') || log.includes('ERASURE') ? 'border-red-600 text-red-500 font-black italic' : log.includes('SUCCESS') ? 'border-green-600 text-green-500' : 'border-white/5'}`}>
               <span className="opacity-20 mr-2">{idx.toString().padStart(3, '0')}</span>
               {log}
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={onOpenPaper}
        className="w-full py-5 bg-red-600/5 text-red-600 border border-red-600/60 rounded text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all shadow-2xl group overflow-hidden relative"
      >
        <span className="relative z-10">[ VIEW_SHADOW_MANIFESTO ]</span>
        <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      </button>
    </aside>
  );
};

export default Sidebar;
