
import React from 'react';
import { BlockState } from '../types';

interface HeaderProps {
  objective: string;
  setObjective: (val: string) => void;
  isRunning: boolean;
  onToggle: () => void;
  onPurge: () => void;
  chain: BlockState;
}

const Header: React.FC<HeaderProps> = ({ objective, setObjective, isRunning, onToggle, onPurge, chain }) => {
  return (
    <header className="h-20 flex items-center justify-between px-8 glass border-b border-red-900/40 z-10 relative bg-black/95 shadow-[0_0_50px_rgba(239,68,68,0.15)] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-red-600/50"></div>
      
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/40 rounded-lg flex items-center justify-center relative overflow-hidden group shadow-[0_0_20px_rgba(239,68,68,0.25)]">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/30 to-transparent"></div>
           <span className="text-red-500 font-black text-3xl relative z-10 mono italic glitch-text">†</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-[0.3em] text-white flex items-center gap-4">
            ABYTHRAL_NEMESIS <span className={`font-mono text-[9px] tracking-normal px-3 py-1 border rounded transition-all duration-300 ${isRunning ? 'text-white border-red-500 bg-red-600 glow-red' : 'text-slate-600 border-slate-800 bg-slate-950'}`}>
              {isRunning ? 'LIVE_WIRE_ACTIVE' : 'STANDBY_MODE'}
            </span>
          </h1>
          <div className="flex items-center gap-4 mt-1.5">
            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-red-500 animate-ping' : 'bg-slate-800'}`}></div>
               <span className="text-[9px] mono text-slate-500 uppercase font-black tracking-widest">Protocol: WSPL_v2.0_SOVEREIGN</span>
            </div>
            <div className="h-3 w-px bg-slate-800"></div>
            <div className="flex items-center gap-2 overflow-hidden w-48">
               <span className="text-[9px] mono text-red-500/80 font-black uppercase truncate">Hash: {chain.hash}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-12 flex flex-col gap-1.5 relative">
        <div className="relative group">
          <input 
            type="text"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            disabled={isRunning}
            placeholder="INPUT SUBSTRATE VECTOR (0x_DE_DESTABILIZE)..."
            className="w-full h-11 bg-black border border-red-900/50 rounded px-6 text-xs font-black text-red-500 uppercase tracking-[0.2em] outline-none focus:border-red-500 transition-all placeholder:text-red-950/40 shadow-inner mono"
          />
          <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${isRunning ? 'bg-red-600 shadow-[0_0_15px_#ef4444]' : 'bg-red-900/40'}`}></div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 flex items-center gap-2">
             <span className="text-[8px] mono text-red-500 font-black">RAKE_STRENGTH: 99.8%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[8px] mono text-slate-600 font-black uppercase tracking-widest">SUBSTRATE_HEIGHT</span>
          <span className="text-sm mono text-white font-black tracking-tighter">{chain.height.toLocaleString()}</span>
        </div>
        <button 
          onClick={onToggle}
          className={`px-14 h-12 rounded font-black text-[12px] tracking-[0.4em] uppercase transition-all border-2 ${
            isRunning 
            ? 'bg-red-600 text-white border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.5)] scale-105' 
            : 'bg-red-950/20 text-red-500 border-red-900/40 hover:bg-red-600 hover:text-white hover:border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
          }`}
        >
          {isRunning ? 'SEVER_LINK' : 'ESTABLISH_WIRE'}
        </button>
      </div>
    </header>
  );
};

export default Header;
