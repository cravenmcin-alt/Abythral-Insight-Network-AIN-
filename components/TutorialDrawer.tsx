
import React from 'react';
import { TutorialModule } from '../types';

interface TutorialDrawerProps {
  tutorial?: TutorialModule;
}

const TutorialDrawer: React.FC<TutorialDrawerProps> = ({ tutorial }) => {
  if (!tutorial) return null;

  return (
    <div className="glass p-6 rounded-xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">{tutorial.title}</h3>
          <p className="text-[10px] text-cyan-400/60 mono">Adaptive Learning Module v2.1</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {tutorial.steps.map((step, i) => (
          <div key={i} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
                {i + 1}
              </div>
              {i < tutorial.steps.length - 1 && <div className="w-px flex-1 bg-slate-800 my-1"></div>}
            </div>
            <p className="text-xs text-slate-300 py-1 leading-relaxed">{step}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-cyan-500/5 rounded-lg border border-cyan-500/10">
        <h4 className="text-[10px] uppercase font-bold text-cyan-400 mb-1">Executive Summary</h4>
        <p className="text-[11px] text-slate-400 italic leading-snug">"{tutorial.summary}"</p>
      </div>
    </div>
  );
};

export default TutorialDrawer;
