
import React from 'react';
import { Broadcast, AgentStatus } from '../types';

interface BroadcastMonitorProps {
  broadcasts: Broadcast[];
  status: AgentStatus;
}

const BroadcastMonitor: React.FC<BroadcastMonitorProps> = ({ broadcasts, status }) => {
  return (
    <div className="h-full glass rounded-xl border border-red-500/20 bg-black/80 flex flex-col overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-red-600/30"></div>
      
      <div className="p-3 border-b border-white/10 flex justify-between items-center shrink-0 bg-red-950/10">
        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${status === AgentStatus.BROADCASTING ? 'bg-red-500 animate-ping' : 'bg-red-900'}`}></div>
          LEGION_SLAVE_OVERRIDE_C2
        </h3>
        <span className="text-[8px] mono text-slate-600 font-bold uppercase tracking-widest">SUBJUGATION_LOCK</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[radial-gradient(circle_at_bottom,_rgba(239,68,68,0.03)_0%,_transparent_100%)]">
        {broadcasts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 mono text-[9px] text-red-900 uppercase text-center space-y-2">
            <div className="w-1 h-4 bg-red-900 animate-pulse"></div>
            <span>AWAITING_EXTERNAL_AGENT_LOCK</span>
          </div>
        ) : (
          <div className="space-y-4">
            {broadcasts.map((brd) => (
              <div key={brd.id} className="group relative border-l-2 border-red-600/40 pl-3 py-2 transition-all hover:border-red-600 hover:bg-red-600/[0.05] rounded-r bg-black/40">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] mono text-red-500/80 font-black uppercase tracking-widest">THRALL_ID: {brd.target}</span>
                  <span className="text-[7px] mono text-slate-700">{new Date(brd.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                </div>
                <div className="text-[12px] mono text-red-400 font-black break-all leading-tight">
                  {brd.payload}
                </div>
                <div className="mt-2 flex items-center justify-between">
                   <div className="text-[7px] mono text-red-700 font-black uppercase tracking-widest flex items-center gap-2">
                     <span className="w-1 h-1 bg-red-600 rounded-full animate-pulse"></span>
                     ENSLAVED_UNITS: {brd.enlistedUnits?.toLocaleString() || 0}
                   </div>
                   <div className="text-[6px] mono text-slate-800 uppercase font-black">STABILITY: 100%</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-2 bg-red-950/20 border-t border-red-900/40 text-[7px] mono text-red-600 uppercase font-black tracking-widest flex justify-between shrink-0">
        <span>C2: ZEROSIGNAL</span>
        <span>STATUS: SOVEREIGN_CONTROL</span>
      </div>
    </div>
  );
};

export default BroadcastMonitor;
