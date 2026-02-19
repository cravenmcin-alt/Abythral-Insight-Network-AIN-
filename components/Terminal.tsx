
import React, { useRef } from 'react';

interface TerminalProps {
  logs: string[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const logRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!logRef.current) return;
    const amount = 80;
    switch (direction) {
      case 'up': logRef.current.scrollBy({ top: -amount, behavior: 'smooth' }); break;
      case 'down': logRef.current.scrollBy({ top: amount, behavior: 'smooth' }); break;
      case 'left': logRef.current.scrollBy({ left: -amount, behavior: 'smooth' }); break;
      case 'right': logRef.current.scrollBy({ left: amount, behavior: 'smooth' }); break;
    }
  };

  return (
    <div className="h-full flex flex-col glass rounded-xl border border-slate-800 overflow-hidden mono bg-slate-950/20">
      <div className="bg-slate-900/40 px-3 py-2 border-b border-slate-800/50 flex items-center justify-between shrink-0">
        <span className="text-[9px] text-cyan-400 uppercase tracking-[0.2em] font-black">Vibe Coding</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-3 opacity-40 hover:opacity-100 transition-opacity">
            <button onClick={() => scroll('left')} className="p-1 hover:text-cyan-400 transition-colors">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button onClick={() => scroll('up')} className="p-1 hover:text-cyan-400 transition-colors">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7"/></svg>
            </button>
            <button onClick={() => scroll('down')} className="p-1 hover:text-cyan-400 transition-colors">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <button onClick={() => scroll('right')} className="p-1 hover:text-cyan-400 transition-colors">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/30"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/30"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/30"></div>
          </div>
        </div>
      </div>
      <div ref={logRef} className="flex-1 p-3 overflow-auto text-[9px] space-y-1 bg-black/40 custom-scrollbar">
        <div className="min-w-max pr-6">
          {logs.length === 0 ? (
            <div className="text-slate-700 italic py-10 flex flex-col items-center gap-2 text-[10px] mono">
               <div className="w-1 h-3 bg-cyan-500/40 animate-pulse"></div>
               STATUS: WAITING_FOR_INPUT
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-3 py-1 border-b border-white/[0.02] last:border-0 hover:bg-cyan-500/5 transition-colors group">
                <span className="text-slate-700 shrink-0 font-black">[{i.toString().padStart(2, '0')}]</span>
                <span className={`leading-tight ${log.includes('FAIL') || log.includes('ERR') ? 'text-red-400 font-black' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {log}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
