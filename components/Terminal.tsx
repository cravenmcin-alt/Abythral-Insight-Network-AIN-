
import React from 'react';

interface TerminalProps {
  logs: string[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  return (
    <div className="h-full flex flex-col glass rounded-xl border border-slate-800 overflow-hidden mono">
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
        <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Vibe Verification Terminal</span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto text-[11px] space-y-1 bg-black/40">
        {logs.length === 0 ? (
          <div className="text-slate-600 animate-pulse">Waiting for execution cycles...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-slate-600">[{i.toString().padStart(3, '0')}]</span>
              <span className={log.includes('FAIL') || log.includes('ERR') ? 'text-red-400' : 'text-cyan-200/80'}>{log}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Terminal;
