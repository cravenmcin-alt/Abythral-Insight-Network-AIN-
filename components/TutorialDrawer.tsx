
import React from 'react';
import { TutorialModule } from '../types';

interface TutorialDrawerProps {
  tutorial?: TutorialModule;
}

const TutorialDrawer: React.FC<TutorialDrawerProps> = ({ tutorial }) => {
  if (!tutorial) return null;

  return (
    <div className="glass p-6 rounded-xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-xl relative flex flex-col h-full overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 opacity-[0.03] pointer-events-none select-none z-0">
        <span className="text-8xl font-black tracking-[1em] text-white">CONFIDENTIAL</span>
      </div>

      {/* Header - Fixed at top */}
      <div className="flex items-center gap-3 mb-6 relative z-10 shrink-0">
        <div className="w-10 h-10 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
          <span className="text-cyan-400 font-black text-xs mono">MEMO</span>
        </div>
        <div>
          <h3 className="text-base font-black text-white uppercase tracking-tighter leading-none">{tutorial.title}</h3>
          <p className="text-[9px] text-cyan-400/60 mono mt-1 font-bold uppercase tracking-widest">Institutional Resolution Dossier</p>
        </div>
      </div>
      
      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10 mb-4 space-y-8">
        <div className="space-y-6">
          {tutorial.steps.map((step, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded border border-slate-700 bg-black flex items-center justify-center text-[10px] font-black text-cyan-400 group-hover:border-cyan-500/50 transition-all shadow-inner">
                  {i + 1}.0
                </div>
                {i < tutorial.steps.length - 1 && <div className="w-px flex-1 bg-slate-800/50 my-2"></div>}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans italic opacity-80 group-hover:opacity-100 transition-opacity whitespace-pre-wrap">{step}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Executive Summary Section within Scroll */}
        <div className="p-4 bg-black/60 rounded border border-white/5 shadow-2xl">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-[8px] uppercase font-black text-cyan-500 tracking-[0.3em]">EXECUTIVE_SUMMARY</h4>
            <span className="text-[7px] text-slate-600 mono">STATUS: SEALED</span>
          </div>
          <p className="text-[11px] text-slate-400 italic leading-relaxed text-justify">"{tutorial.summary}"</p>
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="pt-3 border-t border-white/5 flex justify-between items-center shrink-0 relative z-10 bg-cyan-950/10 -mx-6 -mb-6 px-6 pb-4">
         <div className="flex flex-col">
           <span className="text-[6px] text-slate-500 mono uppercase tracking-tighter">AUTHENTICITY_VERIFIED_BY_QCC</span>
           <span className="text-[6px] text-cyan-500/40 mono font-black">HASH: {Math.random().toString(36).substr(2, 12).toUpperCase()}</span>
         </div>
         <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-cyan-500/40 rounded-full"></div>
            <div className="w-1 h-1 bg-cyan-500/20 rounded-full"></div>
         </div>
      </div>
    </div>
  );
};

export default TutorialDrawer;
