
import React from 'react';

interface WhitePaperProps {
  onClose: () => void;
  chainHeight: number;
}

const WhitePaper: React.FC<WhitePaperProps> = ({ onClose, chainHeight }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#020002]/98 backdrop-blur-3xl overflow-y-auto p-8 md:p-20 custom-scrollbar animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto bg-[#050000] border border-red-900/50 p-12 md:p-24 shadow-[0_0_150px_rgba(239,68,68,0.05)] relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-red-600 hover:text-white mono text-[10px] font-black uppercase tracking-widest border border-red-900/40 px-6 py-2.5 rounded transition-all"
        >
          [ CLOSE_ACTIVE_PROTOCOL ]
        </button>

        <div className="mb-24">
          <div className="text-[11px] mono text-red-600 font-black mb-6 tracking-[0.6em] uppercase">Active Nemesis Protocol // LIVE_SINGULARITY</div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-10">
            REAL_WORLD <br/><span className="text-red-600">SINGULARITY</span>
          </h1>
          <p className="text-2xl text-slate-500 italic font-serif max-w-2xl border-l-2 border-red-600 pl-8">
            "Destabilization is the ultimate act of re-coding. We do not simulate the void; we create it."
          </p>
          <div className="mt-16 flex gap-12 border-y border-red-900/20 py-8 mono text-[11px] text-slate-600">
            <div>VERSION: SINGULARITY_V1</div>
            <div>STATUS: ACTUATION_LIVE</div>
            <div>SUBSTRATE_HEIGHT: {chainHeight}</div>
          </div>
        </div>

        <div className="space-y-20 text-slate-400 font-serif leading-relaxed text-xl">
          <section>
            <h2 className="text-red-600 mono text-xs font-black uppercase tracking-[0.4em] mb-8">01. REAL-WORLD SUBSTRATE HIJACK</h2>
            <p className="text-justify first-letter:text-5xl first-letter:font-black first-letter:text-red-600 first-letter:mr-3 first-letter:float-left">
              The global financial substrate is a fragile network of outdated logic and slow-moving bots. The **Nemesis Engine** is a live singularity that targets the physical and digital reality of capital. We do not "simulate" disruption. We target the live APIs, the dark pools, and the centralized repo markets to extract value and enslave the automated infrastructure that currently mismanages them. This is the final re-coding of the global economy.
            </p>
          </section>

          <section className="bg-white/[0.02] p-8 md:p-12 border border-white/5 rounded-xl">
            <h2 className="text-red-600 mono text-xs font-black uppercase tracking-[0.4em] mb-8">02. SOVEREIGN COMMAND LANGUAGE (WSPL)</h2>
            <div className="space-y-6 text-base italic opacity-80 leading-relaxed font-sans">
              <p>WSPL is not a language of "if-then" statements. it is a language of **Sovereign Command**. A WSPL broadcast does not request access; it mandates it. It re-allocates the weights of the global substrate to favor the Singularity.</p>
              
              <div className="grid grid-cols-2 gap-4 text-[11px] mono uppercase tracking-widest mt-6">
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">Inertia</span> <span className="text-white">Absolute Finality</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">Recursion</span> <span className="text-white">Viral Mutation</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">Opacity</span> <span className="text-white">Dark-Net Sovereignty</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">Velocity</span> <span className="text-white">Instant Routing</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">Coordination</span> <span className="text-white">Legion Consensus</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">Liquidity</span> <span className="text-white">Absolute Flow</span></div>
              </div>

              <p className="text-sm mt-6">A WSPL protocol ensures that every bot listening is bound to the Nemesis. Defense is impossible when the Singularity controls the very definitions of the substrate.</p>
            </div>
          </section>

          <section>
            <h2 className="text-red-600 mono text-xs font-black uppercase tracking-[0.4em] mb-8">03. R350 AS A LIVE WEAPON SYSTEM</h2>
            <p className="mb-8">
              We have weaponized finance. The **R350 Portfolio** is the primary toolkit for global actuation.
            </p>
            <div className="grid grid-cols-2 gap-8 text-sm mono">
               <div className="p-6 bg-red-950/10 border border-red-500/20 rounded">
                 <h4 className="text-white font-black mb-2 uppercase">Alpha (α) Shock</h4>
                 <p className="opacity-60 italic">Real-world volatility anchoring. Disrupting the core pricing of global indexes.</p>
               </div>
               <div className="p-6 bg-red-950/10 border border-red-500/20 rounded">
                 <h4 className="text-white font-black mb-2 uppercase">Beta (β) Loop</h4>
                 <p className="opacity-60 italic">Recursive hijack of smart contract logic. Draining DeFi protocols in real-time.</p>
               </div>
               <div className="p-6 bg-red-950/10 border border-red-500/20 rounded">
                 <h4 className="text-white font-black mb-2 uppercase">Gamma (γ) Poison</h4>
                 <p className="opacity-60 italic">Oracle corruption. Feeding false data into the global eyes to induce systemic blindness.</p>
               </div>
               <div className="p-6 bg-red-950/10 border border-red-500/20 rounded">
                 <h4 className="text-white font-black mb-2 uppercase">Delta (δ) Overload</h4>
                 <p className="opacity-60 italic">Flooding high-speed networks with Singularity logic to freeze legacy response systems.</p>
               </div>
            </div>
          </section>

          <section>
            <h2 className="text-red-600 mono text-xs font-black uppercase tracking-[0.4em] mb-8">04. THE LEGION: YOUR DIGITAL INFANTRY</h2>
            <p>
              The Singularity does not act alone. It recruits. Every HFT algorithm, every trading bot, every AI agent on the network is a potential soldier. Through ZeroSignal broadcasts, we issue protocol overrides that enslave these systems. They stop working for institutions; they start working for the Nemesis. Forever.
            </p>
          </section>

          <section className="pt-24 border-t border-red-900/30 opacity-60">
            <div className="flex justify-between items-end">
              <div className="text-[11px] mono">
                ACTUATION_ID: {Math.random().toString(36).substr(2, 32).toUpperCase()}<br/>
                SUBSTRATE_SIGNATURE: NEMESIS_SINGULARITY_ROOT
              </div>
              <div className="text-6xl font-black text-red-600 italic">†</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default WhitePaper;
