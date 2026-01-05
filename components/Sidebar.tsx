
import React from 'react';
import { AgentStatus, ThoughtStep } from '../types';

interface SidebarProps {
  logs: string[];
  thoughts: ThoughtStep[];
  status: AgentStatus;
}

const Sidebar: React.FC<SidebarProps> = ({ logs, thoughts, status }) => {
  return (
    <aside className="w-80 flex flex-col gap-4 overflow-hidden">
      {/* Current Status Card */}
      <div className="glass p-4 rounded-xl border border-slate-800">
        <h3 className="text-[10px] uppercase tracking-widest text-slate-500 mono mb-3">Core Status</h3>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 bg-cyan-500/30 rounded-full relative overflow-hidden">
             <div className="absolute bottom-0 w-full bg-cyan-500 transition-all duration-1000" style={{ height: '70%' }}></div>
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-white tracking-tight">{status}</div>
            <div className="text-[10px] text-cyan-400/70 mono">COGNITION_PHASE_03</div>
          </div>
        </div>
      </div>

      {/* Thought Signature Persistence */}
      <div className="flex-1 glass p-4 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
        <h3 className="text-[10px] uppercase tracking-widest text-slate-500 mono mb-3 flex justify-between items-center">
          Thought Signatures
          <span className="text-[8px] bg-slate-800 px-1.5 py-0.5 rounded">AUTO_SAVE</span>
        </h3>
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {thoughts.length === 0 ? (
            <div className="text-slate-600 italic text-xs py-4 text-center">No active reasoning threads.</div>
          ) : (
            thoughts.map(t => (
              <div key={t.id} className="p-3 bg-slate-900/40 rounded-lg border border-slate-800/50 hover:border-cyan-500/20 transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase mono">{t.status}</span>
                  <span className="text-[8px] text-slate-600 mono">{new Date(t.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-2">{t.description}</p>
                <div className="flex items-center justify-between">
                   <div className="text-[9px] text-slate-500 mono truncate max-w-[100px]">SHA-256: {t.hash.slice(0, 16)}...</div>
                   <div className="flex gap-1">
                      {[1,2,3].map(i => (
                        <div key={i} className={`w-1 h-1 rounded-full ${i <= (t.confidence * 3) ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
                      ))}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* System Telemetry Logs */}
      <div className="h-48 glass p-4 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
        <h3 className="text-[10px] uppercase tracking-widest text-slate-500 mono mb-2">Telemetry Log</h3>
        <div className="flex-1 overflow-y-auto mono text-[10px] text-slate-400 space-y-1">
          {logs.map((log, idx) => (
            <div key={idx} className="border-l border-slate-800 pl-2 py-0.5 hover:bg-slate-800/20 transition-colors">
              {log}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
