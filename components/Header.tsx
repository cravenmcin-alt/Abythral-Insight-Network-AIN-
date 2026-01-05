
import React from 'react';

interface HeaderProps {
  objective: string;
  isRunning: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ objective, isRunning, onToggle }) => {
  return (
    <header className="h-16 flex items-center justify-between px-6 glass border-b border-slate-800 z-10">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/50 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent animate-pulse"></div>
          <span className="text-cyan-400 font-bold text-xl relative z-10">A</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            AIN <span className="text-slate-500 font-normal">| Abythral Insight Network</span>
          </h1>
          <div className="text-[10px] uppercase tracking-widest text-cyan-400/80 mono flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-cyan-500 animate-pulse' : 'bg-red-500'}`}></span>
            {isRunning ? 'Orchestrator Engaged' : 'System Standby'}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-8 px-4 py-2 glass rounded-full border border-slate-700/50 flex items-center gap-3">
        <span className="text-[10px] uppercase text-slate-500 mono whitespace-nowrap">Objective:</span>
        <span className="text-sm font-medium text-slate-300 truncate">{objective}</span>
      </div>

      <button 
        onClick={onToggle}
        className={`px-6 py-2 rounded-lg font-bold text-sm tracking-wide transition-all duration-300 flex items-center gap-2 ${
          isRunning 
          ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20' 
          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
        }`}
      >
        {isRunning ? (
          <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4h12v12H4z"/></svg> TERMINATE</>
        ) : (
          <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 3L15.5 10L4.5 17V3Z"/></svg> ORCHESTRATE</>
        )}
      </button>
    </header>
  );
};

export default Header;
